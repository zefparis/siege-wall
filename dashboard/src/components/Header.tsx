'use client';

import { motion } from 'framer-motion';

interface HeaderProps {
  connected: boolean;
  totalAttacks: number;
}

export function Header({ connected, totalAttacks }: HeaderProps) {
  return (
    <header className="text-center py-8 relative">
      {/* ASCII Art Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-4"
      >
        <pre className="text-cyan-400 text-[8px] sm:text-[10px] md:text-xs leading-tight font-mono hidden sm:block text-glow-cyan">
{`██╗  ██╗ ██████╗███████╗   ██╗   ██╗███████╗    ███████╗██╗███████╗ ██████╗ ███████╗
██║  ██║██╔════╝██╔════╝   ██║   ██║╚════██║    ██╔════╝██║██╔════╝██╔════╝ ██╔════╝
███████║██║     ███████╗   ██║   ██║    ██╔╝    ███████╗██║█████╗  ██║  ███╗█████╗  
██╔══██║██║     ╚════██║   ██║   ██║   ██╔╝     ╚════██║██║██╔══╝  ██║   ██║██╔══╝  
██║  ██║╚██████╗███████║   ╚██████╔╝   ██║      ███████║██║███████╗╚██████╔╝███████╗
╚═╝  ╚═╝ ╚═════╝╚══════╝    ╚═════╝    ╚═╝      ╚══════╝╚═╝╚══════╝ ╚═════╝ ╚══════╝`}
        </pre>
        
        {/* Mobile title */}
        <h1 className="sm:hidden text-3xl font-bold text-cyan-400 text-glow-cyan">
          HCS-U7 SIEGE
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="space-y-2"
      >
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
          🏰 LIVE ATTACK DEFENSE SYSTEM
        </h2>
        
        {/* Status indicators */}
        <div className="flex items-center justify-center gap-6 text-sm">
          {/* Connection status */}
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className={connected ? 'text-green-400' : 'text-red-400'}>
              {connected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>

          {/* Divider */}
          <span className="text-gray-600">|</span>

          {/* Attack counter */}
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">⚔️</span>
            <span className="text-gray-400">
              <span className="text-cyan-400 font-bold">{totalAttacks.toLocaleString()}</span> attacks processed
            </span>
          </div>
        </div>

        {/* Tech badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {['Quantum-Safe Signatures', '30s Rotation', 'BLAKE3', 'Celestial Entropy'].map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="px-3 py-1 text-xs rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Decorative lines */}
      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
    </header>
  );
}
