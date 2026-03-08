import { motion } from 'motion/react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-sm"
        >
          <p>© {currentYear} Alex Chen. All rights reserved.</p>
          <p>Built with React, TypeScript, and Tailwind CSS</p>
        </motion.div>
      </div>
    </footer>
  );
}
