import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Film, Tv, Info, Play } from 'lucide-react';
import { MediaItem } from '../../types/media';
import { getPosterUrl } from '../../services/tmdb';
import { useSettings } from '../../context/SettingsContext';

interface MovieCardProps {
  media: MediaItem;
  mediaTypeOverride?: 'movie' | 'tv';
  priority?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  media,
  mediaTypeOverride,
}) => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  // Normalize data across Movie & TVShow
  const isMovie = mediaTypeOverride === 'movie' || media.media_type === 'movie' || 'title' in media;
  const mediaType: 'movie' | 'tv' = isMovie ? 'movie' : 'tv';
  
  const title = 'title' in media ? media.title : media.name;
  const dateStr = 'release_date' in media ? media.release_date : media.first_air_date;
  const releaseYear = dateStr ? new Date(dateStr).getFullYear() || dateStr.slice(0, 4) : '';
  const rating = typeof media.vote_average === 'number' && media.vote_average > 0
    ? media.vote_average.toFixed(1)
    : 'NR';

  const posterUrl = getPosterUrl(media.poster_path, 'w500');
  const detailsUrl = `/${mediaType}/${media.id}`;
  const watchUrl = `/watch/${mediaType}/${media.id}`;

  const handleCardClick = () => {
    navigate(detailsUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(detailsUrl);
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      data-cursor="card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-2xl bg-[var(--nova-surface)] border border-white/[0.06] hover:border-white/[0.18] overflow-hidden cursor-pointer shadow-card hover:shadow-card-hover transition-all select-none focus:outline-none focus:ring-2 focus:ring-[var(--nova-accent)]/60"
      aria-label={`${title} (${releaseYear}), Rating ${rating}. Click to view details.`}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#161922]">
        <img
          src={posterUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--nova-bg)] via-transparent to-black/30 opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Media Type Badge (Top-Left) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium tracking-wide uppercase text-zinc-300 shadow-sm">
            {mediaType === 'movie' ? (
              <>
                <Film className="w-3 h-3 text-zinc-400" />
                <span>Movie</span>
              </>
            ) : (
              <>
                <Tv className="w-3 h-3 text-zinc-400" />
                <span>TV</span>
              </>
            )}
          </span>
        </div>

        {/* Rating Badge (Top-Right) */}
        {settings.showRatings && rating !== 'NR' && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-[var(--nova-accent)] shadow-sm">
              <Star className="w-3 h-3 fill-[var(--nova-accent)] text-[var(--nova-accent)]" />
              <span>{rating}</span>
            </span>
          </div>
        )}

        {/* Hover Quick Action Buttons (Center Overlay) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-250 bg-black/40 backdrop-blur-[2px] p-4">
          <button
            type="button"
            data-cursor="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(detailsUrl);
            }}
            className="w-full max-w-[150px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-lg"
          >
            <Info className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>

          <button
            type="button"
            data-cursor="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(watchUrl, {
                state: {
                  title,
                  overview: media.overview,
                  backdrop_path: media.backdrop_path,
                  poster_path: media.poster_path,
                },
              });
            }}
            className="w-full max-w-[150px] inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--nova-accent)] hover:opacity-90 text-zinc-950 text-xs font-semibold shadow-md transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Watch Now</span>
          </button>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-gradient-to-b from-[var(--nova-surface)] to-[var(--nova-card)]">
        <div>
          <h3 className="font-semibold text-sm text-zinc-100 group-hover:text-white line-clamp-1 transition-colors">
            {title}
          </h3>
          {settings.showDescriptions && media.overview && (
            <p className="text-[11px] text-zinc-400 line-clamp-1 mt-1 font-normal opacity-70">
              {media.overview}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 font-medium">
          <span>{settings.showYears ? (releaseYear || '—') : ''}</span>
          <span className="group-hover:text-[var(--nova-accent)] group-hover:translate-x-0.5 transition-all duration-200 text-[11px] uppercase tracking-wider font-medium text-zinc-500">
            Details →
          </span>
        </div>
      </div>
    </motion.div>
  );
};
