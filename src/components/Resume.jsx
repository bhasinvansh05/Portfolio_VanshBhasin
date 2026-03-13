import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Maximize2, Minimize2, FileText } from 'lucide-react';

export default function Resume() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pdfUrl = `${import.meta.env.BASE_URL}Resume_Vansh.pdf`;

  return (
    <section id="resume" className="flex flex-col justify-center px-6 py-24 relative z-10">
      <div className={`${isExpanded ? 'max-w-6xl' : 'max-w-4xl'} mx-auto w-full transition-all duration-500`}>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Resume
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            A snapshot of my experience, skills, and education.
          </p>
        </div>

        <motion.div
          layout
          className="relative bg-card/30 border border-border/50 rounded-2xl overflow-hidden backdrop-blur-md"
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-card/50">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Resume_Vansh.pdf</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <a
                href={pdfUrl}
                download="Vansh_Bhasin_Resume.pdf"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          </div>

          {/* PDF Embed */}
          <motion.div
            layout
            className="w-full bg-neutral-900/50"
            animate={{ height: isExpanded ? '85vh' : '70vh' }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          >
            <iframe
              key={isExpanded ? 'expanded' : 'collapsed'}
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              title="Vansh Bhasin Resume"
              className="w-full h-full border-0"
              style={{ colorScheme: 'normal' }}
            />
          </motion.div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
