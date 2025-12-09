'use client';

import { motion } from 'framer-motion';

interface HeroProps {
  breachRate: number;
  totalAttacks: number;
  isConnected: boolean;
}

export function Hero({ breachRate, totalAttacks, isConnected }: HeroProps) {
  const formattedRate = breachRate.toFixed(6);
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center justify-center py-20 px-4"
    >
      {/* Glow effect behind */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Status indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8"
      >
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
          {isConnected ? 'Shield Active' : 'Monitoring'}
        </span>
      </motion.div>

      {/* Main title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-5xl md:text-7xl font-bold text-center mb-4 tracking-tight"
      >
        <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
          HCS-U7
        </span>
        <span className="text-white/20 mx-3">×</span>
        <span className="bg-gradient-to-b from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
          Siege Wall
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-white/40 text-lg mb-12 text-center max-w-md"
      >
        Quantum-hardened authentication fortress
      </motion.p>

      {/* Breach Rate - Hero metric */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 via-red-500/10 to-red-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative px-12 py-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl">
          <p className="text-xs font-medium text-white/40 uppercase tracking-[0.2em] text-center mb-3">
            Breach Rate
          </p>
          
          <div className="flex items-baseline justify-center gap-1">
            <motion.span
              key={formattedRate}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="font-mono text-6xl md:text-8xl font-bold text-red-500 tabular-nums tracking-tight"
              style={{
                textShadow: '0 0 40px rgba(239, 68, 68, 0.4), 0 0 80px rgba(239, 68, 68, 0.2)',
              }}
            >
              {formattedRate}
            </motion.span>
            <span className="text-2xl text-red-500/60 font-mono">%</span>
          </div>

          <p className="text-center text-white/30 text-sm mt-4 font-mono">
            {totalAttacks.toLocaleString()} attacks blocked
          </p>
        </div>
      </motion.div>

      {/* Launch button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-12 relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300 animate-pulse" />
        <div className="relative px-8 py-4 bg-black rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
          <span className="font-medium text-white">Launch Full Siege</span>
        </div>
      </motion.button>
    </motion.section>
  );
}
