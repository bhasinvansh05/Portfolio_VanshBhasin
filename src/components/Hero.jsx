import { portfolioData } from '../data/portfolio';
import { LiquidButton } from './ui/liquid-glass-button';

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 p-4 w-full justify-between flex flex-col mx-auto max-w-5xl h-full pt-[20vh] pb-[10vh]">
        <main className="relative flex flex-col items-center flex-grow">
            
            <div className="flex flex-col items-center justify-center flex-grow w-full">
              <h1 className="mb-4 text-white text-center text-7xl font-extrabold tracking-tight md:text-8xl lg:text-[10rem] lg:leading-none drop-shadow-[0_0_15px_rgba(0,0,0,1)]">
                {portfolioData.hero.title}
              </h1>
              
              <p className="text-white/80 max-w-xl text-center text-lg md:text-2xl font-medium leading-relaxed drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
                {portfolioData.hero.bio}
              </p>
            </div>
            
            <div className="flex justify-center mt-16 z-50 w-full relative"> 
                <LiquidButton 
                  className="text-white w-40 sm:w-48 cursor-pointer" 
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
