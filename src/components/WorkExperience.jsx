import { portfolioData } from '../data/portfolio';
import { Timeline } from './ui/timeline';
import { Building2, Calendar } from 'lucide-react';

export default function WorkExperience() {
  const timelineData = portfolioData.experience.map((job) => ({
    title: job.duration,
    content: (
      <div className="group relative border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 bg-card/50 hover:bg-card/80 transition-colors backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Building2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-primary/70" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground break-words">{job.company}</h3>
        </div>
        <p className="text-sm sm:text-base font-medium text-primary/80 mb-3 sm:mb-4">{job.role}</p>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{job.description}</p>
      </div>
    ),
  }));

  return (
    <section id="experience" className="flex flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 lg:px-10 mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 sm:mb-4">Experience</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
            A timeline of my professional journey from research labs to real-world systems.
          </p>
        </div>
        <Timeline data={timelineData} />
      </div>
    </section>
  );
}
