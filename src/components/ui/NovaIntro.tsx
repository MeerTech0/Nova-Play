import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NovaIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

const STORAGE_KEY = 'novaplay_intro_seen';

export const NovaIntro: React.FC<NovaIntroProps> = ({ onComplete, forceShow = false }) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (forceShow) return true;
    try {
      return !sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return true;
    }
  });

  const handleFinish = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore sessionStorage errors
    }
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    if (!isVisible) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Run sequence for approx 2.2 seconds (or 0.8s if reduced motion)
    const duration = prefersReducedMotion ? 800 : 2200;
    const timer = setTimeout(() => {
      handleFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, handleFinish]);

  // Handle escape key to skip
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="novaplay-startup-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#08090C] text-white overflow-hidden select-none"
          role="dialog"
          aria-label="NovaPlay Introduction"
        >
          {/* Subtle cinematic ambient background lighting */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 0.3, scale: 1.15 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[var(--nova-accent)]/15 via-[var(--nova-accent)]/5 to-transparent blur-3xl pointer-events-none"
          />

          {/* Central Logo Experience */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Logo Wrapper with entrance blur, fade, and subtle cinematic scale */}
            <motion.div
              initial={{
                opacity: 0,
                filter: 'blur(14px)',
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)',
                scale: 1.04,
              }}
              transition={{
                duration: 1.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex items-center gap-3.5 px-6 py-3"
            >
              {/* Minimal Aperture Emblem */}
              <div className="relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-gradient-to-br from-zinc-800/90 to-zinc-950 border border-white/15 shadow-2xl overflow-hidden">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6 text-[var(--nova-accent)]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.5 6.2C8.5 5.4 9.4 4.9 10.1 5.3L18.4 10.6C19.1 11 19.1 12 18.4 12.4L10.1 17.7C9.4 18.1 8.5 17.6 8.5 16.8V6.2Z"
                    fill="currentColor"
                  />
                </svg>

                {/* Subtle internal glyph shine */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="absolute inset-0 bg-[var(--nova-accent)]/20"
                />
              </div>

              {/* NovaPlay Typography */}
              <div className="flex items-center text-3xl sm:text-4xl font-display font-semibold tracking-wider">
                <span className="text-white tracking-widest">NOVA</span>
                <span className="font-light text-zinc-400 tracking-[0.25em] ml-1">PLAY</span>
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="inline-block w-2 h-2 rounded-full bg-[var(--nova-accent)] ml-2.5 shadow-sm"
                />
              </div>

              {/* Light Sweep Effect across Logo */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                <motion.div
                  initial={{ x: '-150%', opacity: 0 }}
                  animate={{
                    x: '200%',
                    opacity: [0, 0.4, 0.7, 0],
                  }}
                  transition={{
                    delay: 0.6,
                    duration: 0.95,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
                />
              </div>
            </motion.div>

            {/* Subtle cinematic subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.35em] text-zinc-400 mt-2"
            >
              Cinematic Discovery
            </motion.p>
          </div>

          {/* Accessible Skip Button (Bottom-Right or Top-Right) */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            type="button"
            onClick={handleFinish}
            className="absolute bottom-8 right-8 z-20 px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[var(--nova-accent)]/50"
            aria-label="Skip introductory animation"
          >
            <span>Skip Intro</span>
            <span className="ml-1 text-[10px] text-zinc-500 font-mono hidden sm:inline">(Esc)</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
