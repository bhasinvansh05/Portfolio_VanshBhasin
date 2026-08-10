import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import {
  getProjectsByRecency,
  getRecentProjects,
} from '@/lib/utils';
import Reveal from './Reveal';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const reduceMotion = useReducedMotion();
  const closeRef = useRef(null);
  const titleId = useId();

  const recentProjects = getRecentProjects(3);
  const allProjects = getProjectsByRecency();
  const list = showAll ? allProjects : recentProjects;

  const closeSheet = () => setSelectedProject(null);

  useEffect(() => {
    if (!selectedProject) return undefined;

    document.body.classList.add('sheet-open');
    const previous = document.activeElement;
    const onKey = (event) => {
      if (event.key === 'Escape') closeSheet();
    };

    window.addEventListener('keydown', onKey);
    // Focus close control after paint so sheet is present
    requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      document.body.classList.remove('sheet-open');
      window.removeEventListener('keydown', onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="apple-section relative z-10">
      <div className="apple-panel">
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
                onClick={() => setSelectedProject(project)}
                className="apple-press group flex w-full items-start justify-between gap-3 py-5 text-left sm:gap-4 sm:py-7"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-[clamp(1.05rem,0.95rem+0.6vw,1.25rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">
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
                <span
                  className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-[var(--ink)] transition-colors group-hover:bg-black/[0.07] sm:h-9 sm:w-9"
                  aria-hidden="true"
                >
                  <ArrowUpRight className="h-4 w-4" />
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

      <AnimatePresence>
        {selectedProject ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0.15 } : { duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close project details"
              className="absolute inset-0 bg-[var(--scrim)]"
              onClick={closeSheet}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 28, scale: 0.98, filter: 'blur(8px)' }
              }
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
              }
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 28, scale: 0.98, filter: 'blur(8px)' }
              }
              transition={
                reduceMotion
                  ? { duration: 0.15 }
                  : { type: 'spring', bounce: 0.15, duration: 0.35 }
              }
              className="apple-material-heavy relative z-10 max-h-[85dvh] w-full max-w-[min(100%,32rem)] overflow-y-auto rounded-t-[var(--radius)] p-[var(--panel-pad-x)] sm:rounded-[var(--radius)]"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3
                    id={titleId}
                    className="apple-title text-[clamp(1.4rem,1.1rem+1.2vw,1.85rem)] text-[var(--ink)]"
                  >
                    {selectedProject.title}
                  </h3>
                  {selectedProject.meta ? (
                    <p className="mt-1 text-sm font-medium text-[var(--ink-secondary)]">
                      {selectedProject.meta}
                    </p>
                  ) : null}
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closeSheet}
                  className="apple-press inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-[var(--ink)]"
                >
                  <span className="sr-only">Close</span>
                  <X className="h-4 w-4" />
                </button>
              </div>

              {selectedProject.tags?.length ? (
                <div className="mb-5 flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="apple-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="space-y-3">
                {(selectedProject.details?.length
                  ? selectedProject.details
                  : selectedProject.description
                    ? [selectedProject.description]
                    : []
                ).map((detail) => (
                  <p
                    key={detail}
                    className="apple-body text-[clamp(0.9rem,0.82rem+0.3vw,1rem)] leading-relaxed"
                  >
                    {detail}
                  </p>
                ))}
              </div>

              {selectedProject.href ? (
                <a
                  href={selectedProject.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-press apple-capsule mt-8 gap-1.5 bg-[var(--ink)] text-white"
                >
                  Open project
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
