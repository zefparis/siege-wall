/**
 * Security Audit Report Generator
 * Generates formatted reports for security test results
 */

import { SecurityTestReport, TestResultSummary, TestStatus } from './types';

const BOX_WIDTH = 70;

export function generateReport(report: SecurityTestReport): string {
  const lines: string[] = [];
  
  // Header
  lines.push('╔' + '═'.repeat(BOX_WIDTH - 2) + '╗');
  lines.push('║' + centerText('HCS-U7 SECURITY AUDIT REPORT', BOX_WIDTH - 2) + '║');
  lines.push('╠' + '═'.repeat(BOX_WIDTH - 2) + '╣');
  
  // Metadata
  lines.push('║' + padRight(` Backend: ${report.backend}`, BOX_WIDTH - 2) + '║');
  lines.push('║' + padRight(` Date: ${report.timestamp.toISOString().replace('T', ' ').slice(0, 19)}`, BOX_WIDTH - 2) + '║');
  lines.push('║' + padRight(` Version: ${report.version}`, BOX_WIDTH - 2) + '║');
  
  // Test Results Header
  lines.push('╠' + '═'.repeat(BOX_WIDTH - 2) + '╣');
  lines.push('║' + padRight(' TEST                    │ RESULT    │ DETAILS', BOX_WIDTH - 2) + '║');
  lines.push('╠' + '═'.repeat(24) + '╪' + '═'.repeat(11) + '╪' + '═'.repeat(BOX_WIDTH - 39) + '╣');
  
  // Test Results
  for (const test of report.summary) {
    const statusIcon = getStatusIcon(test.status);
    const statusText = getStatusText(test.status);
    const details = truncate(test.details, BOX_WIDTH - 42);
    
    lines.push('║' + 
      padRight(` ${test.name}`, 24) + '│' +
      padRight(` ${statusIcon} ${statusText}`, 11) + '│' +
      padRight(` ${details}`, BOX_WIDTH - 39) + '║'
    );
  }
  
  // Overall Score
  lines.push('╠' + '═'.repeat(BOX_WIDTH - 2) + '╣');
  const scoreBar = generateScoreBar(report.overallScore);
  lines.push('║' + padRight(` OVERALL SCORE: ${report.overallScore}/100 ${scoreBar}`, BOX_WIDTH - 2) + '║');
  
  // Vulnerabilities
  const criticalCount = report.vulnerabilities.length;
  const warningCount = report.warnings.length;
  lines.push('║' + padRight(` VULNERABILITIES: ${criticalCount} critical, ${warningCount} warning`, BOX_WIDTH - 2) + '║');
  
  if (report.vulnerabilities.length > 0) {
    lines.push('╠' + '─'.repeat(BOX_WIDTH - 2) + '╣');
    lines.push('║' + padRight(' ❌ CRITICAL ISSUES:', BOX_WIDTH - 2) + '║');
    for (const vuln of report.vulnerabilities) {
      lines.push('║' + padRight(`   • ${truncate(vuln, BOX_WIDTH - 8)}`, BOX_WIDTH - 2) + '║');
    }
  }
  
  if (report.warnings.length > 0) {
    lines.push('╠' + '─'.repeat(BOX_WIDTH - 2) + '╣');
    lines.push('║' + padRight(' ⚠️  WARNINGS:', BOX_WIDTH - 2) + '║');
    for (const warn of report.warnings) {
      lines.push('║' + padRight(`   • ${truncate(warn, BOX_WIDTH - 8)}`, BOX_WIDTH - 2) + '║');
    }
  }
  
  // Recommendations
  if (report.recommendations.length > 0) {
    lines.push('╠' + '─'.repeat(BOX_WIDTH - 2) + '╣');
    lines.push('║' + padRight(' 💡 RECOMMENDATIONS:', BOX_WIDTH - 2) + '║');
    for (const rec of report.recommendations) {
      lines.push('║' + padRight(`   • ${truncate(rec, BOX_WIDTH - 8)}`, BOX_WIDTH - 2) + '║');
    }
  }
  
  // Footer
  lines.push('╚' + '═'.repeat(BOX_WIDTH - 2) + '╝');
  
  return lines.join('\n');
}

