import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import WorkExperience from './components/WorkExperience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Contact from './components/Contact';
import { WebGLShader } from './components/ui/web-gl-shader';
import { NavBar } from './components/ui/tubelight-navbar';
import { Home, User, Briefcase, Mail, GraduationCap, Wrench, FileText } from 'lucide-react';

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Add passive event listener for better scrolling performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate dynamic blur and darkness relative to scroll position (0 to 600px)
  const maxScroll = 600;
  const scrollRatio = Math.min(scrollY / maxScroll, 1);
  const blurAmount = scrollRatio * 8; // Max 8px blur
  const darkenAmount = scrollRatio * 0.4; // Max 0.4 opacity background

  const navItems = [
    { name: 'Home', url: '#hero', icon: Home },
    { name: 'About', url: '#about', icon: User },
    { name: 'Experience', url: '#experience', icon: GraduationCap },
    { name: 'Skills', url: '#skills', icon: Wrench },
    { name: 'Projects', url: '#projects', icon: Briefcase },
    { name: 'Resume', url: '#resume', icon: FileText },
    { name: 'Contact', url: '#contact', icon: Mail }
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
        <NavBar items={navItems} />
        <Hero />
        <About />
        <WorkExperience />
        <Skills />
        <Projects />
        <Resume />
        <Contact />
      </main>
    </div>
  );
}

export default App;
