import { motion, useInView, Variants } from "framer-motion";
import { useRef, ElementType, ReactNode, RefObject } from "react";

interface TimelineContentProps {
  as?: ElementType;
  animationNum?: number;
  timelineRef?: RefObject<Element>;
  customVariants?: Variants;
  className?: string;
  children?: ReactNode;
}

export function TimelineContent({
  as: Tag = "div",
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  children,
}: TimelineContentProps) {
  const fallbackRef = useRef<HTMLElement>(null);
  const ref = timelineRef || fallbackRef;
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const MotionComponent = (motion as any)[Tag as string] || motion(Tag as any);

  return (
    <MotionComponent
      ref={!timelineRef ? fallbackRef : undefined}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={animationNum}
      variants={customVariants}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
