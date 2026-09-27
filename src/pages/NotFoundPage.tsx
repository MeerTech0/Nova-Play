import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-20"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[var(--nova-accent)] mb-6">
        <Film className="w-8 h-8" />
      </div>

      <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
        404 — Screen Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-bold text-white font-display mb-3">
        Lost in the Cut
      </h1>

      <p className="max-w-md text-sm text-zinc-400 mb-8 leading-relaxed">
        The page you requested does not exist or has been moved from the catalogue.
      </p>

      <button
        onClick={() => navigate('/')}
        type="button"
        data-cursor="button"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-semibold transition-all shadow-lg active:scale-95"
      >
        <Home className="w-4 h-4" />
        <span>Return to Premiere</span>
      </button>
    </motion.div>
  );
};
