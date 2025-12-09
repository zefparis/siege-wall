'use client';

import { motion } from 'framer-motion';

interface AttackerData {
  rank: number;
  name: string;
  country: string;
  attempts: number;
  cost: number;
  lastSeen: string;
}

const MOCK_ATTACKERS: AttackerData[] = [
  { rank: 1, name: 'APT-SHADOW', country: '🇷🇺', attempts: 12847, cost: 128470, lastSeen: '2m ago' },
  { rank: 2, name: 'LAZARUS-7', country: '🇰🇵', attempts: 8934, cost: 89340, lastSeen: '5m ago' },
  { rank: 3, name: 'COZY-BEAR', country: '🇷🇺', attempts: 7621, cost: 76210, lastSeen: '12m ago' },
  { rank: 4, name: 'FANCY-BEAR', country: '🇷🇺', attempts: 5432, cost: 54320, lastSeen: '18m ago' },
  { rank: 5, name: 'EQUATION-X', country: '🇺🇸', attempts: 4218, cost: 42180, lastSeen: '24m ago' },
  { rank: 6, name: 'CHARMING-KITTEN', country: '🇮🇷', attempts: 3891, cost: 38910, lastSeen: '31m ago' },
  { rank: 7, name: 'SANDWORM', country: '🇷🇺', attempts: 2764, cost: 27640, lastSeen: '45m ago' },
  { rank: 8, name: 'TURLA', country: '🇷🇺', attempts: 2103, cost: 21030, lastSeen: '1h ago' },
];

function getRankBadge(rank: number) {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black';
  if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-black';
  if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
  return 'bg-white/5 text-white/60';
}

export function HallOfShame() {
  return (
    <section className="px-4 md:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <span className="text-2xl">💀</span>
              Hall of Shame
            </h2>
            <p className="text-sm text-white/40 mt-1">Top failed attackers ranked by wasted resources</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <span className="text-xs font-medium text-red-400">Live</span>
          </div>
        </div>

        {/* Table */}
        <div className="relative rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden backdrop-blur-xl">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Threat Actor</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Origin</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-white/40 uppercase tracking-wider">Attempts</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-white/40 uppercase tracking-wider">Cost Wasted</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-white/40 uppercase tracking-wider">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ATTACKERS.map((attacker, i) => (
                  <motion.tr
                    key={attacker.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 + i * 0.05 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${getRankBadge(attacker.rank)}`}>
                        {attacker.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border border-white/5">
                          <span className="text-lg">👤</span>
                        </div>
                        <span className="font-mono font-medium text-white">{attacker.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-2xl">{attacker.country}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-white/80">{attacker.attempts.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-emerald-400">${attacker.cost.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-white/40 text-sm">{attacker.lastSeen}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
