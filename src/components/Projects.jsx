import { useId, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { getProjectsByRecency, getRecentProjects } from '@/lib/utils';
import ProjectSheet from './ProjectSheet';
import Reveal from './Reveal';

export default function Projects() {
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const titleId = useId();

  const recentProjects = getRecentProjects(3);
  const allProjects = getProjectsByRecency();
  const list = showAll ? allProjects : recentProjects;

  /* The sheet grows out of the row that opened it, so keep the row's geometry. */
  const openProject = (project) => (event) => {
    setSelected({
      project,
      originRect: event.currentTarget.getBoundingClientRect(),
    });
  };

  return (
    <section id="projects" className="apple-section relative z-10">
      <div className="apple-panel apple-panel-lift">
        <Reveal className="apple-section-head">
          <p className="apple-kicker mb-3">Work</p>
          <h2 className="apple-title text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] text-[var(--ink)]">
            Things that had to work after the demo ended
          </h2>
        </Reveal>

        <ul className="divide-y divide-black/10 border-y border-black/10">
          {list.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.03} as="li">
              <button
                type="button"
                onClick={openProject(project)}
                className="apple-press-row group flex w-full items-start justify-between gap-3 py-5 text-left sm:gap-4 sm:py-7"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="apple-title-sm text-[clamp(1.05rem,0.95rem+0.6vw,1.25rem)] text-[var(--ink)]">
                      {project.title}
                    </h3>
                    {project.meta ? (
                      <span className="text-[clamp(0.7rem,0.65rem+0.2vw,0.8125rem)] font-semibold text-[var(--ink-secondary)]">
                        {project.meta}
                      </span>
                    ) : null}
                  </div>
                  <p className="apple-body mt-2 line-clamp-2 max-w-xl text-[clamp(0.9rem,0.82rem+0.3vw,1rem)]">
                    {project.description}
                  </p>
                </div>
                {/* Disclosure, not an outbound arrow: this opens a panel in place. */}
                <span
                  className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-[var(--ink)] transition-colors group-hover:bg-black/[0.07] sm:h-10 sm:w-10"
                  aria-hidden="true"
                >
                  <ChevronRight className="h-4 w-4" />
                </span>
              </button>
            </Reveal>
          ))}
        </ul>

        {!showAll && allProjects.length > recentProjects.length ? (
          <Reveal delay={0.06} className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="apple-press apple-capsule border border-black/10 bg-[var(--grey)] text-[var(--ink)]"
            >
              View all projects
            </button>
          </Reveal>
        ) : null}
      </div>

      {selected ? (
        <ProjectSheet
          project={selected.project}
          originRect={selected.originRect}
          titleId={titleId}
          onClosed={() => setSelected(null)}
        />
      ) : null}
    </section>
  );
}
