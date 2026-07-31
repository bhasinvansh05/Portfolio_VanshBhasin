import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Maximize2, Minimize2, FileText, ExternalLink } from 'lucide-react';

export default function Resume() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pdfUrl = './Resume_Vansh.pdf';

  return (
    <section id="resume" className="flex flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 relative z-10">
      <div className={`${isExpanded ? 'max-w-6xl' : 'max-w-4xl'} mx-auto w-full transition-all duration-500`}>
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 sm:mb-4">
            Resume
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto px-2">
            A snapshot of my experience, skills, and education.
          </p>
        </div>

        <motion.div
          layout
          className="relative bg-card/30 border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-md"
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Toolbar — desktop / tablet */}
          <div className="hidden sm:flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 px-3 sm:px-5 py-2 sm:py-3 border-b border-border/50 bg-card/50">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <FileText className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground truncate">Resume_Vansh.pdf</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
                title={isExpanded ? 'Collapse' : 'Expand'}
                aria-label={isExpanded ? 'Collapse resume preview' : 'Expand resume preview'}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <a
                href={pdfUrl}
                download="Vansh_Bhasin_Resume.pdf"
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          </div>

          {/* Mobile fallback — iframe embeds are unreliable on iOS Safari */}
          <div className="sm:hidden flex flex-col items-center justify-center gap-5 px-6 py-12 bg-neutral-900/50 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-card/50">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-base font-medium text-foreground mb-1">Resume_Vansh.pdf</p>
              <p className="text-sm text-muted-foreground">Open or download the full PDF.</p>
            </div>
            <div className="flex flex-col w-full max-w-xs gap-3">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Open PDF
              </a>
              <a
                href={pdfUrl}
                download="Vansh_Bhasin_Resume.pdf"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-lg border border-border bg-card/50 text-foreground text-sm font-medium hover:bg-card/80 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          </div>

          {/* PDF Embed — tablet / desktop */}
          <motion.div
            layout
            className="hidden sm:block w-full bg-neutral-900/50"
            animate={{ height: isExpanded ? '85vh' : '55vh' }}
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

          {/* Bottom gradient fade — desktop only */}
          <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
