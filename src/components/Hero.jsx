import { portfolioData } from '../data/portfolio';
import { LiquidButton } from './ui/liquid-glass-button';

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 px-4 py-6 sm:p-4 w-full justify-between flex flex-col mx-auto max-w-5xl h-full pt-[12vh] sm:pt-[16vh] md:pt-[20vh] pb-[18vh] sm:pb-[12vh] md:pb-[10vh]">
        <main className="relative flex flex-col items-center flex-grow w-full">
            <div className="flex flex-col items-center justify-center flex-grow w-full">
              <h1 className="mb-3 sm:mb-4 text-white text-center font-extrabold tracking-tight drop-shadow-[0_0_15px_rgba(0,0,0,1)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] lg:leading-none">
                {portfolioData.hero.title}
              </h1>
              
              <p className="text-white/80 max-w-xl text-center font-medium leading-relaxed drop-shadow-[0_0_10px_rgba(0,0,0,1)] text-base sm:text-lg md:text-2xl px-2">
                {portfolioData.hero.bio}
              </p>
            </div>
            
            <div className="flex justify-center mt-8 sm:mt-12 md:mt-16 z-50 w-full relative"> 
                <LiquidButton 
                  className="text-white w-full max-w-[12rem] sm:w-48 cursor-pointer text-sm sm:text-base min-h-[48px]" 
                  size={'xl'}
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Contact Me
                </LiquidButton>
            </div> 
        </main>
      </div>
    </section>
  );
}
