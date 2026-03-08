import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Award, Trophy, Star, GraduationCap } from 'lucide-react';

const achievements = [
  {
    title: 'Dean\'s List',
    description: 'Recognized for academic excellence with GPA 3.95/4.0',
    icon: GraduationCap,
    year: '2023-2025',
  },
  {
    title: 'Best Paper Award',
    description: 'ICML Workshop on AutoML - Neural Architecture Search',
    icon: Trophy,
    year: '2025',
  },
  {
    title: 'Google Excellence Scholarship',
    description: 'Awarded for outstanding achievement in Computer Science',
    icon: Award,
    year: '2024',
  },
  {
    title: 'Hackathon Winner',
    description: 'First place at Stanford TreeHacks for AI Healthcare project',
    icon: Star,
    year: '2024',
  },
  {
    title: 'Research Grant',
    description: 'NSF Graduate Research Fellowship Program (GRFP)',
    icon: Award,
    year: '2025',
  },
  {
    title: 'Outstanding TA Award',
    description: 'Recognized for exceptional teaching in CS229 Machine Learning',
    icon: Star,
    year: '2024',
  },
];

export function Achievements() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-muted/30" id="achievements">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent"
            style={{ 
              fontSize: '3rem',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            Academic Achievements
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mb-12" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 h-full" data-card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                            {achievement.title}
                          </h3>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {achievement.year}
                          </span>
                        </div>
                        <p className="text-muted-foreground" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
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