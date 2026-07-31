import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDemoMode } from './DemoModeContext';

const STORAGE_KEY = 'vb-demo-treasures';

const TREASURES = [
  {
    id: 'glyph',
    label: 'Hidden glyph in the status chip',
    reward: '✦ Micro-interaction credit unlocked',
    style: { top: '18%', left: '12%' },
  },
  {
    id: 'dot',
    label: 'Quiet pulse near the decoy meter',
    reward: '◎ Attention to detail noted',
    style: { top: '42%', right: '18%' },
  },
  {
    id: 'rule',
    label: 'Hairline rule at the strip edge',
    reward: '— Spatial curiosity logged',
    style: { bottom: '22%', left: '28%' },
  },
  {
    id: 'mark',
    label: 'Faint mark beside “System nominal”',
    reward: '◇ Recruiter easter egg found',
    style: { bottom: '30%', right: '10%' },
  },
];

function readFound() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => TREASURES.some((t) => t.id === id)) : [];
  } catch {
    return [];
  }
}

export default function TreasureHunt() {
  const { reducedMotion, isRecruiter } = useDemoMode();
  const [found, setFound] = useState(() => readFound());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    } catch {
      /* ignore */
    }
  }, [found]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const discover = (id) => {
    if (found.includes(id)) return;
    const item = TREASURES.find((t) => t.id === id);
    setFound((prev) => [...prev, id]);
    setToast(item?.reward ?? 'Found!');
  };

  const reset = () => {
    setFound([]);
    setToast(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <section id="demo-treasure" className="relative px-4 sm:px-6 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto w-full">
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-white/45 mb-3">
          Feature 04 · Inspired by Jordan Delcros
        </p>
        <h2 className="font-demo-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
          Hidden Interactives Treasure Hunt
        </h2>
        <p className="text-sm sm:text-base text-white/55 max-w-xl mb-8 leading-relaxed">
          Why it stands out: a “normal” UI strip hides playful rewards — curiosity becomes the
          navigation, with an accessible escape hatch.
        </p>

        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="text-sm text-white/70">
            <span className="font-demo-display text-white">{found.length}/4</span> found
          </p>
          <button
            type="button"
            onClick={reset}
            className="text-xs text-white/45 hover:text-white underline-offset-4 hover:underline"
          >
            Reset hunt
          </button>
        </div>

        <div
          className={`relative border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900/80 to-zinc-950 px-5 sm:px-8 py-8 sm:py-10 min-h-[200px] sm:min-h-[220px] ${
            isRecruiter ? '' : 'overflow-hidden'
          }`}
        >
          {/* Decoy UI */}
          <div className="flex flex-wrap items-center justify-between gap-4 pointer-events-none select-none">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">Telemetry</p>
              <p className="font-demo-display text-lg sm:text-xl text-white/85 mt-1">
                System nominal
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
              status · live
            </div>
            <div className="w-full sm:w-40">
              <div className="flex justify-between text-[10px] text-white/35 mb-1">
                <span>Throughput</span>
                <span>72%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[72%] bg-white/40" />
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-white/30 pointer-events-none">
            Looks ordinary. It isn’t. Tap the quiet spots.
          </p>

          {/* Hotspots */}
          {TREASURES.map((t) => {
            const isFound = found.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => discover(t.id)}
                className={`absolute h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 ${
                  isFound ? 'opacity-100' : 'opacity-0 hover:opacity-30 focus-visible:opacity-40'
                }`}
                style={t.style}
                aria-label={isFound ? `Found: ${t.label}` : `Hidden hotspot: ${t.label}`}
              >
                <motion.span
                  className="block h-full w-full rounded-full border border-white/40 bg-white/10"
                  animate={
                    isFound && !reducedMotion
                      ? { scale: [0.6, 1.15, 1], opacity: [0.4, 1, 0.85] }
                      : { scale: 1, opacity: isFound ? 0.85 : 0.15 }
                  }
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 420, damping: 14 }
                  }
                />
              </button>
            );
          })}
        </div>

        <details className="mt-5 group border border-white/10 bg-white/[0.02] px-4 py-3">
          <summary className="cursor-pointer text-sm text-white/70 list-none flex items-center justify-between">
            <span>Discoverables list</span>
            <span className="text-xs text-white/35 group-open:hidden">show</span>
            <span className="text-xs text-white/35 hidden group-open:inline">hide</span>
          </summary>
          <ul className="mt-3 space-y-2">
            {TREASURES.map((t) => {
              const isFound = found.includes(t.id);
              return (
                <li key={t.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className={isFound ? 'text-white/50 line-through' : 'text-white/80'}>
                    {t.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => discover(t.id)}
                    disabled={isFound}
                    className="text-xs px-2 py-1 border border-white/15 text-white/70 disabled:opacity-40 hover:border-white/35"
                  >
                    {isFound ? 'Found' : 'Reveal'}
                  </button>
                </li>
              );
            })}
          </ul>
        </details>

        <AnimatePresence>
          {toast && (
            <motion.div
              role="status"
              initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={
                reducedMotion
                  ? { duration: 0.1 }
                  : { type: 'spring', stiffness: 380, damping: 22 }
              }
              className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full border border-white/20 bg-black/85 px-5 py-2.5 text-sm text-white shadow-xl backdrop-blur-md"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
