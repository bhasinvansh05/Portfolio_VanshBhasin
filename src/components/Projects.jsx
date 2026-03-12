import { useState } from 'react';
import { GlassBlogCard } from './ui/glass-blog-card-shadcnui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Badge } from './ui/badge';

const projectCards = [
  {
    title: "Drone Traffic Analysis Pipeline",
    excerpt: "Scalable computer vision system for analyzing drone-captured traffic footage using YOLO models.",
    tags: ["Computer Vision", "YOLO"],
    readTime: "Elder Lab",
    date: "2025",
    details: [
      "Developed scalable computer vision pipelines to analyze drone traffic using YOLO object detection models.",
      "Sped up deployment by 40% across hybrid cloud environments using Docker and CI/CD tools.",
      "Built end-to-end data processing workflows for aerial traffic surveillance at Elder Lab, York University.",
    ],
  },
  {
    title: "EMF Exposure Prediction System",
    excerpt: "Deep learning research for predicting electromagnetic field exposure using generative data augmentation.",
    tags: ["Deep Learning", "Data Analytics"],
    readTime: "NGWN Lab",
    date: "2024–2025",
    details: [
      "Conducted research on EMF exposure prediction using deep learning and generative data augmentation techniques.",
      "Built data pipelines connecting Python, SQL, and Power BI, boosting validation workflows by 15%.",
      "Published findings on predictive modeling for 5G network electromagnetic field mapping.",
    ],
  },
  {
    title: "Micromobility Telemetry Platform",
    excerpt: "Software systems supporting telemetry, safety, and data processing for electric micro-mobility vehicles.",
    tags: ["IoT", "Software Integration"],
    readTime: "Sarit Micromobility",
    date: "2026",
    details: [
      "Contributed to the development and testing of software systems supporting telemetry, safety, and data processing.",
      "Worked on real-time data pipelines for electric micro-mobility vehicle monitoring and diagnostics.",
      "Integrated safety and compliance modules into the core mobility platform.",
    ],
  },
];

const author = {
  name: "Vansh Bhasin",
  avatar: "https://github.com/bhasinvansh05.png",
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="flex flex-col justify-center px-6 py-24 relative z-10 w-full">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4 text-center">
          Featured Work
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto text-center mb-16">
          A collection of projects spanning design, development, and AI research.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {projectCards.map((project, index) => (
            <GlassBlogCard
              key={index}
              title={project.title}
              excerpt={project.excerpt}
              author={author}
              date={project.date}
              readTime={project.readTime}
              tags={project.tags}
              className="max-w-full"
              onReadMore={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Read More Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="sm:max-w-xl bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {selectedProject?.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedProject?.readTime} · {selectedProject?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-2">
            {selectedProject?.tags?.map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-secondary/50">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {selectedProject?.details?.map((detail, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-primary mt-1.5 text-xs">●</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
