/**
 * Video Provider Abstraction for NovaPlay
 *
 * Decouples video playback from underlying delivery mechanisms.
 * Allows legitimate streaming providers and CDN endpoints to be plugged in
 * without modifying the core player component.
 */

export interface VideoSource {
  url: string;
  type: "hls" | "mp4";
  quality?: string;
  language?: string;
  label?: string;
}

export interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  src?: string;
  default?: boolean;
}

export interface AudioTrackOption {
  id: string;
  label: string;
  language: string;
  default?: boolean;
}

export interface TVEpisode {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  overview: string;
  runtime?: number;
  stillPath?: string | null;
  sources: VideoSource[];
}

export interface TVSeason {
  seasonNumber: number;
  title: string;
  episodeCount: number;
  episodes: TVEpisode[];
}

export interface StreamServerOption {
  id: 'screenscape' | 'screenscape-primary' | 'screenscape-flix' | 'native';
  name: string;
  badge: string;
  description: string;
}

export const STREAM_SERVERS: StreamServerOption[] = [
  {
    id: 'screenscape',
    name: 'ScreenScape (Nxsha)',
    badge: 'HD Embed',
    description: 'Fast streaming server with multiple audio options & sub-second buffering',
  },
  {
    id: 'screenscape-primary',
    name: 'ScreenScape (Direct)',
    badge: 'Official',
    description: 'Official ScreenScape primary embed endpoint',
  },
  {
    id: 'screenscape-flix',
    name: 'ScreenScape (Flix)',
    badge: 'Mirror',
    description: 'Alternative high-speed ScreenScape mirror',
  },
  {
    id: 'native',
    name: 'Nova Cinema HLS',
    badge: 'Custom Player',
    description: 'Native HTML5 HLS/MP4 adaptive player with custom controls',
  },
];

export const STREAM_LANGUAGES = [
  { code: 'auto', label: 'Default / Auto' },
  { code: 'hindi', label: 'Hindi (hindi)' },
  { code: 'eng', label: 'English (eng)' },
  { code: 'urdu', label: 'Urdu (urdu)' },
  { code: 'fre', label: 'French (fre)' },
  { code: 'spa', label: 'Spanish (spa)' },
];

/**
 * Generate ScreenScape embed iframe URL
 * Matches the official ScreenScape API:
 * Movie: https://nxsha.screenscape.me/embed?tmdb=10195&type=movie
 * Series: https://nxsha.screenscape.me/embed?tmdb=1396&type=tv&s=1&e=1
 */
export function getScreenscapeEmbedUrl(
  tmdbId: string | number,
  type: 'movie' | 'tv',
  season: number = 1,
  episode: number = 1,
  language?: string,
  host: 'nxsha' | 'primary' | 'flix' = 'nxsha'
): string {
  let baseUrl = 'https://nxsha.screenscape.me/embed';
  if (host === 'primary') {
    baseUrl = 'https://screenscape.me/embed';
  } else if (host === 'flix') {
    baseUrl = 'https://flix.screenscape.me/embed';
  }

  const params = new URLSearchParams({
    tmdb: String(tmdbId),
    type: type === 'tv' ? 'tv' : 'movie',
  });

  if (type === 'tv') {
    params.set('s', String(season));
    params.set('e', String(episode));
  }

  if (language && language !== 'auto') {
    params.set('lan', language);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Standard open-access, legitimate test streams for development
 * (Public domain & open cinema: Blender Foundation HLS & MP4 masters)
 */
const PUBLIC_DEMO_SOURCES: VideoSource[] = [
  {
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    type: 'hls',
    quality: 'Auto (1080p)',
    language: 'en',
    label: 'HLS Adaptive (1080p)',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'mp4',
    quality: '1080p',
    language: 'en',
    label: 'Direct MP4 Master (1080p)',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'mp4',
    quality: '720p',
    language: 'en',
    label: 'Direct MP4 Master (720p)',
  },
];

export const DEFAULT_SUBTITLE_TRACKS: SubtitleTrack[] = [
  { id: 'off', label: 'Off', language: 'none', default: true },
  { id: 'en', label: 'English [CC]', language: 'en' },
  { id: 'hi', label: 'Hindi', language: 'hi' },
  { id: 'ur', label: 'Urdu', language: 'ur' },
  { id: 'orig', label: 'Original Audio Subtitles', language: 'orig' },
];

export const DEFAULT_AUDIO_TRACKS: AudioTrackOption[] = [
  { id: 'orig', label: 'Original [Audio]', language: 'orig', default: true },
  { id: 'en', label: 'English', language: 'en' },
  { id: 'hi', label: 'Hindi', language: 'hi' },
  { id: 'ur', label: 'Urdu', language: 'ur' },
];

/**
 * Core Video Provider Service
 */
export const videoProvider = {
  /**
   * Resolve playback sources for a Movie or TV episode
   */
  async resolveSources(
    _mediaId: string | number,
    _mediaType: 'movie' | 'tv',
    _season = 1,
    _episode = 1
  ): Promise<VideoSource[]> {
    // Returns legitimate open HLS and MP4 sources
    return PUBLIC_DEMO_SOURCES;
  },

  /**
   * Resolve subtitle tracks
   */
  async resolveSubtitles(
    _mediaId: string | number,
    _mediaType: 'movie' | 'tv'
  ): Promise<SubtitleTrack[]> {
    return DEFAULT_SUBTITLE_TRACKS;
  },

  /**
   * Resolve audio tracks
   */
  async resolveAudioTracks(
    _mediaId: string | number,
    _mediaType: 'movie' | 'tv'
  ): Promise<AudioTrackOption[]> {
    return DEFAULT_AUDIO_TRACKS;
  },

  /**
   * Generate or retrieve TV Seasons & Episodes catalogue
   */
  generateTVSeasons(numberOfSeasons = 3, showTitle = 'Series'): TVSeason[] {
    const seasons: TVSeason[] = [];

    for (let s = 1; s <= numberOfSeasons; s++) {
      const episodes: TVEpisode[] = [];
      const epCount = s === 1 ? 8 : 10;

      for (let e = 1; e <= epCount; e++) {
        episodes.push({
          id: s * 100 + e,
          seasonNumber: s,
          episodeNumber: e,
          title: `Episode ${e}: Chapter ${s}.${e}`,
          overview: `As tensions mount across the central factions in ${showTitle}, pivotal decisions test old alliances and unveil unforeseen consequences.`,
          runtime: 54 + (e % 8),
          stillPath: null,
          sources: PUBLIC_DEMO_SOURCES,
        });
      }

      seasons.push({
        seasonNumber: s,
        title: `Season ${s}`,
        episodeCount: epCount,
        episodes,
      });
    }

    return seasons;
  },
};
