import { portfolioData } from '../data/portfolio';
import Reveal from './Reveal';

export default function WorkExperience() {
  return (
    <section id="experience" className="apple-section relative z-10">
      <div className="apple-panel">
        <Reveal className="apple-section-head">
          <p className="apple-kicker mb-3">Experience</p>
          <h2 className="apple-title text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] text-[var(--ink)]">
            Roles that asked for more than a hello-world
          </h2>
        </Reveal>

        <ol>
          {portfolioData.experience.map((job, index) => (
            <Reveal key={job.id} delay={index * 0.03}>
              <li className="border-t border-black/10 py-6 first:border-t-0 first:pt-0 sm:py-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                  <div className="min-w-0">
                    <h3 className="text-[clamp(1.15rem,1rem+0.8vw,1.5rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">
                      {job.company}
                    </h3>
                    <p className="mt-1 text-[clamp(0.9rem,0.82rem+0.3vw,1rem)] font-semibold text-[var(--ink-secondary)]">
                      {job.role}
                    </p>
                  </div>
                  <p className="shrink-0 text-[clamp(0.75rem,0.7rem+0.2vw,0.875rem)] font-semibold tabular-nums tracking-[-0.01em] text-[var(--ink-secondary)]">
                    {job.duration}
                  </p>
                </div>
                <p className="apple-body mt-3 max-w-2xl text-[clamp(0.9rem,0.82rem+0.3vw,1rem)] sm:mt-4">
                  {job.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
