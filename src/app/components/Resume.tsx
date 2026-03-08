import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Button } from './ui/button';
import { Download, FileText, Eye } from 'lucide-react';
import { PDFViewer } from './PDFViewer';

export function Resume() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-muted/30" id="resume">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20 border border-indigo-500/30 mb-6 shadow-lg shadow-indigo-500/10">
            <Eye className="w-12 h-12 text-indigo-400" />
          </div>
          
          <h2 
            className="mb-4 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent"
            style={{ 
              fontSize: '3rem',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            View Resume
          </h2>
          
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto" style={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
            Get a comprehensive overview of my education, research experience, projects, and technical skills. 
            View online or download in PDF format optimized for ATS systems.
          </p>
        </motion.div>

        {/* PDF Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PDFViewer />
        </motion.div>

        {/* Last updated */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-muted-foreground mt-8 text-sm text-center"
        >
          Last updated: March 2026
        </motion.p>
      </div>
    </section>
  );
}