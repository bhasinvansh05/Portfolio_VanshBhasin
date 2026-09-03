/**
 * Cloudflare Worker: Accept-based Markdown content negotiation for
 * vanshbhasin.dev, per the acceptmarkdown.com convention.
 *
 * GitHub Pages serves static files and cannot vary a response on a request
 * header, so this runs at the edge in front of it:
 *
 *  - `Accept: text/markdown` (or any Accept that prefers Markdown over HTML)
 *    gets the page's Markdown mirror with `Content-Type: text/markdown`.
 *  - Everything else gets the HTML page, untouched.
 *  - Both variants carry `Vary: Accept, Accept-Encoding` so a cache can never
 *    hand an HTML response to a client that asked for Markdown.
 *  - Both variants advertise the alternate via a `Link` header.
 *
 * The Markdown mirrors are generated at build time by scripts/prerender.mjs,
 * so `/about/` always has a matching `/about.md`.
 *
 * Deployment is documented in infra/cloudflare/README.md. Nothing in the site
 * build depends on this file; it is inert until deployed.
 */

const MARKDOWN_TYPES = ['text/markdown', 'text/x-markdown'];
const HTML_TYPES = ['text/html', 'application/xhtml+xml'];

/**
 * Parses an Accept header into entries sorted by descending q value, keeping
 * the original order as the tiebreak so earlier entries win.
 *
 * @param {string | null} header
 * @returns {{ type: string, q: number }[]}
 */
export function parseAccept(header) {
  if (!header) return [];

  return header
    .split(',')
    .map((part, index) => {
      const [rawType, ...params] = part.split(';');
      const type = rawType.trim().toLowerCase();
      if (!type) return null;

      const qParam = params
        .map((param) => param.trim().toLowerCase())
        .find((param) => param.startsWith('q='));
      const parsed = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
      const q = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 1) : 1;

      return { type, q, index };
    })
    .filter(Boolean)
    .sort((a, b) => b.q - a.q || a.index - b.index)
    .map(({ type, q }) => ({ type, q }));
}

/** Best q value the header offers for `candidates`, honouring wildcards. */
function qualityFor(entries, candidates) {
  let best = -1;

  for (const { type, q } of entries) {
    const matches =
      candidates.includes(type) ||
      type === '*/*' ||
      (type === 'text/*' && candidates.some((c) => c.startsWith('text/')));
    if (matches && q > best) best = q;
  }

  return best;
}

/**
 * True when the client would rather have Markdown than HTML.
 *
 * A wildcard-only Accept (`*​/*`, as sent by curl and most crawlers) is not
 * treated as a Markdown request: those clients expect the HTML page.
 *
 * @param {string | null} header
 */
export function prefersMarkdown(header) {
  const entries = parseAccept(header);
  if (!entries.length) return false;

  const explicitMarkdown = entries.some(
    ({ type, q }) => MARKDOWN_TYPES.includes(type) && q > 0,
  );
  if (!explicitMarkdown) return false;

  const markdownQuality = qualityFor(entries, MARKDOWN_TYPES);
  const htmlQuality = qualityFor(entries, HTML_TYPES);

  return markdownQuality > 0 && markdownQuality >= htmlQuality;
}

/**
 * Maps a request pathname to its Markdown mirror, or null when the path has
 * none (assets, the PDF, the generated text files, and so on).
 *
 * @param {string} pathname
 * @returns {string | null}
 */
export function markdownPathFor(pathname) {
  if (/\.(md|txt|xml|json|png|jpe?g|webp|svg|ico|pdf|css|js|map)$/i.test(pathname)) {
    return null;
  }
  if (pathname.startsWith('/v1')) return null;

  if (pathname === '' || pathname === '/' || pathname === '/index.html') {
    return '/index.md';
  }

  const trimmed = pathname.replace(/\/?(index\.html)?$/, '').replace(/\/$/, '');
  return trimmed ? `${trimmed}.md` : '/index.md';
}

function withNegotiationHeaders(response, { alternate, isMarkdown }) {
  const headers = new Headers(response.headers);
  headers.set('Vary', 'Accept, Accept-Encoding');
  headers.set(
    'Link',
    `<${alternate}>; rel="alternate"; type="${
      isMarkdown ? 'text/html' : 'text/markdown'
    }"`,
  );
  if (isMarkdown) {
    headers.set('Content-Type', 'text/markdown; charset=utf-8');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const markdownPath = markdownPathFor(url.pathname);

    // Paths with no Markdown mirror still need Vary, or a cache keyed on the
    // first request could pin the wrong variant for the whole site.
    if (!markdownPath) return fetch(request);

    const htmlUrl = new URL(url);
    const markdownUrl = new URL(markdownPath, url);

    if (!prefersMarkdown(request.headers.get('Accept'))) {
      const response = await fetch(request);
      return withNegotiationHeaders(response, {
        alternate: markdownUrl.toString(),
        isMarkdown: false,
      });
    }

    const markdownResponse = await fetch(new Request(markdownUrl, request));

    // A missing mirror must not turn a valid page into a 404.
    if (!markdownResponse.ok) {
      const fallback = await fetch(request);
      return withNegotiationHeaders(fallback, {
        alternate: markdownUrl.toString(),
        isMarkdown: false,
      });
    }

    return withNegotiationHeaders(markdownResponse, {
      alternate: htmlUrl.toString(),
      isMarkdown: true,
    });
  },
};
