import { AttackResult } from '../attacks/types';
import { logger } from '../utils/logger';
import { appendFileSync } from 'fs';

const RESULTS_FILE = 'attack-results.jsonl';

/**
 * Log attack result to console and file
 */
export function logResult(result: AttackResult): void {
  const summary = `[${result.attackType}] ${result.success ? '🚨 SUCCESS' : '✅ REJECTED'} - ${result.responseTimeMs}ms`;
  
  if (result.success) {
    logger.warn(summary);
    logger.warn(`  Payload: ${result.payload.slice(0, 100)}`);
  } else {
    logger.debug(summary);
  }
  
  // Append to JSONL file
  try {
    appendFileSync(RESULTS_FILE, JSON.stringify({
      ...result,
      timestamp: result.timestamp.toISOString(),
    }) + '\n');
  } catch (error) {
    // Ignore file write errors
  }
}

/**
 * Log batch of results
 */
export function logBatchResults(results: AttackResult[]): void {
  const successes = results.filter(r => r.success).length;
  const avgTime = results.reduce((sum, r) => sum + r.responseTimeMs, 0) / results.length;
  
  logger.info(`Batch: ${results.length} attacks, ${successes} successes, avg ${Math.round(avgTime)}ms`);
  
  for (const result of results) {
    logResult(result);
  }
}
