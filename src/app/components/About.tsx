import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6" id="about">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="mb-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent"
            style={{ 
              fontSize: '3rem',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            About Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mb-12" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-muted-foreground mb-6" style={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
              I'm a third-year Computer Science student at Stanford University with a deep passion for 
              artificial intelligence and machine learning. My academic journey has been focused on 
              understanding how we can build more intelligent, efficient, and ethical AI systems.
            </p>
            <p className="text-muted-foreground" style={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
              Currently, I'm conducting research at the Stanford AI Lab on neural architecture search 
              and automated machine learning, while also working on open-source projects that make 
              advanced AI more accessible to developers and researchers worldwide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-muted-foreground mb-6" style={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
              Beyond academics, I'm fascinated by the intersection of AI and real-world applications—from 
              healthcare diagnostics to climate modeling. I believe that the next generation of AI systems 
              will be more interpretable, efficient, and aligned with human values.
            </p>
            <p className="text-muted-foreground" style={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
              When I'm not coding or researching, you'll find me contributing to open-source projects, 
              mentoring students in machine learning, or exploring the latest developments in 
              transformers, diffusion models, and reinforcement learning.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}