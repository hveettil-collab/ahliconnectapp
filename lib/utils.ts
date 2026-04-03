/** Shared utility functions for the Ahli Connect web app */

/**
 * Returns a time-of-day greeting string.
 */
export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * Formats a duration in milliseconds to a human-readable string (e.g. "2.4s").
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Returns a Tailwind-style text color class for an automation status.
 */
export function statusColor(s: string): string {
  switch (s) {
    case 'completed':
    case 'approved':
      return 'text-green-600';
    case 'failed':
      return 'text-red-500';
    case 'running':
      return 'text-blue-500';
    default:
      return 'text-[var(--text-muted)]';
  }
}
