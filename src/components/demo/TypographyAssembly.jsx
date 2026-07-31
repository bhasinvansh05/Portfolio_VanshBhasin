import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useDemoMode } from './DemoModeContext';

const NAME = 'VANSH BHASIN';
const TAGLINE = 'builds things that survive demos';

/** Offset shards so letters look fractured before assembly */
function shardOffsets(charIndex) {
  const seed = (charIndex + 1) * 17;
  return [
    { x: -28 - (seed % 18), y: -36 - (seed % 22), rotate: -18 - (seed % 12) },
    { x: 32 + (seed % 14), y: -22 - (seed % 16), rotate: 14 + (seed % 10) },
    { x: -18 - (seed % 20), y: 34 + (seed % 12), rotate: 22 - (seed % 8) },
    { x: 24 + (seed % 16), y: 28 + (seed % 18), rotate: -12 + (seed % 14) },
  ];
}

function AssembledChar({ char, progress, reduced }) {
  if (char === ' ') {
    return <span className="inline-block w-[0.35em]" aria-hidden="true" />;
  }

  const offsets = shardOffsets(char.charCodeAt(0));
  const t = reduced ? 1 : progress;

  return (
    <span className="relative inline-block mx-[0.02em]" style={{ width: '0.72em', height: '1em' }}>
      {offsets.map((off, i) => {
        const clip =
          i === 0
            ? 'polygon(0 0, 55% 0, 45% 55%, 0 60%)'
            : i === 1
              ? 'polygon(45% 0, 100% 0, 100% 50%, 55% 45%)'
              : i === 2
                ? 'polygon(0 50%, 50% 45%, 55% 100%, 0 100%)'
                : 'polygon(50% 40%, 100% 45%, 100% 100%, 45% 100%)';
        const x = off.x * (1 - t);
        const y = off.y * (1 - t);
        const rotate = off.rotate * (1 - t);
        const opacity = 0.35 + 0.65 * Math.min(1, t * 1.2);
        return (
          <span
            key={i}
            className="absolute inset-0 flex items-center justify-center font-[inherit] font-bold leading-none select-none"
            style={{
              clipPath: clip,
              transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
              opacity,
              willChange: 'transform, opacity',
            }}
            aria-hidden="true"
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

export default function TypographyAssembly() {
  const { isRecruiter, reducedMotion } = useDemoMode();
  const [progress, setProgress] = useState(reducedMotion || isRecruiter ? 1 : 0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const tagInView = useInView(tagRef, { once: true, amount: 0.6 });
  const chars = useMemo(() => NAME.split(''), []);

  // Auto-play assembly on mount when cinematic
  useEffect(() => {
    if (reducedMotion || isRecruiter) {
      setProgress(1);
      return;
    }
    if (hasPlayed) return;
    let raf = 0;
    let start = 0;
    const duration = 1600;
    const tick = (now) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - (1 - t) ** 3;
      setProgress(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setHasPlayed(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, isRecruiter, hasPlayed]);

  const replay = () => {
    if (reducedMotion || isRecruiter) {
      setProgress(1);
      return;
    }
    setHasPlayed(false);
    setProgress(0);
  };

  return (
    <section
      id="demo-typography"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col justify-center px-4 sm:px-6 py-20 sm:py-28"
    >
      <div className="max-w-5xl mx-auto w-full">
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-white/45 mb-3">
          Feature 01 · Inspired by Stefan Vitasović
        </p>
        <h2 className="font-demo-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
          Typography Assembly Motif
        </h2>
        <p className="text-sm sm:text-base text-white/55 max-w-xl mb-10 sm:mb-14 leading-relaxed">
          Why it stands out: the name itself becomes the motion system — shards lock into
          identity before anything else asks for attention.
        </p>

        <div
          className={`relative flex flex-col items-center justify-center min-h-[42vh] sm:min-h-[50vh] ${
            isRecruiter ? '' : 'demo-atmosphere'
          }`}
        >
          {!isRecruiter && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  'radial-gradient(ellipse 70% 50% at 50% 45%, rgba(180,200,220,0.12), transparent 70%)',
              }}
            />
          )}

          <h3
            className="relative font-demo-display text-[clamp(2.4rem,9vw,6.5rem)] tracking-[-0.04em] text-white leading-none text-center"
            aria-label={NAME}
          >
            {chars.map((char, i) => {
              // Stagger: earlier letters assemble slightly ahead
              const local = Math.min(1, Math.max(0, (progress - i * 0.035) / 0.75));
              return (
                <AssembledChar
                  key={`${char}-${i}`}
                  char={char}
                  progress={local}
                  reduced={reducedMotion || isRecruiter}
                />
              );
            })}
          </h3>

          <div ref={tagRef} className="mt-6 sm:mt-8 overflow-hidden">
            <motion.p
              className="font-demo-body text-sm sm:text-lg md:text-xl text-white/70 tracking-wide text-center"
              initial={false}
              animate={
                reducedMotion || isRecruiter || tagInView
                  ? { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }
                  : { opacity: 0, y: 16, clipPath: 'inset(0% 0% 100% 0%)' }
              }
              transition={
                reducedMotion || isRecruiter
                  ? { duration: 0 }
                  : { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }
              }
            >
              {TAGLINE}
            </motion.p>
          </div>
        </div>

        {!isRecruiter && (
          <div className="mt-8 sm:mt-10 max-w-md mx-auto w-full space-y-3">
            <div className="flex items-center justify-between text-xs text-white/45">
              <span>Scrub assembly</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(progress * 100)}
              onChange={(e) => {
                setHasPlayed(true);
                setProgress(Number(e.target.value) / 100);
              }}
              className="w-full accent-white h-2 cursor-pointer"
              aria-label="Scrub typography assembly progress"
              disabled={reducedMotion}
            />
            <button
              type="button"
              onClick={replay}
              className="text-xs text-white/60 hover:text-white underline-offset-4 hover:underline transition-colors"
            >
              Replay assembly
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
