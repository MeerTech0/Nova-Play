/**
 * Official TMDB API Service for NovaPlay
 *
 * Handles API requests, rate-limiting, in-flight deduplication,
 * and memory caching. Credentials are securely loaded via Vite environment variables.
 */

import {
  Movie,
  TVShow,
  MediaItem,
  MediaDetails,
  Genre,
  PaginatedResponse,
  CreditsResponse,
  VideosResponse,
} from '../types/media';
import {
  PLACEHOLDER_HERO,
  PLACEHOLDER_TRENDING,
  PLACEHOLDER_POPULAR_MOVIES,
  PLACEHOLDER_POPULAR_TV,
  PLACEHOLDER_TOP_RATED,
  PLACEHOLDER_GENRES,
  getPlaceholderDetails,
} from '../data/placeholderData';

export * from './tmdbImage';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Read API credentials from Vite env without hardcoding
const RAW_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TMDB_API_KEY
  ? String(import.meta.env.VITE_TMDB_API_KEY)
  : ''
).trim();
const RAW_ACCESS_TOKEN = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TMDB_ACCESS_TOKEN
  ? String(import.meta.env.VITE_TMDB_ACCESS_TOKEN)
  : ''
).trim();

export const isApiKeyConfigured = Boolean(
  RAW_API_KEY && RAW_API_KEY !== 'YOUR_TMDB_KEY' && RAW_API_KEY.length > 5
);

export const isAccessTokenConfigured = Boolean(
  RAW_ACCESS_TOKEN && RAW_ACCESS_TOKEN !== 'YOUR_TMDB_TOKEN' && RAW_ACCESS_TOKEN.length > 10
);

export const isTMDBConfigured = isApiKeyConfigured || isAccessTokenConfigured;

/**
 * Cache Entry Interface
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// In-memory response cache & in-flight request map for deduplication
const apiCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();
const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export class TmdbApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = 'TmdbApiError';
    this.status = status;
  }
}

/**
 * Core TMDB HTTP Client
 * - Deduplicates concurrent requests for the exact same endpoint
 * - Caches successful responses with TTL to avoid rate limit spikes
 */
