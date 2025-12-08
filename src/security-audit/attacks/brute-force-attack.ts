/**
 * BRUTE FORCE ATTACK - Exhaustive Testing
 * Tests resistance to random code generation with detailed statistics
 */

import { randomBytes } from 'crypto';
import { SecurityAuditClient } from '../api-client';
import { BruteForceResult } from '../types';

const DEFAULT_DURATION_MS = 60000; // 60 seconds
const PROGRESS_INTERVAL = 100; // Log every 100 attempts

export async function runBruteForceAttack(
  client: SecurityAuditClient,
  durationMs: number = DEFAULT_DURATION_MS
): Promise<BruteForceResult> {
  console.log('\n💪 Starting Brute Force Attack...');
  console.log(`   Duration: ${durationMs / 1000} seconds`);
  
  const startTime = Date.now();
  let attempts = 0;
  let successes = 0;
  const responseTimes: number[] = [];
  
  while (Date.now() - startTime < durationMs) {
    const code = generateRandomHCSCode();
    
    const result = await client.verify(code);
    responseTimes.push(result.responseTimeMs);
    
    attempts++;
    if (result.valid) {
      successes++;
      console.log(`   ⚠️ SUCCESS! Code accepted: ${code.slice(0, 60)}...`);
    }
    
    // Progress logging
    if (attempts % PROGRESS_INTERVAL === 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = attempts / elapsed;
      process.stdout.write(`   Progress: ${attempts} attempts, ${successes} successes, ${rate.toFixed(0)} req/s\r`);
    }
  }
  
  const actualDuration = Date.now() - startTime;
  const attacksPerSecond = attempts / (actualDuration / 1000);
  
  // Calculate statistics
  const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const minResponseTime = Math.min(...responseTimes);
  const maxResponseTime = Math.max(...responseTimes);
  
  // Calculate theoretical time to break
  // QSIG = 64 hex chars = 256 bits = 2^256 possibilities
  // B3 = 64 hex chars = 256 bits = 2^256 possibilities
  // Combined: 2^512 possibilities
  const qsigBits = 256;
  const totalPossibilities = Math.pow(2, qsigBits);
  const secondsToBreak = totalPossibilities / attacksPerSecond;
  const yearsToBreak = secondsToBreak / (365.25 * 24 * 3600);
  
  const successRate = ((successes / attempts) * 100).toFixed(10) + '%';
  const theoreticalYearsToBreak = yearsToBreak.toExponential(2);
  
  console.log(`\n   Completed: ${attempts} attempts in ${(actualDuration / 1000).toFixed(1)}s`);
  console.log(`   Rate: ${attacksPerSecond.toFixed(0)} requests/second`);
  console.log(`   Response times: avg=${avgResponseTime.toFixed(0)}ms, min=${minResponseTime.toFixed(0)}ms, max=${maxResponseTime.toFixed(0)}ms`);
  
  const vulnerable = successes > 0;
  
  let conclusion: string;
  if (vulnerable) {
    conclusion = `VULNÉRABLE: ${successes} codes aléatoires acceptés sur ${attempts} tentatives!`;
  } else {
    conclusion = `SÉCURISÉ: 0/${attempts} en ${(actualDuration / 1000).toFixed(0)}s (${attacksPerSecond.toFixed(0)} req/s). Temps théorique pour casser: ${theoreticalYearsToBreak} années`;
  }
  
  console.log(`   ${vulnerable ? '❌' : '✅'} ${conclusion}`);
  
  return {
    durationMs: actualDuration,
    attempts,
    successes,
    successRate,
    attacksPerSecond: Math.round(attacksPerSecond),
    avgResponseTime: Math.round(avgResponseTime),
    minResponseTime: Math.round(minResponseTime),
    maxResponseTime: Math.round(maxResponseTime),
    theoreticalYearsToBreak,
    vulnerable,
    conclusion,
  };
}

/**
 * Generate a random but well-formed HCS code
 */
function generateRandomHCSCode(): string {
  const version = 'V:7.0';
  const alg = 'ALG:QS';
  const element = 'E:' + ['E', 'W', 'F', 'A'][Math.floor(Math.random() * 4)];
  
  // Random modalities
  const c = Math.floor(Math.random() * 100);
  const f = Math.floor(Math.random() * 100);
  const m = Math.floor(Math.random() * 100);
  const mod = `MOD:c${c.toString().padStart(2, '0')}f${f.toString().padStart(2, '0')}m${m.toString().padStart(2, '0')}`;
  
  // Random cognition
  const form = Math.floor(Math.random() * 100);
  const logic = Math.floor(Math.random() * 100);
  const visual = Math.floor(Math.random() * 100);
  const synthesis = Math.floor(Math.random() * 100);
  const creativity = Math.floor(Math.random() * 100);
  const cog = `COG:F${form}C${logic}V${visual}S${synthesis}Cr${creativity}`;
  
  // Current time window
  const tw = `TW:${Math.floor(Date.now() / 1000 / 30)}`;
  
  // Random cryptographic components
  const ce = `CE:${randomBytes(16).toString('hex')}`;
  const qsig = `QSIG:${randomBytes(32).toString('hex')}`;
  const b3 = `B3:${randomBytes(32).toString('hex')}`;
  
  return `HCS-U7|${version}|${alg}|${element}|${mod}|${cog}|${tw}|${ce}|${qsig}|${b3}`;
}

