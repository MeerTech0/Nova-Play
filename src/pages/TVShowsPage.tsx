import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tv } from 'lucide-react';
import { MovieCard } from '../components/media/MovieCard';
import { MovieCardSkeleton } from '../components/feedback/SkeletonLoaders';
import { GlobalError } from '../components/feedback/GlobalError';
import { tmdbService } from '../services/tmdb';
import { TVShow } from '../types/media';

type FilterTab = 'popular' | 'top_rated' | 'trending';

export const TVShowsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>('popular');
  const [shows, setShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShows = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'popular') {
        const data = await tmdbService.getPopularTV();
        setShows(data);
      } else if (activeTab === 'top_rated') {
        const data = await tmdbService.getTopRatedTV();
        setShows(data);
      } else {
        const data = await tmdbService.getTrending('week');
        setShows(data.filter((item) => item.media_type === 'tv' || 'name' in item) as TVShow[]);
      }
    } catch (err: any) {
      console.error('Failed to load TV shows:', err);
      setError(err?.message || 'Could not retrieve TV shows.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[var(--nova-accent)]">
              <Tv className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Television</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            TV Shows
          </h1>
          <p className="mt-1 text-sm text-zinc-400 max-w-xl">
            Prestige serials, mini-series, and global television phenomena.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center bg-[#111319] p-1 rounded-xl border border-white/[0.06]">
          {(
            [
              { id: 'popular', label: 'Popular' },
              { id: 'top_rated', label: 'Top Rated' },
              { id: 'trending', label: 'Trending' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-cursor="button"
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white/[0.1] text-white shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 15 }).map((_, i) => (
            <MovieCardSkeleton key={`skel-tv-${i}`} />
          ))}
        </div>
      ) : error ? (
        <GlobalError
          title="Error Loading TV Shows"
          message={error}
          onRetry={fetchShows}
          showHomeButton={false}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {shows.map((show) => (
            <MovieCard key={show.id} media={show} mediaTypeOverride="tv" />
          ))}
        </div>
      )}
    </motion.div>
  );
};

