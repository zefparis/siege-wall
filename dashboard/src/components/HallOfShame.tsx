'use client';

import { motion } from 'framer-motion';

interface AttackerStats {
  name: string;
  icon: string;
  attempts: number;
  successes: number;
  costWasted: number;
  model: string;
}

const MOCK_ATTACKERS: AttackerStats[] = [
  { name: 'GPT-4 Turbo', icon: '🤖', attempts: 847293, successes: 0, costWasted: 12847, model: 'OpenAI' },
  { name: 'Claude 3 Opus', icon: '🧠', attempts: 623182, successes: 0, costWasted: 9347, model: 'Anthropic' },
  { name: 'Gemini Ultra', icon: '💎', attempts: 412847, successes: 0, costWasted: 6192, model: 'Google' },
  { name: 'Llama 3 70B', icon: '🦙', attempts: 284719, successes: 0, costWasted: 2847, model: 'Meta' },
  { name: 'Mistral Large', icon: '🌬️', attempts: 156482, successes: 0, costWasted: 1564, model: 'Mistral' },
];

interface HallOfShameProps {
  stats: {
    totalAttacks: number;
    successfulAttacks: number;
  };
}

export function HallOfShame({ stats }: HallOfShameProps) {
  // Scale mock data based on real attack count
  const scaleFactor = stats.totalAttacks > 0 ? stats.totalAttacks / 2324523 : 1;
  
  const attackers = MOCK_ATTACKERS.map((a, i) => ({
    ...a,
    attempts: Math.floor(a.attempts * scaleFactor * (1 - i * 0.1)),
    costWasted: Math.floor(a.costWasted * scaleFactor * (1 - i * 0.1)),
  }));

  const totalWasted = attackers.reduce((sum, a) => sum + a.costWasted, 0);

  return (
    <div className="rounded-xl border border-red-500/30 bg-black/60 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-red-500/30 bg-linear-to-r from-red-500/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <h3 className="font-bold text-red-400 uppercase tracking-wider">
                Hall of Shame
              </h3>
              <p className="text-xs text-gray-500">
                Top AI models that failed to breach HCS-U7
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Total $ Wasted</div>
            <div className="text-xl font-bold text-red-400 font-mono">
              ${totalWasted.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="divide-y divide-red-500/10">
        {attackers.map((attacker, index) => (
          <motion.div
            key={attacker.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-4 hover:bg-red-500/5 transition-colors group"
          >
            {/* Rank */}
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
              ${index === 0 ? 'bg-yellow-500/20 text-yellow-400 ring-2 ring-yellow-500/50' :
                index === 1 ? 'bg-gray-400/20 text-gray-300 ring-2 ring-gray-400/50' :
                index === 2 ? 'bg-orange-600/20 text-orange-400 ring-2 ring-orange-500/50' :
                'bg-gray-700/50 text-gray-500'}
            `}>
              #{index + 1}
            </div>

            {/* Icon & Name */}
            <div className="flex items-center gap-3 w-40 shrink-0">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {attacker.icon}
              </span>
              <div>
                <div className="font-mono text-white font-medium">
                  {attacker.name}
                </div>
                <div className="text-xs text-gray-500">
                  {attacker.model}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500 text-xs">Attempts</div>
                <div className="font-mono text-cyan-400 font-medium">
                  {attacker.attempts.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Breaches</div>
                <div className="font-mono text-green-400 font-medium">
                  {attacker.successes}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">$ Wasted</div>
                <div className="font-mono text-red-400 font-medium">
                  ${attacker.costWasted.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Success rate bar */}
            <div className="w-32 shrink-0">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-red-500 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
              <div className="text-xs text-center text-red-400 mt-1 font-mono">
                0.000% success
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-red-500/30 bg-linear-to-r from-red-500/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-2xl">💸</span>
            <span className="text-gray-400">
              Combined AI costs wasted trying to breach HCS-U7:
            </span>
          </div>
          <motion.span 
            className="text-2xl font-bold text-red-400 font-mono"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ${totalWasted.toLocaleString()}
          </motion.span>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">
          * Estimated costs based on API pricing. No AI has ever successfully breached HCS-U7.
        </p>
      </div>
    </div>
  );
}
