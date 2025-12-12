'use client';

import { motion } from 'framer-motion';

interface AttackTypeChartProps {
  attacksByType: Record<string, { total: number; success: number }>;
}

const typeConfig: Record<string, { color: string; bgColor: string; icon: string }> = {
  'brute-force': { color: '#f97316', bgColor: 'bg-orange-500', icon: '🔨' },
  'replay': { color: '#a855f7', bgColor: 'bg-purple-500', icon: '🔄' },
  'timing': { color: '#3b82f6', bgColor: 'bg-blue-500', icon: '⏱️' },
  'gradient': { color: '#ec4899', bgColor: 'bg-pink-500', icon: '📈' },
  'ai-simulation': { color: '#ef4444', bgColor: 'bg-red-500', icon: '🤖' },
  'expired-code': { color: '#eab308', bgColor: 'bg-yellow-500', icon: '⌛' },
  'malformed': { color: '#6b7280', bgColor: 'bg-gray-500', icon: '💢' },
};

export function AttackTypeChart({ attacksByType }: AttackTypeChartProps) {
  const entries = Object.entries(attacksByType);
  const maxTotal = Math.max(...entries.map(([, data]) => data.total), 1);

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-black/60 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/30 bg-cyan-500/5">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-lg">📊</span>
          <span className="font-mono text-cyan-400 uppercase tracking-wider text-sm font-bold">
            Attack Distribution
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {entries.length} types
        </span>
      </div>

      {/* Chart */}
      <div className="p-4 space-y-3">
        {entries.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No attack data yet
          </div>
        ) : (
          entries
            .sort(([, a], [, b]) => b.total - a.total)
            .map(([type, data], index) => {
              const config = typeConfig[type] || { color: '#6b7280', bgColor: 'bg-gray-500', icon: '❓' };
              const percentage = (data.total / maxTotal) * 100;
              
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  {/* Label row */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{config.icon}</span>
                      <span className="text-xs font-mono text-gray-300 uppercase">
                        {type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-400">
                        {data.total.toLocaleString()}
                      </span>
                      <span className={data.success > 0 ? 'text-red-400' : 'text-green-400'}>
                        {data.success} breach
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
                      className={`h-full ${config.bgColor} rounded-full relative`}
                      style={{ 
                        boxShadow: `0 0 10px ${config.color}40`,
                      }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent 
                                      -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })
        )}
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-cyan-500/30 bg-cyan-500/5">
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-400">0% breach = secure</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-400">&gt;0% breach = vulnerability</span>
          </div>
        </div>
      </div>
    </div>
  );
}
