import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import WorkExperience from './components/WorkExperience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Contact from './components/Contact';
import { WebGLShader } from './components/ui/web-gl-shader';
import GooeyNav from './components/ui/GooeyNav';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsNarrow(mq.matches);
    const handler = (e) => setIsNarrow(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Calculate dynamic blur and darkness relative to scroll position (0 to 600px)
  const maxScroll = 600;
  const scrollRatio = Math.min(scrollY / maxScroll, 1);
  const blurAmount = scrollRatio * (isNarrow ? 4 : 8); // Less blur on mobile for performance
  const darkenAmount = scrollRatio * 0.4; // Max 0.4 opacity background

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
      <WebGLShader />
      
      {/* Dynamic Scroll Overlay that blurs background content */}
      <div 
        className="fixed inset-0 pointer-events-none -z-[5]"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${darkenAmount})`,
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`
        }}
      />

      <main className="relative w-full overflow-x-hidden">
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
