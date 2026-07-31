import React, { useState, useEffect, useRef, memo } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import WorkExperience from './components/WorkExperience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Contact from './components/Contact';
import { SparklesCore } from './components/ui/sparkles';
import GooeyNav from './components/ui/GooeyNav';
import WanderingCreature from './components/WanderingCreature';

/** Isolated so scroll updates never remount the particle engine. */
const SiteSparklesBackground = memo(function SiteSparklesBackground({ isNarrow }) {
  return (
    <SparklesCore
      id="site-sparkles-bg"
      background="#000000"
      minSize={0.6}
      maxSize={1.4}
      particleDensity={isNarrow ? 60 : 100}
      className="h-full w-full"
      particleColor="#FFFFFF"
      speed={1}
    />
  );
});

function App() {
  const [isNarrow, setIsNarrow] = useState(false);
  const veilRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsNarrow(mq.matches);
    const handler = (e) => setIsNarrow(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const maxBlur = isNarrow ? 4 : 6;

    const applyScrollFx = () => {
      const hero = document.getElementById('hero');
      const heroH = hero?.offsetHeight || window.innerHeight;
      // Blur eases in as the hero leaves the viewport; sharp at top
      const scrollRatio = Math.min(Math.max(window.scrollY / (heroH * 0.65), 0), 1);
      const blurAmount = scrollRatio * maxBlur;

      const veil = veilRef.current;
      if (!veil) return;

      veil.style.opacity = String(scrollRatio);
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
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Resume', href: '#resume' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="relative min-h-screen text-foreground selection:bg-primary/30">
      {/* Fixed hero sparkles — always animating, never filtered */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-black overflow-hidden">
        <SiteSparklesBackground isNarrow={isNarrow} />
      </div>
      <WanderingCreature />

      {/* Frosted veil over the live background once past the hero */}
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
        <div className="fixed inset-x-0 bottom-0 sm:top-0 sm:bottom-auto z-50 flex justify-center overflow-x-clip mb-4 sm:mb-0 sm:pt-4 md:pt-6 pb-[env(safe-area-inset-bottom)] sm:pb-0 px-2">
          <GooeyNav
            items={navItems}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
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
