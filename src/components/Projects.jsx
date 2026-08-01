import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ProjectTile } from './ui/glass-cards';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Badge } from './ui/badge';
import {
  cardData,
  getProjectsByRecency,
  getRecentProjects,
} from '@/lib/utils';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const recentProjects = getRecentProjects(3);
  const allProjects = getProjectsByRecency(cardData);

  return (
    <section id="projects" className="relative z-10 w-full px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="mb-3 text-center text-2xl font-semibold tracking-tight text-foreground sm:mb-4 sm:text-3xl md:text-4xl">
          Featured Work
        </h2>
        <p className="mx-auto mb-10 max-w-2xl px-2 text-center text-sm text-muted-foreground md:text-base sm:mb-12">
          Things that had to work after the demo ended.
        </p>

        {/* 3 most recent — 3×1 on desktop, stacked on small screens */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 md:gap-7">
          {recentProjects.map((project) => (
            <ProjectTile
              key={project.id}
              project={project}
              onSelect={() => setSelectedProject(project)}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:mt-12">
          <button
            type="button"
            onClick={() => setShowAllProjects(true)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            More projects
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* All projects — separate view */}
      <Dialog open={showAllProjects} onOpenChange={setShowAllProjects}>
        <DialogContent className="max-h-[90vh] w-[calc(100%-1.5rem)] max-w-5xl overflow-y-auto border-border/50 bg-black/95 backdrop-blur-xl sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              All projects
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Everything shipped, researched, or still in the field.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {allProjects.map((project) => (
              <ProjectTile
                key={project.id}
                project={project}
                onSelect={() => {
                  setShowAllProjects(false);
                  setSelectedProject(project);
                }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Project detail */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {selectedProject?.href ? (
                <a
                  href={selectedProject.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {selectedProject.title}
                </a>
              ) : (
                selectedProject?.title
              )}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedProject?.meta}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedProject?.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-secondary/50">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {(selectedProject?.details?.length
              ? selectedProject.details
              : selectedProject?.description
                ? [selectedProject.description]
                : []
            ).map((detail, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-1.5 text-xs text-primary">●</span>
                <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
