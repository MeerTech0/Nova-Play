/**
 * Centralized TMDB Image URL Generator
 *
 * Modeled strictly after TMDB API image specifications:
 * https://developer.themoviedb.org/docs/image-basics
 */

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
export type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';
export type LogoSize = 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original';

export type ImageCategory = 'poster' | 'backdrop' | 'profile' | 'logo';

// Default SVG placeholder fallbacks for missing assets
const FALLBACK_SVGS: Record<ImageCategory, string> = {
  poster:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750" fill="%23111319"><rect width="100%" height="100%" fill="%23111319"/><text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="%23475569" font-family="sans-serif" font-size="20" font-weight="600">NOVAPLAY</text><text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" fill="%2364748B" font-family="sans-serif" font-size="14">No Poster Available</text></svg>',
  backdrop:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" fill="%2308090C"><rect width="100%" height="100%" fill="%2308090C"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23334155" font-family="sans-serif" font-size="32">NovaPlay Cinema</text></svg>',
  profile:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450" fill="%23111319"><rect width="100%" height="100%" fill="%23111319"/><circle cx="150" cy="180" r="60" fill="%231e293b"/><path d="M70 360 C70 270, 230 270, 230 360" fill="%231e293b"/></svg>',
  logo:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100" fill="none"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23E5A93C" font-family="sans-serif" font-size="22" font-weight="bold">NOVAPLAY</text></svg>',
};

/**
 * Universal TMDB Image URL generator
 */
export function getTmdbImageUrl(
  category: 'poster',
  path: string | null | undefined,
  size?: PosterSize
): string;
export function getTmdbImageUrl(
  category: 'backdrop',
  path: string | null | undefined,
  size?: BackdropSize
): string;
export function getTmdbImageUrl(
  category: 'profile',
  path: string | null | undefined,
  size?: ProfileSize
): string;
export function getTmdbImageUrl(
  category: 'logo',
  path: string | null | undefined,
  size?: LogoSize
): string;
export function getTmdbImageUrl(
  category: ImageCategory,
  path: string | null | undefined,
  size: string = 'original'
): string {
  if (!path) {
    return FALLBACK_SVGS[category];
  }

  // Already a full URL (data URI or external link)
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${TMDB_IMAGE_BASE_URL}/${size}${cleanPath}`;
}

/**
 * Reusable Poster URL helper
 */
export function getPosterUrl(
  path: string | null | undefined,
  size: PosterSize = 'w500'
): string {
  return getTmdbImageUrl('poster', path, size);
}

/**
 * Reusable Backdrop URL helper
 */
export function getBackdropUrl(
  path: string | null | undefined,
  size: BackdropSize = 'original'
): string {
  return getTmdbImageUrl('backdrop', path, size);
}

/**
 * Reusable Profile/Avatar URL helper
 */
export function getProfileUrl(
  path: string | null | undefined,
  size: ProfileSize = 'w185'
): string {
  return getTmdbImageUrl('profile', path, size);
}

/**
 * Reusable Network/Studio Logo URL helper
 */
export function getLogoUrl(
  path: string | null | undefined,
  size: LogoSize = 'w300'
): string {
  return getTmdbImageUrl('logo', path, size);
}
