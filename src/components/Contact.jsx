import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, Github, Linkedin, Mail } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { RESUME_FILENAME, RESUME_URL } from '../lib/navigation';
import Reveal from './Reveal';

/* Kept short enough to sit on one line at the narrowest supported width, so
   showing a message never pushes the rest of the section down. */
const STATUS_MESSAGE = {
  copied: 'Copied to clipboard',
  error: "Couldn't copy — use the button above",
};

export default function Contact() {
  const [status, setStatus] = useState('idle');
  const timerRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const copyEmail = async () => {
    window.clearTimeout(timerRef.current);
    try {
      await navigator.clipboard.writeText(portfolioData.contact.email);
      setStatus('copied');
      // Fired with the visual change, on the frame the copy actually commits.
      navigator.vibrate?.(8);
    } catch {
      setStatus('error');
    }
    timerRef.current = window.setTimeout(() => setStatus('idle'), 2600);
  };

  const copied = status === 'copied';

  return (
    <section
      id="contact"
      className="apple-section relative z-10 pb-[clamp(4rem,3rem+3vw,7rem)]"
    >
      <div className="apple-panel apple-panel-muted text-center">
        <Reveal className="apple-section-head !mb-0">
          <p className="apple-kicker mb-3">Contact</p>
          <h2 className="apple-display text-[clamp(2.25rem,1.5rem+3.5vw,4.25rem)] text-[var(--ink)]">
            Let&apos;s connect
          </h2>
          <p className="apple-body mx-auto mt-4 max-w-xl text-[clamp(0.95rem,0.85rem+0.4vw,1.125rem)]">
            Say hi. I actually reply.
          </p>
        </Reveal>

        <Reveal
          delay={0.06}
          className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:gap-4"
        >
          {/* All three controls share one column width so their edges line up,
              and the secondary pair splits that width evenly. */}
          <div className="flex w-full max-w-[min(100%,26rem)] flex-col gap-3">
            <a
              href={`mailto:${portfolioData.contact.email}`}
              className="apple-press apple-capsule w-full gap-2 overflow-hidden bg-[var(--ink)] text-white"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{portfolioData.contact.email}</span>
            </a>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={copyEmail}
                className="apple-press apple-capsule w-full gap-2 border border-black/10 bg-white text-[var(--ink)] sm:flex-1"
              >
                {copied ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                {copied ? 'Copied' : 'Copy email'}
              </button>
              <a
                href={RESUME_URL}
                download={RESUME_FILENAME}
                className="apple-press apple-capsule w-full gap-2 border border-black/10 bg-white text-[var(--ink)] sm:flex-1"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Resume
              </a>
            </div>
          </div>

          <div
            role="status"
            aria-live="polite"
            className="min-h-[1.25rem] w-full text-center text-[0.8125rem] font-medium leading-tight text-[var(--ink-secondary)]"
          >
            {STATUS_MESSAGE[status] ?? ''}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={portfolioData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-press inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--ink-secondary)] hover:text-[var(--ink)]"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
            <a
              href={portfolioData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-press inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--ink-secondary)] hover:text-[var(--ink)]"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
