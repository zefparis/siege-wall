# HCS-U7 Security Audit Module

Real security testing against the HCS-U7 cognitive authentication backend.

## Overview

This module implements **real attack tests** that attempt to find vulnerabilities in the HCS-U7 system, not just random code generation.

## Attack Types

### 1. Timing Attack (Side-channel)
Measures response times to detect information leaks in QSIG verification.
- Tests 16 QSIG prefixes (0-9, a-f)
- 50 samples per prefix
- Statistical analysis with standard deviation
- Detects anomalies > 2σ from mean

### 2. Replay Attack (Anti-replay)
Tests if the same valid code can be used multiple times.
- Generates valid code from backend
- Tests immediate replay
- Tests parallel replay (10 simultaneous requests)
- Tests delayed replay (2s delay)

### 3. Time Window Boundary Attack
Tests the time window (TW) validation boundaries.
- Tests offsets: -100, -10, -5, -3, -2, -1, 0, +1, +2, +3, +5, +10, +100
- Identifies tolerance window
- Detects overly permissive TW validation

### 4. Signature Forgery Attack
Attempts to forge valid signatures by analyzing patterns.
- Collects 10 valid codes for analysis
- Analyzes QSIG and B3 patterns
- Attempts 20 forgery techniques:
  - XOR of known signatures
  - Average bytes
  - Part swapping
  - Increment/decrement
  - Bit flipping
  - Common weak values

### 5. Brute Force Attack
Tests resistance to random code generation with statistics.
- Configurable duration (default: 30s)
- Generates well-formed random HCS codes
- Calculates theoretical time to break
- Reports requests/second and response times

### 6. Rate Limit Bypass Attack
Tests if rate limiting can be circumvented.
- Burst test: 100 simultaneous requests
- Header bypass: Spoofed X-Forwarded-For, User-Agent, etc.
- Slowloris: Gradual requests with variable delays

### 7. Celestial Entropy Analysis
Analyzes if the Celestial Entropy (CE) component is predictable.
- Collects 30 CE samples
- Measures uniqueness ratio
- Detects time correlation
- Identifies sequential patterns
- Checks for timestamp-based CE

## Usage

### Run All Tests
```bash
npm run security-audit
```

### Run Individual Tests
```bash
npm run test:timing
npm run test:replay
npm run test:time-window
npm run test:forgery
npm run test:brute-force
npm run test:rate-limit
npm run test:entropy
```

### Quick Audit (Timing + Replay + Entropy)
```bash
npm run audit:quick
```

### Full Audit with Reports
```bash
npm run audit:full
```

### Custom Options
```bash
# Run specific tests
npm run security-audit -- --timing --replay

# Extended brute force
npm run security-audit -- --brute-force --duration 120

# Save reports
npm run security-audit -- --all --output all --output-dir ./reports
```

## Output Formats

- **Console**: Formatted ASCII table
- **JSON**: Machine-readable report
- **Markdown**: Documentation-ready report

## Report Structure

```
╔════════════════════════════════════════════════════════════════════╗
║                    HCS-U7 SECURITY AUDIT REPORT                    ║
╠════════════════════════════════════════════════════════════════════╣
║ Backend: https://hcs-u7-backend-production.up.railway.app          ║
║ Date: 2025-12-09 00:00:00                                          ║
║ Version: 1.0.0                                                     ║
╠════════════════════════════════════════════════════════════════════╣
║ TEST                    │ RESULT    │ DETAILS                      ║
╠════════════════════════╪═══════════╪═══════════════════════════════╣
║ Timing Attack          │ ✅ PASS    │ No timing leak               ║
║ Replay Attack          │ ✅ PASS    │ Anti-replay active           ║
║ Time Window            │ ✅ PASS    │ ±1 window tolerance          ║
║ Signature Forgery      │ ✅ PASS    │ Crypto secure                ║
║ Brute Force            │ ✅ PASS    │ 0/5000 success               ║
║ Rate Limit             │ ⚠️ WARN    │ 20/100 blocked               ║
║ Entropy                │ ✅ PASS    │ 95% unique                   ║
╠════════════════════════════════════════════════════════════════════╣
║ OVERALL SCORE: 94/100 [█████████░]                                 ║
║ VULNERABILITIES: 0 critical, 1 warning                             ║
╚════════════════════════════════════════════════════════════════════╝
```

## Exit Codes

- `0`: All tests passed
- `1`: Vulnerabilities found
- `2`: Audit failed (e.g., backend unreachable)

## Configuration

Set in `.env`:
```env
HCS_BACKEND_URL=https://hcs-u7-backend-production.up.railway.app
HCS_API_KEY=HCS-U7|V:7.0|...
```

## Files

```
src/security-audit/
├── types.ts           # Type definitions
├── api-client.ts      # HTTP client with precise timing
├── attacks/
│   ├── index.ts
│   ├── timing-attack.ts
│   ├── replay-attack.ts
│   ├── time-window-attack.ts
│   ├── forgery-attack.ts
│   ├── brute-force-attack.ts
│   ├── rate-limit-attack.ts
│   └── entropy-attack.ts
├── report-generator.ts # Report formatting
├── runner.ts          # Main entry point
└── index.ts           # Module exports
```
