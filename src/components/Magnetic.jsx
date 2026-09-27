import { useReducedMotion } from 'framer-motion';
import { useMagnetic } from '../hooks/useMagnetic';

/** Wraps a control so desktop pointers get a quiet magnetic pull. */
export default function Magnetic({
  children,
  className,
  strength = 10,
  as: Tag = 'div',
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const ref = useMagnetic({
    strength,
    enabled: !reduceMotion,
  });

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
}
