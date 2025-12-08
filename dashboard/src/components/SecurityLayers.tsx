'use client';

import { motion } from 'framer-motion';

const SECURITY_LAYERS = [
  {
    name: 'Quantum-Safe Signatures',
    description: 'QSIG/B3 cryptographic validation',
    icon: '🔐',
    color: 'cyan',
    status: 'active',
  },
  {
    name: 'BLAKE3 Hash Verification',
    description: 'High-speed cryptographic hashing',
    icon: '🔒',
    color: 'green',
    status: 'active',
  },
  {
    name: 'Time Window Validation',
    description: '30-second rotation windows',
    icon: '⏱️',
    color: 'yellow',
    status: 'active',
  },
  {
    name: 'Celestial Entropy',
    description: 'Astronomical data integration',
    icon: '🌌',
    color: 'purple',
    status: 'active',
  },
  {
    name: 'Cognitive Fingerprint',
    description: 'Human behavior analysis',
    icon: '🧠',
    color: 'pink',
    status: 'active',
  },
  {
    name: 'Rate Limiting',
    description: 'Anti-brute-force protection',
    icon: '🛡️',
    color: 'orange',
    status: 'active',
  },
];

const colorClasses: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  cyan: { border: 'border-cyan-500/50', bg: 'bg-cyan-500/10', text: 'text-cyan-400', glow: 'shadow-cyan-500/30' },
  green: { border: 'border-green-500/50', bg: 'bg-green-500/10', text: 'text-green-400', glow: 'shadow-green-500/30' },
  yellow: { border: 'border-yellow-500/50', bg: 'bg-yellow-500/10', text: 'text-yellow-400', glow: 'shadow-yellow-500/30' },
  purple: { border: 'border-purple-500/50', bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'shadow-purple-500/30' },
  pink: { border: 'border-pink-500/50', bg: 'bg-pink-500/10', text: 'text-pink-400', glow: 'shadow-pink-500/30' },
  orange: { border: 'border-orange-500/50', bg: 'bg-orange-500/10', text: 'text-orange-400', glow: 'shadow-orange-500/30' },
};

export function SecurityLayers() {
  return (
    <div className="rounded-xl border border-purple-500/30 bg-black/60 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-purple-500/30 bg-purple-500/5">
        <div className="flex items-center gap-2">
          <span className="text-purple-400 text-lg">🛡️</span>
          <span className="font-mono text-purple-400 uppercase tracking-wider text-sm font-bold">
            Active Security Layers
          </span>
        </div>
      </div>

      {/* Layers grid */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {SECURITY_LAYERS.map((layer, index) => {
          const colors = colorClasses[layer.color];
          
          return (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative p-3 rounded-lg border ${colors.border} ${colors.bg}
                hover:shadow-lg ${colors.glow} transition-all duration-300
                group cursor-default
              `}
            >
              {/* Status indicator */}
              <div className="absolute top-2 right-2">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.bg} opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 bg-green-400`} />
                </span>
              </div>

              {/* Content */}
              <div className="flex items-start gap-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {layer.icon}
                </span>
                <div className="min-w-0">
                  <div className={`font-mono text-xs font-bold ${colors.text} truncate`}>
                    {layer.name}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
                    {layer.description}
                  </div>
                </div>
              </div>

              {/* Active badge */}
              <div className={`mt-2 text-[10px] ${colors.text} font-mono uppercase tracking-wider`}>
                ● Active
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-purple-500/30 bg-purple-500/5 text-center">
        <span className="text-xs text-gray-500">
          All {SECURITY_LAYERS.length} security layers operational • 
          <span className="text-green-400 ml-1">System integrity: 100%</span>
        </span>
      </div>
    </div>
  );
}
