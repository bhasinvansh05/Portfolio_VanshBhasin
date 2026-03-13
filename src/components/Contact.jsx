import { portfolioData } from '../data/portfolio';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="min-h-[60vh] flex flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 pb-28 sm:pb-24 relative z-10">
      <div className="max-w-4xl mx-auto w-full text-center">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4 sm:mb-6">Let's Connect</h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
          I'm actively looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <button
            onClick={() => window.location.href = `mailto:${portfolioData.contact.email}`}
            className="rounded-lg bg-primary px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all hover:scale-105 w-full sm:w-auto min-h-[48px] inline-flex justify-center items-center gap-3 cursor-pointer"
          >
            <Mail className="h-5 w-5 shrink-0" />
            Say Hello
          </button>
          <div className="flex gap-4 sm:gap-6 mt-2 sm:mt-0">
            <button onClick={() => window.open(portfolioData.contact.github, '_blank')} className="min-h-[48px] min-w-[48px] p-4 bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-card/80 active:scale-95 transition-all hover:scale-110 shadow-sm cursor-pointer flex items-center justify-center">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </button>
            <button onClick={() => window.open(portfolioData.contact.linkedin, '_blank')} className="min-h-[48px] min-w-[48px] p-4 bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-card/80 active:scale-95 transition-all hover:scale-110 shadow-sm cursor-pointer flex items-center justify-center">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
