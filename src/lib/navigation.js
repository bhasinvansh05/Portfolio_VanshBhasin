/** Shared section scroll — respects reduced motion + sticky nav offset. */
export function scrollToId(id, { behavior } = {}) {
  const el = document.getElementById(id);
  if (!el) return;

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  el.scrollIntoView({
    behavior: behavior ?? (reduce ? 'auto' : 'smooth'),
    block: 'start',
  });

  // Keep URL hash in sync for shareable deep links without jump
  if (history.replaceState) {
    history.replaceState(null, '', `#${id}`);
  }
}

export const RESUME_URL = './Resume_Vansh.pdf';
export const RESUME_FILENAME = 'Vansh_Bhasin_Resume.pdf';
