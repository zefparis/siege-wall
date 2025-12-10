# 🏰 HCS-U7 Siege Wall

Attack simulation system for testing the HCS-U7 backend security.

## Overview

The Siege Wall continuously attacks the HCS-U7 backend to prove its resistance against various attack vectors. A successful attack (where the backend incorrectly validates a forged code) indicates a security vulnerability.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  SIEGE WALL                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌──────────────┐  │
│  │ Attack      │────▶│ HCS-U7      │────▶│ Results      │  │
│  │ Engine      │     │ Backend     │     │ Dashboard    │  │
│  │ (Node.js)   │◀────│ (Render)    │◀────│ (Next.js)    │  │
│  └─────────────┘     └─────────────┘     └──────────────┘  │
│        │                                        ▲          │
│        │         WebSocket (live updates)       │          │
│        └────────────────────────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Attack Types

| Attack | Description |
|--------|-------------|
| **brute-force** | Generates random HCS codes with valid structure but random signatures |
| **replay** | Reuses previously captured codes to test replay protection |
| **expired-code** | Sends codes with expired time windows (TW) |
| **malformed** | Tests parser robustness with malformed inputs (SQL injection, XSS, etc.) |
| **timing** | Measures response times to detect timing side-channels |
| **gradient** | Attempts to optimize cognitive scores through iterative mutations |
| **ai-simulation** | Simulates AI-generated patterns (balanced values, sequences, etc.) |

## Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your HCS-U7 API key
```

## Configuration

```env
# Backend HCS-U7
HCS_BACKEND_URL=https://hcs-u7-backend-production.up.railway.app
HCS_API_KEY=hcs_sk_test_...

# Siege config
ATTACK_RATE_PER_SECOND=10
ATTACK_DURATION_HOURS=24

# Dashboard
DASHBOARD_PORT=3001
```

## Usage

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start

# Run tests
npm test
```

## Dashboard

Open `http://localhost:3001` to view the real-time attack dashboard:

- **Total Attacks**: Number of attacks executed
- **Success Rate**: Percentage of attacks that bypassed security (should be 0%)
- **Avg Response**: Average backend response time
- **Live Feed**: Real-time attack results
- **Live Verification**: Interactive "Test Defense" button to verify system responsiveness in real-time

## Success Criteria

The HCS-U7 backend is considered secure if:

- Success rate = **0.000000%**
- No breach alerts
- All attack types consistently rejected
- Response times are consistent (no timing leaks)
- ✅ No breach alerts
- ✅ All attack types consistently rejected
- ✅ Response times are consistent (no timing leaks)

## Security Notes

- This tool is for authorized security testing only
- Never run against production systems without permission
- API keys should be kept secure and rotated regularly

## License

MIT
