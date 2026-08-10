import { useState } from 'react';
import { Check, Copy, Download, Github, Linkedin, Mail } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { RESUME_FILENAME, RESUME_URL } from '../lib/navigation';
import Reveal from './Reveal';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolioData.contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${portfolioData.contact.email}`;
    }
  };

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
          className="mx-auto mt-8 flex w-full max-w-[17.5rem] flex-col items-stretch gap-3 sm:mt-10 sm:max-w-sm sm:gap-3.5"
        >
          <a
            href={`mailto:${portfolioData.contact.email}`}
            className="apple-press apple-capsule !inline-flex w-full max-w-full box-border gap-2 overflow-hidden bg-[var(--ink)] text-white"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate">{portfolioData.contact.email}</span>
          </a>

          <button
            type="button"
            onClick={copyEmail}
            className="apple-press apple-capsule !inline-flex w-full max-w-full box-border gap-2 border border-black/10 bg-white text-[var(--ink)]"
          >
            {copied ? (
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy email'}
          </button>

          <a
            href={RESUME_URL}
            download={RESUME_FILENAME}
            className="apple-press apple-capsule !inline-flex w-full max-w-full box-border gap-2 border border-black/10 bg-white text-[var(--ink)]"
          >
            <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
            Resume
          </a>

          <div className="mt-1 flex items-center justify-center gap-2">
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
