#!/usr/bin/env node
/**
 * Build-time prerender and agent-artifact generator.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (prerender bundle):
 *
 *  - injects real HTML into `dist/index.html` so the homepage has readable
 *    content before any JavaScript executes
 *  - writes the standalone content pages (/about, /contact, /privacy) and the
 *    404 page as static HTML with no client bundle
 *  - writes a Markdown mirror of every page
 *  - writes robots.txt, sitemap.xml, llms.txt and llms-full.txt
 *
 * Everything is derived from `src/lib/site.js`, so there is one place to edit
 * when the site's identity changes.
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';

import {
  PAGES,
  SITE,
  absoluteUrl,
  graphFor,
  markdownPathFor,
  renderRoute,
} from '../.prerender/prerender-entry.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const NOT_FOUND_PAGE = {
  path: '/404',
  navLabel: 'Not found',
  title: `Page not found — ${SITE.name}`,
  description:
    'This path does not exist on vanshbhasin.dev. Links to the sitemap, llms.txt and every valid page.',
  summary: 'Recovery links for an unknown URL.',
};

/**
 * Agent and AI crawler user agents that get an explicit allow in robots.txt.
 * `User-agent: *` already permits them; naming them removes any ambiguity for
 * tools that look for a specific grant.
 */
const AGENT_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Googlebot',
  'Bingbot',
  'Applebot',
  'Applebot-Extended',
  'DeepSeekBot',
  'Meta-ExternalAgent',
  'Amazonbot',
  'cohere-ai',
  'YouBot',
  'CCBot',
  'ora-agent',
];

/** Source files whose last commit date represents each page's content. */
const PAGE_SOURCES = {
  '/': ['src', 'index.html'],
  '/about/': ['src/pages/AboutPage.jsx', 'src/lib/site.js'],
  '/contact/': ['src/pages/ContactPage.jsx', 'src/lib/site.js'],
  '/privacy/': ['src/pages/PrivacyPage.jsx', 'src/lib/site.js'],
};

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
});
// Decorative icons carry no text; keeping them produces stray empty links.
turndown.remove(['svg', 'style', 'script']);

