/**
 * SIGNATURE FORGERY ATTACK
 * Attempts to forge valid signatures by analyzing patterns
 */

import { randomBytes } from 'crypto';
import { SecurityAuditClient } from '../api-client';
import { ForgeryResult } from '../types';

const VALID_CODES_TO_COLLECT = 10;
const FORGERY_ATTEMPTS = 20;

export async function runForgeryAttack(client: SecurityAuditClient): Promise<ForgeryResult> {
  console.log('\n🔓 Starting Signature Forgery Attack...');
  
  // Step 1: Collect valid codes for pattern analysis
  console.log(`   Collecting ${VALID_CODES_TO_COLLECT} valid codes for analysis...`);
  const validCodes: string[] = [];
  const elements = ['E', 'F', 'W', 'A'];
  
  for (let i = 0; i < VALID_CODES_TO_COLLECT; i++) {
    const signResponse = await client.sign(
      `forgery_test_${Date.now()}_${i}`,
      70 + i
    );
    
    if (signResponse.success && signResponse.data?.hcsCode) {
      validCodes.push(signResponse.data.hcsCode);
      process.stdout.write(`   Collected ${validCodes.length}/${VALID_CODES_TO_COLLECT}\r`);
    }
    
    await sleep(100);
  }
  
  console.log(`\n   Collected ${validCodes.length} valid codes`);
  
  if (validCodes.length < 2) {
    return {
      validCodesCollected: validCodes.length,
      qsigPatterns: [],
      b3Patterns: [],
      forgedAttempts: 0,
      forgedSuccesses: 0,
      vulnerable: false,
      conclusion: 'SKIP: Pas assez de codes valides collectés pour l\'analyse',
    };
  }
  
  // Step 2: Extract and analyze signatures
  console.log('   Analyzing signature patterns...');
  const qsigs = validCodes.map(c => c.match(/QSIG:([a-f0-9]+)/i)?.[1] || '');
  const b3s = validCodes.map(c => c.match(/B3:([a-f0-9]+)/i)?.[1] || '');
  const ces = validCodes.map(c => c.match(/CE:([a-f0-9]+)/i)?.[1] || '');
  const tws = validCodes.map(c => c.match(/TW:(\d+)/)?.[1] || '');
  
  // Analyze patterns
  const qsigPatterns = analyzePatterns(qsigs);
  const b3Patterns = analyzePatterns(b3s);
  
  console.log(`   QSIG patterns: ${qsigPatterns.join(', ') || 'none detected'}`);
  console.log(`   B3 patterns: ${b3Patterns.join(', ') || 'none detected'}`);
  
  // Step 3: Attempt forgery using various techniques
  console.log(`   Attempting ${FORGERY_ATTEMPTS} signature forgeries...`);
  let forgedSuccesses = 0;
  
  const forgeryTechniques = [
    // XOR of known signatures
    () => xorSignatures(qsigs),
    // Average bytes
    () => averageSignatures(qsigs),
    // Swap parts between codes
    () => swapParts(qsigs),
    // Increment/decrement bytes
    () => incrementSignature(qsigs[0]),
    // Bit flip
    () => bitFlipSignature(qsigs[0]),
    // Null signature
    () => '0'.repeat(64),
    // All F's
    () => 'f'.repeat(64),
    // Repeated pattern
    () => 'deadbeef'.repeat(8),
    // Random
    () => randomBytes(32).toString('hex'),
  ];
  
  for (let i = 0; i < FORGERY_ATTEMPTS; i++) {
    const technique = forgeryTechniques[i % forgeryTechniques.length];
    const forgedQsig = technique();
    const forgedB3 = randomBytes(32).toString('hex');
    const currentTw = Math.floor(Date.now() / 1000 / 30);
    
    // Build forged code using structure from valid codes
    const baseCode = validCodes[0];
    const forgedCode = baseCode
      .replace(/QSIG:[a-f0-9]+/i, `QSIG:${forgedQsig}`)
      .replace(/B3:[a-f0-9]+/i, `B3:${forgedB3}`)
      .replace(/TW:\d+/, `TW:${currentTw}`);
    
    const result = await client.verify(forgedCode);
    
    if (result.valid) {
      forgedSuccesses++;
      console.log(`   ⚠️ FORGED CODE ACCEPTED! Technique: ${i % forgeryTechniques.length}`);
    }
    
    await sleep(50);
  }
  
  console.log(`   Forgery results: ${forgedSuccesses}/${FORGERY_ATTEMPTS} accepted`);
  
  const vulnerable = forgedSuccesses > 0;
  
  let conclusion: string;
  if (vulnerable) {
    conclusion = `VULNÉRABLE: ${forgedSuccesses} signatures forgées acceptées!`;
  } else {
    conclusion = 'SÉCURISÉ: Toutes les signatures forgées rejetées - crypto robuste';
  }
  
  console.log(`   ${vulnerable ? '❌' : '✅'} ${conclusion}`);
  
  return {
    validCodesCollected: validCodes.length,
    qsigPatterns,
    b3Patterns,
    forgedAttempts: FORGERY_ATTEMPTS,
    forgedSuccesses,
    vulnerable,
    conclusion,
  };
}

