import React, { useState, useEffect, useRef, memo } from 'react';
import {
  Home,
  User,
  FolderKanban,
  Briefcase,
  Code2,
  FileText,
  Mail,
} from 'lucide-react';
import Hero from './components/Hero';
import About from './components/About';
import WorkExperience from './components/WorkExperience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Contact from './components/Contact';
import { Starfield } from './components/ui/starfield';
import GooeyNav from './components/ui/GooeyNav';

/** Isolated so scroll/resize sizing never remounts the canvas mid-frame. */
const SiteStarfieldBackground = memo(function SiteStarfieldBackground({
  isNarrow,
  starEscapeWidth,
  voidWidth,
  centerYRatio,
}) {
  return (
    <Starfield
      starCount={isNarrow ? 5500 : 22000}
      waveFrequency={isNarrow ? 14 : 18}
      starEscapeWidth={starEscapeWidth}
      voidWidth={voidWidth}
      starColor={{ r: 245, g: 248, b: 255 }}
      maxOpacity={255}
      rotationSpeed={isNarrow ? 0.00025 : 0.0004}
      waveSpeed={isNarrow ? 0.006 : 0.009}
      centerYRatio={centerYRatio}
      className="h-full w-full"
    />
  );
});

/** Upper-middle circle origin by breakpoint — shared by starfield + hero. */
function getHeroOriginY(width) {
  if (width < 640) return 0.36;
  if (width < 768) return 0.38;
  if (width < 1024) return 0.40;
  return 0.42;
}

function App() {
  const [isNarrow, setIsNarrow] = useState(false);
  const [ring, setRing] = useState({ escape: 340, void: 110 });
  const [centerYRatio, setCenterYRatio] = useState(0.4);
  const veilRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsNarrow(mq.matches);
    const handler = (e) => setIsNarrow(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const updateOrigin = () => setCenterYRatio(getHeroOriginY(window.innerWidth));
    updateOrigin();
    window.addEventListener('resize', updateOrigin);
    return () => window.removeEventListener('resize', updateOrigin);
  }, []);

  // Size the star ring so it surrounds the hero name
  useEffect(() => {
    const measure = () => {
      const title = document.querySelector('#hero h1');
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (title) {
        const r = title.getBoundingClientRect();
        const halfW = r.width / 2;
        const halfH = r.height / 2;
        // Inner void stays clear for the name; outer ring hugs its silhouette
        const voidW = Math.max(72, Math.min(halfW * 0.72, halfH + 36));
        const escape = Math.max(
          voidW + 90,
          Math.hypot(halfW, halfH) + (vw < 768 ? 36 : 56),
        );
        setRing({
          void: Math.round(voidW),
          escape: Math.round(Math.min(escape, Math.min(vw, vh) * 0.52)),
        });
        return;
      }

      const base = Math.min(vw, vh);
      setRing({
        void: Math.round(base * 0.16),
        escape: Math.round(base * 0.38),
      });
    };

    measure();
    // Layout fonts can settle after first paint
    const t = window.setTimeout(measure, 120);
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const maxBlur = isNarrow ? 3 : 5;

    const applyScrollFx = () => {
      const hero = document.getElementById('hero');
      const heroH = hero?.offsetHeight || window.innerHeight;
      const scrollRatio = Math.min(Math.max(window.scrollY / (heroH * 0.65), 0), 1);
      const blurAmount = scrollRatio * maxBlur;

      const veil = veilRef.current;
      if (!veil) return;

      veil.style.opacity = String(scrollRatio * 0.85);
      veil.style.backdropFilter = blurAmount > 0.05 ? `blur(${blurAmount}px)` : 'none';
      veil.style.webkitBackdropFilter = blurAmount > 0.05 ? `blur(${blurAmount}px)` : 'none';
    };

    applyScrollFx();
    window.addEventListener('scroll', applyScrollFx, { passive: true });
    window.addEventListener('resize', applyScrollFx, { passive: true });
    return () => {
      window.removeEventListener('scroll', applyScrollFx);
      window.removeEventListener('resize', applyScrollFx);
    };
  }, [isNarrow]);

  const navItems = [
    { label: 'Home', href: '#hero', icon: Home },
    { label: 'About', href: '#about', icon: User },
    { label: 'Projects', href: '#projects', icon: FolderKanban },
    { label: 'Experience', href: '#experience', icon: Briefcase },
    { label: 'Skills', href: '#skills', icon: Code2 },
    { label: 'Resume', href: '#resume', icon: FileText },
    { label: 'Contact', href: '#contact', icon: Mail },
  ];

  return (
    <div
      className="relative min-h-screen text-foreground selection:bg-primary/30"
      style={{ '--hero-origin-y': `${centerYRatio * 100}%` }}
    >
      {/* Fixed starfield — ring sized to the hero name */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-black overflow-hidden">
        <SiteStarfieldBackground
          isNarrow={isNarrow}
          starEscapeWidth={ring.escape}
          voidWidth={ring.void}
          centerYRatio={centerYRatio}
        />
      </div>

      {/* Soft blur veil once past the hero — keeps the field visible */}
      <div
        ref={veilRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-[5]"
        style={{
          opacity: 0,
          backgroundColor: 'rgba(0,0,0,0.001)',
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
          willChange: 'opacity, backdrop-filter',
        }}
      />

      <main className="relative z-0 w-full overflow-x-hidden">
        <div className="fixed inset-x-0 bottom-0 sm:top-0 sm:bottom-auto z-50 flex justify-center mb-4 sm:mb-0 sm:pt-4 md:pt-6 pb-[env(safe-area-inset-bottom)] sm:pb-0 px-2">
          <GooeyNav
            items={navItems}
            particleCount={isNarrow ? 8 : 15}
            particleDistances={isNarrow ? [50, 8] : [90, 10]}
            particleR={isNarrow ? 60 : 100}
            initialActiveIndex={0}
            animationTime={600}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </div>
        <Hero />
        <About />
        <Projects />
        <WorkExperience />
        <Skills />
        <Resume />
        <Contact />
      </main>
    </div>
  );
}

export default App;
