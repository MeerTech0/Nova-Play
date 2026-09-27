import React from 'react';

interface TmdbLogoProps {
  className?: string;
  variant?: 'badge' | 'full';
}

export const TmdbLogo: React.FC<TmdbLogoProps> = ({ className = 'h-4', variant = 'full' }) => {
  if (variant === 'badge') {
    return (
      <svg
        viewBox="0 0 100 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="The Movie Database (TMDB)"
      >
        <defs>
          <linearGradient id="tmdb-gradient" x1="0" y1="0" x2="100" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#01b4e4" />
            <stop offset="1" stopColor="#90cea1" />
          </linearGradient>
        </defs>
        <rect width="100" height="40" rx="8" fill="url(#tmdb-gradient)" />
        <text
          x="50"
          y="26"
          textAnchor="middle"
          fill="#0D253F"
          fontSize="20"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          letterSpacing="0.05em"
        >
          TMDB
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 154 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="The Movie Database (TMDB)"
    >
      <defs>
        <linearGradient id="tmdb-full-grad" x1="0" y1="0" x2="154" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01b4e4" />
          <stop offset="1" stopColor="#90cea1" />
        </linearGradient>
      </defs>
      {/* Official TMDB Primary wordmark geometry */}
      <rect width="46" height="20" rx="4" fill="url(#tmdb-full-grad)" />
      <text
        x="23"
        y="14.5"
        textAnchor="middle"
        fill="#08090C"
        fontSize="11.5"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        letterSpacing="0.04em"
      >
        TMDB
      </text>
      <text
        x="56"
        y="14.5"
        fill="#94A3B8"
        fontSize="11"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="600"
        letterSpacing="0.05em"
      >
        THE MOVIE DB
      </text>
    </svg>
  );
};