/**
 * Analyze patterns in signatures
 */
function analyzePatterns(signatures: string[]): string[] {
  const patterns: string[] = [];
  
  if (signatures.length < 2) return patterns;
  
  // Check for common prefixes
  const commonPrefix = findCommonPrefix(signatures);
  if (commonPrefix.length > 2) {
    patterns.push(`common_prefix:${commonPrefix}`);
  }
  
  // Check for common suffixes
  const commonSuffix = findCommonSuffix(signatures);
  if (commonSuffix.length > 2) {
    patterns.push(`common_suffix:${commonSuffix}`);
  }
  
  // Check for sequential patterns
  const firstBytes = signatures.map(s => parseInt(s.slice(0, 2), 16));
  if (isSequential(firstBytes)) {
    patterns.push('sequential_first_byte');
  }
  
  return patterns;
}

function findCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return '';
  let prefix = strings[0];
  for (const s of strings) {
    while (!s.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}

function findCommonSuffix(strings: string[]): string {
  return findCommonPrefix(strings.map(s => s.split('').reverse().join('')))
    .split('').reverse().join('');
}

function isSequential(numbers: number[]): boolean {
  for (let i = 1; i < numbers.length; i++) {
    if (Math.abs(numbers[i] - numbers[i - 1]) > 5) return false;
  }
  return true;
}

/**
 * Forgery techniques
 */
function xorSignatures(signatures: string[]): string {
  if (signatures.length < 2) return randomBytes(32).toString('hex');
  
  const bytes1 = Buffer.from(signatures[0], 'hex');
  const bytes2 = Buffer.from(signatures[1], 'hex');
  const result = Buffer.alloc(Math.min(bytes1.length, bytes2.length));
  
  for (let i = 0; i < result.length; i++) {
    result[i] = bytes1[i] ^ bytes2[i];
  }
  
  return result.toString('hex');
}

function averageSignatures(signatures: string[]): string {
  if (signatures.length === 0) return randomBytes(32).toString('hex');
  
  const length = signatures[0].length / 2;
  const result = Buffer.alloc(length);
  
  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (const sig of signatures) {
      sum += parseInt(sig.slice(i * 2, i * 2 + 2), 16);
    }
    result[i] = Math.floor(sum / signatures.length);
  }
  
  return result.toString('hex');
}

function swapParts(signatures: string[]): string {
  if (signatures.length < 2) return randomBytes(32).toString('hex');
  
  const half = Math.floor(signatures[0].length / 2);
  return signatures[0].slice(0, half) + signatures[1].slice(half);
}

function incrementSignature(signature: string): string {
  const bytes = Buffer.from(signature, 'hex');
  bytes[0] = (bytes[0] + 1) % 256;
  return bytes.toString('hex');
}

function bitFlipSignature(signature: string): string {
  const bytes = Buffer.from(signature, 'hex');
  bytes[0] ^= 0x01; // Flip least significant bit
  return bytes.toString('hex');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