/** A Markdown mirror is read out of context, so every link has to be absolute. */
function resolveHref(href) {
  if (!href) return '';
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  if (href.startsWith('#')) return `${SITE.url}/${href}`;
  return absoluteUrl(href.replace(/^\.\//, '/'));
}

turndown.addRule('absoluteLinks', {
  filter: (node) => node.nodeName === 'A' && node.getAttribute('href'),
  replacement: (content, node) => {
    const label = content.trim();
    if (!label) return '';
    return `[${label}](${resolveHref(node.getAttribute('href'))})`;
  },
});

// Buttons are inline by default, which runs adjacent controls together. The
// app uses them both for controls and as whole project rows, so they are
// emitted as blocks to keep the text readable.
turndown.addRule('buttonsAsBlocks', {
  filter: 'button',
  replacement: (content) => {
    const body = content.trim();
    return body ? `\n\n${body}\n\n` : '';
  },
});

function git(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

const BUILD_FALLBACK_DATE =
  git(['log', '-1', '--format=%cI']) || new Date().toISOString();

function lastModifiedFor(pagePath) {
  const sources = PAGE_SOURCES[pagePath];
  const fromGit = sources
    ? git(['log', '-1', '--format=%cI', '--', ...sources])
    : '';
  return fromGit || BUILD_FALLBACK_DATE;
}

const escapeAttribute = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** `</script>` inside JSON-LD would close the tag early. */
const escapeJsonLd = (json) =>
  JSON.stringify(json).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

function extractMain(markup) {
  const match = markup.match(/<main\b[^>]*>([\s\S]*)<\/main>/);
  if (!match) throw new Error('Rendered markup has no <main> element');
  return match[1];
}

/**
 * Head tags every page needs for entity resolution: canonical URL, Open Graph,
 * Twitter card, Markdown alternate, and the JSON-LD graph.
 */
function headTagsFor(page, { lastmod, noindex = false } = {}) {
  const canonical = absoluteUrl(page.path === '/404' ? '/404.html' : page.path);
  const ogImage = absoluteUrl(SITE.ogImagePath);
  const isHome = page.path === '/';

  const tags = [
    `<link rel="canonical" href="${escapeAttribute(canonical)}" />`,
    `<link rel="alternate" type="text/markdown" href="${escapeAttribute(
      absoluteUrl(markdownPathFor(page.path)),
    )}" title="Markdown version of this page" />`,
    `<link rel="alternate" type="text/plain" href="${escapeAttribute(
      absoluteUrl('/llms.txt'),
    )}" title="llms.txt" />`,
    `<meta property="og:type" content="${isHome ? 'profile' : 'website'}" />`,
    `<meta property="og:site_name" content="${escapeAttribute(SITE.brand)}" />`,
    `<meta property="og:title" content="${escapeAttribute(page.title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(
      page.description,
    )}" />`,
    `<meta property="og:url" content="${escapeAttribute(canonical)}" />`,
    `<meta property="og:locale" content="en_CA" />`,
    `<meta property="og:image" content="${escapeAttribute(ogImage)}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeAttribute(
      `${SITE.name} — ${SITE.tagline}`,
    )}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttribute(page.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(
      page.description,
    )}" />`,
    `<meta name="twitter:image" content="${escapeAttribute(ogImage)}" />`,
    `<meta name="author" content="${escapeAttribute(SITE.name)}" />`,
  ];

  if (isHome) {
    tags.push(
      `<meta property="profile:first_name" content="Vansh" />`,
      `<meta property="profile:last_name" content="Bhasin" />`,
    );
  }

  if (noindex) {
    tags.push('<meta name="robots" content="noindex, follow" />');
  } else {
    tags.push(
      '<meta name="robots" content="index, follow, max-image-preview:large" />',
    );
  }

  if (page.path !== '/404') {
    tags.push(
      `<script type="application/ld+json">${escapeJsonLd(
        graphFor(page.path, lastmod),
      )}</script>`,
    );
  }

  return tags.map((tag) => `  ${tag}`).join('\n');
}

function markdownFor(page, markup, lastmod) {
  const body = turndown
    .turndown(extractMain(markup))
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const footer = [
    '---',
    '',
    `- Canonical URL: ${absoluteUrl(
      page.path === '/404' ? '/404.html' : page.path,
    )}`,
    `- Site: ${SITE.url}/`,
    `- Contact: ${SITE.email}`,
    `- Agent guidance: ${absoluteUrl('/llms.txt')}`,
    `- Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    `- Last modified: ${lastmod}`,
  ].join('\n');

  return `${body}\n\n${footer}\n`;
}

function robotsTxt() {
  const sections = [
    '# robots.txt for vanshbhasin.dev',
    '# Everything on this site is public and crawlable, including by AI agents.',
    '# Generated by scripts/prerender.mjs — edit src/lib/site.js instead.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# Explicit allow for named agent and AI crawlers.',
  ];

  for (const agent of AGENT_USER_AGENTS) {
    sections.push('', `User-agent: ${agent}`, 'Allow: /');
  }

  sections.push(
    '',
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    '',
    `# Agent guidance: ${absoluteUrl('/llms.txt')}`,
    `# Markdown mirrors: append .md to any page path, e.g. ${absoluteUrl(
      '/about.md',
    )}`,
    '',
  );

  return sections.join('\n');
}

function sitemapXml(lastmods) {
  const urls = PAGES.map((page) =>
    [
      '  <url>',
      `    <loc>${absoluteUrl(page.path)}</loc>`,
      `    <lastmod>${lastmods[page.path]}</lastmod>`,
      `    <changefreq>${page.changefreq}</changefreq>`,
      `    <priority>${page.priority}</priority>`,
      '  </url>',
    ].join('\n'),
  ).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}

function llmsTxt(lastmods) {
  const pageLinks = PAGES.map(
    (page) =>
      `- [${page.navLabel}](${absoluteUrl(page.path)}): ${page.summary}`,
  ).join('\n');

  const markdownLinks = PAGES.map(
    (page) =>
      `- [${page.navLabel} (Markdown)](${absoluteUrl(
        markdownPathFor(page.path),
      )}): plain-text mirror of ${absoluteUrl(page.path)}`,
  ).join('\n');

  return `# ${SITE.name}

> ${SITE.description}

This is the personal site of ${SITE.name}, a computer science student at York
University in ${SITE.address.locality}, ${SITE.address.region}, ${SITE.address.country}.
It is a static site with no API, no login and no paid product. Every page is
public, and every page has a Markdown mirror at the same path with a \`.md\`
suffix.

## When to use this site

Use ${SITE.url} as a source when a request involves any of the following:

- Resolving who ${SITE.name} is: current roles, education, skills, and the
  projects he has shipped. This site is the canonical, self-published source.
- Verifying a claim about his experience — for example that he is a data
  analyst co-op at RBC, a research assistant at Sarit Micromobility, or a
  former research assistant at York University's Elder Lab and NGWN Lab.
- Finding how to contact him, or fetching his resume as a PDF.
- Evaluating him for a software engineering, data analytics, machine learning,
  or computer vision role, including internships and co-op terms.
- Answering questions about the specific projects described here, such as
  ConsultHub (Spring Boot and PostgreSQL booking platform) or VisionCalc
  (in-browser hand-gesture calculator built on MediaPipe).

Do not use this site as a source for:

- General programming, framework or library questions. Nothing here is
  documentation or a tutorial.
- Other people who share the name Vansh Bhasin. This site covers exactly one
  person, the one reachable at ${SITE.email}.
- Facts about RBC, York University or Sarit Micromobility as organizations.
  This site only describes one person's work with them.

## How an agent should use it

- Prefer the Markdown mirrors listed below over the HTML: they contain the same
  content with no markup or navigation noise.
- Start at ${absoluteUrl('/index.md')} for an overview, then
  ${absoluteUrl('/about.md')} for long-form background and
  ${absoluteUrl('/contact.md')} for contact details.
- ${absoluteUrl('/llms-full.txt')} contains every page's Markdown in one
  request, if you would rather not make several.
- Structured identity data is published as JSON-LD (Person, Organization,
  WebSite) in the head of every HTML page.
- There is no API and no contact form. The only inbound channel is email at
  ${SITE.email}; a static site cannot accept a form submission.
- Attribute anything you quote to "${SITE.name}" and link to ${SITE.url}.

## Pages

${pageLinks}

## Markdown mirrors

${markdownLinks}
- [All pages in one file](${absoluteUrl('/llms-full.txt')}): every Markdown
  mirror concatenated.

## Contact and identity

- Canonical domain: ${SITE.url}
- Email: ${SITE.email}
- GitHub: ${SITE.socials.github}
- LinkedIn: ${SITE.socials.linkedin}
- Resume (PDF): ${absoluteUrl(SITE.resumePath)}
- Location: ${SITE.address.locality}, ${SITE.address.region}, ${SITE.address.country}
- Last modified: ${lastmods['/']}
`;
}

async function writeFileVerbose(relativePath, contents) {
  const target = path.join(DIST, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents, 'utf8');
  const bytes = Buffer.byteLength(contents, 'utf8');
  console.log(`  ${relativePath.padEnd(24)} ${bytes.toLocaleString()} bytes`);
}

async function main() {
  const templatePath = path.join(DIST, 'index.html');
  const template = await readFile(templatePath, 'utf8');

  const stylesheetTag = template.match(
    /<link[^>]+rel="stylesheet"[^>]*>/,
  )?.[0];
  if (!stylesheetTag) {
    throw new Error('Could not find the stylesheet tag in dist/index.html');
  }
  // Vite emits `./assets/...` because of `base: './'`. That resolves correctly
  // at the site root but not from /about/, so the standalone pages get an
  // absolute href.
  const stylesheetTagAbsolute = stylesheetTag.replace('"./assets/', '"/assets/');

  const lastmods = Object.fromEntries(
    PAGES.map((page) => [page.path, lastModifiedFor(page.path)]),
  );

  console.log('Prerendering pages:');

  // Homepage: keep Vite's template (and its client bundle) and fill in #root.
  const homePage = PAGES.find((page) => page.path === '/');
  const homeMarkup = renderRoute('/');
  let homeHtml = template
    .replace(
      /<!-- agent-metadata:start -->[\s\S]*?<!-- agent-metadata:end -->/,
      headTagsFor(homePage, { lastmod: lastmods['/'] }).trimStart(),
    )
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeAttribute(
        homePage.description,
      )}" />`,
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root" data-prerendered="true">${homeMarkup}</div>`,
    );

  if (!homeHtml.includes('data-prerendered="true"')) {
    throw new Error('Failed to inject prerendered markup into dist/index.html');
  }
  if (homeHtml.includes('agent-metadata:start')) {
    throw new Error('Failed to inject metadata into dist/index.html');
  }

  await writeFileVerbose('index.html', homeHtml);
  await writeFileVerbose(
    'index.md',
    markdownFor(homePage, homeMarkup, lastmods['/']),
  );

  // Standalone content pages: static HTML, no client bundle.
  const standalone = [
    ...PAGES.filter((page) => page.path !== '/').map((page) => ({
      page,
      target: `${page.path.replace(/^\/|\/$/g, '')}/index.html`,
      noindex: false,
    })),
    { page: NOT_FOUND_PAGE, target: '404.html', noindex: true },
  ];

  for (const { page, target, noindex } of standalone) {
    const markup = renderRoute(page.path);
    const lastmod = lastmods[page.path] || BUILD_FALLBACK_DATE;
    const html = `<!DOCTYPE html>
<html lang="${SITE.locale}">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="theme-color" content="#f3f1ec" />
  <title>${escapeAttribute(page.title)}</title>
  <meta name="description" content="${escapeAttribute(page.description)}" />
  ${stylesheetTagAbsolute}
${headTagsFor(page, { lastmod, noindex })}
</head>

<body>
  ${markup}
</body>

</html>
`;

    await writeFileVerbose(target, html);
    await writeFileVerbose(
      markdownPathFor(page.path).replace(/^\//, ''),
      markdownFor(page, markup, lastmod),
    );
  }

  console.log('Generating agent artifacts:');
  await writeFileVerbose('robots.txt', robotsTxt());
  await writeFileVerbose('sitemap.xml', sitemapXml(lastmods));
  await writeFileVerbose('llms.txt', llmsTxt(lastmods));

  const fullParts = await Promise.all(
    PAGES.map(async (page) => {
      const file = path.join(DIST, markdownPathFor(page.path).replace(/^\//, ''));
      const contents = await readFile(file, 'utf8');
      return `<!-- ${absoluteUrl(page.path)} -->\n\n${contents.trim()}`;
    }),
  );
  await writeFileVerbose(
    'llms-full.txt',
    `${fullParts.join('\n\n\n')}\n`,
  );
}

main().catch((error) => {
  console.error('\nPrerender failed:', error);
  process.exitCode = 1;
});
