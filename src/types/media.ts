/**
 * Core Media & TMDB Types for NovaPlay
 * Modeled strictly after TMDB API v3 specifications for effortless real API integration.
 */

export type MediaType = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

export interface CastMember {
  id: number;
  name: string;
  original_name?: string;
  character: string;
  profile_path: string | null;
  order?: number;
  known_for_department?: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  iso_639_1?: string;
  iso_3166_1?: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface BaseMedia {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity?: number;
  genre_ids?: number[];
  genres?: Genre[];
  adult?: boolean;
  original_language?: string;
}

export interface Movie extends BaseMedia {
  media_type?: 'movie';
  title: string;
  original_title?: string;
  release_date: string;
  video?: boolean;
  runtime?: number;
  budget?: number;
  revenue?: number;
}

export interface TVShow extends BaseMedia {
  media_type?: 'tv';
  name: string;
  original_name?: string;
  first_air_date: string;
  origin_country?: string[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
}

export type MediaItem = (Movie & { media_type?: 'movie' }) | (TVShow & { media_type?: 'tv' });

export interface MediaDetails extends BaseMedia {
  media_type: MediaType;
  title: string;
  original_title?: string;
  release_date: string;
  tagline?: string;
  status?: string;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres: Genre[];
  certification?: string;
  original_language?: string;
  spoken_languages?: { english_name: string; iso_639_1: string; name: string }[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos?: {
    results: Video[];
  };
  similar?: {
    results: MediaItem[];
  };
  recommendations?: {
    results: MediaItem[];
  };
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface CreditsResponse {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

