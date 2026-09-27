import AppleNav from './components/AppleNav';
import Hero from './components/Hero';
import WorkExperience from './components/WorkExperience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ScrollProgress from './components/ScrollProgress';

function App() {
  return (
    <div className="apple-canvas relative min-h-screen text-[var(--ink)]">
      <a href="#main" className="apple-skip">
        Skip to content
      </a>
      <ScrollProgress />
      <AppleNav />
      <main id="main" className="relative z-0 w-full overflow-x-hidden">
        <Hero />
        <WorkExperience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}

export default App;
