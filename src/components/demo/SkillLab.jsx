import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import gsap from 'gsap';
import { useDemoMode } from './DemoModeContext';

const EASES = [
  { id: 'power2.out', label: 'power2.out' },
  { id: 'power3.inOut', label: 'power3.inOut' },
  { id: 'back.out(1.7)', label: 'back.out' },
  { id: 'elastic.out(1,0.4)', label: 'elastic.out' },
  { id: 'bounce.out', label: 'bounce.out' },
];

function SpringPad({ reduced }) {
  const [stiffness, setStiffness] = useState(180);
  const [damping, setDamping] = useState(18);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <WidgetShell
      title="Spring pad"
      lesson="Stiffness snaps; damping calms the overshoot."
      onReset={reset}
    >
      <div className="relative h-40 sm:h-44 rounded-lg border border-white/10 bg-black/40 overflow-hidden touch-none">
        <motion.div
          drag={!reduced}
          dragConstraints={{ left: -90, right: 90, top: -55, bottom: 55 }}
          dragElastic={reduced ? 0 : 0.35}
          dragTransition={
            reduced
              ? { power: 0, timeConstant: 0 }
              : { bounceStiffness: stiffness, bounceDamping: damping, power: 0.3 }
          }
          style={{ x, y }}
          className="absolute left-1/2 top-1/2 -ml-5 -mt-5 h-10 w-10 rounded-full bg-white cursor-grab active:cursor-grabbing shadow-[0_0_24px_rgba(255,255,255,0.25)]"
          aria-label="Draggable spring handle"
        />
      </div>
      <div className="mt-3 space-y-2 text-xs text-white/55">
        <label className="flex items-center justify-between gap-3">
          <span>Stiffness {stiffness}</span>
          <input
            type="range"
            min={40}
            max={400}
            value={stiffness}
            onChange={(e) => setStiffness(Number(e.target.value))}
            className="w-32 accent-white"
          />
        </label>
        <label className="flex items-center justify-between gap-3">
          <span>Damping {damping}</span>
          <input
            type="range"
            min={4}
            max={40}
            value={damping}
            onChange={(e) => setDamping(Number(e.target.value))}
            className="w-32 accent-white"
          />
        </label>
      </div>
    </WidgetShell>
  );
}

function EasingScrubber({ reduced }) {
  const [ease, setEase] = useState(EASES[0].id);
  const [progress, setProgress] = useState(0);
  const dotRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (!dotRef.current) return undefined;
    gsap.set(dotRef.current, { x: 0 });
    return undefined;
  }, []);

  useEffect(() => {
    if (!dotRef.current) return;
    if (reduced) {
      gsap.set(dotRef.current, { x: progress * 200 });
      return;
    }
    tweenRef.current?.kill();
    // Map scrubbed progress through the selected ease for the path feel
    const proxy = { t: 0 };
    tweenRef.current = gsap.to(proxy, {
      t: progress,
      duration: 0.01,
      ease: 'none',
      onUpdate: () => {
        const eased = gsap.parseEase(ease)(proxy.t);
        gsap.set(dotRef.current, { x: eased * 200 });
      },
    });
  }, [progress, ease, reduced]);

  const play = () => {
    if (!dotRef.current) return;
    tweenRef.current?.kill();
    setProgress(0);
    gsap.set(dotRef.current, { x: 0 });
    if (reduced) {
      gsap.set(dotRef.current, { x: 200 });
      setProgress(1);
      return;
    }
    const proxy = { t: 0 };
    tweenRef.current = gsap.to(proxy, {
      t: 1,
      duration: 1.25,
      ease,
      onUpdate: () => {
        setProgress(proxy.t);
        gsap.set(dotRef.current, { x: proxy.t * 200 });
      },
    });
  };

  const reset = () => {
    tweenRef.current?.kill();
    setProgress(0);
    if (dotRef.current) gsap.set(dotRef.current, { x: 0 });
  };

  return (
    <WidgetShell
      title="Easing scrubber"
      lesson="Same distance, different personality — ease is the feel."
      onReset={reset}
    >
      <div className="relative h-40 sm:h-44 rounded-lg border border-white/10 bg-black/40 px-4 py-6">
        <svg className="absolute inset-x-4 top-8 h-16 w-[calc(100%-2rem)]" viewBox="0 0 220 40" aria-hidden="true">
          <path
            d="M10 30 C 70 30, 90 8, 110 20 S 170 8, 210 12"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.5"
          />
        </svg>
        <div className="absolute left-6 top-[4.5rem] h-3 w-[200px]">
          <div
            ref={dotRef}
            className="h-3 w-3 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.35)]"
          />
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
          <select
            value={ease}
            onChange={(e) => setEase(e.target.value)}
            className="flex-1 bg-black/60 border border-white/15 text-xs text-white rounded px-2 py-1.5"
            aria-label="Select easing function"
          >
            {EASES.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={play}
            className="text-xs px-2.5 py-1.5 rounded border border-white/20 text-white/80 hover:text-white hover:border-white/40"
          >
            Play
          </button>
        </div>
      </div>
      <label className="mt-3 flex items-center justify-between gap-3 text-xs text-white/55">
        <span>Progress {Math.round(progress * 100)}%</span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(progress * 100)}
          onChange={(e) => {
            tweenRef.current?.kill();
            setProgress(Number(e.target.value) / 100);
          }}
          className="w-32 accent-white"
        />
      </label>
    </WidgetShell>
  );
}

