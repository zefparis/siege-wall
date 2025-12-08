import { SiegeStats } from '../engine/orchestrator';

/**
 * Calculate derived statistics from siege stats
 */
export function calculateDerivedStats(stats: SiegeStats) {
  const runtime = Date.now() - stats.startTime.getTime();
  const runtimeSeconds = runtime / 1000;
  const runtimeMinutes = runtimeSeconds / 60;
  const runtimeHours = runtimeMinutes / 60;

  return {
    ...stats,
    runtime: {
      ms: runtime,
      seconds: Math.round(runtimeSeconds),
      minutes: Math.round(runtimeMinutes * 10) / 10,
      hours: Math.round(runtimeHours * 100) / 100,
    },
    attacksPerSecond: runtimeSeconds > 0 ? stats.totalAttacks / runtimeSeconds : 0,
    attacksPerMinute: runtimeMinutes > 0 ? stats.totalAttacks / runtimeMinutes : 0,
    successRate: stats.totalAttacks > 0 
      ? (stats.successfulAttacks / stats.totalAttacks) * 100 
      : 0,
    failureRate: stats.totalAttacks > 0 
      ? (stats.failedAttacks / stats.totalAttacks) * 100 
      : 0,
  };
}

/**
 * Format stats for display
 */
export function formatStatsForDisplay(stats: SiegeStats): string {
  const derived = calculateDerivedStats(stats);
  
  return `
═══════════════════════════════════════════
   📊 SIEGE WALL STATISTICS
═══════════════════════════════════════════
   Runtime: ${derived.runtime.hours.toFixed(2)} hours
   Total Attacks: ${stats.totalAttacks.toLocaleString()}
   Attacks/sec: ${derived.attacksPerSecond.toFixed(2)}
   
   ✅ Rejected: ${stats.failedAttacks.toLocaleString()} (${derived.failureRate.toFixed(4)}%)
   🚨 Success: ${stats.successfulAttacks} (${derived.successRate.toFixed(6)}%)
   
   Avg Response: ${Math.round(stats.avgResponseTime)}ms
═══════════════════════════════════════════
  `.trim();
}

/**
 * Get attack type breakdown
 */
export function getAttackTypeBreakdown(stats: SiegeStats): string {
  const lines = ['Attack Type Breakdown:'];
  
  for (const [type, data] of Object.entries(stats.attacksByType)) {
    const rate = data.total > 0 ? (data.success / data.total) * 100 : 0;
    lines.push(`  ${type}: ${data.total} attacks, ${data.success} success (${rate.toFixed(4)}%)`);
  }
  
  return lines.join('\n');
}
