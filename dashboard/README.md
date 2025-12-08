# 🏰 HCS-U7 Siege Wall Dashboard

Cyberpunk-style real-time dashboard for monitoring the HCS-U7 attack defense system.

## Features

- **Matrix Rain Background** - Animated falling characters effect
- **3D Global Attack Map** - Interactive globe showing attack origins
- **Live Attack Feed** - Real-time stream of blocked attacks
- **Stats Grid** - Animated counters with glow effects
- **Attack Distribution Chart** - Visual breakdown by attack type
- **Hall of Shame** - Leaderboard of failed AI attackers
- **Security Layers** - Status of all protection mechanisms

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **react-globe.gl** - 3D globe visualization
- **WebSocket** - Real-time data streaming

## Getting Started

### Prerequisites

Make sure the Siege Wall backend is running:

```bash
cd ../
npm run dev
```

### Install & Run

```bash
npm install
npm run dev -- -p 3002
```

Open [http://localhost:3002](http://localhost:3002) to view the dashboard.

## Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## Design

The dashboard uses a cyberpunk aesthetic with:

- **Colors**: Cyan (#00ffff), Green (#00ff00), Red (#ff0000)
- **Fonts**: JetBrains Mono (code), Orbitron (headers)
- **Effects**: Glow, scanlines, Matrix rain, pulse animations

## Components

| Component | Description |
|-----------|-------------|
| `MatrixRain` | Canvas-based falling characters |
| `GlobalMap` | 3D globe with attack arcs |
| `StatsGrid` | Animated stat cards |
| `LiveFeed` | Scrolling attack log |
| `AttackTypeChart` | Distribution bars |
| `HallOfShame` | AI attacker leaderboard |
| `SecurityLayers` | Protection status grid |

## License

MIT - IA Solution
