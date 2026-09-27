import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';
import { MovieCard } from '../components/media/MovieCard';
import { GlobalLoading } from '../components/feedback/GlobalLoading';
import { tmdbService } from '../services/tmdb';
import { Genre, MediaItem } from '../types/media';

export const GenresPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initGenres = async () => {
      try {
        const genreList = await tmdbService.getGenres();
        setGenres(genreList);

        const paramGenre = searchParams.get('genre');
        const initialId = paramGenre ? Number(paramGenre) : genreList[0]?.id || 28;
        setSelectedGenreId(initialId);

        const trending = await tmdbService.getTrending();
        setItems(trending);
      } catch (err) {
        console.error('Error fetching genres:', err);
      } finally {
        setLoading(false);
      }
    };

    initGenres();
  }, [searchParams]);

  const handleSelectGenre = (genreId: number) => {
    setSelectedGenreId(genreId);
    setSearchParams({ genre: String(genreId) });
  };

  const selectedGenre = genres.find((g) => g.id === selectedGenreId);

  const displayedItems = React.useMemo(() => {
    if (!selectedGenreId) return items;
    const filtered = items.filter((item) =>
      item.genre_ids?.includes(selectedGenreId) ||
      item.genres?.some((g) => g.id === selectedGenreId)
    );
    return filtered.length > 0 ? filtered : items;
  }, [items, selectedGenreId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16"
    >
      {/* Page Header */}
      <div className="border-b border-white/[0.06] pb-6 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[var(--nova-accent)]">
            <Compass className="w-5 h-5" />
          </span>
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Categories</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Genres & Curations
        </h1>
        <p className="mt-1 text-sm text-zinc-400 max-w-xl">
          Browse by tone, cinematic tradition, and thematic universe.
        </p>

        {/* Genre Pill Selector */}
        <div className="flex flex-wrap gap-2 pt-6">
          {genres.map((g) => {
            const isSelected = selectedGenreId === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => handleSelectGenre(g.id)}
                data-cursor="button"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[var(--nova-accent)] text-zinc-950 font-semibold border-[var(--nova-accent)] shadow-md'
                    : 'bg-[#111319] text-zinc-400 border-white/[0.06] hover:text-white hover:border-white/[0.15]'
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Genre Banner */}
      {selectedGenre && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--nova-accent)]" />
            <h2 className="text-lg font-semibold text-white">
              {selectedGenre.name} Showcase
            </h2>
          </div>
          <span className="text-xs text-zinc-500">
            {items.length} titles available
          </span>
        </div>
      )}

      {/* Grid Content */}
      {loading ? (
        <GlobalLoading fullScreen={false} message="Loading genre catalog..." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {displayedItems.map((item) => (
            <MovieCard key={item.id} media={item} />
          ))}
        </div>
      )}
    </motion.div>
  );
};
