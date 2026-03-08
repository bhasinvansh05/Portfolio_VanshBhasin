import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface GlowOrb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
}

export function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [orbs] = useState<GlowOrb[]>([
    {
      id: 1,
      x: 20,
      y: 20,
      size: 400,
      color: 'rgba(139, 92, 246, 0.18)', // Purple - increased opacity
      duration: 20,
    },
    {
      id: 2,
      x: 80,
      y: 40,
      size: 350,
      color: 'rgba(59, 130, 246, 0.15)', // Blue - increased opacity
      duration: 25,
    },
    {
      id: 3,
      x: 50,
      y: 70,
      size: 450,
      color: 'rgba(167, 139, 250, 0.12)', // Light purple
      duration: 30,
    },
    {
      id: 4,
      x: 10,
      y: 60,
      size: 320,
      color: 'rgba(20, 184, 166, 0.1)', // Teal
      duration: 28,
    },
  ]);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{
            x: `${orb.x + mousePosition.x * 10}%`,
            y: `${orb.y + mousePosition.y * 10}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 20,
            damping: 30,
            mass: 2,
          }}
        />
      ))}

      {/* Mouse-following gradient light */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: mousePosition.x * window.innerWidth - 250,
          y: mousePosition.y * window.innerHeight - 250,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 30,
          mass: 1.5,
        }}
      />

      {/* Secondary mouse follower with delay */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        animate={{
          x: mousePosition.x * window.innerWidth - 200,
          y: mousePosition.y * window.innerHeight - 200,
        }}
        transition={{
          type: "spring",
          stiffness: 30,
          damping: 35,
          mass: 2,
        }}
      />

      {/* Ambient floating particles */}
      <motion.div
        className="absolute top-1/4 left-1/4 rounded-full"
        style={{
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-2/3 right-1/4 rounded-full"
        style={{
          width: 350,
          height: 350,
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Mesh gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(at 20% 30%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(at 80% 70%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}