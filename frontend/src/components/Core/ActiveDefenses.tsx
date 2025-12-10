import { motion } from 'framer-motion';
import { Brain, Sparkles, Lock, Radio } from 'lucide-react';

const defenses = [
  {
    id: 'cognitive',
    name: 'Cognitive Firewall',
    icon: Brain,
    status: 'ACTIVE',
    detail: 'Neural Pattern Matching',
    color: 'text-pink-500'
  },
  {
    id: 'celestial',
    name: 'Celestial Entropy',
    icon: Sparkles,
    status: 'SYNCED',
    detail: 'Atmospheric Noise Stream',
    color: 'text-cyan-400'
  },
  {
    id: 'quantum',
    name: 'Quantum Hardening',
    icon: Lock,
    status: 'SECURE',
    detail: 'Post-Quantum Sig.',
    color: 'text-violet-500'
  },
  {
    id: 'behavioral',
    name: 'Behavioral Biometrics',
    icon: Radio,
    status: 'MONITORING',
    detail: 'Micro-movement Analysis',
    color: 'text-emerald-400'
  }
];

export function ActiveDefenses() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 w-full max-w-4xl gap-2 md:gap-4 mt-4 md:mt-6">
      {defenses.map((defense, index) => (
        <motion.div
          key={defense.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-2 md:p-3 flex flex-col items-center text-center group hover:border-white/20 transition-colors"
        >
          <div className={`p-1.5 md:p-2 rounded-full bg-white/5 mb-1 md:mb-2 ${defense.color} group-hover:scale-110 transition-transform`}>
            <defense.icon className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          
          <div className="text-[10px] md:text-xs font-mono text-white/40 mb-1 tracking-wider uppercase leading-tight">
            {defense.name}
          </div>
          
          <div className={`text-xs md:text-sm font-bold font-mono ${defense.color} flex items-center gap-1 md:gap-2`}>
            <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current`}></span>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-current`}></span>
            </span>
            {defense.status}
          </div>
          
          <div className="text-[8px] md:text-[10px] text-white/30 mt-1 hidden sm:block">
            {defense.detail}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
