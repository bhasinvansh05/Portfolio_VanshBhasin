import { motion } from 'motion/react';
import { ArrowDown, ArrowRight, Download } from 'lucide-react';
import { Button } from './ui/button';

export function Hero() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToResume = () => {
    document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1771814574230-49e5a374aafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwYmFja2dyb3VuZCUyMGRhcmslMjBibHVlJTIwcHVycGxlfGVufDF8fHx8MTc3MjkyNTAyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-background z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="mb-6 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent"
            style={{ 
              fontSize: '4.5rem',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Vansh Bhasin
          </motion.h1>

          <motion.p 
            className="mb-4"
            style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              background: 'linear-gradient(to right, rgba(167, 139, 250, 0.9), rgba(139, 92, 246, 0.9), rgba(99, 102, 241, 0.9))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Computer Science@YorkU | Student Researcher | Software Developer | Data Analyst | Incoming @RBC
          </motion.p>

          <motion.p 
            className="mb-10 text-muted-foreground max-w-2xl mx-auto"
            style={{ fontSize: '1.125rem', lineHeight: 1.7 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Building intelligent systems through machine learning and data-driven engineering. 
            Passionate about leveraging AI to solve complex real-world problems and create 
            meaningful impact in healthcare, sustainability, and human-computer interaction.
          </motion.p>

          <motion.div 
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Button 
              size="lg" 
              className="gap-2"
              style={{ fontSize: '1rem', padding: '1.5rem 2rem' }}
              onClick={scrollToProjects}
            >
              View Projects
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2 bg-background/10 backdrop-blur-sm border-white/20 hover:bg-background/20"
              style={{ fontSize: '1rem', padding: '1.5rem 2rem' }}
              onClick={scrollToResume}
            >
              View Resume
              <ArrowDown className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-white/50 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}