async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
  ttl = DEFAULT_CACHE_TTL
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

  if (isApiKeyConfigured && !RAW_ACCESS_TOKEN) {
    url.searchParams.set('api_key', RAW_API_KEY!);
  }

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const cacheKey = url.toString();

  // 1. Check in-memory cache
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data as T;
  }

  // 2. Check in-flight requests (deduplication)
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey) as Promise<T>;
  }

  // 3. Perform network fetch
  const fetchPromise = (async () => {
    try {
      if (!isTMDBConfigured) {
        throw new TmdbApiError(
          'TMDB API key is not yet configured or contains the placeholder "YOUR_TMDB_KEY". Add your valid key in .env to access live TMDB data.',
          401
        );
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (isAccessTokenConfigured) {
        headers['Authorization'] = `Bearer ${RAW_ACCESS_TOKEN}`;
      }

      // Add a 6-second timeout to prevent requests from hanging forever
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const response = await fetch(url.toString(), {
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            throw new TmdbApiError(
              'Invalid TMDB API Key. Please verify the VITE_TMDB_API_KEY in your .env file.',
              401
            );
          }
          if (response.status === 429) {
            throw new TmdbApiError(
              'TMDB rate limit reached. Please wait a moment before retrying.',
              429
            );
          }
          throw new TmdbApiError(
            `TMDB API Error (${response.status}): ${response.statusText}`,
            response.status
          );
        }

        const data = await response.json();
        apiCache.set(cacheKey, { data, timestamp: Date.now() });
        return data as T;
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}

/**
 * Reusable TMDB API Functions
 */

/**
 * Trending movies & shows (Day or Week)
 */
export async function getTrending(
  timeWindow: 'day' | 'week' = 'week'
): Promise<MediaItem[]> {
  try {
    const data = await tmdbFetch<PaginatedResponse<MediaItem>>(`/trending/all/${timeWindow}`);
    return data.results.filter(
      (item) => item.media_type === 'movie' || item.media_type === 'tv'
    );
  } catch (err) {
    if (!isTMDBConfigured) {
      return PLACEHOLDER_TRENDING;
    }
    throw err;
  }
}

/**
 * Popular Movies
 */
export async function getPopularMovies(page = 1): Promise<Movie[]> {
  try {
    const data = await tmdbFetch<PaginatedResponse<Movie>>('/movie/popular', {
      page: String(page),
    });
    return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
  } catch (err) {
    if (!isTMDBConfigured) {
      return PLACEHOLDER_POPULAR_MOVIES;
    }
    throw err;
  }
}

/**
 * Popular TV Shows
 */
export async function getPopularTV(page = 1): Promise<TVShow[]> {
  try {
    const data = await tmdbFetch<PaginatedResponse<TVShow>>('/tv/popular', {
      page: String(page),
    });
    return data.results.map((t) => ({ ...t, media_type: 'tv' as const }));
  } catch (err) {
    if (!isTMDBConfigured) {
      return PLACEHOLDER_POPULAR_TV;
    }
    throw err;
  }
}

/**
 * Top Rated Movies
 */
export async function getTopRatedMovies(page = 1): Promise<Movie[]> {
  try {
    const data = await tmdbFetch<PaginatedResponse<Movie>>('/movie/top_rated', {
      page: String(page),
    });
    return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
  } catch (err) {
    if (!isTMDBConfigured) {
      return PLACEHOLDER_TOP_RATED;
    }
    throw err;
  }
}

/**
 * Top Rated TV Shows
 */
export async function getTopRatedTV(page = 1): Promise<TVShow[]> {
  try {
    const data = await tmdbFetch<PaginatedResponse<TVShow>>('/tv/top_rated', {
      page: String(page),
    });
    return data.results.map((t) => ({ ...t, media_type: 'tv' as const }));
  } catch (err) {
    if (!isTMDBConfigured) {
      return PLACEHOLDER_POPULAR_TV;
    }
    throw err;
  }
}

/**
 * Helper to extract age rating/certification from TMDB response
 */
function extractCertification(data: any, type: 'movie' | 'tv'): string | undefined {
  try {
    if (type === 'movie' && data.release_dates?.results) {
      const us = data.release_dates.results.find((r: any) => r.iso_3166_1 === 'US') || data.release_dates.results[0];
      const cert = us?.release_dates?.find((d: any) => d.certification)?.certification;
      if (cert) return cert;
    }
    if (type === 'tv' && data.content_ratings?.results) {
      const us = data.content_ratings.results.find((r: any) => r.iso_3166_1 === 'US') || data.content_ratings.results[0];
      if (us?.rating) return us.rating;
    }
  } catch {
    // Graceful fallback
  }
  return undefined;
}

/**
 * Movie Details
 */
export async function getMovieDetails(id: number | string): Promise<MediaDetails> {
  try {
    const data = await tmdbFetch<any>(`/movie/${id}`, {
      append_to_response: 'credits,videos,similar,recommendations,release_dates',
    });
    return {
      ...data,
      media_type: 'movie',
      title: data.title || data.original_title,
      original_title: data.original_title,
      release_date: data.release_date,
      certification: extractCertification(data, 'movie'),
    };
  } catch (err) {
    console.warn(`TMDB getMovieDetails(${id}) failed or offline; using resilient fallback:`, err);
    return getPlaceholderDetails(Number(id), 'movie');
  }
}

/**
 * TV Details
 */
export async function getTVDetails(id: number | string): Promise<MediaDetails> {
  try {
    const data = await tmdbFetch<any>(`/tv/${id}`, {
      append_to_response: 'credits,videos,similar,recommendations,content_ratings',
    });
    return {
      ...data,
      media_type: 'tv',
      title: data.name || data.original_name,
      original_title: data.original_name,
      release_date: data.first_air_date,
      certification: extractCertification(data, 'tv'),
    };
  } catch (err) {
    console.warn(`TMDB getTVDetails(${id}) failed or offline; using resilient fallback:`, err);
    return getPlaceholderDetails(Number(id), 'tv');
  }
}

/**
 * Movie Credits (Cast & Crew)
 */
export async function getMovieCredits(id: number | string): Promise<CreditsResponse> {
  try {
    return await tmdbFetch<CreditsResponse>(`/movie/${id}/credits`);
  } catch (err) {
    if (!isTMDBConfigured) {
      const details = getPlaceholderDetails(Number(id), 'movie');
      return { id: Number(id), cast: details.credits?.cast || [], crew: details.credits?.crew || [] };
    }
    throw err;
  }
}

/**
 * TV Credits (Cast & Crew)
 */
export async function getTVCredits(id: number | string): Promise<CreditsResponse> {
  try {
    return await tmdbFetch<CreditsResponse>(`/tv/${id}/credits`);
  } catch (err) {
    if (!isTMDBConfigured) {
      const details = getPlaceholderDetails(Number(id), 'tv');
      return { id: Number(id), cast: details.credits?.cast || [], crew: details.credits?.crew || [] };
    }
    throw err;
  }
}

/**
 * Similar Movies
 */
export async function getSimilarMovies(id: number | string, page = 1): Promise<Movie[]> {
  try {
    const data = await tmdbFetch<PaginatedResponse<Movie>>(`/movie/${id}/similar`, {
      page: String(page),
    });
    return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
  } catch (err) {
    if (!isTMDBConfigured) {
      return PLACEHOLDER_POPULAR_MOVIES.slice(0, 4);
    }
    throw err;
  }
}

/**
 * Similar TV Shows
 */
export async function getSimilarTV(id: number | string, page = 1): Promise<TVShow[]> {
  try {
    const data = await tmdbFetch<PaginatedResponse<TVShow>>(`/tv/${id}/similar`, {
      page: String(page),
    });
    return data.results.map((t) => ({ ...t, media_type: 'tv' as const }));
  } catch (err) {
    if (!isTMDBConfigured) {
      return PLACEHOLDER_POPULAR_TV.slice(0, 4);
    }
    throw err;
  }
}

/**
 * Search Multi (Movies & TV Shows)
 */
export async function searchMulti(query: string, page = 1): Promise<MediaItem[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const data = await tmdbFetch<PaginatedResponse<MediaItem>>('/search/multi', {
      query: trimmed,
      page: String(page),
    });
    return data.results.filter(
      (item) => item.media_type === 'movie' || item.media_type === 'tv'
    );
  } catch (err) {
    if (!isTMDBConfigured) {
      const q = trimmed.toLowerCase();
      const all = [
        ...PLACEHOLDER_TRENDING,
        ...PLACEHOLDER_POPULAR_MOVIES,
        ...PLACEHOLDER_POPULAR_TV,
      ];
      return all.filter((item) => {
        const title = 'title' in item ? item.title : item.name;
        const overview = item.overview || '';
        return title.toLowerCase().includes(q) || overview.toLowerCase().includes(q);
      });
    }
    throw err;
  }
}

/**
 * Get Genres
 */
export async function getGenres(type: 'movie' | 'tv' = 'movie'): Promise<Genre[]> {
  try {
    const data = await tmdbFetch<{ genres: Genre[] }>(`/genre/${type}/list`, {}, 24 * 60 * 60 * 1000);
    return data.genres;
  } catch (err) {
    if (!isTMDBConfigured) {
      return PLACEHOLDER_GENRES;
    }
    throw err;
  }
}

/**
 * Movie Videos (Trailers, Teasers)
 */
export async function getMovieVideos(id: number | string): Promise<VideosResponse> {
  try {
    return await tmdbFetch<VideosResponse>(`/movie/${id}/videos`);
  } catch (err) {
    if (!isTMDBConfigured) {
      return { id: Number(id), results: [] };
    }
    throw err;
  }
}

/**
 * TV Videos (Trailers, Teasers)
 */
export async function getTVVideos(id: number | string): Promise<VideosResponse> {
  try {
    return await tmdbFetch<VideosResponse>(`/tv/${id}/videos`);
  } catch (err) {
    if (!isTMDBConfigured) {
      return { id: Number(id), results: [] };
    }
    throw err;
  }
}

/**
 * Dynamically select featured hero item
 */
export async function getHeroItem(): Promise<MediaItem> {
  try {
    const trending = await getTrending('week');
    if (trending && trending.length > 0) {
      // Pick a featured item with a high quality backdrop
      const candidate = trending.find((item) => item.backdrop_path && item.overview) || trending[0];
      return candidate;
    }
    return PLACEHOLDER_HERO;
  } catch {
    return PLACEHOLDER_HERO;
  }
}

/**
 * Unified tmdbService object
 */
export const tmdbService = {
  isConfigured: () => isTMDBConfigured,
  getTrending,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV,
  getMovieDetails,
  getTVDetails,
  getMovieCredits,
  getTVCredits,
  getSimilarMovies,
  getSimilarTV,
  searchMulti,
  getGenres,
  getMovieVideos,
  getTVVideos,
  getHeroItem,
  // Helper for single details resolution
  getDetails: async (id: number | string, type: 'movie' | 'tv'): Promise<MediaDetails> => {
    return type === 'movie' ? getMovieDetails(id) : getTVDetails(id);
  },
};
