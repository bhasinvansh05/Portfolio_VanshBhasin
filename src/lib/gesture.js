/**
 * Gesture physics from Apple's "Designing Fluid Interfaces" (WWDC 2018).
 * These are the exact functions the talk ships, not physics-textbook equivalents.
 */

/** Movement threshold before a drag commits to a direction. */
export const DRAG_THRESHOLD = 10;

/**
 * Where a flick would come to rest if it decelerated like a scroll view.
 * Used to pick a snap target from where the gesture is *going*, not where it stopped.
 */
export function projectMomentum(velocity, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Progressive resistance past a boundary: the further out, the less it follows.
 * A hard stop reads as frozen; this reads as "responsive, but there's nothing more here".
 */
export function rubberband(overshoot, dimension, constant = 0.55) {
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  );
}

/**
 * Release velocity in px/s from a short pointer history.
 * A single frame delta is too noisy to hand to a spring, so this compares the
 * latest sample against one at least `minSpanMs` older.
 */
export function velocityFrom(history, minSpanMs = 20) {
  if (!history || history.length < 2) return 0;

  const last = history[history.length - 1];
  let reference = history[0];

  for (let i = history.length - 2; i >= 0; i -= 1) {
    reference = history[i];
    if (last.t - reference.t >= minSpanMs) break;
  }

  const dt = last.t - reference.t;
  if (dt <= 0) return 0;

  return ((last.y - reference.y) / dt) * 1000;
}
