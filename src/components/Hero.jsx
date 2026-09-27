import { motion, useReducedMotion } from 'framer-motion';
import { Download } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { RESUME_FILENAME, RESUME_URL, scrollToId } from '../lib/navigation';
import { FADE, SPRING } from '../lib/motion';
import HeroPresence from './HeroPresence';
import Magnetic from './Magnetic';

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const spring = reduceMotion ? FADE.ui : SPRING.ui;

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] w-full flex-col justify-center px-[var(--section-gutter)] pb-24 pt-28 sm:pb-28 sm:pt-32"
    >
      <HeroPresence />

      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.02 }}
          className="apple-kicker mb-5"
        >
          CS · York University
        </motion.p>

        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.06 }}
          className="apple-display mx-auto max-w-[16ch] text-[clamp(3rem,9vw,6.75rem)] text-[var(--ink)]"
        >
          {portfolioData.hero.name}
        </motion.h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.12 }}
          className="mx-auto mt-5 max-w-lg text-[clamp(1.05rem,0.95rem+0.5vw,1.25rem)] font-medium leading-snug tracking-[-0.015em] text-[var(--ink)] sm:mt-6"
        >
          I ship work that still behaves on Monday: dashboards at RBC,
          telemetry on real hardware, and UIs I refuse to leave half-right.
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.18 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4"
        >
          <Magnetic strength={12} className="inline-flex w-full justify-center sm:w-auto">
            <a
              href={RESUME_URL}
              download={RESUME_FILENAME}
              className="apple-press apple-capsule apple-capsule-block gap-2 bg-[var(--ink)] text-white"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Resume
            </a>
          </Magnetic>
          <Magnetic strength={12} className="inline-flex w-full justify-center sm:w-auto">
            <button
              type="button"
              onClick={() =>
                scrollToId('contact', {
                  behavior: reduceMotion ? 'auto' : 'smooth',
                })
              }
              className="apple-press apple-capsule apple-capsule-block border border-black/15 bg-white text-[var(--ink)]"
            >
              Contact Me
            </button>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
