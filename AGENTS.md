# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single static front-end app: a personal portfolio built with Vite + React (JSX) + TypeScript config, TailwindCSS, Framer Motion/GSAP/Lenis, and Three.js. There is no backend, database, or auth. Package manager is npm (`package-lock.json`).

Scripts (see `package.json`):
- `npm run dev` — start the Vite dev server (defaults to `http://localhost:5173/`). This is the primary way to develop/preview.
- `npm run build` — production build to `dist/` (also useful as the closest thing to a "test": it type/transform-checks the whole app).
- `npm run preview` — serve the built `dist/` output.

Notes / gotchas:
- There is no lint or automated-test script; `npm run build` is the main correctness check.
- CI (`.github/workflows/deploy.yml`) builds with Node 24 and deploys `dist/` to GitHub Pages. Node 22 works fine locally for dev/build.
- `vite.config.js` sets `server.allowedHosts: true` and `base: './'`, so the dev server is reachable through proxied hosts.
- Root-level `extract.js` / `extract.cjs` / `extract.mjs` are one-off scripts that parse `Resume_Vansh.pdf` via `pdf-parse` (not a project dependency); they are unrelated to running the site and can be ignored.
