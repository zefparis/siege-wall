'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AttackResult } from '@/hooks/useWebSocket';

interface LiveFeedProps {
  attacks: AttackResult[];
}

const attackConfig: Record<string, { color: string; icon: string; label: string }> = {
  'brute-force': { color: 'text-orange-400 border-orange-400/50', icon: '🔨', label: 'BRUTE' },
  'replay': { color: 'text-purple-400 border-purple-400/50', icon: '🔄', label: 'REPLAY' },
  'timing': { color: 'text-blue-400 border-blue-400/50', icon: '⏱️', label: 'TIMING' },
  'gradient': { color: 'text-pink-400 border-pink-400/50', icon: '📈', label: 'GRAD' },
  'ai-simulation': { color: 'text-red-400 border-red-400/50', icon: '🤖', label: 'AI-SIM' },
  'expired-code': { color: 'text-yellow-400 border-yellow-400/50', icon: '⌛', label: 'EXPIR' },
  'malformed': { color: 'text-gray-400 border-gray-400/50', icon: '💢', label: 'MALFRM' },
};

export function LiveFeed({ attacks }: LiveFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [attacks.length]);

  const getConfig = (type: string) => {
    return attackConfig[type] || { color: 'text-gray-400 border-gray-400/50', icon: '❓', label: type.slice(0, 6).toUpperCase() };
  };

  const getResponseTimeColor = (ms: number) => {
    if (ms < 100) return 'bg-green-500/20 text-green-400';
    if (ms < 200) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
  };

  return (
    <div className="rounded-xl border border-green-500/30 bg-black/60 backdrop-blur-sm overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-green-500/30 bg-green-500/5">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-lg">📜</span>
          <span className="font-mono text-green-400 uppercase tracking-wider text-sm font-bold">
            Live Attack Stream
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-mono">STREAMING</span>
        </div>
      </div>

      {/* Feed */}
      <div
        ref={containerRef}
        className="h-[350px] md:h-[400px] overflow-y-auto p-2 md:p-4 font-mono text-xs md:text-sm space-y-1"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {attacks.slice(0, 100).map((attack, i) => {
            const config = getConfig(attack.attackType);
            
            return (
              <motion.div
                key={`${attack.timestamp}-${i}`}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className={`
                  flex items-center gap-2 md:gap-3 py-2 px-2 md:px-3 rounded-lg
                  border-l-2 ${attack.success ? 'border-l-red-500 bg-red-500/10' : 'border-l-green-500/50 bg-green-500/5'}
                  hover:bg-white/5 transition-colors
                `}
              >
                {/* Timestamp */}
                <span className="text-gray-500 text-[10px] md:text-xs w-20 md:w-24 shrink-0 hidden sm:block">
                  {new Date(attack.timestamp).toISOString().slice(11, 23)}
                </span>

                {/* Attack type badge */}
                <span className={`
                  px-2 py-0.5 rounded text-[10px] md:text-xs font-bold uppercase
                  bg-black/50 border ${config.color}
                  w-16 md:w-20 text-center shrink-0 flex items-center justify-center gap-1
                `}>
                  <span className="hidden md:inline">{config.icon}</span>
                  <span>{config.label}</span>
                </span>

                {/* Status */}
                <div className="flex-1 min-w-0">
                  {attack.success ? (
                    <span className="text-red-500 font-bold animate-pulse flex items-center gap-1">
                      <span>🚨</span>
                      <span>BREACH!</span>
                    </span>
                  ) : (
                    <span className="text-green-400 flex items-center gap-1">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="hidden md:inline">BLOCKED</span>
                      <span className="md:hidden">OK</span>
                    </span>
                  )}
                </div>

                {/* Response time */}
                <span className={`
                  text-[10px] md:text-xs px-2 py-0.5 rounded shrink-0
                  ${getResponseTimeColor(attack.responseTimeMs)}
                `}>
                  {attack.responseTimeMs}ms
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {attacks.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📡</div>
              <div>Waiting for attacks...</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="px-4 py-2 border-t border-green-500/30 bg-green-500/5 flex justify-between text-xs text-gray-500">
        <span>Showing {Math.min(attacks.length, 100)} of {attacks.length} attacks</span>
        <span className="text-green-400">All systems nominal</span>
      </div>
    </div>
  );
}
