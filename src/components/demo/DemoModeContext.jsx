import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'vb-demo-mode';

const DemoModeContext = createContext({
  mode: 'cinematic',
  isRecruiter: false,
  setMode: () => {},
  toggleMode: () => {},
  reducedMotion: false,
});

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readStoredMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'cinematic' || stored === 'recruiter') return stored;
  } catch {
    /* ignore */
  }
  // Default toward recruiter-like reduction when OS asks for less motion
  return prefersReducedMotion() ? 'recruiter' : 'cinematic';
}

export function DemoModeProvider({ children }) {
  const [mode, setModeState] = useState(() => readStoredMode());
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const setMode = (next) => {
    const value = next === 'recruiter' ? 'recruiter' : 'cinematic';
    setModeState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    // Tall sticky stack can leave scroll past content after layout swap
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  const toggleMode = () => setMode(mode === 'recruiter' ? 'cinematic' : 'recruiter');

  const value = {
    mode,
    isRecruiter: mode === 'recruiter',
    setMode,
    toggleMode,
    reducedMotion: reducedMotion || mode === 'recruiter',
  };

  return (
    <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  return useContext(DemoModeContext);
}
