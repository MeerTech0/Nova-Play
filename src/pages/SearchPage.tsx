import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Film, Tv, RefreshCw } from 'lucide-react';
import { MovieCard } from '../components/media/MovieCard';
import { MovieCardSkeleton } from '../components/feedback/SkeletonLoaders';
import { tmdbService } from '../services/tmdb';
import { MediaItem } from '../types/media';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv'>('all');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setSearching(false);
      setSearchError(null);
      return;
    }

    setSearching(true);
    setSearchError(null);
    try {
      const data = await tmdbService.searchMulti(searchTerm);
      setResults(data);
    } catch (err: any) {
      console.error('Search error:', err);
      setSearchError(err?.message || 'Failed to complete search query.');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const filteredResults = results.filter((item) => {
    if (filterType === 'all') return true;
    const isMovie = 'title' in item;
    return filterType === 'movie' ? isMovie : !isMovie;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 min-h-[75vh]"
    >
      {/* Search Input Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows, actors, or directors..."
            autoFocus
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#111319] border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--nova-accent)]/50 focus:ring-2 focus:ring-[var(--nova-accent)]/20 transition-all text-base shadow-lg"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              data-cursor="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Filter Bar */}
        {query && (
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs text-zinc-500 mr-1">Filter by:</span>
            {(
              [
                { id: 'all', label: 'All Results' },
                { id: 'movie', label: 'Movies', icon: Film },
                { id: 'tv', label: 'TV Shows', icon: Tv },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                data-cursor="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterType === filter.id
                    ? 'bg-white/[0.1] text-white border border-white/[0.1]'
                    : 'text-zinc-400 hover:text-white bg-transparent'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results or Empty State */}
      {query ? (
        <div>
          <div className="flex items-center justify-between mb-6 border-b border-white/[0.06] pb-3">
            <h2 className="text-sm font-medium text-zinc-400">
              {searching
                ? `Searching TMDB for "${query}"...`
                : `Found ${filteredResults.length} title${filteredResults.length === 1 ? '' : 's'} for "${query}"`}
            </h2>
          </div>

          {searchError ? (
            <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-center max-w-lg mx-auto">
              <p className="text-sm text-red-300 mb-3">{searchError}</p>
              <button
                type="button"
                onClick={() => performSearch(query)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.1] hover:bg-white/[0.15] text-white text-xs font-medium border border-white/10 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Search</span>
              </button>
            </div>
          ) : searching ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <MovieCardSkeleton key={`search-skel-${i}`} />
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredResults.map((item) => (
                <MovieCard key={item.id} media={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-400 text-base">No titles matched your query.</p>
              <p className="text-zinc-500 text-xs mt-1">
                Try searching for titles like "Dune", "Oppenheimer", "Shōgun", or "Severance".
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Default Empty State / Suggested Searches */
        <div className="text-center py-16 sm:py-24 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-500 mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Explore the NovaPlay Universe
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
            Search across thousands of movies, television series, awards nominees, and high-definition previews.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {['Dune: Part Two', 'Shōgun', 'Interstellar', 'Succession', 'Blade Runner'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs text-zinc-300 hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
