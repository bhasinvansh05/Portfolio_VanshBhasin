import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Soft light that follows the pointer across the hero — presence without spectacle.
 * Disabled for touch, reduced motion, and reduced transparency.
 */
export default function HeroPresence() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const glow = glowRef.current;
    if (!root || !glow || reduceMotion) return undefined;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduceTransparency = window.matchMedia(
      '(prefers-reduced-transparency: reduce)',
    );
    if (!fine.matches || reduceTransparency.matches) return undefined;

    let raf = 0;
    let tx = 0.5;
    let ty = 0.35;
    let cx = tx;
    let cy = ty;

    const paint = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      glow.style.setProperty('--hx', `${(cx * 100).toFixed(2)}%`);
      glow.style.setProperty('--hy', `${(cy * 100).toFixed(2)}%`);
      glow.style.opacity = '1';

      if (Math.abs(tx - cx) > 0.0008 || Math.abs(ty - cy) > 0.0008) {
        raf = requestAnimationFrame(paint);
      } else {
        raf = 0;
      }
    };

    const onMove = (event) => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      tx = (event.clientX - rect.left) / rect.width;
      ty = (event.clientY - rect.top) / rect.height;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      tx = 0.5;
      ty = 0.35;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(paint);

    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref={glowRef}
        className="hero-presence-glow absolute inset-0 opacity-0"
      />
    </div>
  );
}