export function generateJSONReport(report: SecurityTestReport): string {
  return JSON.stringify(report, null, 2);
}

export function generateMarkdownReport(report: SecurityTestReport): string {
  const lines: string[] = [];
  
  lines.push('# HCS-U7 Security Audit Report');
  lines.push('');
  lines.push(`**Backend:** ${report.backend}`);
  lines.push(`**Date:** ${report.timestamp.toISOString()}`);
  lines.push(`**Version:** ${report.version}`);
  lines.push('');
  
  lines.push('## Test Results');
  lines.push('');
  lines.push('| Test | Result | Details |');
  lines.push('|------|--------|---------|');
  
  for (const test of report.summary) {
    const statusIcon = getStatusIcon(test.status);
    const statusText = getStatusText(test.status);
    lines.push(`| ${test.name} | ${statusIcon} ${statusText} | ${test.details} |`);
  }
  
  lines.push('');
  lines.push(`## Overall Score: ${report.overallScore}/100`);
  lines.push('');
  lines.push(generateScoreBar(report.overallScore, 20));
  lines.push('');
  
  if (report.vulnerabilities.length > 0) {
    lines.push('## ❌ Critical Vulnerabilities');
    lines.push('');
    for (const vuln of report.vulnerabilities) {
      lines.push(`- ${vuln}`);
    }
    lines.push('');
  }
  
  if (report.warnings.length > 0) {
    lines.push('## ⚠️ Warnings');
    lines.push('');
    for (const warn of report.warnings) {
      lines.push(`- ${warn}`);
    }
    lines.push('');
  }
  
  if (report.recommendations.length > 0) {
    lines.push('## 💡 Recommendations');
    lines.push('');
    for (const rec of report.recommendations) {
      lines.push(`- ${rec}`);
    }
    lines.push('');
  }
  
  // Detailed Results
  lines.push('## Detailed Results');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify(report.tests, null, 2));
  lines.push('```');
  
  return lines.join('\n');
}

function getStatusIcon(status: TestStatus): string {
  switch (status) {
    case 'pass': return '✅';
    case 'fail': return '❌';
    case 'warn': return '⚠️';
    case 'skip': return '⏭️';
    case 'error': return '💥';
    default: return '❓';
  }
}

function getStatusText(status: TestStatus): string {
  switch (status) {
    case 'pass': return 'PASS';
    case 'fail': return 'FAIL';
    case 'warn': return 'WARN';
    case 'skip': return 'SKIP';
    case 'error': return 'ERROR';
    default: return '???';
  }
}

function generateScoreBar(score: number, width: number = 10): string {
  const filled = Math.round((score / 100) * width);
  const empty = width - filled;
  return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
}

function centerText(text: string, width: number): string {
  const padding = Math.max(0, width - text.length);
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;
  return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
}

function padRight(text: string, width: number): string {
  if (text.length >= width) return text.slice(0, width);
  return text + ' '.repeat(width - text.length);
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function calculateOverallScore(report: SecurityTestReport): number {
  const weights: Record<string, number> = {
    'Timing Attack': 15,
    'Replay Attack': 20,
    'Time Window': 10,
    'Signature Forgery': 20,
    'Brute Force': 15,
    'Rate Limit': 10,
    'Entropy': 10,
  };
  
  let totalWeight = 0;
  let earnedPoints = 0;
  
  for (const test of report.summary) {
    const weight = weights[test.name] || 10;
    totalWeight += weight;
    
    switch (test.status) {
      case 'pass':
        earnedPoints += weight;
        break;
      case 'warn':
        earnedPoints += weight * 0.5;
        break;
      case 'skip':
        totalWeight -= weight; // Don't count skipped tests
        break;
      // fail and error get 0 points
    }
  }
  
  if (totalWeight === 0) return 0;
  return Math.round((earnedPoints / totalWeight) * 100);
}
