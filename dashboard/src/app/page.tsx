'use client';

import { useWebSocket } from '@/hooks/useWebSocket';
import { 
  MatrixRain, 
  Header, 
  StatsGrid, 
  LiveFeed, 
  AttackTypeChart,
  HallOfShame, 
  GlobalMap,
  SecurityLayers,
  SecurityAudit,
} from '@/components';

// WebSocket URL - connects to the Siege Wall backend
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002';

export default function SiegeWallDashboard() {
  const { stats, attacks, connected } = useWebSocket(WS_URL);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden cyber-grid noise-overlay">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Container */}
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          
          {/* Header */}
          <Header connected={connected} totalAttacks={stats.totalAttacks} />

          {/* Stats Grid */}
          <section className="mb-8">
            <StatsGrid stats={stats} />
          </section>

          {/* Main Grid - Globe & Live Feed */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Global Attack Map */}
            <section>
              <h2 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <span>🌍</span>
                <span>Global Attack Map</span>
              </h2>
              <GlobalMap attacks={attacks} />
            </section>

            {/* Live Attack Feed */}
            <section>
              <h2 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                <span>📜</span>
                <span>Live Attack Stream</span>
              </h2>
              <LiveFeed attacks={attacks} />
            </section>
          </div>

          {/* Security Audit - Auto-runs on startup */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <span>🔒</span>
              <span>Live Security Audit</span>
            </h2>
            <SecurityAudit />
          </section>

          {/* Secondary Grid - Charts & Security */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Attack Distribution */}
            <section>
              <AttackTypeChart attacksByType={stats.attacksByType} />
            </section>

            {/* Security Layers */}
            <section>
              <SecurityLayers />
            </section>
          </div>

          {/* Hall of Shame */}
          <section className="mb-8">
            <HallOfShame stats={stats} />
          </section>

          {/* Footer */}
          <footer className="text-center py-8 border-t border-gray-800/50">
            <div className="space-y-3">
              <p className="text-gray-500 text-sm">
                🏰 <span className="text-cyan-400">HCS-U7 Siege Wall</span> • 
                Patents FR2514274 & FR2514546 • 
                © 2025 IA Solution
              </p>
              <p className="text-xs text-gray-600">
                <span className="text-green-400 font-bold">{stats.successfulAttacks} breaches</span> since deployment • 
                <span className="text-cyan-400 font-bold ml-2">{stats.totalAttacks.toLocaleString()}</span> attacks blocked
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                <span>Quantum-Safe</span>
                <span>•</span>
                <span>BLAKE3</span>
                <span>•</span>
                <span>30s Rotation</span>
                <span>•</span>
                <span>Celestial Entropy</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-scan" />
      </div>
    </div>
  );
}
