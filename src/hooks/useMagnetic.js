import { useEffect, useRef } from 'react';

/**
 * Subtle pointer magnetism for desktop fine pointers.
 * Translates the element toward the cursor within `strength` px; springs back on leave.
 */
export function useMagnetic({
  strength = 10,
  enabled = true,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return undefined;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let tracking = false;

    const tick = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

      if (
        tracking ||
        Math.abs(targetX - currentX) > 0.05 ||
        Math.abs(targetY - currentY) > 0.05
      ) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        el.style.transform = '';
      }
    };

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const pull = Math.min(1, (rect.width * 0.65) / dist);
      targetX = (dx / dist) * strength * pull;
      targetY = (dy / dist) * strength * pull;
      tracking = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      tracking = false;
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [enabled, strength]);

  return ref;
}
