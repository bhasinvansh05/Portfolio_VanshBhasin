#!/usr/bin/env node --test
/**
 * Verifies the agent-readiness contract of the built site.
 *
 * Run with `npm test`, after `npm run build`. Everything here reads `dist/`,
 * because the built output is what an agent actually fetches — asserting on
 * source files would pass even if the prerender step silently stopped running.
 *
 * The pure helpers of the Cloudflare Worker in infra/cloudflare are covered
 * too, since they cannot be exercised against the deployed site from here.
 */
import assert from 'node:assert/strict';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { PAGES, SAME_AS, SITE, absoluteUrl, markdownPathFor } from '../src/lib/site.js';
import worker, {
  markdownPathFor as workerMarkdownPathFor,
  parseAccept,
  prefersMarkdown,
} from '../infra/cloudflare/markdown-negotiation.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/index.html is missing. Run `npm run build` first.');
  process.exit(1);
}

const read = (relativePath) =>
  readFileSync(path.join(DIST, relativePath), 'utf8');

/** Approximates what a crawler that does not execute JavaScript would read. */
function visibleText(html) {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const headingLevels = (html) =>
  [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));

const metaContent = (html, attribute, name) => {
  const pattern = new RegExp(
    `<meta[^>]+${attribute}="${name}"[^>]+content="([^"]*)"`,
    'i',
  );
  return html.match(pattern)?.[1] ?? null;
};

const linkHref = (html, rel) =>
  html.match(new RegExp(`<link[^>]+rel="${rel}"[^>]+href="([^"]*)"`, 'i'))?.[1] ??
  null;

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
};

/**
 * Serves `dist/` the way GitHub Pages does — directory index files, and
 * 404.html with a real 404 status — so the Cloudflare Worker can be exercised
 * without a network or a deployment.
 */
function startStaticServer() {
  const server = createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost');
    let file = path.join(DIST, decodeURIComponent(pathname));

    if (existsSync(file) && statSync(file).isDirectory()) {
      file = path.join(file, 'index.html');
    }

    if (!file.startsWith(DIST) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404, { 'content-type': CONTENT_TYPES['.html'] });
      createReadStream(path.join(DIST, '404.html')).pipe(res);
      return;
    }

    res.writeHead(200, {
      'content-type':
        CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream',
      vary: 'Accept-Encoding',
    });
    createReadStream(file).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () =>
      resolve({
        origin: `http://127.0.0.1:${server.address().port}`,
        close: () => new Promise((done) => server.close(done)),
      }),
    );
  });
}

/** Every page rendered to HTML, including the 404 that is not in the sitemap. */
const HTML_PAGES = [
  ...PAGES.map((page) => ({
    ...page,
    file: page.path === '/' ? 'index.html' : `${page.path.replace(/^\/|\/$/g, '')}/index.html`,
    indexable: true,
  })),
  {
    path: '/404',
    navLabel: 'Not found',
    file: '404.html',
    indexable: false,
  },
];

test('homepage serves meaningful content without JavaScript', async (t) => {
  const html = read('index.html');
  const text = visibleText(html);

  await t.test('has well over the 500 character minimum', () => {
    assert.ok(
      text.length >= 500,
      `raw homepage text is only ${text.length} characters`,
    );
  });

  await t.test('markup came from the prerender step', () => {
    assert.match(html, /<div id="root" data-prerendered="true">/);
    assert.doesNotMatch(html, /<div id="root"><\/div>/);
  });

  await t.test('metadata placeholder was replaced', () => {
    assert.doesNotMatch(html, /agent-metadata:(start|end)/);
  });

  await t.test('content is not parked at opacity 0 by the animation library', () => {
    const hero = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/i)?.[0] ?? '';
    assert.doesNotMatch(hero, /opacity:\s*0/);
  });

  await t.test('names the site owner in the raw HTML', () => {
    assert.ok(text.includes(SITE.name));
  });
});

