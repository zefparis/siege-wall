/**
 * TIME WINDOW BOUNDARY ATTACK
 * Tests the time window (TW) validation boundaries
 */

import { randomBytes } from 'crypto';
import { SecurityAuditClient } from '../api-client';
import { TimeWindowResult } from '../types';

// Test offsets: negative = past, positive = future
const TW_OFFSETS = [-100, -10, -5, -3, -2, -1, 0, 1, 2, 3, 5, 10, 100];

export async function runTimeWindowAttack(client: SecurityAuditClient): Promise<TimeWindowResult> {
  console.log('\n⏰ Starting Time Window Boundary Attack...');
  
  // First, get a valid code to understand the current TW format
  console.log('   Generating reference code...');
  const signResponse = await client.sign({ element: 'E' }, 75);
  
  let originalTW: number;
  let originalCode: string;
  
  if (signResponse.success && signResponse.data?.hcsCode) {
    originalCode = signResponse.data.hcsCode;
    const twMatch = originalCode.match(/TW:(\d+)/);
    originalTW = twMatch ? parseInt(twMatch[1]) : Math.floor(Date.now() / 1000 / 30);
    console.log(`   Original TW: ${originalTW}`);
  } else {
    // Fallback: calculate current TW
    originalTW = Math.floor(Date.now() / 1000 / 30);
    originalCode = buildTestCode(originalTW);
    console.log(`   Using calculated TW: ${originalTW}`);
  }
  
  const results: { offset: number; valid: boolean; reason?: string }[] = [];
  
  console.log('   Testing TW offsets...');
  for (const offset of TW_OFFSETS) {
    const modifiedTW = originalTW + offset;
    const testCode = buildTestCode(modifiedTW);
    
    const result = await client.verify(testCode);
    results.push({
      offset,
      valid: result.valid,
      reason: result.reason,
    });
    
    const status = result.valid ? '✅' : '❌';
    const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;
    console.log(`   TW offset ${offsetStr}: ${status} (TW=${modifiedTW})`);
    
    await sleep(50);
  }
  
  // Analyze tolerance window
  const toleranceWindow = results
    .filter(r => r.valid)
    .map(r => r.offset);
  
  // Check for vulnerabilities
  // A secure system should only accept TW within ±1-2 windows (30-60 seconds)
  const acceptedFuture = results.filter(r => r.offset > 2 && r.valid);
  const acceptedPast = results.filter(r => r.offset < -2 && r.valid);
  
  const vulnerable = acceptedFuture.length > 0 || acceptedPast.length > 0;
  
  let conclusion: string;
  if (toleranceWindow.length === 0) {
    conclusion = 'ATTENTION: Aucun TW accepté - vérification peut être trop stricte ou signatures invalides';
  } else if (vulnerable) {
    const futureOffsets = acceptedFuture.map(r => r.offset).join(', ');
    const pastOffsets = acceptedPast.map(r => r.offset).join(', ');
    conclusion = `VULNÉRABLE: Fenêtre TW trop large! Future: [${futureOffsets}], Passé: [${pastOffsets}]`;
  } else {
    const minOffset = Math.min(...toleranceWindow);
    const maxOffset = Math.max(...toleranceWindow);
    conclusion = `SÉCURISÉ: Fenêtre TW correcte [${minOffset}, ${maxOffset}] (${toleranceWindow.length} offsets acceptés)`;
  }
  
  console.log(`   ${vulnerable ? '❌' : '✅'} ${conclusion}`);
  
  return {
    originalTW,
    results,
    toleranceWindow,
    vulnerable,
    conclusion,
  };
}

/**
 * Build a test code with specific TW
 * Note: Signatures will be invalid, but we're testing TW validation logic
 */
function buildTestCode(tw: number): string {
  const ce = randomBytes(16).toString('hex');
  const qsig = randomBytes(32).toString('hex');
  const b3 = randomBytes(32).toString('hex');
  
  return `HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f50m50|COG:F50C50V50S50Cr50|TW:${tw}|CE:${ce}|QSIG:${qsig}|B3:${b3}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
