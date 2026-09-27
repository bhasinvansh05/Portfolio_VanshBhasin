import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { FADE, SPRING } from '../lib/motion';
import Reveal from './Reveal';

export default function WorkExperience() {
  const [openId, setOpenId] = useState(null);
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section id="experience" className="apple-section relative z-10">
      <div className="apple-panel apple-panel-lift">
        <Reveal className="apple-section-head">
          <p className="apple-kicker mb-3">Experience</p>
          <h2 className="apple-title text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] text-[var(--ink)]">
            Roles that asked for more than a hello-world
          </h2>
        </Reveal>

        <ol>
          {portfolioData.experience.map((job, index) => {
            const isOpen = openId === job.id;
            const panelId = `${baseId}-panel-${job.id}`;
            const buttonId = `${baseId}-btn-${job.id}`;
            const highlights = job.highlights?.length
              ? job.highlights
              : job.description
                ? [job.description]
                : [];

            return (
              <Reveal key={job.id} delay={index * 0.03}>
                <li className="border-t border-black/10 first:border-t-0">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(job.id)}
                    className="apple-press-row group flex w-full items-start justify-between gap-3 py-6 text-left sm:gap-4 sm:py-8"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                        <div className="min-w-0">
                          <h3 className="apple-title-sm text-[clamp(1.15rem,1rem+0.8vw,1.5rem)] text-[var(--ink)]">
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
                      {!isOpen ? (
                        <p className="apple-body mt-3 line-clamp-2 max-w-2xl text-[clamp(0.9rem,0.82rem+0.3vw,1rem)] sm:mt-4">
                          {job.description}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-[var(--ink)] transition-colors group-hover:bg-black/[0.07] sm:h-10 sm:w-10"
                      aria-hidden="true"
                    >
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={reduceMotion ? FADE.quick : SPRING.snappy}
                        className="inline-flex"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={
                          reduceMotion
                            ? { opacity: 0 }
                            : { height: 0, opacity: 0 }
                        }
                        animate={
                          reduceMotion
                            ? { opacity: 1 }
                            : { height: 'auto', opacity: 1 }
                        }
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : { height: 0, opacity: 0 }
                        }
                        transition={reduceMotion ? FADE.ui : SPRING.snappy}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-2.5 pb-6 pl-0 sm:pb-8">
                          {highlights.map((item) => (
                            <li
                              key={item}
                              className="apple-body relative max-w-2xl pl-4 text-[clamp(0.9rem,0.82rem+0.3vw,1rem)] before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-[var(--ink-secondary)]/50"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
