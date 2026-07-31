import { useDemoMode } from './DemoModeContext';

export default function RecruiterToggle() {
  const { mode, setMode } = useDemoMode();

  return (
    <div
      className="fixed top-3 right-3 sm:top-5 sm:right-5 z-[60] flex items-center gap-1 rounded-full border border-white/15 bg-black/70 p-1 backdrop-blur-md shadow-lg"
      role="group"
      aria-label="Demo viewing mode"
    >
      <button
        type="button"
        onClick={() => setMode('cinematic')}
        className={`rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-medium tracking-wide transition-colors min-h-[36px] ${
          mode === 'cinematic'
            ? 'bg-white text-black'
            : 'text-white/70 hover:text-white'
        }`}
        aria-pressed={mode === 'cinematic'}
      >
        Cinematic
      </button>
      <button
        type="button"
        onClick={() => setMode('recruiter')}
        className={`rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-medium tracking-wide transition-colors min-h-[36px] ${
          mode === 'recruiter'
            ? 'bg-white text-black'
            : 'text-white/70 hover:text-white'
        }`}
        aria-pressed={mode === 'recruiter'}
      >
        Recruiter
      </button>
    </div>
  );
}
