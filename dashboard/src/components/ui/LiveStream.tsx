'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Attack {
  attackType: string;
  timestamp: string;
  success: boolean;
  responseTimeMs: number;
  payload: string;
}

interface LiveStreamProps {
  attacks: Attack[];
}

function getAttackIcon(type: string) {
  const icons: Record<string, string> = {
    'replay': '🔄',
    'timing': '⏱️',
    'forgery': '🔓',
    'entropy': '🎲',
    'brute-force': '🔨',
    'injection': '💉',
    'overflow': '📦',
  };
  return icons[type.toLowerCase()] || '⚡';
}

function getAttackColor(success: boolean) {
  return success ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
}

export function LiveStream({ attacks }: LiveStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [attacks]);

  return (
    <section className="px-4 md:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <span className="text-2xl">📡</span>
              Live Attack Stream
            </h2>
            <p className="text-sm text-white/40 mt-1">Real-time attack monitoring</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-medium text-cyan-400">Streaming</span>
          </div>
        </div>

        {/* Terminal */}
        <div className="relative rounded-2xl bg-black border border-white/10 overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-white/40 font-mono ml-2">siege-wall — attack-stream</span>
          </div>

          {/* Stream content */}
          <div 
            ref={scrollRef}
            className="h-80 overflow-y-auto p-4 font-mono text-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
          >
            <AnimatePresence mode="popLayout">
              {attacks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-full text-white/30"
                >
                  <span>Waiting for attacks...</span>
                </motion.div>
              ) : (
                attacks.slice(0, 50).map((attack, i) => (
                  <motion.div
                    key={`${attack.timestamp}-${i}`}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-2"
                  >
                    <div className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                      {/* Timestamp */}
                      <span className="text-white/30 text-xs whitespace-nowrap">
                        {new Date(attack.timestamp).toLocaleTimeString()}
                      </span>

                      {/* Icon */}
                      <span className="text-lg">{getAttackIcon(attack.attackType)}</span>

                      {/* Attack type */}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getAttackColor(attack.success)}`}>
                        {attack.success ? 'BREACH' : 'BLOCKED'}
                      </span>

                      {/* Details */}
                      <span className="text-white/60 flex-1 truncate">
                        <span className="text-cyan-400">{attack.attackType}</span>
                        <span className="text-white/30 mx-2">→</span>
                        <span className="text-white/40">{attack.responseTimeMs}ms</span>
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
}
