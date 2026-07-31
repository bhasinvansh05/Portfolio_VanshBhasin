import { portfolioData } from '../data/portfolio';
import { LiquidButton } from './ui/liquid-glass-button';

export default function Hero() {
  const scrollToContact = () =>
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      className="relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden"
    >
      {/*
        Name + bio stacked and centered on the shared origin.
        Keeping them in normal flow avoids the bio overlapping a wrapped
        multi-line title on large desktop type sizes.
      */}
      <div
        className="absolute left-1/2 z-10 flex w-full max-w-[min(100%,72rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center px-4"
        style={{ top: 'var(--hero-origin-y, 36dvh)' }}
      >
        <h1 className="w-full text-center font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,0,0,1)] whitespace-nowrap leading-none text-[clamp(2.75rem,5.5vw+1.25rem,8rem)]">
          {portfolioData.hero.title}
        </h1>

        <p className="mt-3 sm:mt-4 md:mt-5 w-full max-w-xl text-center font-medium leading-relaxed text-[#f5f5f5] drop-shadow-[0_0_10px_rgba(0,0,0,1)] text-base sm:text-lg md:text-2xl">
          {portfolioData.hero.bio}
        </p>
      </div>

      {/* Contact — below the circle; clears bottom nav on small screens */}
      <div
        className="absolute left-1/2 z-10 flex w-full justify-center px-4 -translate-x-1/2"
        style={{ top: 'calc(var(--hero-origin-y, 36dvh) + clamp(12rem, 42dvh, 24rem))' }}
      >
        <LiquidButton
          className="text-white w-full max-w-[12rem] sm:w-48 cursor-pointer text-sm sm:text-base min-h-[48px]"
          size={'xl'}
          onClick={scrollToContact}
        >
          Contact Me
        </LiquidButton>
      </div>
    </section>
  );
}
