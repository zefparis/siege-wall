'use client';

import { Hero } from './Hero';
import { MetricsGrid } from './MetricsGrid';
import { HallOfShame } from './HallOfShame';
import { LiveStream } from './LiveStream';
import { GlobalMap } from './GlobalMap';
import { SecurityAudit } from '../SecurityAudit';

interface SiegeStats {
  totalAttacks: number;
  successfulAttacks: number;
  failedAttacks: number;
  attacksByType: Record<string, { total: number; success: number }>;
  avgResponseTime: number;
  startTime: string;
  lastAttack: string;
}

interface Attack {
  attackType: string;
  timestamp: string;
  success: boolean;
  responseTimeMs: number;
  payload: string;
}

interface DashboardProps {
  stats: SiegeStats;
  attacks: Attack[];
  connected: boolean;
}

export function Dashboard({ stats, attacks, connected }: DashboardProps) {
  const breachRate = stats.totalAttacks > 0 
    ? (stats.successfulAttacks / stats.totalAttacks) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-black">
      {/* Subtle noise texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content */}
      <main className="relative max-w-7xl mx-auto">
        {/* Hero section */}
        <Hero 
          breachRate={breachRate}
          totalAttacks={stats.totalAttacks}
          isConnected={connected}
        />

        {/* Metrics grid */}
        <MetricsGrid 
          totalAttacks={stats.totalAttacks}
          successfulAttacks={stats.successfulAttacks}
          avgResponseTime={stats.avgResponseTime}
          attacksByType={stats.attacksByType}
        />

        {/* Security Audit */}
        <section className="px-4 md:px-8 py-12">
          <SecurityAudit />
        </section>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <LiveStream attacks={attacks} />
          <GlobalMap />
        </div>

        {/* Hall of Shame */}
        <HallOfShame />

        {/* Footer */}
        <footer className="px-4 md:px-8 py-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                <span className="text-sm font-bold text-black">H7</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">HCS-U7 Siege Wall</p>
                <p className="text-xs text-white/40">Patents FR2514274 & FR2514546</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-white/40">
              <span>Quantum-Safe</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>BLAKE3</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Zero-Knowledge</span>
            </div>

            <p className="text-xs text-white/30">
              © 2025 IA Solution
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
