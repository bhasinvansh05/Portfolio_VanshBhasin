import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from './ui/button';

const projects = [
  {
    title: 'AutoML Pipeline Framework',
    description: 'Open-source framework for automated machine learning that simplifies model selection, hyperparameter tuning, and deployment. Used by 500+ researchers and developers.',
    tags: ['Python', 'TensorFlow', 'Scikit-learn', 'Docker', 'FastAPI'],
    github: '#',
    demo: '#',
  },
  {
    title: 'Real-Time Emotion Recognition',
    description: 'Computer vision system using CNNs and attention mechanisms to detect facial expressions in real-time with 95% accuracy. Deployed as a web application with WebRTC streaming.',
    tags: ['PyTorch', 'OpenCV', 'React', 'WebRTC', 'AWS'],
    github: '#',
    demo: '#',
  },
  {
    title: 'Climate Data Visualization Platform',
    description: 'Interactive platform for exploring climate change data using advanced visualizations and ML-powered trend analysis. Processes over 50M data points from global weather stations.',
    tags: ['React', 'D3.js', 'PostgreSQL', 'Python', 'Pandas'],
    github: '#',
    demo: '#',
  },
];

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6" id="projects">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="mb-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
            style={{ 
              fontSize: '3rem',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mb-12" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col" data-card>
                <CardHeader>
                  <CardTitle style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    {project.title}
                  </CardTitle>
                  <CardDescription style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2 flex-1">
                      <Github className="w-4 h-4" />
                      Code
                    </Button>
                    <Button size="sm" className="gap-2 flex-1">
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}