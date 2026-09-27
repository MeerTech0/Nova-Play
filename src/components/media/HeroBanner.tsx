import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Info, Star, Calendar, Clock } from 'lucide-react';
import { MediaItem } from '../../types/media';
import { getBackdropUrl } from '../../services/tmdb';
import { useSettings } from '../../context/SettingsContext';

interface HeroBannerProps {
  media: MediaItem;
  genresList?: { id: number; name: string }[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ media, genresList = [] }) => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const isMovie = 'title' in media;
  const title = isMovie ? media.title : media.name;
  const dateStr = isMovie ? media.release_date : media.first_air_date;
  const year = dateStr ? new Date(dateStr).getFullYear() || dateStr.slice(0, 4) : '';
  const mediaType = isMovie ? 'movie' : 'tv';
  const rating = typeof media.vote_average === 'number' && media.vote_average > 0
    ? media.vote_average.toFixed(1)
    : '8.4';
  const runtime = 'runtime' in media && media.runtime ? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m` : null;

  // Resolve genre names
  const genreNames = React.useMemo(() => {
    if (media.genres && media.genres.length > 0) {
      return media.genres.map((g) => g.name);
    }
    if (media.genre_ids && media.genre_ids.length > 0 && genresList.length > 0) {
      return media.genre_ids
        .map((id) => genresList.find((g) => g.id === id)?.name)
        .filter((name): name is string => Boolean(name))
        .slice(0, 3);
    }
    return [];
  }, [media, genresList]);

  const backdropUrl = getBackdropUrl(media.backdrop_path, 'original');
  const detailsUrl = `/${mediaType}/${media.id}`;
  const watchUrl = `/watch/${mediaType}/${media.id}`;

  const heightClasses = {
    compact: 'h-[55vh] sm:h-[65vh] min-h-[440px] max-h-[680px]',
    standard: 'h-[70vh] sm:h-[80vh] min-h-[500px] max-h-[820px]',
    tall: 'h-[80vh] sm:h-[90vh] min-h-[580px] max-h-[920px]',
  }[settings.heroHeight || 'standard'];

  return (
    <div className={`relative w-full ${heightClasses} overflow-hidden bg-[var(--nova-bg)] transition-all duration-300`}>
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover object-top filter brightness-[0.7] contrast-[1.05]"
        />
        {/* Soft radial and linear dark gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--nova-bg)] via-[var(--nova-bg)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--nova-bg)] via-[var(--nova-bg)]/80 to-transparent sm:w-2/3" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[var(--nova-bg)]/30 to-[var(--nova-bg)]/80" />
      </div>

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          {/* Tag & Metadata */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3 text-xs sm:text-sm">
            <span className="px-2.5 py-1 rounded-full bg-[var(--nova-accent)]/15 border border-[var(--nova-accent)]/30 text-[var(--nova-accent)] font-semibold tracking-wide uppercase text-[11px]">
              Featured Cinema
            </span>

            {settings.showRatings && (
              <span className="flex items-center gap-1 text-zinc-300 font-medium">
                <Star className="w-3.5 h-3.5 fill-[var(--nova-accent)] text-[var(--nova-accent)]" />
                <span>{rating}</span>
              </span>
            )}

            {settings.showYears && year && (
              <span className="flex items-center gap-1 text-zinc-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{year}</span>
              </span>
            )}

            {runtime && (
              <span className="hidden sm:flex items-center gap-1 text-zinc-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{runtime}</span>
              </span>
            )}

            <span className="uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-medium">
              {mediaType === 'movie' ? 'Film' : 'Series'}
            </span>

            {/* Resolved Genres */}
            {genreNames.map((gName) => (
              <span
                key={gName}
                className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.06]"
              >
                {gName}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display mb-3 sm:mb-4 leading-tight sm:leading-none drop-shadow-md">
            {title}
          </h1>

          {/* Overview */}
          <p className="text-zinc-300 text-sm sm:text-base line-clamp-3 mb-6 sm:mb-8 font-normal leading-relaxed max-w-xl drop-shadow-sm">
            {media.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              type="button"
              data-magnetic="true"
              data-cursor="button"
              onClick={() =>
                navigate(watchUrl, {
                  state: {
                    title,
                    overview: media.overview,
                    backdrop_path: media.backdrop_path,
                    poster_path: media.poster_path,
                  },
                })
              }
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#08090C] focus:ring-white"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Now</span>
            </button>

            <button
              type="button"
              data-magnetic="true"
              data-cursor="button"
              onClick={() => navigate(detailsUrl)}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.1] hover:bg-white/[0.18] text-white font-medium text-sm backdrop-blur-md border border-white/[0.15] transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <Info className="w-4 h-4 text-zinc-300" />
              <span>More Info</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade line */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#08090C] to-transparent pointer-events-none" />
    </div>
  );
};
