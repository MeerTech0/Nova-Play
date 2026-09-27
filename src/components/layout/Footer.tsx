import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Logo } from '../common/Logo';
import { TmdbLogo } from '../common/TmdbLogo';

export const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="border-t border-white/[0.06] bg-[#07080A] text-zinc-400 mt-20 relative select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-white/[0.06]">
          {/* Brand & Vision Column */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-zinc-400 font-normal leading-relaxed max-w-sm">
              NovaPlay is a modern movie and TV discovery experience designed to make exploring entertainment simple, cinematic and enjoyable.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-zinc-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--nova-accent)]" />
              <span>Cinematic Streaming Architecture</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Browse
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors duration-150">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-white transition-colors duration-150">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/tv" className="hover:text-white transition-colors duration-150">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link to="/genres" className="hover:text-white transition-colors duration-150">
                  Genres
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition-colors duration-150">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Information & Credits */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              NovaPlay
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors duration-150">
                  About
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors duration-150">
                  Credits
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors duration-150">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policy Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Legal & Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors duration-150">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors duration-150">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors duration-150">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* TMDB Attribution Section (Prominent, Official Branding) */}
        <div className="pt-8 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/[0.04]">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-85 transition-opacity inline-flex items-center"
                aria-label="The Movie Database (TMDB)"
              >
                <TmdbLogo className="h-4 sm:h-5" variant="full" />
              </a>
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest border-l border-white/10 pl-3">
                Data Partner
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              "This product uses the TMDB API but is not endorsed or certified by TMDB."
            </p>
          </div>

          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-zinc-300 hover:text-white transition-all group"
          >
            <span>Visit TMDB</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </a>
        </div>

        {/* Copyright & Bottom Metadata */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} NovaPlay. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Designed for cinematic discovery</span>
            <span>•</span>
            <span className="font-mono text-zinc-400">v1.2</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
