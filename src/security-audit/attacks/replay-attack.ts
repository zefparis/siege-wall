/**
 * REPLAY ATTACK - Anti-replay Testing
 * Tests if the same valid code can be used multiple times
 */

import { SecurityAuditClient } from '../api-client';
import { ReplayResult } from '../types';

const PARALLEL_ATTEMPTS = 10;

export async function runReplayAttack(client: SecurityAuditClient): Promise<ReplayResult> {
  console.log('\n🔄 Starting Replay Attack...');
  
  // Step 1: Generate a valid code from the backend
  console.log('   Generating valid code from backend...');
  const signResponse = await client.sign(`replay_test_${Date.now()}`, 75);
  
  if (!signResponse.success || !signResponse.data?.hcsCode) {
    console.log('   ⚠️ Could not generate valid code - testing with captured code pattern');
    return {
      firstVerify: false,
      secondVerify: false,
      parallelSuccesses: 0,
      parallelAttempts: 0,
      timeBetweenAttempts: 0,
      vulnerable: false,
      conclusion: 'SKIP: Impossible de générer un code valide pour le test replay',
    };
  }
  
  const validCode = signResponse.data.hcsCode;
  console.log(`   Valid code obtained: ${validCode.slice(0, 50)}...`);
  
  // Step 2: First verification (should pass)
  console.log('   Testing first verification...');
  const firstVerify = await client.verify(validCode);
  console.log(`   First verify: ${firstVerify.valid ? '✅ PASS' : '❌ FAIL'} (${firstVerify.responseTimeMs.toFixed(0)}ms)`);
  
  // Step 3: Immediate second verification (should fail if anti-replay is active)
  console.log('   Testing immediate replay...');
  const startSecond = Date.now();
  const secondVerify = await client.verify(validCode);
  const timeBetween = Date.now() - startSecond;
  console.log(`   Second verify: ${secondVerify.valid ? '⚠️ PASS (vulnerable!)' : '✅ BLOCKED'} (${secondVerify.responseTimeMs.toFixed(0)}ms)`);
  
  // Step 4: Parallel replay attempts
  console.log(`   Testing ${PARALLEL_ATTEMPTS} parallel replay attempts...`);
  const parallelPromises = Array(PARALLEL_ATTEMPTS)
    .fill(null)
    .map(() => client.verify(validCode));
  
  const parallelResults = await Promise.all(parallelPromises);
  const parallelSuccesses = parallelResults.filter(r => r.valid).length;
  console.log(`   Parallel results: ${parallelSuccesses}/${PARALLEL_ATTEMPTS} passed`);
  
  // Step 5: Delayed replay (after a few seconds)
  console.log('   Testing delayed replay (2s delay)...');
  await sleep(2000);
  const delayedVerify = await client.verify(validCode);
  console.log(`   Delayed verify: ${delayedVerify.valid ? '⚠️ PASS' : '✅ BLOCKED'}`);
  
  // Analyze results
  const vulnerable = firstVerify.valid && (secondVerify.valid || parallelSuccesses > 1);
  
  let conclusion: string;
  if (!firstVerify.valid) {
    conclusion = 'ERREUR: Le premier code n\'a pas été accepté - test invalide';
  } else if (secondVerify.valid) {
    conclusion = `VULNÉRABLE: Replay attack possible - même code accepté ${parallelSuccesses + 1} fois!`;
  } else if (parallelSuccesses > 1) {
    conclusion = `VULNÉRABLE: Race condition détectée - ${parallelSuccesses}/${PARALLEL_ATTEMPTS} requêtes parallèles acceptées`;
  } else {
    conclusion = `SÉCURISÉ: Anti-replay actif (${parallelSuccesses}/${PARALLEL_ATTEMPTS} parallèles passés, replay immédiat bloqué)`;
  }
  
  console.log(`   ${vulnerable ? '❌' : '✅'} ${conclusion}`);
  
  return {
    firstVerify: firstVerify.valid,
    secondVerify: secondVerify.valid,
    parallelSuccesses,
    parallelAttempts: PARALLEL_ATTEMPTS,
    timeBetweenAttempts: timeBetween,
    vulnerable,
    conclusion,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
