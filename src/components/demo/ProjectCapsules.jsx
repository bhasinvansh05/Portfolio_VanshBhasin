import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDemoMode } from './DemoModeContext';

gsap.registerPlugin(ScrollTrigger);

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

export default function ProjectCapsules() {
  const { isRecruiter, reducedMotion } = useDemoMode();
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [openPct, setOpenPct] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (isRecruiter || reducedMotion) {
      setOpenPct(100);
      setActive(0);
      return undefined;
    }

    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return undefined;

    const cards = gsap.utils.toArray(track.querySelectorAll('[data-capsule]'));
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${window.innerHeight * (isMobile ? 2.2 : 3)}`,
          pin: true,
          scrub: isMobile ? 0.6 : 0.85,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const seg = 1 / cards.length;
            const idx = Math.min(cards.length - 1, Math.floor(p / seg));
            const local = (p - idx * seg) / seg;
            setActive(idx);
            setOpenPct(Math.round(local * 100));
          },
        },
      });

      cards.forEach((card, i) => {
        const closed = isMobile
          ? { clipPath: 'inset(42% 6% 42% 6% round 18px)', rotateX: 0, scale: 0.94, opacity: 0.45 }
          : { clipPath: 'inset(38% 8% 38% 8% round 22px)', rotateX: 18, scale: 0.92, opacity: 0.4 };
        const open = {
          clipPath: 'inset(0% 0% 0% 0% round 22px)',
          rotateX: 0,
          scale: 1,
          opacity: 1,
        };

        gsap.set(card, {
          ...closed,
          transformPerspective: 900,
          zIndex: cards.length - i,
        });

        const start = i / cards.length;
        const mid = start + 0.5 / cards.length;
        const end = (i + 1) / cards.length;

        tl.fromTo(card, closed, { ...open, ease: 'none', duration: mid - start }, start);
        if (i < cards.length - 1) {
          tl.to(
            card,
            {
              ...(isMobile
                ? { clipPath: 'inset(8% 4% 70% 4% round 18px)', scale: 0.96, opacity: 0.35 }
                : { clipPath: 'inset(6% 6% 72% 6% round 22px)', rotateX: -10, scale: 0.94, opacity: 0.3 }),
              ease: 'none',
              duration: end - mid,
            },
            mid,
          );
        }
      });
    }, pin);

    return () => ctx.revert();
  }, [isRecruiter, reducedMotion, isMobile]);

  if (isRecruiter || reducedMotion) {
    return (
      <section id="demo-capsules" className="relative px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto w-full">
          <Header />
          <ul className="mt-8 space-y-3">
            {PROJECTS.map((p) => (
              <li
                key={p.id}
                className="border border-white/10 bg-white/[0.03] px-4 py-3 sm:px-5 sm:py-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-demo-display text-lg text-white">{p.title}</h3>
                  <span className="text-[11px] uppercase tracking-wider text-white/40">{p.stack}</span>
                </div>
                <p className="text-sm text-white/55 mt-1">{p.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section id="demo-capsules" className="relative">
      <div className="px-4 sm:px-6 pt-20 sm:pt-28 max-w-5xl mx-auto">
        <Header />
      </div>

      <div ref={pinRef} className="relative h-[100dvh] overflow-hidden">
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

        <div
          ref={trackRef}
          className="relative h-full max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-center"
          style={{ perspective: isMobile ? 'none' : '1200px' }}
        >
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              data-capsule
              className="absolute inset-x-4 sm:inset-x-6 top-[18%] bottom-[14%] sm:top-[16%] sm:bottom-[12%] border border-white/12 bg-gradient-to-b from-zinc-900/95 to-black overflow-hidden will-change-transform"
              style={{ transformOrigin: 'center top' }}
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
          ))}
        </div>
      </div>
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
