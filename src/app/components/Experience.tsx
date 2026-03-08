import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Briefcase } from 'lucide-react';

const experiences = [
  {
    role: 'Machine Learning Research Intern',
    company: 'Google Brain',
    period: 'Summer 2025',
    description: 'Developed novel attention mechanisms for large language models, resulting in 15% improvement in inference speed. Collaborated with senior researchers on model optimization techniques.',
  },
  {
    role: 'Software Engineering Intern',
    company: 'Meta AI',
    period: 'Summer 2024',
    description: 'Built scalable ML infrastructure for recommendation systems serving 2B+ users. Implemented A/B testing frameworks and contributed to production deployment pipelines.',
  },
  {
    role: 'AI Research Assistant',
    company: 'Stanford AI Lab',
    period: 'Sept 2023 - Present',
    description: 'Conducting research on neural architecture search and AutoML under Professor Andrew Ng. Published 2 papers and presented at international conferences.',
  },
  {
    role: 'Teaching Assistant - CS229',
    company: 'Stanford University',
    period: 'Jan 2024 - June 2024',
    description: 'Assisted in teaching Machine Learning course for 300+ students. Held office hours, graded assignments, and mentored student projects on deep learning applications.',
  },
];

export function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6" id="experience">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="mb-4 bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent"
            style={{ 
              fontSize: '3rem',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            Work Experience
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mb-12" />
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative pl-12 md:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-[-7px] md:left-[25px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Briefcase className="w-4 h-4" />
                      <span style={{ fontSize: '1rem' }}>{exp.company}</span>
                    </div>
                  </div>
                  <span className="text-muted-foreground" style={{ fontSize: '0.95rem' }}>
                    {exp.period}
                  </span>
                </div>
                <p className="text-muted-foreground" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}