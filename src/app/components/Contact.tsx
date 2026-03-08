import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Button } from './ui/button';
import { Mail, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    url: '#',
    handle: '@alexchen',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: '#',
    handle: 'Alex Chen',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: '#',
    handle: '@alexchen_ai',
  },
];

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-muted/30" id="contact">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 
            className="mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
            style={{ 
              fontSize: '3rem',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mb-8 mx-auto" />
          
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto" style={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            I'm always open to discussing research collaborations, software engineering opportunities, 
            or interesting AI projects. Feel free to reach out!
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Button 
              size="lg" 
              className="gap-2"
              style={{ fontSize: '1.125rem', padding: '1.5rem 2.5rem' }}
            >
              <Mail className="w-5 h-5" />
              alex.chen@stanford.edu
            </Button>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.3 + 0.1 * index }}
                >
                  <Button 
                    variant="outline" 
                    className="gap-2 hover:border-primary/50"
                  >
                    <Icon className="w-4 h-4" />
                    {link.handle}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}