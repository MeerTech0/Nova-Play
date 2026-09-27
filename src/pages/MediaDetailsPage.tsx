import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Star,
  Calendar,
  Clock,
  Film,
  Tv,
  ArrowLeft,
  BookmarkPlus,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  Award,
} from 'lucide-react';
import { tmdbService, getBackdropUrl, getPosterUrl, getProfileUrl } from '../services/tmdb';
import { MediaDetails, CastMember, CrewMember, MediaItem } from '../types/media';
import { MovieCard } from '../components/media/MovieCard';
import { GlobalLoading } from '../components/feedback/GlobalLoading';
import { GlobalError } from '../components/feedback/GlobalError';

// Language code to human readable name map
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ja: 'Japanese',
  ko: 'Korean',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  zh: 'Chinese',
  hi: 'Hindi',
  pt: 'Portuguese',
  ru: 'Russian',
  ar: 'Arabic',
  sv: 'Swedish',
  no: 'Norwegian',
  da: 'Danish',
};

export const MediaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const isMovie = location.pathname.startsWith('/movie');
  const type: 'movie' | 'tv' = isMovie ? 'movie' : 'tv';

  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const castScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check watchlist saved state in localStorage
  useEffect(() => {
    if (!id) return;
    try {
      const savedList = JSON.parse(localStorage.getItem('novaplay_watchlist') || '[]');
      setIsSaved(savedList.some((item: any) => String(item.id) === String(id) && item.type === type));
    } catch {
      // Ignore localStorage errors
    }
  }, [id, type]);

  // Load Title Details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = isMovie
          ? await tmdbService.getMovieDetails(id)
          : await tmdbService.getTVDetails(id);
        setDetails(data);
      } catch (err: any) {
        console.error('Failed to load media details:', err);
        setError(err?.message || 'Could not retrieve details for this title from TMDB.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, isMovie]);

  // Cast horizontal scroll indicators
  const checkCastScroll = () => {
    const el = castScrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 20);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
    }
  };

  useEffect(() => {
    checkCastScroll();
    const el = castScrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkCastScroll, { passive: true });
      window.addEventListener('resize', checkCastScroll);
      return () => {
        el.removeEventListener('scroll', checkCastScroll);
        window.removeEventListener('resize', checkCastScroll);
      };
    }
  }, [details]);

  const handleCastScroll = (direction: 'left' | 'right') => {
    const el = castScrollRef.current;
    if (el) {
      const distance = el.clientWidth * 0.7;
      el.scrollBy({
        left: direction === 'left' ? -distance : distance,
        behavior: 'smooth',
      });
    }
  };

  // Toggle watchlist item
  const handleToggleWatchlist = () => {
    if (!details) return;
    try {
      const savedList = JSON.parse(localStorage.getItem('novaplay_watchlist') || '[]');
      let updated;
      if (isSaved) {
        updated = savedList.filter((item: any) => !(String(item.id) === String(details.id) && item.type === type));
        setIsSaved(false);
      } else {
        const title = details.title || (details as any).name;
        updated = [
          ...savedList,
          {
            id: details.id,
            type,
            title,
            poster_path: details.poster_path,
            vote_average: details.vote_average,
            addedAt: new Date().toISOString(),
          },
        ];
        setIsSaved(true);
      }
      localStorage.setItem('novaplay_watchlist', JSON.stringify(updated));
    } catch {
      setIsSaved(!isSaved);
    }
  };

  // Share URL handler
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Selected Crew Filtering: Directors, Writers, Producers
  const { directors, writers, producers } = useMemo(() => {
    const crew: CrewMember[] = details?.credits?.crew || [];

    const dirs: CrewMember[] = [];
    const wrs: CrewMember[] = [];
    const prods: CrewMember[] = [];

    const seenDirs = new Set<string>();
    const seenWrs = new Set<string>();
    const seenProds = new Set<string>();

    crew.forEach((c) => {
      const job = c.job?.toLowerCase() || '';
      const dept = c.department?.toLowerCase() || '';

      // Director
      if ((job === 'director' || job === 'series director') && !seenDirs.has(c.name)) {
        seenDirs.add(c.name);
        dirs.push(c);
      }
      // Writers
      else if (
        (job === 'screenplay' || job === 'writer' || job === 'story' || dept === 'writing') &&
        !seenWrs.has(c.name)
      ) {
        seenWrs.add(c.name);
        wrs.push(c);
      }
      // Producers
      else if (
        (job === 'producer' || job === 'executive producer') &&
        !seenProds.has(c.name) &&
        prods.length < 4
      ) {
        seenProds.add(c.name);
        prods.push(c);
      }
    });

    return {
      directors: dirs.slice(0, 3),
      writers: wrs.slice(0, 4),
      producers: prods.slice(0, 4),
    };
  }, [details]);

  // Sorted Relevant Cast Members (sorted by order asc, top 16)
  const sortedCast: CastMember[] = useMemo(() => {
    const rawCast = details?.credits?.cast || [];
    return [...rawCast]
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .slice(0, 16);
  }, [details]);

  // Similar or Recommended Titles
  const similarTitles: MediaItem[] = useMemo(() => {
    const fromRecs = details?.recommendations?.results || [];
    const fromSim = details?.similar?.results || [];
    const merged = [...fromRecs, ...fromSim];

    // Deduplicate by id
    const map = new Map<number, MediaItem>();
    merged.forEach((item) => {
      if (item && item.id && item.id !== details?.id && !map.has(item.id)) {
        map.set(item.id, item);
      }
    });

    return Array.from(map.values()).slice(0, 10);
  }, [details]);

  if (loading) {
    return <GlobalLoading message="Retrieving TMDB filmography..." />;
  }

  if (error || !details) {
    return (
      <div className="pt-24 sm:pt-28 pb-20">
        <GlobalError
          title="Title Not Found"
          message={error || 'Unable to retrieve details from TMDB.'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const title = details.title || (details as any).name || 'Untitled';
  const originalTitle = details.original_title || (details as any).original_name;
  const showOriginalTitle = originalTitle && originalTitle.trim() !== title.trim();

  // Format dates
  const dateStr = details.release_date || (details as any).first_air_date;
  const fullReleaseDate = dateStr
    ? new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
  const releaseYear = dateStr ? new Date(dateStr).getFullYear() || dateStr.slice(0, 4) : '';

  // Ratings & Metrics
  const rating = details.vote_average && details.vote_average > 0 ? details.vote_average.toFixed(1) : 'NR';
  const voteCountFormatted = details.vote_count ? details.vote_count.toLocaleString() : null;

  // Language resolution
  const langCode = details.original_language || 'en';
  const languageName =
    details.spoken_languages?.find((l) => l.iso_639_1 === langCode)?.english_name ||
    LANGUAGE_NAMES[langCode] ||
    langCode.toUpperCase();

  // Runtime / Seasons
  const movieRuntime = details.runtime && details.runtime > 0
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : null;

  const tvSeasonInfo = details.number_of_seasons
    ? `${details.number_of_seasons} ${details.number_of_seasons === 1 ? 'Season' : 'Seasons'}`
    : null;
  const tvEpisodeInfo = details.number_of_episodes
    ? `${details.number_of_episodes} Episodes`
    : null;

  const backdropUrl = getBackdropUrl(details.backdrop_path, 'original');
  const posterUrl = getPosterUrl(details.poster_path, 'w780');
  const watchUrl = `/watch/${type}/${details.id}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#08090C] text-[#F8FAFC] pb-24 selection:bg-[var(--nova-accent)]/20 selection:text-[var(--nova-accent)]"
    >
      {/* 1. DETAIL HERO BACKDROP */}
      <div className="relative w-full h-[65vh] sm:h-[75vh] lg:h-[82vh] min-h-[480px] max-h-[860px] overflow-hidden bg-[#08090C]">
        {/* Full-width backdrop image */}
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover object-top filter brightness-[0.5] contrast-[1.05]"
        />

        {/* Sophisticated dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/65 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090C] via-[#08090C]/80 to-transparent sm:w-2/3 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#08090C]/30 to-[#08090C]/85 pointer-events-none" />

        {/* Floating Top Back Button */}
        <div className="absolute top-20 sm:top-24 left-4 sm:left-8 z-30">
          <button
            type="button"
            onClick={() => navigate(-1)}
            data-cursor="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white border border-white/10 backdrop-blur-md text-xs font-medium transition-all shadow-lg focus:outline-none focus:ring-1 focus:ring-[var(--nova-accent)]/50"
            aria-label="Navigate back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* 2. HERO CONTENT CONTAINER (Poster + Metadata + CTAs) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-52 sm:-mt-64 lg:-mt-80 relative z-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start">
          {/* POSTER CARD (Rounded corners, glass frame, reveal animation) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-none w-56 sm:w-72 lg:w-80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#111319] relative group select-none"
          >
            <div className="aspect-[2/3] w-full overflow-hidden bg-[#161922]">
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />
            </div>
            {/* Soft inner vignette */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
          </motion.div>

          {/* INFORMATION REVEAL COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full space-y-5"
          >
            {/* Meta Row: Type, Age Rating, Rating, Year, Duration, Language */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
              {/* Media Type */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.08] text-zinc-200 font-medium border border-white/[0.06]">
                {type === 'movie' ? <Film className="w-3.5 h-3.5 text-zinc-400" /> : <Tv className="w-3.5 h-3.5 text-zinc-400" />}
                <span className="capitalize">{type === 'movie' ? 'Movie' : 'TV Series'}</span>
              </span>

              {/* Age Certification */}
              {details.certification && (
                <span className="inline-flex items-center px-2 py-0.5 rounded border border-white/20 bg-black/50 text-[11px] font-semibold text-zinc-200 uppercase tracking-wider">
                  {details.certification}
                </span>
              )}

              {/* Star Rating */}
              {rating !== 'NR' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--nova-accent)]/10 border border-[var(--nova-accent)]/30 text-[var(--nova-accent)] font-semibold">
                  <Star className="w-3.5 h-3.5 fill-[var(--nova-accent)]" />
                  <span>{rating}</span>
                  {voteCountFormatted && (
                    <span className="text-zinc-500 font-normal hidden sm:inline">({voteCountFormatted})</span>
                  )}
                </span>
              )}

              {/* Release Year */}
              {releaseYear && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{releaseYear}</span>
                </span>
              )}

              {/* Movie Runtime */}
              {movieRuntime && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{movieRuntime}</span>
                </span>
              )}

              {/* TV Seasons & Episodes */}
              {tvSeasonInfo && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{tvSeasonInfo}</span>
                  {tvEpisodeInfo && <span className="text-zinc-500">• {tvEpisodeInfo}</span>}
                </span>
              )}

              {/* Original Language */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-400">
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
                <span>{languageName}</span>
              </span>
            </div>

            {/* Title & Original Title */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-display leading-tight sm:leading-none">
                {title}
              </h1>

              {/* Original Title when different */}
              {showOriginalTitle && (
                <p className="mt-2 text-sm sm:text-base text-zinc-400 font-normal">
                  <span className="text-zinc-500 text-xs uppercase tracking-wider mr-1.5 font-mono">Original Title:</span>
                  <span className="text-zinc-300 italic">{originalTitle}</span>
                </p>
              )}

              {/* Tagline */}
              {details.tagline && (
                <p className="mt-2 text-base sm:text-lg italic text-[var(--nova-accent)]/85 font-light">
                  "{details.tagline}"
                </p>
              )}
            </div>

            {/* ELEGANT CLICKABLE GENRE TAGS */}
            {details.genres && details.genres.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {details.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/genres?genre=${genre.id}`}
                    data-cursor="hover"
                    className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-[var(--nova-accent)]/40 text-xs font-medium text-zinc-300 hover:text-[var(--nova-accent)] transition-all duration-200"
                  >
                    <span>{genre.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* ACTION BUTTONS (Full width on mobile) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {/* Watch Now Button */}
              <button
                type="button"
                data-magnetic="true"
                data-cursor="button"
                onClick={() =>
                  navigate(watchUrl, {
                    state: {
                      title,
                      overview: details.overview,
                      backdrop_path: details.backdrop_path,
                      poster_path: details.poster_path,
                    },
                  })
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition-all duration-200 shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#08090C] focus:ring-white"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Now</span>
              </button>

              {/* Add to List Button */}
              <button
                type="button"
                data-cursor="button"
                onClick={handleToggleWatchlist}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium border backdrop-blur-md transition-all duration-200 active:scale-95 ${
                  isSaved
                    ? 'bg-[var(--nova-accent)]/15 border-[var(--nova-accent)] text-[var(--nova-accent)]'
                    : 'bg-white/[0.08] hover:bg-white/[0.14] border-white/[0.12] text-zinc-200 hover:text-white'
                }`}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                <span>{isSaved ? 'In Your List' : 'Add to List'}</span>
              </button>

              {/* Share Button */}
              <button
                type="button"
                data-cursor="button"
                onClick={handleShare}
                className="w-full sm:w-auto inline-flex items-center justify-center p-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                aria-label="Share this title"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* SYNOPSIS & OVERVIEW */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Overview
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                {details.overview || 'No synopsis provided for this title.'}
              </p>
              {fullReleaseDate && (
                <p className="text-xs text-zinc-500 pt-1">
                  Theatrical Premiere: <span className="text-zinc-400">{fullReleaseDate}</span>
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* 3. SELECTED CREW HIGHLIGHTS */}
        {(directors.length > 0 || writers.length > 0 || producers.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 pt-8 border-t border-white/[0.06]"
          >
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-4 h-4 text-[var(--nova-accent)]" />
              <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                Key Creative Crew
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Director(s) */}
              {directors.length > 0 && (
                <div className="p-4 rounded-xl bg-[#111319] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--nova-accent)]">
                      {directors.length === 1 ? 'Director' : 'Directors'}
                    </p>
                    <p className="text-sm font-medium text-white mt-0.5">
                      {directors.map((d) => d.name).join(', ')}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">Direction</span>
                </div>
              )}

              {/* Writer(s) */}
              {writers.length > 0 && (
                <div className="p-4 rounded-xl bg-[#111319] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--nova-accent)]">
                      {writers.length === 1 ? 'Screenplay / Writer' : 'Writers'}
                    </p>
                    <p className="text-sm font-medium text-white mt-0.5 line-clamp-1">
                      {writers.map((w) => w.name).join(', ')}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">Writing</span>
                </div>
              )}

              {/* Producer(s) */}
              {producers.length > 0 && (
                <div className="p-4 rounded-xl bg-[#111319] border border-white/[0.06] flex items-center justify-between sm:col-span-2 lg:col-span-1">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--nova-accent)]">
                      Executive Producers
                    </p>
                    <p className="text-sm font-medium text-white mt-0.5 line-clamp-1">
                      {producers.map((p) => p.name).join(', ')}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">Production</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 4. HORIZONTAL CAST SECTION */}
        {sortedCast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 pt-8 border-t border-white/[0.06]"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Principal Cast
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                  Top billed actors and recurring performers
                </p>
              </div>

              {/* Carousel navigation controls (Desktop) */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  data-cursor="button"
                  onClick={() => handleCastScroll('left')}
                  disabled={!canScrollLeft}
                  aria-label="Scroll cast left"
                  className={`p-2 rounded-full border border-white/10 transition-all ${
                    canScrollLeft
                      ? 'bg-white/[0.06] text-white hover:bg-white/[0.12] active:scale-95'
                      : 'text-zinc-600 bg-transparent border-white/[0.03] cursor-not-allowed opacity-40'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  data-cursor="button"
                  onClick={() => handleCastScroll('right')}
                  disabled={!canScrollRight}
                  aria-label="Scroll cast right"
                  className={`p-2 rounded-full border border-white/10 transition-all ${
                    canScrollRight
                      ? 'bg-white/[0.06] text-white hover:bg-white/[0.12] active:scale-95'
                      : 'text-zinc-600 bg-transparent border-white/[0.03] cursor-not-allowed opacity-40'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Cast Carousel */}
            <div
              ref={castScrollRef}
              className="flex gap-4 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scrollbar-none scroll-smooth snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {sortedCast.map((actor, idx) => {
                const profileImg = getProfileUrl(actor.profile_path, 'w185');

                return (
                  <motion.div
                    key={`cast-${actor.id}-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.03 }}
                    className="flex-none w-[135px] sm:w-[155px] snap-start"
                  >
                    <div className="group rounded-2xl bg-[#111319] border border-white/[0.06] hover:border-white/[0.16] p-3 text-center transition-all duration-300 shadow-card hover:shadow-card-hover h-full flex flex-col items-center">
                      {/* Avatar Profile */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-[#161922] mb-3 border border-white/10 group-hover:border-[var(--nova-accent)]/40 transition-colors shadow-md">
                        <img
                          src={profileImg}
                          alt={actor.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                        />
                      </div>

                      {/* Name */}
                      <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-1 group-hover:text-[var(--nova-accent)] transition-colors">
                        {actor.name}
                      </h3>

                      {/* Character */}
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-tight">
                        {actor.character || 'Self'}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 5. "MORE LIKE THIS" SIMILAR & RECOMMENDED TITLES */}
        {similarTitles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 pt-8 border-t border-white/[0.06]"
          >
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                More Like This
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Recommended titles matching tone, theme, and cinematic universe
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {similarTitles.map((item) => (
                <MovieCard key={`similar-${item.id}`} media={item} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