test('every page has one H1 and sequential heading levels', () => {
  for (const page of HTML_PAGES) {
    const levels = headingLevels(read(page.file));

    assert.ok(levels.length > 0, `${page.file} has no headings`);
    assert.equal(levels[0], 1, `${page.file} does not open with an h1`);
    assert.equal(
      levels.filter((level) => level === 1).length,
      1,
      `${page.file} does not have exactly one h1`,
    );

    let deepest = 1;
    for (const level of levels) {
      assert.ok(
        level <= deepest + 1,
        `${page.file} jumps from h${deepest} to h${level}`,
      );
      deepest = Math.max(deepest, level);
    }
  }
});

test('trust anchor pages carry at least 500 characters each', () => {
  for (const pagePath of ['/about/', '/contact/', '/privacy/']) {
    const page = HTML_PAGES.find((entry) => entry.path === pagePath);
    assert.ok(page, `${pagePath} is not registered`);

    const text = visibleText(read(page.file));
    assert.ok(
      text.length >= 500,
      `${page.file} has only ${text.length} characters of text`,
    );
  }
});

test('standalone pages load the stylesheet by absolute path', () => {
  // `base: './'` makes Vite emit relative asset URLs, which resolve to
  // /about/assets/... from a nested page and 404.
  for (const page of HTML_PAGES.filter((entry) => entry.file !== 'index.html')) {
    const html = read(page.file);
    const href = linkHref(html, 'stylesheet');

    assert.ok(href, `${page.file} has no stylesheet`);
    assert.ok(
      href.startsWith('/assets/'),
      `${page.file} stylesheet href is not absolute: ${href}`,
    );
    assert.ok(
      existsSync(path.join(DIST, href.replace(/^\//, ''))),
      `${page.file} stylesheet ${href} does not exist in dist`,
    );
  }
});

test('metadata signals are complete on every page', () => {
  for (const page of HTML_PAGES) {
    const html = read(page.file);
    const label = page.file;

    assert.match(html, /<html lang="en"/, `${label} is missing html lang`);

    const canonical = linkHref(html, 'canonical');
    const expected = absoluteUrl(page.path === '/404' ? '/404.html' : page.path);
    assert.equal(canonical, expected, `${label} canonical URL is wrong`);

    assert.ok(metaContent(html, 'name', 'description'), `${label} has no description`);
    assert.ok(
      metaContent(html, 'property', 'og:type'),
      `${label} has no og:type`,
    );
    assert.equal(
      metaContent(html, 'property', 'og:image'),
      absoluteUrl(SITE.ogImagePath),
      `${label} og:image is wrong`,
    );
    assert.equal(
      metaContent(html, 'property', 'og:url'),
      expected,
      `${label} og:url is wrong`,
    );
    assert.ok(metaContent(html, 'property', 'og:title'), `${label} has no og:title`);
    assert.ok(
      metaContent(html, 'property', 'og:site_name'),
      `${label} has no og:site_name`,
    );
    assert.equal(
      metaContent(html, 'name', 'twitter:card'),
      'summary_large_image',
      `${label} twitter:card is wrong`,
    );

    const markdownAlternate = html.match(
      /<link[^>]+type="text\/markdown"[^>]+href="([^"]*)"/i,
    )?.[1];
    assert.equal(
      markdownAlternate,
      absoluteUrl(markdownPathFor(page.path)),
      `${label} markdown alternate is wrong`,
    );
  }
});

test('the 404 page is marked noindex and the rest are indexable', () => {
  for (const page of HTML_PAGES) {
    const robots = metaContent(read(page.file), 'name', 'robots') ?? '';
    if (page.indexable) {
      assert.match(robots, /\bindex\b/, `${page.file} is not indexable`);
      assert.doesNotMatch(robots, /noindex/, `${page.file} is noindex`);
    } else {
      assert.match(robots, /noindex/, `${page.file} should be noindex`);
    }
  }
});

test('JSON-LD identifies the site owner and the organization', async (t) => {
  const graphs = new Map();

  for (const page of PAGES) {
    const file = HTML_PAGES.find((entry) => entry.path === page.path).file;
    const html = read(file);
    const raw = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )?.[1];

    assert.ok(raw, `${file} has no JSON-LD block`);
    const parsed = JSON.parse(raw);
    assert.equal(parsed['@context'], 'https://schema.org');
    assert.ok(Array.isArray(parsed['@graph']), `${file} JSON-LD has no @graph`);
    graphs.set(page.path, parsed['@graph']);
  }

  const nodeOfType = (graph, type) =>
    graph.find((node) => node['@type'] === type);

  await t.test('Person is complete', () => {
    for (const [pagePath, graph] of graphs) {
      const person = nodeOfType(graph, 'Person');
      assert.ok(person, `${pagePath} has no Person node`);
      assert.equal(person.name, SITE.name);
      assert.equal(person.url, SITE.url);
      assert.equal(person.email, SITE.email);
      assert.deepEqual(person.sameAs, SAME_AS);
      assert.ok(person.jobTitle, `${pagePath} Person has no jobTitle`);
      assert.equal(person.address['@type'], 'PostalAddress');
    }
  });

  await t.test('Organization has contactPoint and address', () => {
    for (const [pagePath, graph] of graphs) {
      const org = nodeOfType(graph, 'Organization');
      assert.ok(org, `${pagePath} has no Organization node`);

      const contactPoints = [].concat(org.contactPoint ?? []);
      assert.ok(
        contactPoints.length > 0,
        `${pagePath} Organization has no contactPoint`,
      );
      for (const contact of contactPoints) {
        assert.equal(contact['@type'], 'ContactPoint');
        assert.ok(contact.contactType, 'contactPoint has no contactType');
        assert.equal(contact.email, SITE.email);
      }

      assert.equal(org.address['@type'], 'PostalAddress');
      assert.equal(org.address.addressLocality, SITE.address.locality);
      assert.equal(org.address.addressRegion, SITE.address.region);
      assert.equal(org.address.addressCountry, SITE.address.country);
      assert.deepEqual(org.sameAs, SAME_AS);
    }
  });

  await t.test('WebSite and per-page nodes are present', () => {
    for (const [pagePath, graph] of graphs) {
      assert.ok(nodeOfType(graph, 'WebSite'), `${pagePath} has no WebSite node`);
      assert.ok(
        nodeOfType(graph, 'BreadcrumbList'),
        `${pagePath} has no BreadcrumbList`,
      );

      const pageNode = graph.find((node) =>
        String(node['@id']).endsWith('#webpage'),
      );
      assert.ok(pageNode, `${pagePath} has no page node`);
      assert.equal(pageNode.url, absoluteUrl(pagePath));
      assert.ok(pageNode.description, `${pagePath} page node has no description`);
      assert.ok(
        !Number.isNaN(Date.parse(pageNode.dateModified)),
        `${pagePath} dateModified is not a date`,
      );
    }
  });

  await t.test('the homepage is typed as a profile page', () => {
    const home = graphs.get('/');
    assert.ok(nodeOfType(home, 'ProfilePage'));
  });
});

