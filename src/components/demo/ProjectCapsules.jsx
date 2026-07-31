import { useEffect, useRef, useState } from 'react';
import { useDemoMode } from './DemoModeContext';

const PROJECTS = [
  {
    id: 'consulthub',
    title: 'ConsultHub',
    role: 'Full-stack booking platform',
    summary:
      'End-to-end consulting marketplace with scheduling, auth, and a clean booking loop that still holds up after the demo.',
    stack: 'React · Node · Postgres',
  },
  {
    id: 'yolo',
    title: 'YOLO Traffic',
    role: 'Computer vision research',
    summary:
      'Drone-footage pipelines that detect and track vehicles — deployment sped up ~40% with Docker + CI.',
    stack: 'YOLO · Python · Docker',
  },
  {
    id: 'emf',
    title: 'EMF Mapper',
    role: 'Deep learning + analytics',
    summary:
      'Predicting electromagnetic field exposure with generative augmentation and BI-ready validation workflows.',
    stack: 'PyTorch · SQL · Power BI',
  },
];

/** Map scroll through the sticky stack → which capsule is open and how far. */
function progressFromScroll(sectionEl) {
  if (!sectionEl) return { active: 0, openPct: 0 };
  const rect = sectionEl.getBoundingClientRect();
  const total = Math.max(1, sectionEl.offsetHeight - window.innerHeight);
  const scrolled = Math.min(total, Math.max(0, -rect.top));
  const p = scrolled / total;
  const seg = 1 / PROJECTS.length;
  const idx = Math.min(PROJECTS.length - 1, Math.floor(p / seg + 1e-6));
  const local = (p - idx * seg) / seg;
  return { active: idx, openPct: Math.round(Math.min(1, Math.max(0, local)) * 100) };
}

function capsuleStyle(i, active, openPct, isMobile) {
  const isActive = i === active;
  const isPast = i < active;
  const t = isActive ? openPct / 100 : isPast ? 1 : 0;

  if (isPast) {
    return {
      clipPath: isMobile
        ? 'inset(8% 4% 70% 4% round 18px)'
        : 'inset(6% 6% 72% 6% round 22px)',
      transform: isMobile
        ? 'scale(0.96)'
        : 'perspective(1200px) rotateX(-10deg) scale(0.94)',
      opacity: 0.3,
      zIndex: PROJECTS.length - i,
    };
  }

  if (!isActive) {
    return {
      clipPath: isMobile
        ? 'inset(42% 6% 42% 6% round 18px)'
        : 'inset(38% 8% 38% 8% round 22px)',
      transform: isMobile
        ? 'scale(0.94)'
        : 'perspective(1200px) rotateX(18deg) scale(0.92)',
      opacity: 0.4,
      zIndex: PROJECTS.length - i,
    };
  }

  // Interpolate closed → open for the active capsule
  const insetY = (isMobile ? 42 : 38) * (1 - t);
  const insetX = (isMobile ? 6 : 8) * (1 - t);
  const rotate = (isMobile ? 0 : 18) * (1 - t);
  const scale = 0.92 + 0.08 * t;
  const opacity = 0.4 + 0.6 * t;

  return {
    clipPath: `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${isMobile ? 18 : 22}px)`,
    transform: isMobile
      ? `scale(${scale})`
      : `perspective(1200px) rotateX(${rotate}deg) scale(${scale})`,
    opacity,
    zIndex: PROJECTS.length + 1,
  };
}

export default function ProjectCapsules() {
  const { isRecruiter, reducedMotion } = useDemoMode();
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const [openPct, setOpenPct] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const showList = isRecruiter || reducedMotion;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (showList) {
      setOpenPct(100);
      setActive(0);
      return undefined;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const { active: nextActive, openPct: nextPct } = progressFromScroll(sectionRef.current);
      setActive(nextActive);
      setOpenPct(nextPct);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [showList]);

  return (
    <section id="demo-capsules" className="relative">
      <div className="px-4 sm:px-6 pt-20 sm:pt-28 max-w-5xl mx-auto">
        <Header />
      </div>

      {showList ? (
        <div className="px-4 sm:px-6 pb-16 sm:pb-20 max-w-5xl mx-auto w-full">
          <ul className="mt-8 space-y-3">
            {PROJECTS.map((p) => (
              <li
                key={p.id}
                className="border border-white/10 bg-white/[0.03] px-4 py-3 sm:px-5 sm:py-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-demo-display text-lg text-white">{p.title}</h3>
                  <span className="text-[11px] uppercase tracking-wider text-white/40">
                    {p.stack}
                  </span>
                </div>
                <p className="text-sm text-white/55 mt-1">{p.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div
          ref={sectionRef}
          className="relative"
          style={{ height: `${PROJECTS.length * 100}vh` }}
        >
          <div className="sticky top-0 h-[100dvh] overflow-hidden">
            <div className="absolute top-4 left-0 right-0 z-20 flex justify-center px-4">
              <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs text-white/70 backdrop-blur-md">
                <span>
                  {PROJECTS[active]?.title} · {openPct}% open
                </span>
                <span className="text-white/35">|</span>
                <span className="text-white/45">
                  {openPct < 85 ? 'scroll to open' : 'scroll to close / next'}
                </span>
              </div>
            </div>

            <div className="relative h-full max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-center">
              {PROJECTS.map((p, i) => {
                const style = capsuleStyle(i, active, openPct, isMobile);
                return (
                  <article
                    key={p.id}
                    className="absolute inset-x-4 sm:inset-x-6 top-[18%] bottom-[14%] sm:top-[16%] sm:bottom-[12%] border border-white/12 bg-gradient-to-b from-zinc-900/95 to-black overflow-hidden transition-[opacity] duration-150"
                    style={{
                      ...style,
                      transformOrigin: 'center top',
                      willChange: 'clip-path, transform, opacity',
                    }}
                    aria-hidden={active !== i}
                  >
                    <div className="h-full flex flex-col justify-between p-6 sm:p-10">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">
                          Case study 0{i + 1}
                        </p>
                        <h3 className="font-demo-display text-3xl sm:text-5xl tracking-tight text-white mb-2">
                          {p.title}
                        </h3>
                        <p className="text-sm sm:text-base text-white/50 mb-4">{p.role}</p>
                        <p className="text-sm sm:text-lg text-white/70 leading-relaxed max-w-lg">
                          {p.summary}
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm uppercase tracking-wider text-white/40 border-t border-white/10 pt-4">
                        {p.stack}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Header() {
  return (
    <>
      <p className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-white/45 mb-3">
        Feature 02 · Inspired by Thomas Monavon
      </p>
      <h2 className="font-demo-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
        Scroll-to-Open Project Capsules
      </h2>
      <p className="text-sm sm:text-base text-white/55 max-w-xl leading-relaxed">
        Why it stands out: projects reveal like physical capsules — scroll depth equals open
        progress, so browsing feels tactile instead of a flat grid.
      </p>
    </>
  );
}
