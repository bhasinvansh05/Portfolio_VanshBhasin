import { PAGES, SITE, markdownPathFor } from '../lib/site';

/**
 * Chrome for the standalone content pages (/about, /contact, /privacy).
 *
 * These pages are rendered to static HTML at build time and ship no client
 * JavaScript, so everything here has to work as plain markup: real links
 * instead of scroll handlers, no motion, no state. Styling reuses the same
 * classes as the single-page app so the pages stay visually consistent.
 */
export default function PageShell({ path, kicker, title, lede, children }) {
  const markdownPath = markdownPathFor(path);

  return (
    <div className="apple-canvas relative min-h-screen text-[var(--ink)]">
      <a href="#main" className="apple-skip">
        Skip to content
      </a>

      <header className="px-[var(--section-gutter)] pt-[max(0.75rem,env(safe-area-inset-top))]">
        <nav
          className="apple-material apple-material-heavy apple-nav-capsule mx-auto flex items-center"
          aria-label="Primary"
        >
          <a
            href="/"
            className="apple-press apple-nav-link shrink-0 font-semibold text-[var(--ink)]"
          >
            Vansh
          </a>

          <div className="flex min-w-0 flex-1 items-center justify-end overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PAGES.filter((page) => page.path !== '/').map((page) => (
              <a
                key={page.path}
                href={page.path}
                aria-current={page.path === path ? 'page' : undefined}
                className={
                  page.path === path
                    ? 'apple-press apple-nav-link relative text-[var(--ink)]'
                    : 'apple-press apple-nav-link relative text-[var(--ink-secondary)] hover:text-[var(--ink)]'
                }
              >
                {page.navLabel}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main id="main" className="apple-section relative z-0">
        <div className="apple-panel">
          <div className="apple-section-head">
            <p className="apple-kicker mb-3">{kicker}</p>
            <h1 className="apple-title text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] text-[var(--ink)]">
              {title}
            </h1>
            <p className="apple-body mx-auto mt-4 max-w-2xl text-[var(--ink-secondary)]">
              {lede}
            </p>
          </div>

          {children}
        </div>
      </main>

      <footer className="apple-section pt-0">
        <div className="apple-panel apple-panel-muted text-center">
          <h2 className="apple-kicker mb-4">Elsewhere on this site</h2>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.9375rem] font-medium tracking-[-0.01em]">
            {PAGES.map((page) => (
              <li key={page.path}>
                <a
                  href={page.path}
                  className="text-[var(--ink-secondary)] underline decoration-black/20 underline-offset-4 hover:text-[var(--ink)]"
                >
                  {page.navLabel}
                </a>
              </li>
            ))}
            <li>
              <a
                href={markdownPath}
                className="text-[var(--ink-secondary)] underline decoration-black/20 underline-offset-4 hover:text-[var(--ink)]"
              >
                This page as Markdown
              </a>
            </li>
            <li>
              <a
                href="/llms.txt"
                className="text-[var(--ink-secondary)] underline decoration-black/20 underline-offset-4 hover:text-[var(--ink)]"
              >
                llms.txt
              </a>
            </li>
            <li>
              <a
                href="/sitemap.xml"
                className="text-[var(--ink-secondary)] underline decoration-black/20 underline-offset-4 hover:text-[var(--ink)]"
              >
                Sitemap
              </a>
            </li>
          </ul>
          <p className="apple-body mt-6 text-[0.9375rem] text-[var(--ink-secondary)]">
            {SITE.name} · <a href={`mailto:${SITE.email}`} className="underline decoration-black/20 underline-offset-4 hover:text-[var(--ink)]">{SITE.email}</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

/** Shared body-copy section used inside the content pages. */
export function Prose({ heading, children }) {
  return (
    <section className="mx-auto mt-10 max-w-2xl text-left first:mt-0">
      <h2 className="apple-title-sm text-[clamp(1.15rem,1rem+0.7vw,1.5rem)] text-[var(--ink)]">
        {heading}
      </h2>
      <div className="apple-body mt-3 space-y-4 text-[var(--ink-secondary)]">
        {children}
      </div>
    </section>
  );
}
