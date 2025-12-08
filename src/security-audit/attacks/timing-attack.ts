/**
 * TIMING ATTACK - Side-channel Analysis
 * Measures response times to detect information leaks in QSIG verification
 */

import { randomBytes } from 'crypto';
import { SecurityAuditClient } from '../api-client';
import { TimingResult } from '../types';

const HEX_PREFIXES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
const SAMPLES_PER_PREFIX = 50;
const ANOMALY_THRESHOLD_SIGMA = 2; // Standard deviations for anomaly detection

export async function runTimingAttack(client: SecurityAuditClient): Promise<TimingResult> {
  console.log('\n🕐 Starting Timing Attack...');
  console.log(`   Testing ${HEX_PREFIXES.length} QSIG prefixes with ${SAMPLES_PER_PREFIX} samples each`);
  
  const prefixResults: { prefix: string; avgTime: number; samples: number }[] = [];
  const allTimes: number[] = [];

  for (const prefix of HEX_PREFIXES) {
    const times: number[] = [];
    
    for (let i = 0; i < SAMPLES_PER_PREFIX; i++) {
      // Generate a code with specific QSIG prefix
      const qsig = prefix + randomBytes(31).toString('hex').slice(0, 63);
      const code = buildTimingProbeCode(qsig);
      
      const result = await client.verify(code);
      times.push(result.responseTimeMs);
      allTimes.push(result.responseTimeMs);
      
      // Small delay to avoid overwhelming the server
      await sleep(10);
    }
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    prefixResults.push({ prefix, avgTime, samples: times.length });
    
    process.stdout.write(`   Prefix '${prefix}': avg ${avgTime.toFixed(2)}ms\r`);
  }
  
  console.log('\n   Analyzing timing patterns...');
  
  // Calculate statistics
  const mean = prefixResults.reduce((a, b) => a + b.avgTime, 0) / prefixResults.length;
  const variance = prefixResults.reduce((a, b) => a + Math.pow(b.avgTime - mean, 2), 0) / prefixResults.length;
  const stdDev = Math.sqrt(variance);
  
  // Detect anomalies (times significantly different from mean)
  const anomalies = prefixResults
    .map(r => ({
      prefix: r.prefix,
      avgTime: r.avgTime,
      deviation: (r.avgTime - mean) / (stdDev || 1),
    }))
    .filter(r => Math.abs(r.deviation) > ANOMALY_THRESHOLD_SIGMA);
  
  const vulnerable = anomalies.length > 0;
  
  let conclusion: string;
  if (vulnerable) {
    const anomalyPrefixes = anomalies.map(a => `'${a.prefix}' (${a.deviation > 0 ? '+' : ''}${a.deviation.toFixed(2)}σ)`).join(', ');
    conclusion = `VULNÉRABLE: Timing leak détecté! Préfixes anormaux: ${anomalyPrefixes}`;
  } else {
    conclusion = `SÉCURISÉ: Pas de timing leak détecté (σ=${stdDev.toFixed(2)}ms, tous les préfixes dans ±${ANOMALY_THRESHOLD_SIGMA}σ)`;
  }
  
  console.log(`   ${vulnerable ? '❌' : '✅'} ${conclusion}`);
  
  return {
    vulnerable,
    prefixResults,
    mean,
    stdDev,
    anomalies,
    conclusion,
    rawData: allTimes,
  };
}

/**
 * Build a probe code with specific QSIG for timing analysis
 */
function buildTimingProbeCode(qsig: string): string {
  const currentTw = Math.floor(Date.now() / 1000 / 30);
  const ce = randomBytes(16).toString('hex');
  const b3 = randomBytes(32).toString('hex');
  
  return `HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f50m50|COG:F50C50V50S50Cr50|TW:${currentTw}|CE:${ce}|QSIG:${qsig}|B3:${b3}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
