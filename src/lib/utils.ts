/**
 * Utility helper functions for NovaPlay
 */

/**
 * Format minutes into readable cinema duration (e.g. 148 min -> 2h 28m)
 */
export function formatRuntime(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return '—';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format date string into human year or full date
 */
export function formatReleaseYear(dateString?: string | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    return isNaN(year) ? dateString.slice(0, 4) : String(year);
  } catch {
    return dateString.slice(0, 4) || '—';
  }
}

/**
 * Format rating to one decimal place
 */
export function formatRating(rating?: number | null): string {
  if (typeof rating !== 'number' || rating <= 0) return 'NR';
  return rating.toFixed(1);
}

/**
 * Format currency for budgets and revenues
 */
export function formatCurrency(amount?: number | null): string {
  if (!amount || amount <= 0) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
