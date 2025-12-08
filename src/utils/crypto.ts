import { randomBytes, createHash } from 'crypto';

/**
 * Generate random hex string
 */
export function randomHex(bytes: number): string {
  return randomBytes(bytes).toString('hex');
}

/**
 * Generate a fake BLAKE3 hash (for testing purposes)
 */
export function fakeBlake3(data: string): string {
  // Use SHA256 as a stand-in for BLAKE3 in attack simulation
  return createHash('sha256').update(data).digest('hex');
}

/**
 * Get current time window (30 second intervals)
 */
export function getCurrentTimeWindow(): number {
  return Math.floor(Date.now() / 1000 / 30);
}

/**
 * Get expired time window
 */
export function getExpiredTimeWindow(offsetWindows: number = 5): number {
  return getCurrentTimeWindow() - offsetWindows;
}
