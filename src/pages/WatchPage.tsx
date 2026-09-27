import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Tv,
  Film,
  Play,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Info,
  Calendar,
  Clock,
  Sparkles,
  Server,
  Globe,
  Copy,
  Check,
  ExternalLink,
  RotateCw,
  Code2,
  Loader2,
} from 'lucide-react';
import { tmdbService, getBackdropUrl } from '../services/tmdb';
import { MediaDetails, MediaItem } from '../types/media';
import {
  videoProvider,
  VideoSource,
  SubtitleTrack,
  AudioTrackOption,
  TVSeason,
  TVEpisode,
  getScreenscapeEmbedUrl,
  STREAM_SERVERS,
  STREAM_LANGUAGES,
} from '../services/videoProvider';
import { VideoPlayer } from '../components/player/VideoPlayer';
import { MovieCard } from '../components/media/MovieCard';

export const WatchPage: React.FC = () => {
  const { type = 'movie', id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const passedState = (location.state as any) || {};

  const isTV = type === 'tv';

  const [details, setDetails] = useState<MediaDetails | null>(() => {
    if (passedState.title) {
      return {
        id: Number(id) || 1,
        title: passedState.title,
        overview: passedState.overview || '',
        backdrop_path: passedState.backdrop_path || null,
        poster_path: passedState.poster_path || null,
        media_type: type,
      } as MediaDetails;
    }
    return null;
  });
  const [loading, setLoading] = useState(!details);
  const [error, setError] = useState<string | null>(null);

  // Streaming Server selection (Default to the user's requested ScreenScape Nxsha source)
  const [selectedServer, setSelectedServer] = useState<'screenscape' | 'screenscape-primary' | 'screenscape-flix' | 'native'>('screenscape');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [copiedDirect, setCopiedDirect] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [iframeReloadKey, setIframeReloadKey] = useState(0);

  // Video playback data resolved via provider abstraction
  const [sources, setSources] = useState<VideoSource[]>([]);
  const [subtitles, setSubtitles] = useState<SubtitleTrack[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrackOption[]>([]);

  // TV Shows: Seasons & Episodes state
  const [seasons, setSeasons] = useState<TVSeason[]>(() => {
    return isTV ? videoProvider.generateTVSeasons(3, passedState.title || `Series #${id}`) : [];
  });
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(1);
  const [selectedEpisodeNumber, setSelectedEpisodeNumber] = useState(1);

  // Autoplay setting (from localStorage, default false unless enabled)
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(() => {
    try {
      return localStorage.getItem('novaplay_autoplay_next') === 'true';
    } catch {
      return false;
    }
  });

  // Track episode watch progress in localStorage
  const [episodeProgressMap, setEpisodeProgressMap] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('novaplay_episode_progress') || '{}');
    } catch {
      return {};
    }
  });

  // Toggle Autoplay
  const handleToggleAutoplay = () => {
    const nextVal = !autoPlayNext;
    setAutoPlayNext(nextVal);
    try {
      localStorage.setItem('novaplay_autoplay_next', String(nextVal));
    } catch {
      // Ignore localStorage errors
    }
  };

  // Load Title Metadata
  useEffect(() => {
    let isMounted = true;
    const fetchMedia = async () => {
      if (!id || !type) return;
      setError(null);
      try {
        const data = await tmdbService.getDetails(id, type);
        if (!isMounted) return;
        setDetails(data);

        if (type === 'tv') {
          const generatedSeasons = videoProvider.generateTVSeasons(
            data.number_of_seasons || 3,
            data.title
          );
          setSeasons(generatedSeasons);
        }
      } catch (err: any) {
        console.warn('Metadata fetch warning for watch stage:', err);
        if (!isMounted) return;
        if (!details) {
          setDetails({
            id: Number(id) || 1,
            title: isTV ? `TV Series #${id}` : `Movie #${id}`,
            overview: 'Now streaming in high definition. Enjoy the presentation.',
            media_type: type,
          } as MediaDetails);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMedia();
    return () => {
      isMounted = false;
    };
  }, [id, type]);

  // Resolve Video Sources, Subtitles, and Audio Tracks from provider abstraction
  useEffect(() => {
    const resolveMediaStreams = async () => {
      if (!id || !type) return;
      try {
        const [resolvedSources, resolvedSubs, resolvedAuds] = await Promise.all([
          videoProvider.resolveSources(id, type, selectedSeasonNumber, selectedEpisodeNumber),
          videoProvider.resolveSubtitles(id, type),
          videoProvider.resolveAudioTracks(id, type),
        ]);

        setSources(resolvedSources);
        setSubtitles(resolvedSubs);
        setAudioTracks(resolvedAuds);
      } catch (err) {
        console.error('Failed to resolve streams from video provider:', err);
      }
    };

    resolveMediaStreams();
  }, [id, type, selectedSeasonNumber, selectedEpisodeNumber]);

  // Current Season and Episodes list
  const currentSeason = useMemo(() => {
    return seasons.find((s) => s.seasonNumber === selectedSeasonNumber) || seasons[0];
  }, [seasons, selectedSeasonNumber]);

  const currentEpisode: TVEpisode | undefined = useMemo(() => {
    if (!currentSeason) return undefined;
    return (
      currentSeason.episodes.find((e) => e.episodeNumber === selectedEpisodeNumber) ||
      currentSeason.episodes[0]
    );
  }, [currentSeason, selectedEpisodeNumber]);

  // Previous & Next Episode Navigation
  const hasPreviousEpisode = isTV && (selectedEpisodeNumber > 1 || selectedSeasonNumber > 1);
  const hasNextEpisode =
    isTV &&
    Boolean(
      currentSeason &&
        (selectedEpisodeNumber < currentSeason.episodes.length ||
          selectedSeasonNumber < seasons.length)
    );

  const handlePreviousEpisode = () => {
    if (selectedEpisodeNumber > 1) {
      setSelectedEpisodeNumber(selectedEpisodeNumber - 1);
    } else if (selectedSeasonNumber > 1) {
      const prevSeasonNum = selectedSeasonNumber - 1;
      const prevSeason = seasons.find((s) => s.seasonNumber === prevSeasonNum);
      setSelectedSeasonNumber(prevSeasonNum);
      setSelectedEpisodeNumber(prevSeason?.episodes.length || 1);
    }
  };

  const handleNextEpisode = () => {
    if (currentSeason && selectedEpisodeNumber < currentSeason.episodes.length) {
      setSelectedEpisodeNumber(selectedEpisodeNumber + 1);
    } else if (selectedSeasonNumber < seasons.length) {
      setSelectedSeasonNumber(selectedSeasonNumber + 1);
      setSelectedEpisodeNumber(1);
    }
  };

  // Mark episode finished / progress
  const handleEpisodeEnded = () => {
    if (isTV && id) {
      const key = `${id}-s${selectedSeasonNumber}-e${selectedEpisodeNumber}`;
      const updated = { ...episodeProgressMap, [key]: 100 };
      setEpisodeProgressMap(updated);
      try {
        localStorage.setItem('novaplay_episode_progress', JSON.stringify(updated));
      } catch {
        // Ignore
      }
    }
  };

  const title = details?.title || (details as any)?.name || passedState.title || (isTV ? `Series #${id}` : `Movie #${id}`);
  const backdropUrl = details?.backdrop_path ? getBackdropUrl(details.backdrop_path, 'original') : '';
  const detailsUrl = `/${type}/${id}`;
  const overview = details?.overview || passedState.overview || 'Now streaming in cinema mode. Enjoy your feature presentation.';

  const currentEpisodeSubtitle = isTV
    ? `Season ${selectedSeasonNumber} • Episode ${selectedEpisodeNumber}: ${currentEpisode?.title || ''}`
    : undefined;

  // ScreenScape Direct & Embed URL matching the user's requested playground
  const screenscapeEmbedUrl = useMemo(() => {
    if (!id) return '';
    const hostMap: Record<string, 'nxsha' | 'primary' | 'flix'> = {
      'screenscape': 'nxsha',
      'screenscape-primary': 'primary',
      'screenscape-flix': 'flix',
    };
    const host = hostMap[selectedServer] || 'nxsha';
    return getScreenscapeEmbedUrl(
      id,
      type,
      selectedSeasonNumber,
      selectedEpisodeNumber,
      selectedLanguage,
      host
    );
  }, [id, type, selectedSeasonNumber, selectedEpisodeNumber, selectedLanguage, selectedServer]);

  const htmlEmbedCode = useMemo(() => {
    return `<iframe src="${screenscapeEmbedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
  }, [screenscapeEmbedUrl]);

  const handleCopyDirect = () => {
    if (!screenscapeEmbedUrl) return;
    navigator.clipboard.writeText(screenscapeEmbedUrl);
    setCopiedDirect(true);
    setTimeout(() => setCopiedDirect(false), 2000);
  };

  const handleCopyEmbed = () => {
    if (!htmlEmbedCode) return;
    navigator.clipboard.writeText(htmlEmbedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  // Related Content
  const relatedTitles: MediaItem[] = [
    ...(details?.recommendations?.results || []),
    ...(details?.similar?.results || []),
  ].slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-[#07080A] text-white pt-20 sm:pt-24 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Context Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(detailsUrl)}
              data-cursor="button"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border border-white/10 transition-colors text-xs font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Title Details</span>
            </button>

            <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
              {type.toUpperCase()} • TMDB ID {id}
            </span>
          </div>

          {/* Autoplay Next Episode Toggle (for TV shows) */}
          {isTV && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Autoplay Next:</span>
              <button
                type="button"
                onClick={handleToggleAutoplay}
                data-cursor="button"
                className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                title={autoPlayNext ? 'Autoplay enabled' : 'Autoplay disabled'}
              >
                {autoPlayNext ? (
                  <ToggleRight className="w-6 h-6 text-[var(--nova-accent)]" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-zinc-600" />
                )}
                <span className={autoPlayNext ? 'text-[var(--nova-accent)]' : 'text-zinc-500'}>
                  {autoPlayNext ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Discreet Notice Bar if metadata fails */}
        {error && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
            <span>Notice: {error} (Streaming continues without interruption).</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-zinc-400 hover:text-white px-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stream Server & Audio Language Selection Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#111319] border border-white/[0.08] shadow-lg">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 pl-1">
              <Server className="w-3.5 h-3.5 text-[var(--nova-accent)]" />
              <span>Stream Source:</span>
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              {STREAM_SERVERS.map((server) => {
                const isActive = selectedServer === server.id;
                return (
                  <button
                    key={server.id}
                    type="button"
                    onClick={() => setSelectedServer(server.id)}
                    data-cursor="button"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[var(--nova-accent)] text-zinc-950 font-semibold shadow-md'
                        : 'bg-white/[0.05] text-zinc-300 hover:text-white hover:bg-white/[0.1] border border-white/[0.06]'
                    }`}
                  >
                    <span>{server.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                        isActive ? 'bg-black/20 text-zinc-950' : 'bg-white/10 text-zinc-400'
                      }`}
                    >
                      {server.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Preference & Quick Actions */}
          <div className="flex items-center gap-2">
            {selectedServer !== 'native' && (
              <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/[0.06]">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs text-zinc-400 hidden sm:inline">Audio:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-transparent text-xs text-white border-0 focus:ring-0 focus:outline-none cursor-pointer pr-1"
                >
                  {STREAM_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#111319] text-white">
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedServer !== 'native' && (
              <>
                <button
                  type="button"
                  onClick={() => setIframeReloadKey((k) => k + 1)}
                  data-cursor="button"
                  title="Reload Player Stream"
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <a
                  href={screenscapeEmbedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  title="Open in Fullscreen Tab"
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors inline-flex items-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </>
            )}
          </div>
        </div>

        {/* 1. CINEMATIC VIDEO PLAYER */}
        <div className="w-full">
          {selectedServer === 'native' ? (
            <VideoPlayer
              sources={sources}
              subtitles={subtitles}
              audioTracks={audioTracks}
              poster={backdropUrl}
              title={title}
              subtitle={currentEpisodeSubtitle}
              onNextEpisode={handleNextEpisode}
              onPreviousEpisode={handlePreviousEpisode}
              hasNextEpisode={hasNextEpisode}
              hasPreviousEpisode={hasPreviousEpisode}
              onEnded={handleEpisodeEnded}
              autoPlayNext={autoPlayNext}
            />
          ) : (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
              <iframe
                key={`${screenscapeEmbedUrl}-${iframeReloadKey}`}
                src={screenscapeEmbedUrl}
                title={`${title} - ${currentEpisodeSubtitle || 'ScreenScape Player'}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* ScreenScape Embed & Direct Link Details (Real-time Playground) */}
        {selectedServer !== 'native' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Direct URL Box */}
            <div className="p-4 rounded-2xl bg-[#111319] border border-white/[0.06] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--nova-accent)]" />
                  <span>DIRECT URL</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyDirect}
                  data-cursor="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--nova-accent)] text-zinc-950 text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
                >
                  {copiedDirect ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedDirect ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-zinc-400 truncate bg-black/40 p-2.5 rounded-xl border border-white/[0.04] select-all">
                {screenscapeEmbedUrl}
              </p>
            </div>

            {/* HTML Embed Box */}
            <div className="p-4 rounded-2xl bg-[#111319] border border-white/[0.06] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                  <Code2 className="w-3.5 h-3.5 text-[var(--nova-accent)]" />
                  <span>HTML EMBED</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  data-cursor="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-medium transition-all border border-white/10"
                >
                  {copiedEmbed ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmbed ? 'Copied Code' : 'Copy Embed'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-zinc-400 truncate bg-black/40 p-2.5 rounded-xl border border-white/[0.04] select-all">
                {htmlEmbedCode}
              </p>
            </div>
          </div>
        )}

        {/* 2. TITLE & OVERVIEW SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-2">
          {/* Main Title & Episode Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[var(--nova-accent)] font-semibold uppercase tracking-wider mb-1">
                {isTV ? <Tv className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                <span>{isTV ? 'Episodic Series' : 'Feature Presentation'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold font-display text-white">
                {title}
              </h1>

              {isTV && currentEpisode && (
                <p className="text-base sm:text-lg font-medium text-zinc-200 mt-1">
                  Season {selectedSeasonNumber}, Episode {selectedEpisodeNumber}: {currentEpisode.title}
                </p>
              )}
            </div>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
              {isTV && currentEpisode ? currentEpisode.overview : overview}
            </p>

            {/* Title Metadata badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-zinc-400">
              {loading && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04] text-[11px] text-zinc-400">
                  <Loader2 className="w-3 h-3 animate-spin text-[var(--nova-accent)]" />
                  <span>Syncing metadata...</span>
                </span>
              )}

              {details?.release_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{new Date(details.release_date).getFullYear()}</span>
                </span>
              )}

              {details?.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
                </span>
              )}

              {details?.genres && details.genres.length > 0 && (
                <span className="text-zinc-500">
                  {details.genres.map((g) => g.name).join(' • ')}
                </span>
              )}
            </div>
          </div>

          {/* Provider Architecture & Playback Security Notice */}
          <div className="p-5 rounded-2xl bg-[#111319] border border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2 text-zinc-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[var(--nova-accent)]" />
              <span>ScreenScape & Multi-Source Engine</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              NovaPlay integrates with the high-performance <strong>ScreenScape (Nxsha)</strong> streaming engine alongside Nova's native adaptive player. Switch seamlessly between ScreenScape HD and native cinema streams with customizable audio tracks (Hindi, English, Urdu, French, Spanish).
            </p>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04] text-[11px] text-zinc-500 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
              <span>
                Both direct URL endpoints and responsive HTML embed codes are generated in real-time for any movie or TV episode.
              </span>
            </div>
          </div>
        </div>

        {/* 3. TV SHOW SEASONS & EPISODES SELECTOR */}
        {isTV && seasons.length > 0 && (
          <div className="pt-6 border-t border-white/[0.06] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-white">Episodes</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select a season and episode to stream
                </p>
              </div>

              {/* Season Selector Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                {seasons.map((season) => (
                  <button
                    key={`season-tab-${season.seasonNumber}`}
                    type="button"
                    onClick={() => {
                      setSelectedSeasonNumber(season.seasonNumber);
                      setSelectedEpisodeNumber(1);
                    }}
                    data-cursor="button"
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      selectedSeasonNumber === season.seasonNumber
                        ? 'bg-[var(--nova-accent)] text-zinc-950 font-semibold shadow-md'
                        : 'bg-[#111319] text-zinc-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    Season {season.seasonNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Episode Grid / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSeason?.episodes.map((ep) => {
                const isCurrent = ep.episodeNumber === selectedEpisodeNumber;
                const progressKey = `${id}-s${selectedSeasonNumber}-e${ep.episodeNumber}`;
                const isFinished = (episodeProgressMap[progressKey] || 0) >= 90;

                return (
                  <div
                    key={`ep-card-${ep.id}`}
                    onClick={() => setSelectedEpisodeNumber(ep.episodeNumber)}
                    data-cursor="button"
                    className={`group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-gradient-to-r from-[#181B24] to-[#12141A] border-[var(--nova-accent)]/50 shadow-lg'
                        : 'bg-[#111319] hover:bg-[#161922] border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                            isCurrent
                              ? 'bg-[var(--nova-accent)] text-zinc-950'
                              : 'bg-white/[0.06] text-zinc-300 group-hover:bg-white/[0.1]'
                          }`}
                        >
                          {ep.episodeNumber}
                        </div>
                        <div>
                          <h3
                            className={`text-sm font-semibold transition-colors ${
                              isCurrent ? 'text-white' : 'text-zinc-200 group-hover:text-white'
                            }`}
                          >
                            {ep.title}
                          </h3>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {ep.runtime} min
                          </span>
                        </div>
                      </div>

                      {/* Finished / Current Status Icon */}
                      <div className="flex items-center gap-2">
                        {isFinished && (
                          <span className="text-emerald-400" title="Episode Watched">
                            <CheckCircle className="w-4 h-4" />
                          </span>
                        )}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                            isCurrent
                              ? 'bg-[var(--nova-accent)] text-zinc-950'
                              : 'bg-white/10 text-white group-hover:scale-110'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {ep.overview}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. RELATED CONTENT UNDERNEATH */}
        {relatedTitles.length > 0 && (
          <div className="pt-8 border-t border-white/[0.06] space-y-4">
            <h2 className="text-xl font-bold font-display text-white">More Like This</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {relatedTitles.map((item) => (
                <MovieCard key={`rel-${item.id}`} media={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
