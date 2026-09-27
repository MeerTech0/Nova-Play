import React from 'react';
import { motion } from 'framer-motion';

interface GlobalLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const GlobalLoading: React.FC<GlobalLoadingProps> = ({
  message = 'Loading cinema experience...',
  fullScreen = true,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08090C] text-white p-4'
    : 'w-full py-20 flex flex-col items-center justify-center text-white';

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="relative flex items-center justify-center">
        {/* Soft outer pulse */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-16 h-16 rounded-full blur-md opacity-30"
          style={{ backgroundColor: 'var(--nova-accent, #E5A93C)' }}
        />

        {/* Minimal spinner ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-3 border-white/10"
          style={{ borderTopColor: 'var(--nova-accent, #E5A93C)' }}
        />
      </div>

      {message && (
        <p className="mt-5 text-sm font-medium tracking-wider uppercase text-zinc-300">
          {message}
        </p>
      )}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="flex-none w-[170px] sm:w-[200px] md:w-[220px] animate-pulse">
      <div className="aspect-[2/3] w-full rounded-xl bg-white/[0.04] border border-white/[0.06]" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-3/4 rounded bg-white/[0.05]" />
        <div className="h-3 w-1/2 rounded bg-white/[0.03]" />
      </div>
    </div>
  );
};
