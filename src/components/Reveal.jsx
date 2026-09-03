import { motion, useReducedMotion } from 'framer-motion';
import { SPRING } from '../lib/motion';
import { IS_STATIC_RENDER } from '../lib/prerendered';

/** Scroll reveal on the house spring: critically damped, no overshoot. */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = 'div',
}) {
  const reduceMotion = useReducedMotion() || IS_STATIC_RENDER;
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
      transition={{ ...SPRING.ui, delay }}
    >
      {children}
    </Tag>
  );
}
