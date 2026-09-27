import { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';
import { MediaItem, Movie, TVShow } from '../types/media';

interface UseMediaReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useTrending(timeWindow: 'day' | 'week' = 'week'): UseMediaReturn<MediaItem[]> {
  const [data, setData] = useState<MediaItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await tmdbService.getTrending(timeWindow);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch trending media'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeWindow]);

  return { data, loading, error, refetch: fetchData };
}

export function usePopularMovies(): UseMediaReturn<Movie[]> {
  const [data, setData] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await tmdbService.getPopularMovies();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch popular movies'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}

export function usePopularTV(): UseMediaReturn<TVShow[]> {
  const [data, setData] = useState<TVShow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await tmdbService.getPopularTV();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch popular TV shows'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
