import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BookOpen, Award } from 'lucide-react';

const researchProjects = [
  {
    title: 'Neural Architecture Search for Edge Devices',
    institution: 'Stanford AI Lab',
    period: 'Sept 2025 - Present',
    description: 'Developing automated machine learning techniques to optimize neural network architectures for resource-constrained edge devices. Achieved 40% reduction in model size while maintaining 98% accuracy on ImageNet classification tasks.',
    outcome: 'Submitted to NeurIPS 2026',
    icon: BookOpen,
  },
  {
    title: 'Explainable AI for Medical Diagnosis',
    institution: 'Stanford Medical School Collaboration',
    period: 'Jan 2025 - Aug 2025',
    description: 'Built interpretable deep learning models for early detection of diabetic retinopathy using attention mechanisms and gradient-based explanations. Collaborated with clinical researchers to validate model predictions.',
    outcome: 'Published at MICCAI 2025',
    icon: Award,
  },
  {
    title: 'Federated Learning for Privacy-Preserving Healthcare',
    institution: 'Stanford Privacy & Security Lab',
    period: 'May 2024 - Dec 2024',
    description: 'Designed and implemented federated learning frameworks that enable collaborative model training across hospitals without sharing patient data. Developed differential privacy mechanisms to protect sensitive information.',
    outcome: 'Workshop paper at ICML 2025',
    icon: BookOpen,
  },
];

export function Research() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-muted/30" id="research">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="mb-4 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent"
            style={{ 
              fontSize: '3rem',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            Research Experience
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mb-12" />
        </motion.div>

        <div className="grid gap-6">
          {researchProjects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5" data-card>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <CardTitle style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                            {project.title}
                          </CardTitle>
                        </div>
                        <CardDescription style={{ fontSize: '1rem' }}>
                          {project.institution} • {project.period}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {project.outcome}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}