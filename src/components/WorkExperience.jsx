import { portfolioData } from '../data/portfolio';
import { Timeline } from './ui/timeline';
import { Building2, Calendar } from 'lucide-react';

export default function WorkExperience() {
  const timelineData = portfolioData.experience.map((job) => ({
    title: job.duration,
    content: (
      <div className="group relative border border-border rounded-2xl p-6 sm:p-8 bg-card/50 hover:bg-card/80 transition-colors backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <Building2 className="h-5 w-5 text-primary/70" />
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">{job.company}</h3>
        </div>
        <p className="text-base font-medium text-primary/80 mb-4">{job.role}</p>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{job.description}</p>
      </div>
    ),
  }));

  return (
    <section id="experience" className="flex flex-col justify-center px-6 py-24 relative z-10">
      <div className="max-w-7xl mx-auto w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 mb-6">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">Experience</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
            A timeline of my professional journey from research labs to real-world systems.
          </p>
        </div>
        <Timeline data={timelineData} />
      </div>
    </section>
  );
}
