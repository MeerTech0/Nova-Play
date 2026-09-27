import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Genre } from '../../types/media';
import { Sparkles } from 'lucide-react';

interface GenreCardProps {
  genre: Genre;
}

export const GenreCard: React.FC<GenreCardProps> = ({ genre }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="flex-none w-[160px] sm:w-[190px]"
    >
      <Link
        to={`/genres?genre=${genre.id}`}
        data-cursor="card"
        aria-label={`Browse ${genre.name} genre`}
        className="group relative block p-4 rounded-xl bg-gradient-to-br from-[#161922] to-[#111319] border border-white/[0.06] hover:border-[var(--nova-accent)]/40 transition-all duration-300 overflow-hidden shadow-card hover:shadow-card-hover focus:outline-none focus:ring-1 focus:ring-[var(--nova-accent)]"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--nova-accent)]/5 rounded-full blur-xl group-hover:bg-[var(--nova-accent)]/15 transition-all duration-300" />

        <div className="relative z-10">
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-400 group-hover:text-[var(--nova-accent)] group-hover:border-[var(--nova-accent)]/30 transition-colors mb-3">
            <Sparkles className="w-4 h-4" />
          </div>

          <h3 className="text-sm font-semibold text-white group-hover:text-[var(--nova-accent)] transition-colors">
            {genre.name}
          </h3>

          <p className="text-[11px] text-zinc-400 line-clamp-1 mt-1 font-normal">
            {genre.description || 'Curated titles'}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};
