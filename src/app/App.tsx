import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Research } from './components/Research';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Achievements } from './components/Achievements';
import { Resume } from './components/Resume';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { InteractiveBackground } from './components/InteractiveBackground';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground dark" style={{ cursor: 'none' }}>
      <CustomCursor />
      <InteractiveBackground />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Research />
        <Projects />
        <Skills />
        <Experience />
        <Achievements />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}