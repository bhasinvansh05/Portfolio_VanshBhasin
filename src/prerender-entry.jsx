/**
 * Entry point for the build-time prerender step.
 *
 * Bundled separately with `vite build --ssr` so the Node script in
 * `scripts/prerender.mjs` can render the same React components the browser
 * runs, and write real HTML into `dist/`. Nothing here ships to the browser.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import App from './App';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPage from './pages/PrivacyPage';

const COMPONENTS = {
  '/': App,
  '/about/': AboutPage,
  '/contact/': ContactPage,
  '/privacy/': PrivacyPage,
  '/404': NotFoundPage,
};

export function renderRoute(path) {
  const Component = COMPONENTS[path];
  if (!Component) throw new Error(`No component registered for route ${path}`);
  return renderToStaticMarkup(<Component />);
}

export { graphFor } from './lib/schema';
export {
  PAGES,
  SAME_AS,
  SITE,
  absoluteUrl,
  markdownPathFor,
} from './lib/site';
