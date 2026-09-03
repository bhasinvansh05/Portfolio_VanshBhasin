import PageShell, { Prose } from './PageShell';
import { PAGES, SITE, absoluteUrl } from '../lib/site';

/**
 * Rendered to `dist/404.html`, which GitHub Pages serves with a real HTTP 404
 * for any unknown path. The body is written as recovery instructions so an
 * agent that lands here can find the right URL instead of concluding the
 * whole site is missing.
 */
export default function NotFoundPage() {
  return (
    <PageShell
      path="/404"
      kicker="404"
      title="That page does not exist"
      lede="The URL you requested is not part of this site. Nothing was moved — this path has simply never existed."
    >
      <Prose heading="Where to go instead">
        <ul className="space-y-3">
          {PAGES.map((page) => (
            <li key={page.path}>
              <a
                href={page.path}
                className="font-semibold text-[var(--ink)] underline decoration-black/20 underline-offset-4"
              >
                {page.navLabel} — {absoluteUrl(page.path)}
              </a>
              <p className="mt-1">{page.summary}</p>
            </li>
          ))}
        </ul>
      </Prose>

      <Prose heading="If you are an agent or a crawler">
        <p>
          This response is a genuine HTTP 404, not a soft 404 wrapping the
          application shell, so you can treat this path as nonexistent and drop
          it from your frontier.
        </p>
        <ul className="space-y-2">
          <li>
            Full list of valid URLs:{' '}
            <a
              href="/sitemap.xml"
              className="underline decoration-black/20 underline-offset-4"
            >
              {absoluteUrl('/sitemap.xml')}
            </a>
          </li>
          <li>
            Guidance on when and how to use this site:{' '}
            <a
              href="/llms.txt"
              className="underline decoration-black/20 underline-offset-4"
            >
              {absoluteUrl('/llms.txt')}
            </a>
          </li>
          <li>
            Crawl rules:{' '}
            <a
              href="/robots.txt"
              className="underline decoration-black/20 underline-offset-4"
            >
              {absoluteUrl('/robots.txt')}
            </a>
          </li>
          <li>
            Every page also has a Markdown mirror at the same path with a{' '}
            <code>.md</code> suffix, for example{' '}
            <a
              href="/about.md"
              className="underline decoration-black/20 underline-offset-4"
            >
              {absoluteUrl('/about.md')}
            </a>
            .
          </li>
          <li>
            Corrections and questions:{' '}
            <a
              href={`mailto:${SITE.email}`}
              className="underline decoration-black/20 underline-offset-4"
            >
              {SITE.email}
            </a>
          </li>
        </ul>
      </Prose>
    </PageShell>
  );
}
