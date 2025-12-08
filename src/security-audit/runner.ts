/**
 * HCS-U7 Security Audit Runner
 * Main entry point for running security tests
 */

import { config } from 'dotenv';
config();

import { SecurityAuditClient } from './api-client';
import {
  runTimingAttack,
  runReplayAttack,
  runTimeWindowAttack,
  runForgeryAttack,
  runBruteForceAttack,
  runRateLimitAttack,
  runEntropyAnalysis,
} from './attacks';
import {
  SecurityTestReport,
  TestResultSummary,
  TestStatus,
} from './types';
import {
  generateReport,
  generateJSONReport,
  generateMarkdownReport,
  calculateOverallScore,
} from './report-generator';
import * as fs from 'fs';
import * as path from 'path';

interface AuditOptions {
  tests?: string[];
  bruteForceSeconds?: number;
  outputFormat?: 'console' | 'json' | 'markdown' | 'all';
  outputDir?: string;
}

const DEFAULT_OPTIONS: AuditOptions = {
  tests: ['timing', 'replay', 'timeWindow', 'forgery', 'bruteForce', 'rateLimit', 'entropy'],
  bruteForceSeconds: 30,
  outputFormat: 'console',
  outputDir: './reports',
};

export async function runSecurityAudit(options: AuditOptions = {}): Promise<SecurityTestReport> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║           HCS-U7 SECURITY AUDIT - REAL ATTACK TESTS             ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  
  const client = new SecurityAuditClient();
  
  // Check backend health
  console.log('\n🔍 Checking backend health...');
  const healthy = await client.health();
  if (!healthy) {
    console.log('❌ Backend is not responding. Aborting audit.');
    throw new Error('Backend health check failed');
  }
  console.log('✅ Backend is healthy');
  
  const report: SecurityTestReport = {
    timestamp: new Date(),
    backend: client.getBackendUrl(),
    version: '1.0.0',
    tests: {},
    summary: [],
    overallScore: 0,
    vulnerabilities: [],
    warnings: [],
    recommendations: [],
  };
  
  const testsToRun = opts.tests || [];
  
  // Run each test
  if (testsToRun.includes('timing')) {
    try {
      const start = Date.now();
      report.tests.timing = await runTimingAttack(client);
      const duration = Date.now() - start;
      
      report.summary.push({
        name: 'Timing Attack',
        status: getStatus(report.tests.timing.vulnerable, false),
        details: report.tests.timing.conclusion.split(':')[1]?.trim() || report.tests.timing.conclusion,
        duration,
      });
      
      if (report.tests.timing.vulnerable) {
        report.vulnerabilities.push('Timing side-channel leak detected');
        report.recommendations.push('Implement constant-time comparison for QSIG verification');
      }
    } catch (error: any) {
      report.summary.push({
        name: 'Timing Attack',
        status: 'error',
        details: error.message,
        duration: 0,
      });
    }
  }
  
  if (testsToRun.includes('replay')) {
    try {
      const start = Date.now();
      report.tests.replay = await runReplayAttack(client);
      const duration = Date.now() - start;
      
      report.summary.push({
        name: 'Replay Attack',
        status: getStatus(report.tests.replay.vulnerable, report.tests.replay.conclusion.includes('SKIP')),
        details: report.tests.replay.conclusion.split(':')[1]?.trim() || report.tests.replay.conclusion,
        duration,
      });
      
      if (report.tests.replay.vulnerable) {
        report.vulnerabilities.push('Replay attack possible - codes can be reused');
        report.recommendations.push('Implement nonce or one-time-use token mechanism');
      }
    } catch (error: any) {
      report.summary.push({
        name: 'Replay Attack',
        status: 'error',
        details: error.message,
        duration: 0,
      });
    }
  }
  
  if (testsToRun.includes('timeWindow')) {
    try {
      const start = Date.now();
      report.tests.timeWindow = await runTimeWindowAttack(client);
      const duration = Date.now() - start;
      
      report.summary.push({
        name: 'Time Window',
        status: getStatus(report.tests.timeWindow.vulnerable, false),
        details: report.tests.timeWindow.conclusion.split(':')[1]?.trim() || report.tests.timeWindow.conclusion,
        duration,
      });
      
      if (report.tests.timeWindow.vulnerable) {
        report.warnings.push('Time window tolerance is too large');
        report.recommendations.push('Reduce TW tolerance to ±1 window (30 seconds)');
      }
    } catch (error: any) {
      report.summary.push({
        name: 'Time Window',
        status: 'error',
        details: error.message,
        duration: 0,
      });
    }
  }
  
  if (testsToRun.includes('forgery')) {
    try {
      const start = Date.now();
      report.tests.forgery = await runForgeryAttack(client);
      const duration = Date.now() - start;
      
      report.summary.push({
        name: 'Signature Forgery',
        status: getStatus(report.tests.forgery.vulnerable, report.tests.forgery.conclusion.includes('SKIP')),
        details: report.tests.forgery.conclusion.split(':')[1]?.trim() || report.tests.forgery.conclusion,
        duration,
      });
      
      if (report.tests.forgery.vulnerable) {
        report.vulnerabilities.push('Signature forgery possible');
        report.recommendations.push('Review cryptographic implementation');
      }
    } catch (error: any) {
      report.summary.push({
        name: 'Signature Forgery',
        status: 'error',
        details: error.message,
        duration: 0,
      });
    }
  }
  
  if (testsToRun.includes('bruteForce')) {
    try {
      const start = Date.now();
      report.tests.bruteForce = await runBruteForceAttack(client, (opts.bruteForceSeconds || 30) * 1000);
      const duration = Date.now() - start;
      
      report.summary.push({
        name: 'Brute Force',
        status: getStatus(report.tests.bruteForce.vulnerable, false),
        details: `0/${report.tests.bruteForce.attempts} in ${(duration / 1000).toFixed(0)}s`,
        duration,
      });
      
      if (report.tests.bruteForce.vulnerable) {
        report.vulnerabilities.push('Brute force attack succeeded');
        report.recommendations.push('Increase cryptographic key space');
      }
    } catch (error: any) {
      report.summary.push({
        name: 'Brute Force',
        status: 'error',
        details: error.message,
        duration: 0,
      });
    }
  }
  
  if (testsToRun.includes('rateLimit')) {
    try {
      const start = Date.now();
      report.tests.rateLimit = await runRateLimitAttack(client);
      const duration = Date.now() - start;
      
      const isWarn = report.tests.rateLimit.conclusion.includes('ATTENTION');
      report.summary.push({
        name: 'Rate Limit',
        status: report.tests.rateLimit.vulnerable ? 'fail' : (isWarn ? 'warn' : 'pass'),
        details: `${report.tests.rateLimit.burstTest.blocked}/${report.tests.rateLimit.burstTest.attempts} blocked`,
        duration,
      });
      
      if (report.tests.rateLimit.vulnerable) {
        report.warnings.push('Rate limiting is weak or bypassable');
        report.recommendations.push('Implement stricter rate limiting based on IP and fingerprinting');
      }
    } catch (error: any) {
      report.summary.push({
        name: 'Rate Limit',
        status: 'error',
        details: error.message,
        duration: 0,
      });
    }
  }
  
  if (testsToRun.includes('entropy')) {
    try {
      const start = Date.now();
      report.tests.entropy = await runEntropyAnalysis(client);
      const duration = Date.now() - start;
      
      const isWarn = report.tests.entropy.conclusion.includes('ATTENTION');
      report.summary.push({
        name: 'Entropy',
        status: report.tests.entropy.vulnerable ? 'fail' : (isWarn ? 'warn' : 'pass'),
        details: `${(report.tests.entropy.entropyRatio * 100).toFixed(0)}% unique`,
        duration,
      });
      
      if (report.tests.entropy.vulnerable) {
        report.warnings.push('Celestial Entropy is predictable');
        report.recommendations.push('Use cryptographically secure random number generator for CE');
      }
    } catch (error: any) {
      report.summary.push({
        name: 'Entropy',
        status: 'error',
        details: error.message,
        duration: 0,
      });
    }
  }
  
  // Calculate overall score
  report.overallScore = calculateOverallScore(report);
  
  // Generate and output report
  console.log('\n');
  console.log(generateReport(report));
  
  // Save reports if requested
  if (opts.outputFormat === 'json' || opts.outputFormat === 'all') {
    const jsonPath = path.join(opts.outputDir || '.', `security-audit-${Date.now()}.json`);
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
    fs.writeFileSync(jsonPath, generateJSONReport(report));
    console.log(`\n📄 JSON report saved to: ${jsonPath}`);
  }
  
  if (opts.outputFormat === 'markdown' || opts.outputFormat === 'all') {
    const mdPath = path.join(opts.outputDir || '.', `security-audit-${Date.now()}.md`);
    fs.mkdirSync(path.dirname(mdPath), { recursive: true });
    fs.writeFileSync(mdPath, generateMarkdownReport(report));
    console.log(`📄 Markdown report saved to: ${mdPath}`);
  }
  
  return report;
}

