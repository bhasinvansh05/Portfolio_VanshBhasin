import { PAGES, SAME_AS, SITE, absoluteUrl } from './site';

const PERSON_ID = `${SITE.url}/#person`;
const ORGANIZATION_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

const postalAddress = () => ({
  '@type': 'PostalAddress',
  addressLocality: SITE.address.locality,
  addressRegion: SITE.address.region,
  addressCountry: SITE.address.country,
});

const ogImage = () => ({
  '@type': 'ImageObject',
  url: absoluteUrl(SITE.ogImagePath),
  width: 1200,
  height: 630,
});

/** The person the site is about — the primary entity for a personal site. */
function personSchema() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    jobTitle: SITE.jobTitle,
    description: SITE.description,
    image: ogImage(),
    sameAs: SAME_AS,
    knowsAbout: SITE.knowsAbout,
    address: postalAddress(),
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'York University',
      url: 'https://www.yorku.ca/',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'RBC',
      url: 'https://www.rbc.com/',
    },
  };
}

/**
 * The personal brand as an organization. Carries contactPoint and address so
 * an agent can answer "how do I contact them" without scraping prose.
 */
function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE.brand,
    legalName: SITE.name,
    alternateName: 'vanshbhasin.dev',
    url: SITE.url,
    description: SITE.description,
    slogan: SITE.tagline,
    email: SITE.email,
    logo: ogImage(),
    image: ogImage(),
    sameAs: SAME_AS,
    founder: { '@id': PERSON_ID },
    address: postalAddress(),
    areaServed: SITE.address.country,
    knowsAbout: SITE.knowsAbout,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: SITE.email,
        url: absoluteUrl('/contact/'),
        availableLanguage: ['English'],
        areaServed: SITE.address.country,
      },
    ],
  };
}

function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    alternateName: 'vanshbhasin.dev',
    description: SITE.description,
    inLanguage: SITE.locale,
    publisher: { '@id': ORGANIZATION_ID },
    author: { '@id': PERSON_ID },
  };
}

/** schema.org type that best matches each route. */
const PAGE_TYPE = {
  '/': 'ProfilePage',
  '/about/': 'AboutPage',
  '/contact/': 'ContactPage',
  '/privacy/': 'WebPage',
};

function webPageSchema(page, lastmod) {
  const url = absoluteUrl(page.path);
  return {
    '@type': PAGE_TYPE[page.path] || 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: SITE.locale,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    primaryImageOfPage: ogImage(),
    ...(lastmod ? { dateModified: lastmod } : {}),
    breadcrumb: { '@id': `${url}#breadcrumb` },
  };
}

function breadcrumbSchema(page) {
  const url = absoluteUrl(page.path);
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: absoluteUrl('/'),
    },
  ];

  if (page.path !== '/') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: page.navLabel,
      item: url,
    });
  }

  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items,
  };
}

/**
 * Full JSON-LD graph for one page. Person, Organization and WebSite are
 * repeated on every page under stable @ids so any single page is enough for
 * an agent to resolve the identity.
 */
export function graphFor(path, lastmod) {
  const page = PAGES.find((entry) => entry.path === path);
  if (!page) throw new Error(`No page registered for path ${path}`);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      personSchema(),
      organizationSchema(),
      websiteSchema(),
      webPageSchema(page, lastmod),
      breadcrumbSchema(page),
    ],
  };
}
