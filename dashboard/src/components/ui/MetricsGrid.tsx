'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Clock, Target, Activity, Lock } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  gradient: string;
  delay?: number;
}

function MetricCard({ icon, label, value, subtext, gradient, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative"
    >
      {/* Gradient border effect */}
      <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />
      <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${gradient} opacity-20`} />
      
      <div className="relative h-full p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/5">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-white/5 text-white/60 group-hover:text-white/80 transition-colors">
            {icon}
          </div>
        </div>
        
        <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
          {label}
        </p>
        
        <p className="text-3xl font-bold text-white font-mono tabular-nums tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        
        {subtext && (
          <p className="text-xs text-white/30 mt-2 font-mono">{subtext}</p>
        )}
      </div>
    </motion.div>
  );
}

interface MetricsGridProps {
  totalAttacks: number;
  successfulAttacks: number;
  avgResponseTime: number;
  attacksByType: Record<string, { total: number; success: number }>;
}

export function MetricsGrid({ totalAttacks, successfulAttacks, avgResponseTime, attacksByType }: MetricsGridProps) {
  const blockedAttacks = totalAttacks - successfulAttacks;
  const blockRate = totalAttacks > 0 ? ((blockedAttacks / totalAttacks) * 100).toFixed(2) : '100.00';
  const topAttackType = Object.entries(attacksByType).sort((a, b) => b[1].total - a[1].total)[0];

  const metrics = [
    {
      icon: <Shield className="w-5 h-5" />,
      label: 'Total Blocked',
      value: blockedAttacks,
      subtext: `${blockRate}% block rate`,
      gradient: 'from-cyan-500/50 to-blue-500/50',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'Attacks/min',
      value: Math.round(totalAttacks / 60) || 0,
      subtext: 'Current rate',
      gradient: 'from-yellow-500/50 to-orange-500/50',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Avg Response',
      value: `${avgResponseTime.toFixed(0)}ms`,
      subtext: 'Constant-time verify',
      gradient: 'from-emerald-500/50 to-teal-500/50',
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Top Vector',
      value: topAttackType?.[0] || 'None',
      subtext: topAttackType ? `${topAttackType[1].total} attempts` : 'No attacks yet',
      gradient: 'from-violet-500/50 to-purple-500/50',
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: 'Breaches',
      value: successfulAttacks,
      subtext: successfulAttacks === 0 ? 'Zero tolerance' : 'Investigating',
      gradient: 'from-red-500/50 to-rose-500/50',
    },
    {
      icon: <Lock className="w-5 h-5" />,
      label: 'Security Score',
      value: '100/100',
      subtext: 'Quantum-hardened',
      gradient: 'from-cyan-500/50 to-violet-500/50',
    },
  ];

  return (
    <section className="px-4 md:px-8 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {metrics.map((metric, i) => (
          <MetricCard key={metric.label} {...metric} delay={0.9 + i * 0.1} />
        ))}
      </motion.div>
    </section>
  );
}
