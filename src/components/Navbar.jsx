import { portfolioData } from '../data/portfolio';

export default function Navbar() {
  {/* SECTION: Navbar */}
  // TODO: add 21st.dev design here
  return (
    <nav className="fixed top-0 w-full bg-white z-50 border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="font-bold text-xl">
          <a href="#hero">{portfolioData.hero.name}</a>
        </div>
        <ul className="flex gap-6">
          <li><a href="#about" className="hover:underline">About</a></li>
          <li><a href="#experience" className="hover:underline">Experience</a></li>
          <li><a href="#projects" className="hover:underline">Projects</a></li>
          <li><a href="#contact" className="hover:underline">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}
