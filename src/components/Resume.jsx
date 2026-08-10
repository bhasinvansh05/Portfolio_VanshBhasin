import { Download } from 'lucide-react';
import Reveal from './Reveal';

const PDF_URL = './Resume_Vansh.pdf';
const PDF_FILENAME = 'Vansh_Bhasin_Resume.pdf';

export default function Resume() {
  return (
    <section id="resume" className="apple-section relative z-10">
      <div className="apple-panel apple-panel-cream text-center">
        <Reveal>
          <h2 className="apple-title text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] text-[var(--ink)]">
            Resume
          </h2>
          <p className="apple-body mx-auto mt-3 max-w-xl text-[clamp(0.95rem,0.85rem+0.4vw,1.125rem)]">
            Prefer the printable version? It&apos;s right here.
          </p>
          <a
            href={PDF_URL}
            download={PDF_FILENAME}
            className="apple-press apple-capsule apple-capsule-block mt-8 gap-2 bg-[var(--ink)] text-white"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download Resume
          </a>
        </Reveal>
      </div>
    </section>
  );
}
