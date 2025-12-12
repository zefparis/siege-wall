'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  color: 'green' | 'red' | 'cyan' | 'yellow' | 'purple';
  icon: string;
  subtext?: string;
}

function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValueRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = previousValueRef.current;
    const endValue = value;
    
    // Skip animation if values are the same
    if (startValue === endValue) {
      return;
    }

    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        previousValueRef.current = endValue;
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

function StatCard({ label, value, prefix = '', suffix = '', color, icon, subtext }: StatCardProps) {
  const colorConfig = {
    green: {
      bg: 'from-green-500/10 to-green-900/5',
      border: 'border-green-500/40',
      text: 'text-green-400',
      glow: 'shadow-green-500/20',
    },
    red: {
      bg: 'from-red-500/10 to-red-900/5',
      border: 'border-red-500/40',
      text: 'text-red-400',
      glow: 'shadow-red-500/20',
    },
    cyan: {
      bg: 'from-cyan-500/10 to-cyan-900/5',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/20',
    },
    yellow: {
      bg: 'from-yellow-500/10 to-yellow-900/5',
      border: 'border-yellow-500/40',
      text: 'text-yellow-400',
      glow: 'shadow-yellow-500/20',
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-900/5',
      border: 'border-purple-500/40',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/20',
    },
  };

  const config = colorConfig[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3 }}
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-sm
        bg-linear-to-br ${config.bg} ${config.border}
        p-4 md:p-6 shadow-lg ${config.glow}
        hover:shadow-xl transition-all duration-300
      `}
    >
      {/* Glow orb */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 ${config.text} opacity-20 blur-3xl rounded-full`} 
           style={{ background: 'currentColor' }} />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent animate-scan opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{icon}</span>
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
            {label}
          </span>
        </div>
        
        <div className={`text-3xl md:text-4xl font-bold font-mono ${config.text}`}>
          {prefix}
          {typeof value === 'number' ? (
            <AnimatedCounter value={value} />
          ) : (
            value
          )}
          {suffix}
        </div>

        {subtext && (
          <div className="text-xs text-gray-500 mt-2">
            {subtext}
          </div>
        )}
      </div>

      {/* Corner accent */}
      <div className={`absolute bottom-0 right-0 w-16 h-16 ${config.text} opacity-5`}>
        <svg viewBox="0 0 100 100" fill="currentColor">
          <polygon points="100,0 100,100 0,100" />
        </svg>
      </div>
    </motion.div>
  );
}

interface StatsGridProps {
  stats: {
    totalAttacks: number;
    successfulAttacks: number;
    failedAttacks: number;
    avgResponseTime: number;
    successRate?: number;
    startTime?: string;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  // Calculate uptime
  const getUptime = () => {
    if (!stats.startTime) return '0h 0m';
    const start = new Date(stats.startTime).getTime();
    const now = Date.now();
    const diff = now - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <StatCard
        icon="⚔️"
        label="Total Attacks"
        value={stats.totalAttacks}
        color="cyan"
        subtext="Attempts to breach"
      />
      <StatCard
        icon="🛡️"
        label="Blocked"
        value={stats.failedAttacks}
        color="green"
        subtext="100% defense rate"
      />
      <StatCard
        icon="💀"
        label="Breach Rate"
        value={(stats.successRate ?? 0).toFixed(6)}
        suffix="%"
        color="red"
        subtext={stats.successfulAttacks === 0 ? 'IMPENETRABLE' : 'ALERT!'}
      />
      <StatCard
        icon="⚡"
        label="Avg Response"
        value={Math.round(stats.avgResponseTime || 0)}
        suffix="ms"
        color="yellow"
        subtext={`Uptime: ${getUptime()}`}
      />
    </div>
  );
}
