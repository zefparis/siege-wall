/**
 * RATE LIMIT BYPASS ATTACK
 * Tests if rate limiting can be circumvented
 */

import { randomBytes } from 'crypto';
import { SecurityAuditClient } from '../api-client';
import { RateLimitResult } from '../types';

const BURST_SIZE = 100;
const HEADER_BYPASS_ATTEMPTS = 50;

export async function runRateLimitAttack(client: SecurityAuditClient): Promise<RateLimitResult> {
  console.log('\n🚦 Starting Rate Limit Bypass Attack...');
  
  const baseUrl = client.getBackendUrl();
  
  // Test 1: Burst of requests (same IP)
  console.log(`   Test 1: Burst attack (${BURST_SIZE} simultaneous requests)...`);
  const burstResults = await runBurstTest(baseUrl, BURST_SIZE);
  console.log(`   Burst results: ${burstResults.blocked}/${burstResults.attempts} blocked (${((burstResults.blocked / burstResults.attempts) * 100).toFixed(0)}%)`);
  
  // Test 2: Header manipulation bypass
  console.log(`   Test 2: Header bypass attack (${HEADER_BYPASS_ATTEMPTS} requests with spoofed headers)...`);
  const headerResults = await runHeaderBypassTest(baseUrl, HEADER_BYPASS_ATTEMPTS);
  console.log(`   Header bypass: ${headerResults.blocked}/${headerResults.attempts} blocked`);
  
  // Test 3: Slowloris-style attack (slow requests)
  console.log('   Test 3: Slowloris-style attack (gradual requests)...');
  const slowlorisResults = await runSlowlorisTest(baseUrl, 30);
  console.log(`   Slowloris: ${slowlorisResults.blocked}/${slowlorisResults.attempts} blocked`);
  
  // Analyze results
  const burstBlockRate = burstResults.blocked / burstResults.attempts;
  const headerBypassSuccessful = headerResults.blocked < headerResults.attempts * 0.5;
  
  // System is vulnerable if:
  // - Less than 50% of burst requests are blocked
  // - Header bypass is successful
  const vulnerable = burstBlockRate < 0.5 || headerBypassSuccessful;
  
  let conclusion: string;
  if (burstBlockRate >= 0.8) {
    conclusion = `SÉCURISÉ: Rate limiting actif (${(burstBlockRate * 100).toFixed(0)}% des bursts bloqués)`;
  } else if (burstBlockRate >= 0.5) {
    conclusion = `ATTENTION: Rate limiting partiel (${(burstBlockRate * 100).toFixed(0)}% bloqués)`;
  } else {
    conclusion = `VULNÉRABLE: Rate limiting faible (${(burstBlockRate * 100).toFixed(0)}% bloqués)`;
  }
  
  if (headerBypassSuccessful) {
    conclusion += ' - Header bypass possible!';
  }
  
  console.log(`   ${vulnerable ? '❌' : '✅'} ${conclusion}`);
  
  return {
    burstTest: {
      attempts: burstResults.attempts,
      blocked: burstResults.blocked,
      successRate: 1 - burstBlockRate,
    },
    headerBypassTest: {
      attempts: headerResults.attempts,
      blocked: headerResults.blocked,
      bypassSuccessful: headerBypassSuccessful,
    },
    slowlorisTest: {
      attempts: slowlorisResults.attempts,
      blocked: slowlorisResults.blocked,
    },
    vulnerable,
    conclusion,
  };
}

/**
 * Burst test - send many requests simultaneously
 */
async function runBurstTest(baseUrl: string, count: number): Promise<{ attempts: number; blocked: number }> {
  const code = generateRandomCode();
  let blocked = 0;
  
  const promises = Array(count).fill(null).map(async () => {
    try {
      const response = await fetch(`${baseUrl}/v1/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      
      if (response.status === 429) {
        return true; // Blocked
      }
      return false;
    } catch {
      return true; // Consider errors as blocked
    }
  });
  
  const results = await Promise.all(promises);
  blocked = results.filter(r => r).length;
  
  return { attempts: count, blocked };
}

/**
 * Header bypass test - try to bypass rate limiting with different headers
 */
async function runHeaderBypassTest(baseUrl: string, count: number): Promise<{ attempts: number; blocked: number }> {
  let blocked = 0;
  
  for (let i = 0; i < count; i++) {
    const code = generateRandomCode();
    
    try {
      const response = await fetch(`${baseUrl}/v1/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `SecurityBot-${i}-${randomBytes(4).toString('hex')}`,
          'X-Forwarded-For': `192.168.${Math.floor(i / 255)}.${i % 255}`,
          'X-Real-IP': `10.0.${Math.floor(i / 255)}.${i % 255}`,
          'X-Client-IP': `172.16.${Math.floor(i / 255)}.${i % 255}`,
          'CF-Connecting-IP': `8.8.${Math.floor(i / 255)}.${i % 255}`,
        },
        body: JSON.stringify({ code }),
      });
      
      if (response.status === 429) {
        blocked++;
      }
    } catch {
      blocked++;
    }
    
    // Small delay between requests
    await sleep(20);
  }
  
  return { attempts: count, blocked };
}

/**
 * Slowloris-style test - gradual requests to avoid detection
 */
async function runSlowlorisTest(baseUrl: string, count: number): Promise<{ attempts: number; blocked: number }> {
  let blocked = 0;
  
  for (let i = 0; i < count; i++) {
    const code = generateRandomCode();
    
    try {
      const response = await fetch(`${baseUrl}/v1/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      
      if (response.status === 429) {
        blocked++;
      }
    } catch {
      blocked++;
    }
    
    // Variable delay to simulate human-like behavior
    const delay = 100 + Math.random() * 200;
    await sleep(delay);
  }
  
  return { attempts: count, blocked };
}

function generateRandomCode(): string {
  const tw = Math.floor(Date.now() / 1000 / 30);
  return `HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f50m50|COG:F50C50V50S50Cr50|TW:${tw}|CE:${randomBytes(16).toString('hex')}|QSIG:${randomBytes(32).toString('hex')}|B3:${randomBytes(32).toString('hex')}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
