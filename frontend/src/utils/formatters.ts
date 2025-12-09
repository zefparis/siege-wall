/**
 * Format a number with thousand separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format a large number with abbreviation (1M, 10M, etc.)
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Format success rate with many decimal places (always shows 0.000000%)
 */
export function formatSuccessRate(rate: number): string {
  return `${rate.toFixed(6)}%`;
}

/**
 * Format uptime from seconds to readable string
 */
export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Format attack ID for display
 */
export function formatAttackId(id: string): string {
  return id.replace('att_', '#');
}

/**
 * Pad number with leading zeros
 */
export function padNumber(num: number, length: number): string {
  return num.toString().padStart(length, '0');
}

/**
 * Get individual digits from a number for odometer display
 */
export function getDigits(num: number, minDigits: number = 12): number[] {
  const str = num.toString().padStart(minDigits, '0');
  return str.split('').map(Number);
}