test('sitemap.xml lists every indexable page with a lastmod', () => {
  const xml = read('sitemap.xml');

  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);

  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => ({
    loc: match[1].match(/<loc>([^<]+)<\/loc>/)?.[1],
    lastmod: match[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
  }));

  assert.deepEqual(
    entries.map((entry) => entry.loc).sort(),
    PAGES.map((page) => absoluteUrl(page.path)).sort(),
  );

  for (const entry of entries) {
    assert.ok(
      !Number.isNaN(Date.parse(entry.lastmod)),
      `${entry.loc} has an unparseable lastmod: ${entry.lastmod}`,
    );
  }

  assert.ok(!xml.includes('/404'), 'the 404 page must not be in the sitemap');
});

test('robots.txt allows agents and points at the sitemap', () => {
  const robots = read('robots.txt');

  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.ok(
    robots.includes(`Sitemap: ${absoluteUrl('/sitemap.xml')}`),
    'robots.txt does not declare the sitemap',
  );

  // The agents the audit found blocked need an unambiguous grant.
  for (const agent of [
    'GPTBot',
    'ChatGPT-User',
    'ClaudeBot',
    'PerplexityBot',
    'Google-Extended',
    'DeepSeekBot',
    'ora-agent',
  ]) {
    const group = robots.match(
      new RegExp(`^User-agent: ${agent}$\\n(Allow|Disallow): (.*)$`, 'm'),
    );
    assert.ok(group, `robots.txt has no group for ${agent}`);
    assert.equal(group[1], 'Allow', `${agent} is disallowed`);
    assert.equal(group[2], '/', `${agent} is not allowed the whole site`);
  }

  assert.doesNotMatch(robots, /^Disallow: \/$/m, 'robots.txt disallows the site');
});

