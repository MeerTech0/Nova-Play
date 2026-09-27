import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 group transition-opacity duration-200 hover:opacity-90 ${className}`}
      aria-label="NovaPlay Home"
    >
      {/* Modern cinematic symbol: minimal geometric aperture */}
      <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 group-hover:border-[var(--nova-accent)]/40 transition-colors duration-300 shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4 h-4 text-[var(--nova-accent)] transition-transform duration-300 group-hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle cinematic play prism */}
          <path
            d="M8.5 6.2C8.5 5.4 9.4 4.9 10.1 5.3L18.4 10.6C19.1 11 19.1 12 18.4 12.4L10.1 17.7C9.4 18.1 8.5 17.6 8.5 16.8V6.2Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <span className={`font-display font-semibold tracking-wider text-white ${sizeClasses[size]} select-none flex items-center`}>
        <span>NOVA</span>
        <span className="font-light text-zinc-400 tracking-widest ml-0.5">PLAY</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--nova-accent)] ml-1.5 opacity-90 shadow-sm" />
      </span>
    </Link>
  );
};
