import { Download } from 'lucide-react';

const PDF_URL = './Resume_Vansh.pdf';
const PDF_FILENAME = 'Vansh_Bhasin_Resume.pdf';

export default function Resume() {
  return (
    <section
      id="resume"
      className="flex flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 relative z-10"
    >
      <div className="max-w-4xl mx-auto w-full text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 sm:mb-4">
          Resume
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mb-8 sm:mb-10">
          Prefer the printable version? It&apos;s right here.
        </p>
        <a
          href={PDF_URL}
          download={PDF_FILENAME}
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm sm:text-base font-medium hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          <Download className="h-4 w-4 sm:h-5 sm:w-5" />
          Download Resume
        </a>
      </div>
    </section>
  );
}