test('llms.txt follows the format and says when to use the site', () => {
  const llms = read('llms.txt');

  assert.match(llms, /^# .+/, 'llms.txt does not open with an H1');
  assert.match(llms, /^> .+/m, 'llms.txt has no summary blockquote');
  assert.match(
    llms,
    /^## When to use this site$/m,
    'llms.txt has no when-to-use section',
  );
  assert.match(
    llms,
    /^## How an agent should use it$/m,
    'llms.txt has no usage instructions',
  );

  // The when-to-use section has to be specific rather than marketing copy.
  const whenToUse = llms.split('## When to use this site')[1].split('\n## ')[0];
  assert.ok(
    whenToUse.length > 400,
    `when-to-use section is only ${whenToUse.length} characters`,
  );
  assert.ok(whenToUse.includes('Do not use'), 'when-to-use has no exclusions');

  assert.ok(llms.includes(SITE.email), 'llms.txt does not list the email');
  for (const page of PAGES) {
    assert.ok(
      llms.includes(absoluteUrl(page.path)),
      `llms.txt does not link ${page.path}`,
    );
    assert.ok(
      llms.includes(absoluteUrl(markdownPathFor(page.path))),
      `llms.txt does not link the markdown mirror for ${page.path}`,
    );
  }
});

test('every page has a Markdown mirror', () => {
  for (const page of PAGES) {
    const file = markdownPathFor(page.path).replace(/^\//, '');
    assert.ok(existsSync(path.join(DIST, file)), `${file} is missing`);

    const markdown = read(file);
    assert.ok(
      markdown.length >= 500,
      `${file} is only ${markdown.length} characters`,
    );
    assert.match(markdown, /^#{1,2} .+/m, `${file} has no heading`);
    assert.ok(
      markdown.includes(`Canonical URL: ${absoluteUrl(page.path)}`),
      `${file} does not declare its canonical URL`,
    );

    // A mirror is read out of context, so relative links would be broken.
    assert.doesNotMatch(markdown, /\]\(\.?\//, `${file} contains relative links`);
  }

  const full = read('llms-full.txt');
  for (const page of PAGES) {
    assert.ok(
      full.includes(absoluteUrl(page.path)),
      `llms-full.txt is missing ${page.path}`,
    );
  }
});

test('the 404 page helps an agent recover', () => {
  const html = read('404.html');
  const text = visibleText(html);

  assert.ok(text.length >= 500, `404 body is only ${text.length} characters`);
  for (const target of ['/sitemap.xml', '/llms.txt', '/robots.txt', '/about.md']) {
    assert.ok(html.includes(target), `404 page does not link ${target}`);
  }
  for (const page of PAGES) {
    assert.ok(
      html.includes(`href="${page.path}"`),
      `404 page does not link ${page.path}`,
    );
  }
  assert.ok(existsSync(path.join(DIST, '404.md')), '404.md is missing');
});

test('the Open Graph image is a 1200x630 PNG', () => {
  const file = path.join(DIST, SITE.ogImagePath.replace(/^\//, ''));
  assert.ok(existsSync(file), `${SITE.ogImagePath} is missing from dist`);

  const bytes = readFileSync(file);
  assert.equal(
    bytes.subarray(0, 8).toString('hex'),
    '89504e470d0a1a0a',
    'og image is not a PNG',
  );
  assert.equal(bytes.readUInt32BE(16), 1200, 'og image width');
  assert.equal(bytes.readUInt32BE(20), 630, 'og image height');
});

test('Accept negotiation prefers markdown only when asked', async (t) => {
  await t.test('parses q values in priority order', () => {
    assert.deepEqual(parseAccept('text/html;q=0.8, text/markdown;q=0.9'), [
      { type: 'text/markdown', q: 0.9 },
      { type: 'text/html', q: 0.8 },
    ]);
    assert.deepEqual(parseAccept(null), []);
  });

  await t.test('markdown wins when explicitly requested', () => {
    assert.equal(prefersMarkdown('text/markdown'), true);
    assert.equal(prefersMarkdown('text/markdown, text/html;q=0.5'), true);
    assert.equal(prefersMarkdown('text/x-markdown'), true);
    assert.equal(prefersMarkdown('text/markdown;q=0.9, text/html;q=0.9'), true);
  });

  await t.test('HTML clients are left alone', () => {
    assert.equal(prefersMarkdown('*/*'), false);
    assert.equal(prefersMarkdown(null), false);
    assert.equal(prefersMarkdown('text/html'), false);
    assert.equal(
      prefersMarkdown('text/html,application/xhtml+xml,*/*;q=0.8'),
      false,
    );
    assert.equal(prefersMarkdown('text/html, text/markdown;q=0.5'), false);
    assert.equal(prefersMarkdown('text/markdown;q=0'), false);
  });

  await t.test('paths map to the mirrors the build actually writes', () => {
    for (const page of PAGES) {
      const mapped = workerMarkdownPathFor(page.path);
      assert.equal(mapped, markdownPathFor(page.path));
      assert.ok(
        existsSync(path.join(DIST, mapped.replace(/^\//, ''))),
        `worker maps ${page.path} to ${mapped}, which does not exist`,
      );
    }

    assert.equal(workerMarkdownPathFor('/about'), '/about.md');
    assert.equal(workerMarkdownPathFor('/index.html'), '/index.md');
    assert.equal(workerMarkdownPathFor(''), '/index.md');
  });

  await t.test('the worker serves the right variant end to end', async () => {
    // The worker is pure request-in/response-out, so it can run against a
    // throwaway server that behaves like GitHub Pages.
    const { origin, close } = await startStaticServer();

    try {
      const markdown = await worker.fetch(
        new Request(`${origin}/about/`, { headers: { Accept: 'text/markdown' } }),
      );
      assert.equal(markdown.status, 200);
      assert.equal(
        markdown.headers.get('content-type'),
        'text/markdown; charset=utf-8',
      );
      assert.equal(markdown.headers.get('vary'), 'Accept, Accept-Encoding');
      assert.match(markdown.headers.get('link'), /rel="alternate"/);
      assert.match(await markdown.text(), /^#{1,2} /m);

      const html = await worker.fetch(
        new Request(`${origin}/about/`, {
          headers: { Accept: 'text/html,application/xhtml+xml,*/*;q=0.8' },
        }),
      );
      assert.equal(html.status, 200);
      assert.match(html.headers.get('content-type'), /text\/html/);
      assert.equal(html.headers.get('vary'), 'Accept, Accept-Encoding');
      assert.match(await html.text(), /<!DOCTYPE html>/i);

      // A 404 stays a 404 rather than becoming a soft 200.
      const missing = await worker.fetch(
        new Request(`${origin}/nope`, { headers: { Accept: 'text/markdown' } }),
      );
      assert.equal(missing.status, 404);

      // Assets are passed through untouched.
      const asset = await worker.fetch(new Request(`${origin}/og.png`));
      assert.equal(asset.status, 200);
      assert.equal(asset.headers.get('content-type'), 'image/png');
    } finally {
      await close();
    }
  });

  await t.test('assets and generated files have no mirror', () => {
    for (const pathname of [
      '/assets/index-abc123.css',
      '/assets/index-abc123.js',
      '/og.png',
      '/Resume_Vansh.pdf',
      '/sitemap.xml',
      '/robots.txt',
      '/llms.txt',
      '/about.md',
      '/v1/index.html',
    ]) {
      assert.equal(
        workerMarkdownPathFor(pathname),
        null,
        `${pathname} should not be negotiated`,
      );
    }
  });
});
