# AGENTS.md

## Skills

- `.agents/skills/apple-design` — Apple interface design & fluid motion (from [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/main/skills/apple-design)). Prefer its guidance for materials, springs, typography, and reduced-motion when redesigning or reviewing UI.

## Site versions

- `/` — current Apple-inspired redesign (active site)
- `/v1/` — archived previous portfolio (static snapshot under `public/v1`)

## Pages and agent-readable files

The homepage is a client-rendered SPA that is **prerendered to static HTML at
build time** so crawlers see real content. `/about/`, `/contact/`, `/privacy/`
and `404.html` are rendered from `src/pages/*` and ship no client JavaScript.

- `src/lib/site.js` is the single source of truth for site identity and the
  page list. Adding or renaming a page means editing it there; `sitemap.xml`,
  `robots.txt`, `llms.txt`, the Markdown mirrors and the JSON-LD all derive
  from it.
- `scripts/prerender.mjs` runs as part of `npm run build` and writes all of
  the above into `dist/`. None of those files exist in `public/`.
- Every page has a Markdown mirror (`/about/` → `/about.md`), plus
  `/llms-full.txt` with all of them concatenated.
- `public/og.png` is generated from `scripts/og-image.template.html` by
  `npm run og:image` (needs a local Chrome). It is committed, and deliberately
  not part of `npm run build` so CI never needs a browser.
- `infra/cloudflare/` holds the Worker and dashboard steps for the two things a
  static host cannot do: Accept-based Markdown negotiation, and unblocking AI
  crawlers that Cloudflare currently answers with 403. See its README.

## Cursor Cloud specific instructions

This repo is a single static front-end app: a personal portfolio built with Vite + React (JSX) + TypeScript config, TailwindCSS, Framer Motion/GSAP/Lenis, and Three.js. There is no backend, database, or auth. Package manager is npm (`package-lock.json`).

Scripts (see `package.json`):
- `npm run dev` — start the Vite dev server (defaults to `http://localhost:5173/`). This is the primary way to develop/preview.
- `npm run build` — production build to `dist/`: Vite client build, then the SSR prerender bundle, then `scripts/prerender.mjs`.
- `npm test` — asserts the agent-readiness contract of `dist/` (raw-HTML content, heading structure, canonical/OG/JSON-LD metadata, sitemap, robots, llms.txt, Markdown mirrors, 404) plus the Worker's Accept-negotiation logic. Requires a build first: `npm run build && npm test`.
- `npm run preview` — serve the built `dist/` output.
- `npm run og:image` — regenerate `public/og.png` (needs a local Chrome).

Notes / gotchas:
- There is no lint script; `npm run build && npm test` is the correctness check.
- `npm test` reads `dist/`, not `src/`, so a stale `dist/` gives misleading results. Always build first.
- CI (`.github/workflows/deploy.yml`) builds with Node 24 and deploys `dist/` to GitHub Pages. Node 22 works fine locally for dev/build.
- `vite.config.js` sets `server.allowedHosts: true` and `base: './'`, so the dev server is reachable through proxied hosts.
- Root-level `extract.js` / `extract.cjs` / `extract.mjs` are one-off scripts that parse `Resume_Vansh.pdf` via `pdf-parse` (not a project dependency); they are unrelated to running the site and can be ignored.
