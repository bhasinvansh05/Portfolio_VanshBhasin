/**
 * Single source of truth for site-level identity, used by the browser bundle,
 * the build-time prerender step, and every generated machine-readable file
 * (sitemap.xml, robots.txt, llms.txt, markdown mirrors, JSON-LD).
 *
 * Keeping these values in one module is what stops the generated artifacts
 * from drifting apart; `npm test` asserts the built output matches this file.
 */

export const SITE = {
  name: 'Vansh Bhasin',
  url: 'https://vanshbhasin.dev',
  /** Used as og:site_name and as the Organization/brand entity name. */
  brand: 'Vansh Bhasin',
  tagline: 'Software that survives outside a demo.',
  description:
    'Portfolio of Vansh Bhasin, a computer science student at York University working on data analytics at RBC, vehicle telemetry at Sarit Micromobility, and computer vision research. Experience, projects, skills, and contact details.',
  email: 'me@vanshbhasin.dev',
  jobTitle: 'Software Engineer and Data Analyst',
  locale: 'en',
  /**
   * Approximate, city-level only. Derived from York University (Toronto) and
   * the RBC Toronto co-op; no street address is published on purpose.
   */
  address: {
    locality: 'Toronto',
    region: 'ON',
    country: 'CA',
  },
  socials: {
    github: 'https://github.com/bhasinvansh05',
    linkedin: 'https://www.linkedin.com/in/vansh05/',
  },
  resumePath: '/Resume_Vansh.pdf',
  ogImagePath: '/og.png',
  knowsAbout: [
    'Software engineering',
    'Data analytics',
    'Computer vision',
    'Machine learning',
    'Full-stack web development',
    'Telemetry and IoT systems',
    'Data visualization',
  ],
};

export const SAME_AS = [SITE.socials.github, SITE.socials.linkedin];

/**
 * Every indexable URL on the site. Drives sitemap.xml, llms.txt, the 404
 * recovery links, and the markdown mirrors.
 */
export const PAGES = [
  {
    path: '/',
    navLabel: 'Home',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    summary:
      'Homepage: who Vansh Bhasin is, current roles, featured projects, skills, and how to get in touch.',
    priority: '1.0',
    changefreq: 'monthly',
  },
  {
    path: '/about/',
    navLabel: 'About',
    title: `About ${SITE.name}`,
    description:
      'Background on Vansh Bhasin: computer science at York University, data analytics at RBC, micromobility telemetry at Sarit, and computer vision research at York University labs.',
    summary:
      'Long-form background, education, current and past roles, and areas of technical depth.',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/contact/',
    navLabel: 'Contact',
    title: `Contact ${SITE.name}`,
    description:
      'How to reach Vansh Bhasin: email me@vanshbhasin.dev, GitHub, LinkedIn, resume download, and what kinds of work and questions are a good fit.',
    summary:
      'Verified contact channels, expected response time, and the kinds of enquiries that are a good fit.',
    priority: '0.8',
    changefreq: 'yearly',
  },
  {
    path: '/privacy/',
    navLabel: 'Privacy',
    title: `Privacy — ${SITE.name}`,
    description:
      'Privacy statement for vanshbhasin.dev: what data this static site collects (none), what third parties are involved in hosting, and how to make a data request.',
    summary:
      'What this static site collects, which third parties are involved, and how to contact the owner about data.',
    priority: '0.3',
    changefreq: 'yearly',
  },
];

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = '/') {
  const base = SITE.url.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Path of the markdown mirror that corresponds to an HTML page. */
export function markdownPathFor(path) {
  if (path === '/') return '/index.md';
  return `${path.replace(/\/$/, '')}.md`;
}
