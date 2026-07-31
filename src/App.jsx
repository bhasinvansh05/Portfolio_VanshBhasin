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
import FeaturesDemo from './components/demo/FeaturesDemo';

const STAR_COLOR = { r: 245, g: 248, b: 255 };

function isFeaturesDemoRoute() {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash || '';
  const path = window.location.pathname || '';
  return (
    hash === '#features-demo' ||
    hash.startsWith('#features-demo') ||
    path.endsWith('/demo')
  );
}

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
      starColor={STAR_COLOR}
      maxOpacity={255}
      rotationSpeed={isNarrow ? 0.00025 : 0.0004}
      waveSpeed={isNarrow ? 0.006 : 0.009}
      centerYRatio={centerYRatio}
      className="h-full w-full"
    />
  );
});

/** Upper-middle name origin in dvh — shared CSS var for hero layout. */
function getHeroOriginDvh(width) {
  if (width < 768) return '36dvh';
  if (width < 1024) return '40dvh';
  return '42dvh';
}

function viewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function App() {
  const [showFeaturesDemo, setShowFeaturesDemo] = useState(() => isFeaturesDemoRoute());
  const [isNarrow, setIsNarrow] = useState(false);
  const [ring, setRing] = useState({ escape: 340, void: 110 });
  const [centerYRatio, setCenterYRatio] = useState(0.36);
  const [heroOriginDvh, setHeroOriginDvh] = useState('36dvh');
  const veilRef = useRef(null);
  const lastCenterYRef = useRef(0.36);

  useEffect(() => {
    const syncRoute = () => setShowFeaturesDemo(isFeaturesDemoRoute());
    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsNarrow(mq.matches);
    const handler = (e) => setIsNarrow(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const updateOriginDvh = () => setHeroOriginDvh(getHeroOriginDvh(window.innerWidth));
    updateOriginDvh();
    window.addEventListener('resize', updateOriginDvh);
    window.addEventListener('orientationchange', updateOriginDvh);
    return () => {
      window.removeEventListener('resize', updateOriginDvh);
      window.removeEventListener('orientationchange', updateOriginDvh);
    };
  }, []);

  // Size the star ring to the title and lock circle center to the name's viewport center.
  // Do NOT run on scroll — that caused setState thrash and starfield remount flicker.
  useEffect(() => {
    const measure = () => {
      const title = document.querySelector('#hero h1');
      const field = document.getElementById('site-starfield');
      const vw = window.innerWidth;
      const vh = viewportHeight();

      if (title) {
        const r = title.getBoundingClientRect();
        const halfW = r.width / 2;
        const halfH = r.height / 2;
        const voidW = Math.max(72, Math.min(halfW * 0.72, halfH + 36));
        const escape = Math.max(
          voidW + 90,
          Math.hypot(halfW, halfH) + (vw < 768 ? 36 : 56),
        );
        const nextVoid = Math.round(voidW);
        const nextEscape = Math.round(Math.min(escape, Math.min(vw, vh) * 0.52));
        setRing((prev) =>
          prev.void === nextVoid && prev.escape === nextEscape
            ? prev
            : { void: nextVoid, escape: nextEscape },
        );

        if (window.scrollY < 8 && r.height > 0 && field) {
          const fr = field.getBoundingClientRect();
          const fieldH = Math.max(1, fr.height);
          const nameCenterY = r.top + r.height / 2 - fr.top;
          const nextRatio = nameCenterY / fieldH;
          if (Math.abs(nextRatio - lastCenterYRef.current) > 0.005) {
            lastCenterYRef.current = nextRatio;
            setCenterYRatio(nextRatio);
          }
        }
        return;
      }

      const base = Math.min(vw, vh);
      const nextVoid = Math.round(base * 0.16);
      const nextEscape = Math.round(base * 0.38);
      setRing((prev) =>
        prev.void === nextVoid && prev.escape === nextEscape
          ? prev
          : { void: nextVoid, escape: nextEscape },
      );
    };

    let debounceId = 0;
    const debouncedMeasure = () => {
      window.clearTimeout(debounceId);
      debounceId = window.setTimeout(measure, 100);
    };

    measure();
    const t1 = window.setTimeout(measure, 50);
    const t2 = window.setTimeout(measure, 250);

    window.addEventListener('resize', debouncedMeasure);
    window.addEventListener('orientationchange', debouncedMeasure);

    const vv = window.visualViewport;
    // Debounce iOS chrome show/hide; ignore visualViewport scroll (fires while page scrolling)
    vv?.addEventListener('resize', debouncedMeasure);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(debounceId);
      window.removeEventListener('resize', debouncedMeasure);
      window.removeEventListener('orientationchange', debouncedMeasure);
      vv?.removeEventListener('resize', debouncedMeasure);
    };
  }, [heroOriginDvh]);

  useEffect(() => {
    const maxBlur = isNarrow ? 3 : 5;
    let raf = 0;
    let lastBlurStep = -1;

    const applyScrollFx = () => {
      raf = 0;
      const hero = document.getElementById('hero');
      const heroH = hero?.offsetHeight || window.innerHeight;
      const scrollRatio = Math.min(Math.max(window.scrollY / (heroH * 0.65), 0), 1);
      // Quantize blur to cut backdrop-filter thrashing on scroll
      const blurStep = Math.round(scrollRatio * maxBlur * 2) / 2;
      const blurAmount = blurStep;

      const veil = veilRef.current;
      if (!veil) return;

      veil.style.opacity = String(scrollRatio * 0.85);
      if (blurStep !== lastBlurStep) {
        lastBlurStep = blurStep;
        veil.style.backdropFilter = blurAmount > 0.05 ? `blur(${blurAmount}px)` : 'none';
        veil.style.webkitBackdropFilter = blurAmount > 0.05 ? `blur(${blurAmount}px)` : 'none';
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(applyScrollFx);
    };

    applyScrollFx();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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

  if (showFeaturesDemo) {
    return <FeaturesDemo />;
  }

  return (
    <div
      className="relative min-h-screen text-foreground selection:bg-primary/30"
      style={{ '--hero-origin-y': heroOriginDvh }}
    >
      {/* Fixed starfield — ring sized to the hero name */}
      <div
        id="site-starfield"
        className="pointer-events-none fixed inset-0 -z-10 bg-black overflow-hidden"
      >
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