function LayoutToy() {
  const [cols, setCols] = useState(3);
  const [gap, setGap] = useState(8);

  const reset = () => {
    setCols(3);
    setGap(8);
  };

  const cells = Array.from({ length: 6 }, (_, i) => i);

  return (
    <WidgetShell
      title="Layout toy"
      lesson="Gap and columns rewrite the same six tiles instantly."
      onReset={reset}
    >
      <div
        className="h-40 sm:h-44 rounded-lg border border-white/10 bg-black/40 p-3 overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: `${gap}px`,
        }}
      >
        {cells.map((i) => (
          <div
            key={i}
            className="min-h-[28px] rounded-sm bg-gradient-to-br from-white/25 to-white/5 border border-white/10"
          />
        ))}
      </div>
      <div className="mt-3 space-y-2 text-xs text-white/55">
        <label className="flex items-center justify-between gap-3">
          <span>Columns {cols}</span>
          <input
            type="range"
            min={1}
            max={4}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="w-32 accent-white"
          />
        </label>
        <label className="flex items-center justify-between gap-3">
          <span>Gap {gap}px</span>
          <input
            type="range"
            min={0}
            max={24}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="w-32 accent-white"
          />
        </label>
      </div>
    </WidgetShell>
  );
}

function WidgetShell({ title, lesson, onReset, children }) {
  return (
    <div className="flex flex-col min-w-0 border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="font-demo-display text-base sm:text-lg text-white">{title}</h3>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 text-[11px] uppercase tracking-wider text-white/45 hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>
      <p className="text-xs text-white/45 mb-3 leading-relaxed">{lesson}</p>
      {children}
    </div>
  );
}

export default function SkillLab() {
  const { reducedMotion, isRecruiter } = useDemoMode();

  return (
    <section id="demo-skill-lab" className="relative px-4 sm:px-6 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto w-full">
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-white/45 mb-3">
          Feature 03 · Inspired by Josh Comeau / Eva Sánchez
        </p>
        <h2 className="font-demo-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
          Hands-On Skill Lab
        </h2>
        <p className="text-sm sm:text-base text-white/55 max-w-xl mb-8 sm:mb-10 leading-relaxed">
          Why it stands out: skills stop being a badge list — you feel spring physics, easing,
          and layout as tools you can tune.
        </p>

        <div
          className={`grid gap-4 ${
            isRecruiter ? 'grid-cols-1 md:grid-cols-3 gap-3' : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          <SpringPad reduced={reducedMotion} />
          <EasingScrubber reduced={reducedMotion} />
          <LayoutToy />
        </div>
      </div>
    </section>
  );
}
