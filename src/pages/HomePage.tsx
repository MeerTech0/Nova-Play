import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HeroBanner } from '../components/media/HeroBanner';
import { Section } from '../components/layout/Section';
import { MovieCard } from '../components/media/MovieCard';
import { GenreCard } from '../components/media/GenreCard';
import { HeroSkeleton, SectionSkeleton } from '../components/feedback/SkeletonLoaders';
import { GlobalError } from '../components/feedback/GlobalError';
import { tmdbService } from '../services/tmdb';
import { Movie, TVShow, MediaItem, Genre } from '../types/media';
import { Sparkles, Database } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [hero, setHero] = useState<MediaItem | null>(null);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTV, setPopularTV] = useState<TVShow[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        heroData,
        trendingData,
        moviesData,
        tvData,
        topMoviesData,
        topTVData,
        genresData,
      ] = await Promise.all([
        tmdbService.getHeroItem(),
        tmdbService.getTrending('week'),
        tmdbService.getPopularMovies(),
        tmdbService.getPopularTV(),
        tmdbService.getTopRatedMovies(),
        tmdbService.getTopRatedTV(),
        tmdbService.getGenres(),
      ]);

      setHero(heroData);
      setTrending(trendingData);
      setPopularMovies(moviesData);
      setPopularTV(tvData);
      setTopRatedMovies(topMoviesData);
      setTopRatedTV(topTVData);
      setGenres(genresData);
    } catch (err: any) {
      console.error('Failed to load home page content:', err);
      setError(
        err?.message || 'We were unable to connect to TMDB. Please check your network or API key.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  // Show Skeleton Loaders while TMDB requests are running
  if (loading) {
    return (
      <div className="min-h-screen">
        <HeroSkeleton />
        <div className="relative -mt-10 sm:-mt-16 z-20 space-y-4">
          <SectionSkeleton titleWidth="w-48" />
          <SectionSkeleton titleWidth="w-56" />
          <SectionSkeleton titleWidth="w-52" />
          <SectionSkeleton titleWidth="w-60" />
        </div>
      </div>
    );
  }

  // Graceful Error State with Retry Button (does not crash page)
  if (error || !hero) {
    return (
      <div className="pt-24 sm:pt-28 pb-20">
        <GlobalError
          title="Catalogue Offline or Rate Limited"
          message={error || 'Unable to load real-time media catalogue from TMDB.'}
          onRetry={loadHomeData}
          showHomeButton={false}
        />
      </div>
    );
  }

  const isLive = tmdbService.isConfigured();

  return (
    <div className="min-h-screen">
      {/* TMDB Integration Status Bar (Discreet, Premium) */}
      <div className="bg-[#0D0F14] border-b border-white/[0.04] py-1.5 px-4 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-400 animate-pulse' : 'bg-[var(--nova-accent)]'
              }`}
            />
            <span className="font-medium text-zinc-300">
              {isLive ? 'Live TMDB API Active' : 'TMDB Integration Ready'}
            </span>
            <span className="text-zinc-500 hidden sm:inline">
              — {isLive ? 'Connected to api.themoviedb.org' : 'Set VITE_TMDB_API_KEY in .env to activate live requests'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
              <Database className="w-3 h-3 text-zinc-500" />
              <span>TMDB v3 API</span>
            </span>
          </div>
        </div>
      </div>

      {/* 1. Hero Section */}
      <HeroBanner media={hero} genresList={genres} />

      <div className="relative -mt-10 sm:-mt-16 z-20 space-y-2">
        {/* 2. Trending Section */}
        <Section
          title="Trending Now"
          subtitle="The most popular movies and television titles trending worldwide this week"
          action={{ label: 'Explore', href: '/movies' }}
          layout="carousel"
        >
          {trending.map((item) => (
            <div key={`trending-${item.id}`} className="flex-none w-[170px] sm:w-[200px] md:w-[220px]">
              <MovieCard media={item} />
            </div>
          ))}
        </Section>

        {/* 3. Popular Movies */}
        <Section
          title="Popular Movies"
          subtitle="Box office sensations and current theatrical favorites"
          action={{ label: 'View All Movies', href: '/movies' }}
          layout="carousel"
        >
          {popularMovies.map((movie) => (
            <div key={`pop-movie-${movie.id}`} className="flex-none w-[170px] sm:w-[200px] md:w-[220px]">
              <MovieCard media={movie} mediaTypeOverride="movie" />
            </div>
          ))}
        </Section>

        {/* 4. Popular TV Shows */}
        <Section
          title="Popular TV Shows"
          subtitle="Compelling episodic storytelling and trending series"
          action={{ label: 'View All TV', href: '/tv' }}
          layout="carousel"
        >
          {popularTV.map((show) => (
            <div key={`pop-tv-${show.id}`} className="flex-none w-[170px] sm:w-[200px] md:w-[220px]">
              <MovieCard media={show} mediaTypeOverride="tv" />
            </div>
          ))}
        </Section>

        {/* 5. Top Rated Movies */}
        <Section
          title="Top Rated Movies"
          subtitle="Critically acclaimed cinematic masterpieces with top community ratings"
          action={{ label: 'All Top Rated', href: '/movies' }}
          layout="carousel"
        >
          {topRatedMovies.map((movie) => (
            <div key={`top-movie-${movie.id}`} className="flex-none w-[170px] sm:w-[200px] md:w-[220px]">
              <MovieCard media={movie} mediaTypeOverride="movie" />
            </div>
          ))}
        </Section>

        {/* 6. Top Rated TV Shows */}
        <Section
          title="Top Rated TV Shows"
          subtitle="All-time highest-rated series, anthologies, and limited seasons"
          action={{ label: 'All Top TV', href: '/tv' }}
          layout="carousel"
        >
          {topRatedTV.map((show) => (
            <div key={`top-tv-${show.id}`} className="flex-none w-[170px] sm:w-[200px] md:w-[220px]">
              <MovieCard media={show} mediaTypeOverride="tv" />
            </div>
          ))}
        </Section>

        {/* 7. Curated Genres */}
        <Section
          title="Curated Genres"
          subtitle="Explore titles categorized by genre, tone, and cinematic universe"
          action={{ label: 'All Genres', href: '/genres' }}
          layout="carousel"
        >
          {genres.map((genre) => (
            <GenreCard key={`genre-${genre.id}`} genre={genre} />
          ))}
        </Section>

        {/* Architectural Callout Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#111319] via-[#161922] to-[#111319] border border-white/[0.08] relative overflow-hidden"
          >
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--nova-accent)]/10 text-[var(--nova-accent)] text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Connected to Official TMDB API</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
                Live Cinema & Television Discovery
              </h3>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                Powered by The Movie Database. Discover millions of titles, cast biographies, trailers, and release metrics in high-fidelity dark cinematic mode.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