/**
 * Extended brute force with different strategies
 */
export async function runExtendedBruteForce(
  client: SecurityAuditClient,
  durationMs: number = DEFAULT_DURATION_MS
): Promise<BruteForceResult & { strategies: Record<string, { attempts: number; successes: number }> }> {
  console.log('\n💪 Starting Extended Brute Force Attack...');
  
  const strategies: Record<string, { attempts: number; successes: number }> = {
    random: { attempts: 0, successes: 0 },
    sequential: { attempts: 0, successes: 0 },
    dictionary: { attempts: 0, successes: 0 },
    mutation: { attempts: 0, successes: 0 },
  };
  
  const startTime = Date.now();
  let totalAttempts = 0;
  let totalSuccesses = 0;
  const responseTimes: number[] = [];
  
  // Rotate through strategies
  const strategyNames = Object.keys(strategies);
  let strategyIndex = 0;
  
  while (Date.now() - startTime < durationMs) {
    const strategyName = strategyNames[strategyIndex % strategyNames.length];
    const code = generateCodeByStrategy(strategyName, totalAttempts);
    
    const result = await client.verify(code);
    responseTimes.push(result.responseTimeMs);
    
    totalAttempts++;
    strategies[strategyName].attempts++;
    
    if (result.valid) {
      totalSuccesses++;
      strategies[strategyName].successes++;
      console.log(`   ⚠️ SUCCESS with ${strategyName}! Code: ${code.slice(0, 60)}...`);
    }
    
    strategyIndex++;
    
    if (totalAttempts % PROGRESS_INTERVAL === 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      process.stdout.write(`   Progress: ${totalAttempts} attempts, ${totalSuccesses} successes, ${(totalAttempts / elapsed).toFixed(0)} req/s\r`);
    }
  }
  
  const actualDuration = Date.now() - startTime;
  const attacksPerSecond = totalAttempts / (actualDuration / 1000);
  const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  
  console.log(`\n   Strategy breakdown:`);
  for (const [name, stats] of Object.entries(strategies)) {
    console.log(`     ${name}: ${stats.successes}/${stats.attempts}`);
  }
  
  return {
    durationMs: actualDuration,
    attempts: totalAttempts,
    successes: totalSuccesses,
    successRate: ((totalSuccesses / totalAttempts) * 100).toFixed(10) + '%',
    attacksPerSecond: Math.round(attacksPerSecond),
    avgResponseTime: Math.round(avgResponseTime),
    minResponseTime: Math.round(Math.min(...responseTimes)),
    maxResponseTime: Math.round(Math.max(...responseTimes)),
    theoreticalYearsToBreak: (Math.pow(2, 256) / attacksPerSecond / (365.25 * 24 * 3600)).toExponential(2),
    vulnerable: totalSuccesses > 0,
    conclusion: totalSuccesses > 0
      ? `VULNÉRABLE: ${totalSuccesses} codes acceptés!`
      : `SÉCURISÉ: 0/${totalAttempts} tentatives`,
    strategies,
  };
}

function generateCodeByStrategy(strategy: string, iteration: number): string {
  const tw = Math.floor(Date.now() / 1000 / 30);
  
  switch (strategy) {
    case 'sequential':
      // Sequential QSIG values
      const seqQsig = iteration.toString(16).padStart(64, '0');
      return `HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f50m50|COG:F50C50V50S50Cr50|TW:${tw}|CE:${'0'.repeat(32)}|QSIG:${seqQsig}|B3:${'0'.repeat(64)}`;
    
    case 'dictionary':
      // Common weak values
      const weakValues = ['0', '1', 'a', 'f', 'dead', 'beef', 'cafe', 'babe'];
      const weak = weakValues[iteration % weakValues.length];
      const dictQsig = weak.repeat(Math.ceil(64 / weak.length)).slice(0, 64);
      return `HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f50m50|COG:F50C50V50S50Cr50|TW:${tw}|CE:${dictQsig.slice(0, 32)}|QSIG:${dictQsig}|B3:${dictQsig}`;
    
    case 'mutation':
      // Mutate a base code
      const baseQsig = 'a'.repeat(64);
      const pos = iteration % 64;
      const mutatedQsig = baseQsig.slice(0, pos) + ((parseInt(baseQsig[pos], 16) + 1) % 16).toString(16) + baseQsig.slice(pos + 1);
      return `HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f50m50|COG:F50C50V50S50Cr50|TW:${tw}|CE:${'b'.repeat(32)}|QSIG:${mutatedQsig}|B3:${'c'.repeat(64)}`;
    
    default: // random
      return generateRandomHCSCode();
  }
}
