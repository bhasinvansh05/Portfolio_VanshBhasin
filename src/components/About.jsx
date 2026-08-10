import Reveal from './Reveal';
import { portfolioData } from '../data/portfolio';

export default function About() {
  return (
    <section
      id="about"
      className="relative z-10 w-full px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto w-full max-w-3xl">
        <Reveal>
          <h2 className="apple-title text-[clamp(2rem,4vw,3rem)] text-[var(--ink)]">
            About
          </h2>
          <p className="apple-body mt-3 max-w-xl text-base sm:text-lg">
            A little context before the rest of the scroll.
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mt-10 sm:mt-12">
          <p className="text-[1.05rem] leading-[1.65] tracking-[-0.01em] text-[var(--ink)] sm:text-[1.25rem] sm:leading-[1.6]">
            {portfolioData.about.description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
