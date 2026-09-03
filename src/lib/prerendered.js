/**
 * True while the build-time prerender step is turning the app into static
 * HTML. There is no document then, so components render their no-motion
 * branch: the generated markup has to contain readable text rather than
 * elements parked at `opacity: 0` waiting for an animation to run.
 */
export const IS_STATIC_RENDER = typeof document === 'undefined';

/**
 * True in the browser when this page's markup came from the prerender step,
 * i.e. the above-the-fold content was already painted before React booted.
 *
 * The one-time entrance animations are skipped in that case: re-hiding
 * content the browser has already shown reads as a flash, not as motion.
 * Scroll-driven reveals further down the page are unaffected.
 *
 * Read at module load, which runs before `createRoot().render()` clears #root.
 */
export const IS_PRERENDERED =
  !IS_STATIC_RENDER &&
  document.getElementById('root')?.dataset.prerendered === 'true';
