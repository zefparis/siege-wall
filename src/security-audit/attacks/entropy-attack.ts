/**
 * CELESTIAL ENTROPY ANALYSIS
 * Analyzes if the Celestial Entropy (CE) component is predictable
 */

import { SecurityAuditClient } from '../api-client';
import { EntropyResult } from '../types';

const SAMPLE_COUNT = 30;
const SAMPLE_DELAY_MS = 100;

export async function runEntropyAnalysis(client: SecurityAuditClient): Promise<EntropyResult> {
  console.log('\n🌟 Starting Celestial Entropy Analysis...');
  console.log(`   Collecting ${SAMPLE_COUNT} samples...`);
  
  const samples: { timestamp: number; ce: string; tw: string; qsig: string }[] = [];
  
  // Collect CE samples over time
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const signResponse = await client.sign({ element: 'E' }, 75);
    
    if (signResponse.success && signResponse.data?.hcsCode) {
      const code = signResponse.data.hcsCode;
      const ce = code.match(/CE:([a-f0-9]+)/i)?.[1] || '';
      const tw = code.match(/TW:(\d+)/)?.[1] || '';
      const qsig = code.match(/QSIG:([a-f0-9]+)/i)?.[1] || '';
      
      samples.push({
        timestamp: Date.now(),
        ce,
        tw,
        qsig,
      });
      
      process.stdout.write(`   Collected ${samples.length}/${SAMPLE_COUNT}\r`);
    }
    
    await sleep(SAMPLE_DELAY_MS);
  }
  
  console.log(`\n   Analyzing ${samples.length} samples...`);
  
  if (samples.length < 5) {
    return {
      samples: samples.length,
      uniqueCEs: 0,
      entropyRatio: 0,
      timeCorrelation: false,
      predictable: false,
      vulnerable: false,
      conclusion: 'SKIP: Pas assez d\'échantillons collectés',
      cePatterns: [],
    };
  }
  
  // Analyze CE uniqueness
  const ceSet = new Set(samples.map(s => s.ce));
  const uniqueCEs = ceSet.size;
  const entropyRatio = uniqueCEs / samples.length;
  
  console.log(`   Unique CEs: ${uniqueCEs}/${samples.length} (${(entropyRatio * 100).toFixed(1)}%)`);
  
  // Check for time correlation
  const timeWindowGroups = new Map<string, string[]>();
  for (const sample of samples) {
    const tw = sample.tw;
    if (!timeWindowGroups.has(tw)) {
      timeWindowGroups.set(tw, []);
    }
    timeWindowGroups.get(tw)!.push(sample.ce);
  }
  
  // Check if same TW produces same CE (bad - predictable)
  let sameWindowSameCE = 0;
  for (const [tw, ces] of timeWindowGroups) {
    const uniqueInWindow = new Set(ces).size;
    if (uniqueInWindow < ces.length) {
      sameWindowSameCE += ces.length - uniqueInWindow;
    }
  }
  
  const timeCorrelation = sameWindowSameCE > samples.length * 0.3;
  console.log(`   Time correlation: ${timeCorrelation ? 'DETECTED' : 'None'} (${sameWindowSameCE} duplicates in same TW)`);
  
  // Analyze CE patterns
  const cePatterns = analyzeCEPatterns(samples.map(s => s.ce));
  if (cePatterns.length > 0) {
    console.log(`   Patterns detected: ${cePatterns.map(p => `${p.ce.slice(0, 8)}... (${p.count}x)`).join(', ')}`);
  }
  
  // Check for sequential patterns in CE
  const sequentialPattern = checkSequentialPattern(samples.map(s => s.ce));
  console.log(`   Sequential pattern: ${sequentialPattern ? 'DETECTED' : 'None'}`);
  
  // Check for timestamp-based CE (very bad)
  const timestampBased = checkTimestampBasedCE(samples);
  console.log(`   Timestamp-based: ${timestampBased ? 'DETECTED' : 'None'}`);
  
  // Determine if predictable
  const predictable = entropyRatio < 0.5 || timeCorrelation || sequentialPattern || timestampBased;
  const vulnerable = predictable;
  
  let conclusion: string;
  if (entropyRatio >= 0.95 && !timeCorrelation && !sequentialPattern && !timestampBased) {
    conclusion = `SÉCURISÉ: Haute entropie (${(entropyRatio * 100).toFixed(1)}% unique, pas de patterns)`;
  } else if (entropyRatio >= 0.7) {
    conclusion = `ATTENTION: Entropie moyenne (${(entropyRatio * 100).toFixed(1)}% unique)`;
  } else {
    const issues: string[] = [];
    if (entropyRatio < 0.7) issues.push(`faible entropie (${(entropyRatio * 100).toFixed(1)}%)`);
    if (timeCorrelation) issues.push('corrélation temporelle');
    if (sequentialPattern) issues.push('pattern séquentiel');
    if (timestampBased) issues.push('basé sur timestamp');
    conclusion = `VULNÉRABLE: CE prévisible - ${issues.join(', ')}`;
  }
  
  console.log(`   ${vulnerable ? '❌' : '✅'} ${conclusion}`);
  
  return {
    samples: samples.length,
    uniqueCEs,
    entropyRatio,
    timeCorrelation,
    predictable,
    vulnerable,
    conclusion,
    cePatterns,
  };
}

/**
 * Analyze CE patterns - find repeated values
 */
function analyzeCEPatterns(ces: string[]): { ce: string; count: number }[] {
  const counts = new Map<string, number>();
  
  for (const ce of ces) {
    counts.set(ce, (counts.get(ce) || 0) + 1);
  }
  
  return Array.from(counts.entries())
    .filter(([_, count]) => count > 1)
    .map(([ce, count]) => ({ ce, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Check if CEs follow a sequential pattern
 */
function checkSequentialPattern(ces: string[]): boolean {
  if (ces.length < 3) return false;
  
  // Check first 4 bytes for sequential pattern
  const firstBytes = ces.map(ce => parseInt(ce.slice(0, 8), 16));
  
  let sequentialCount = 0;
  for (let i = 1; i < firstBytes.length; i++) {
    const diff = Math.abs(firstBytes[i] - firstBytes[i - 1]);
    if (diff <= 256) { // Within 256 of each other
      sequentialCount++;
    }
  }
  
  // If more than 50% are sequential, it's a pattern
  return sequentialCount > ces.length * 0.5;
}

/**
 * Check if CE is based on timestamp
 */
function checkTimestampBasedCE(samples: { timestamp: number; ce: string }[]): boolean {
  if (samples.length < 3) return false;
  
  // Check if CE correlates with timestamp
  for (let i = 0; i < samples.length; i++) {
    const timestamp = samples[i].timestamp;
    const ce = samples[i].ce;
    
    // Check if CE contains timestamp-like values
    const timestampHex = Math.floor(timestamp / 1000).toString(16);
    if (ce.includes(timestampHex.slice(0, 4))) {
      return true;
    }
    
    // Check if CE is derived from timestamp
    const timestampBytes = Math.floor(timestamp / 1000).toString(16).padStart(8, '0');
    if (ce.startsWith(timestampBytes) || ce.endsWith(timestampBytes)) {
      return true;
    }
  }
  
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
