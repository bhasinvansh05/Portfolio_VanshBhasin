import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Badge } from './ui/badge';
import { Code, Brain, Database, Boxes, Wrench, Cloud } from 'lucide-react';

const skillCategories = [
  {
    title: 'Programming Languages',
    icon: Code,
    iconColor: 'from-blue-500 to-cyan-500',
    skills: ['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'R', 'SQL', 'Go'],
  },
  {
    title: 'AI/ML Tools',
    icon: Brain,
    iconColor: 'from-violet-500 to-purple-500',
    skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Hugging Face', 'OpenCV', 'NLTK', 'spaCy'],
  },
  {
    title: 'Data Science',
    icon: Database,
    iconColor: 'from-teal-500 to-emerald-500',
    skills: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter', 'Apache Spark', 'Tableau', 'Power BI'],
  },
  {
    title: 'Frameworks',
    icon: Boxes,
    iconColor: 'from-pink-500 to-rose-500',
    skills: ['React', 'Node.js', 'FastAPI', 'Flask', 'Django', 'Next.js', 'Express', 'Spring Boot'],
  },
  {
    title: 'Development Tools',
    icon: Wrench,
    iconColor: 'from-amber-500 to-orange-500',
    skills: ['Git', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Bash', 'VS Code', 'Postman'],
  },
  {
    title: 'Cloud & Services',
    icon: Cloud,
    iconColor: 'from-indigo-500 to-blue-500',
    skills: ['AWS', 'Google Cloud', 'Azure', 'Firebase', 'MongoDB', 'PostgreSQL', 'Redis', 'Supabase'],
  },
];

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-muted/30" id="skills">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent"
            style={{ 
              fontSize: '3rem',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            Technical Skills
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mb-12" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${category.iconColor} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    {category.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex} 
                      variant="secondary"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200 cursor-default"
                      data-badge
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}