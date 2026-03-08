import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over interactive elements
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer') ||
        target.closest('[data-badge]') ||
        target.getAttribute('data-badge') !== null
      ) {
        setIsHovering(true);
        setCursorVariant('button');
      } else if (
        target.closest('[data-card]') ||
        target.closest('.card') ||
        target.classList.contains('hover:shadow-lg')
      ) {
        setIsHovering(true);
        setCursorVariant('card');
      } else {
        setIsHovering(false);
        setCursorVariant('default');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const cursorSize = isHovering ? (cursorVariant === 'button' ? 48 : 64) : 32;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </motion.div>

      {/* Cursor ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-2"
        style={{
          borderColor: isHovering ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)',
        }}
        animate={{
          x: mousePosition.x - cursorSize / 2,
          y: mousePosition.y - cursorSize / 2,
          width: cursorSize,
          height: cursorSize,
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
      />

      {/* Glow effect on hover */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            x: mousePosition.x - 40,
            y: mousePosition.y - 40,
            width: 80,
            height: 80,
            opacity: 1,
            scale: 1,
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
          }}
        />
      )}

      {/* Trailing particles effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9996] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)',
          filter: 'blur(20px)',
        }}
        animate={{
          x: mousePosition.x - 30,
          y: mousePosition.y - 30,
          width: 60,
          height: 60,
          opacity: isHovering ? 0.6 : 0.3,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 25,
          mass: 0.8,
        }}
      />
    </>
  );
}