function getStatus(vulnerable: boolean, skipped: boolean): TestStatus {
  if (skipped) return 'skip';
  return vulnerable ? 'fail' : 'pass';
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);
  
  const options: AuditOptions = {
    tests: [],
    outputFormat: 'console',
  };
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--all' || arg === '-a') {
      options.tests = ['timing', 'replay', 'timeWindow', 'forgery', 'bruteForce', 'rateLimit', 'entropy'];
    } else if (arg === '--timing') {
      options.tests!.push('timing');
    } else if (arg === '--replay') {
      options.tests!.push('replay');
    } else if (arg === '--time-window') {
      options.tests!.push('timeWindow');
    } else if (arg === '--forgery') {
      options.tests!.push('forgery');
    } else if (arg === '--brute-force') {
      options.tests!.push('bruteForce');
    } else if (arg === '--rate-limit') {
      options.tests!.push('rateLimit');
    } else if (arg === '--entropy') {
      options.tests!.push('entropy');
    } else if (arg === '--duration' && args[i + 1]) {
      options.bruteForceSeconds = parseInt(args[++i]);
    } else if (arg === '--output' && args[i + 1]) {
      options.outputFormat = args[++i] as any;
    } else if (arg === '--output-dir' && args[i + 1]) {
      options.outputDir = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
HCS-U7 Security Audit Tool

Usage: npm run security-audit [options]

Options:
  --all, -a           Run all tests
  --timing            Run timing attack test
  --replay            Run replay attack test
  --time-window       Run time window boundary test
  --forgery           Run signature forgery test
  --brute-force       Run brute force test
  --rate-limit        Run rate limit bypass test
  --entropy           Run entropy analysis test
  --duration <sec>    Brute force duration in seconds (default: 30)
  --output <format>   Output format: console, json, markdown, all
  --output-dir <dir>  Output directory for reports
  --help, -h          Show this help

Examples:
  npm run security-audit -- --all
  npm run security-audit -- --timing --replay
  npm run security-audit -- --brute-force --duration 60
  npm run security-audit -- --all --output all --output-dir ./reports
`);
      process.exit(0);
    }
  }
  
  // Default to all tests if none specified
  if (options.tests!.length === 0) {
    options.tests = ['timing', 'replay', 'timeWindow', 'forgery', 'bruteForce', 'rateLimit', 'entropy'];
  }
  
  try {
    const report = await runSecurityAudit(options);
    
    // Exit with error code if vulnerabilities found
    if (report.vulnerabilities.length > 0) {
      process.exit(1);
    }
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Audit failed:', error.message);
    process.exit(2);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
