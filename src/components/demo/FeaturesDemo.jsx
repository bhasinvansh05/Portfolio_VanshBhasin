import { portfolioData } from '../../data/portfolio';
import { DemoModeProvider, useDemoMode } from './DemoModeContext';
import RecruiterToggle from './RecruiterToggle';
import TypographyAssembly from './TypographyAssembly';
import ProjectCapsules from './ProjectCapsules';
import SkillLab from './SkillLab';
import TreasureHunt from './TreasureHunt';

const SECTIONS = [
  { id: 'demo-typography', label: 'Typography' },
  { id: 'demo-capsules', label: 'Capsules' },
  { id: 'demo-skill-lab', label: 'Skill Lab' },
  { id: 'demo-treasure', label: 'Treasure' },
  { id: 'demo-recruiter', label: 'Fast-Lane' },
];

function backToPortfolio() {
  const { pathname, search } = window.location;
  window.history.pushState(null, '', `${pathname}${search}`);
  window.dispatchEvent(new Event('hashchange'));
}

function RecruiterCvStrip() {
  const { experience, contact } = portfolioData;
  const keyProjects = [
    { title: 'ConsultHub', blurb: 'Full-stack booking platform' },
    { title: 'YOLO Traffic', blurb: 'Drone CV pipelines · Elder Lab' },
    { title: 'EMF Mapper', blurb: 'Deep learning EMF prediction · NGWN' },
  ];

  return (
    <section
      id="demo-recruiter"
      className="relative px-4 sm:px-6 py-16 sm:py-20 border-t border-white/10"
    >
      <div className="max-w-5xl mx-auto w-full">
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-white/45 mb-3">
          Feature 05 · Recruiter Fast-Lane
        </p>
        <h2 className="font-demo-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
          Condensed CV strip
        </h2>
        <p className="text-sm sm:text-base text-white/55 max-w-xl mb-8 leading-relaxed">
          Why it stands out: one sticky toggle flips the whole lab from cinema to scan-speed —
          experience, projects, contact without the chrome.
        </p>

        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">
              Experience
            </h3>
            <ul className="space-y-3">
              {experience.slice(0, 4).map((job) => (
                <li key={job.id} className="border-b border-white/10 pb-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="text-white font-medium text-sm sm:text-base">
                      {job.role}
                    </p>
                    <span className="text-[11px] text-white/40">{job.duration}</span>
                  </div>
                  <p className="text-sm text-white/55 mt-0.5">{job.company}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">
                Key projects
              </h3>
              <ul className="space-y-2">
                {keyProjects.map((p) => (
                  <li key={p.title}>
                    <p className="text-white text-sm sm:text-base font-medium">{p.title}</p>
                    <p className="text-xs sm:text-sm text-white/50">{p.blurb}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">
                Contact
              </h3>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-white/80 hover:text-white underline-offset-4 hover:underline"
                  >
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/80 hover:text-white underline-offset-4 hover:underline"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/80 hover:text-white underline-offset-4 hover:underline"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoShell() {
  const { isRecruiter } = useDemoMode();

  return (
    <div
      className={`demo-page relative min-h-screen text-white ${
        isRecruiter ? 'demo-page--recruiter' : ''
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(140,165,190,0.14), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 40%, rgba(90,110,130,0.08), transparent 50%), #050506',
        }}
      />
      {!isRecruiter && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }}
        />
      )}

      <RecruiterToggle />

      <header className="relative px-4 sm:px-6 pt-16 sm:pt-20 pb-10 sm:pb-14">
        <div className="max-w-5xl mx-auto w-full">
          <button
            type="button"
            onClick={backToPortfolio}
            className="text-sm text-white/55 hover:text-white transition-colors mb-8 inline-flex items-center gap-1"
          >
            ← Back to portfolio
          </button>

          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40 mb-4">
            Portfolio review
          </p>
          <h1 className="font-demo-display text-[clamp(2.75rem,10vw,5.5rem)] leading-[0.95] tracking-[-0.04em] text-white mb-4">
            Features Lab
          </h1>
          <p className="text-base sm:text-lg text-white/55 max-w-lg leading-relaxed">
            Five interactive ideas for Vansh Bhasin’s site. Scrub, scroll, and poke each one —
            then keep what feels like him.
          </p>

          <nav
            aria-label="Demo sections"
            className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm"
          >
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() =>
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
                }
                className="text-white/45 hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {isRecruiter && <RecruiterCvStrip />}

      <TypographyAssembly />
      <ProjectCapsules />
      <SkillLab />
      <TreasureHunt />

      {!isRecruiter && <RecruiterCvStrip />}

      <footer className="px-4 sm:px-6 py-12 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-white/45">
          <p>Features Lab · local review only</p>
          <button
            type="button"
            onClick={backToPortfolio}
            className="text-white/70 hover:text-white transition-colors"
          >
            ← Back to portfolio
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function FeaturesDemo() {
  return (
    <DemoModeProvider>
      <DemoShell />
    </DemoModeProvider>
  );
}
