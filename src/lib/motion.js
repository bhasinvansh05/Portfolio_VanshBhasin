/**
 * Spring vocabulary for the site, in Apple's designer-facing terms.
 * `bounce` maps to damping ratio (0 = critically damped) and `duration` to response.
 */
export const SPRING = {
  /** Default for anything the interface initiates. Damping 1.0, response 0.4. */
  ui: { type: 'spring', bounce: 0, duration: 0.4 },

  /** Same character, quicker — for small elements and state swaps. */
  snappy: { type: 'spring', bounce: 0, duration: 0.32 },

  /**
   * Slight overshoot, reserved for motion that follows a flick, throw or drag
   * release. Bounce on something the user never touched feels arbitrary.
   */
  momentum: { type: 'spring', bounce: 0.2, duration: 0.4 },
};

/** Non-vestibular equivalents used when prefers-reduced-motion is set. */
export const FADE = {
  ui: { duration: 0.2 },
  quick: { duration: 0.14 },
};
