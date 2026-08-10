import { motion, useReducedMotion } from 'framer-motion';

/** Critically damped spring reveal — Apple default (bounce 0, response ~0.4). */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = 'div',
}) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as] || motion.div;

  if (reduceMotion) {
    const StaticTag = as === 'li' ? 'li' : 'div';
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4, delay }}
    >
      {children}
    </Tag>
  );
}
