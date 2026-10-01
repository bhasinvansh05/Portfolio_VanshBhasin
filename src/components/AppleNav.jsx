import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { scrollToId } from '@/lib/navigation';
import { FADE, SPRING } from '@/lib/motion';

const links = [
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

const SECTION_IDS = ['hero', 'experience', 'projects', 'skills', 'contact'];

export default function AppleNav() {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const scrollY = window.scrollY;
      setScrolled(scrollY > 12);

      const doc = document.documentElement;
      const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
      /* Short last sections never reach a mid-nav marker; pin Contact at the bottom. */
      if (maxScroll > 0 && scrollY >= maxScroll - 4) {
        setActive('#contact');
        return;
      }

      /* Marker sits just under the sticky nav so the highlight tracks the
         section the user is actually reading. */
      const marker =
        scrollY +
        Math.min(120, Math.max(72, window.innerHeight * 0.18));

      let next = '';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + scrollY;
        if (top <= marker) {
          next = id === 'hero' ? '' : `#${id}`;
        }
      }
      setActive(next);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const go = (href) => (event) => {
    event.preventDefault();
    scrollToId(href.slice(1), {
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-[var(--section-gutter)] pt-[max(0.75rem,env(safe-area-inset-top))]">
      <motion.nav
        initial={reduceMotion ? false : { y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={reduceMotion ? FADE.ui : SPRING.ui}
        className={cn(
          'pointer-events-auto apple-material apple-nav-capsule mx-auto flex items-center',
          scrolled ? 'apple-material-heavy' : '',
        )}
        aria-label="Primary"
      >
        <a
          href="#hero"
          onClick={go('#hero')}
          className="apple-press apple-nav-link shrink-0 font-semibold text-[var(--ink)]"
        >
          Vansh
        </a>

        <div className="flex min-w-0 flex-1 items-center justify-end overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {links.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={go(link.href)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'apple-press apple-nav-link relative',
                  isActive
                    ? 'text-[var(--ink)]'
                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink)]',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId={reduceMotion ? undefined : 'nav-pill'}
                    className="absolute inset-0 -z-10 rounded-full bg-black/[0.06]"
                    transition={reduceMotion ? { duration: 0 } : SPRING.snappy}
                  />
                )}
                {link.label}
              </a>
            );
          })}
        </div>
      </motion.nav>
    </header>
  );
}
