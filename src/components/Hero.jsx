import { portfolioData } from '../data/portfolio';
import { LiquidButton } from './ui/liquid-glass-button';

export default function Hero() {
  const scrollToContact = () =>
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[100dvh] w-full overflow-hidden"
    >
      {/* Name — locked to the shared circle origin (--hero-origin-y) */}
      <h1
        className="absolute left-1/2 z-10 w-full max-w-5xl px-4 -translate-x-1/2 -translate-y-1/2 text-white text-center font-extrabold tracking-tight drop-shadow-[0_0_15px_rgba(0,0,0,1)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] lg:leading-none"
        style={{ top: 'var(--hero-origin-y, 40%)' }}
      >
        {portfolioData.hero.title}
      </h1>

      {/* Bio — just below the name / circle center */}
      <p
        className="absolute left-1/2 z-10 w-full max-w-xl px-4 -translate-x-1/2 text-[#f5f5f5] text-center font-medium leading-relaxed drop-shadow-[0_0_10px_rgba(0,0,0,1)] text-base sm:text-lg md:text-2xl"
        style={{ top: 'calc(var(--hero-origin-y, 40%) + clamp(2.75rem, 6vh, 5.5rem))' }}
      >
        {portfolioData.hero.bio}
      </p>

      {/* Contact — below the circle, scales with viewport */}
      <div
        className="absolute left-1/2 z-10 flex w-full justify-center px-4 -translate-x-1/2"
        style={{ top: 'calc(var(--hero-origin-y, 40%) + clamp(8rem, 26vh, 16rem))' }}
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
