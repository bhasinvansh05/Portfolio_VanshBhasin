import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { scrollToId } from '@/lib/navigation';

const links = [
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function AppleNav() {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const ids = ['experience', 'projects', 'skills', 'contact', 'hero'];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target?.id || visible.target.id === 'hero') {
          setActive('');
          return;
        }
        setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.15, 0.35, 0.6] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 12);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
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
        transition={
          reduceMotion
            ? { duration: 0.2 }
            : { type: 'spring', bounce: 0, duration: 0.4 }
        }
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
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', bounce: 0, duration: 0.35 }
                    }
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
