import { useSiegeStore } from '../../store/siegeStore';
import { formatNumber, formatCompactNumber } from '../../utils/formatters';
import { Activity, Zap, Target, Cpu } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  color?: string;
}

function StatCard({ icon, label, value, subtext, color = 'cyan' }: StatCardProps) {
  return (
    <div className="bg-bg-secondary/50 rounded-lg p-2 md:p-3 border border-cyan/10">
      <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
        <div className={`text-${color}`}>{icon}</div>
        <span className="text-[10px] md:text-xs text-text-secondary uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className={`font-mono text-lg md:text-xl font-bold text-${color}`}>
        {value}
      </div>
      {subtext && (
        <div className="text-[10px] md:text-xs text-text-secondary mt-0.5 md:mt-1">
          {subtext}
        </div>
      )}
    </div>
  );
}

export function StatsPanel() {
  const stats = useSiegeStore((state) => state.stats);

  return (
    <div className="card card-glow p-3 md:p-4">
      <h2 className="font-display text-xs md:text-sm text-cyan tracking-wider mb-3 md:mb-4">
        LIVE STATISTICS
      </h2>
      
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <StatCard
          icon={<Activity className="w-4 h-4" />}
          label="Attacks/sec"
          value={formatNumber(stats.attacks_per_second)}
          subtext="Current rate"
        />
        
        <StatCard
          icon={<Zap className="w-4 h-4" />}
          label="Total"
          value={formatCompactNumber(stats.total_attacks)}
          subtext="All time"
        />
        
        <StatCard
          icon={<Target className="w-4 h-4" />}
          label="Vectors"
          value={`${stats.active_vectors}/${stats.total_vectors}`}
          subtext="Active attacks"
        />
        
        <StatCard
          icon={<Cpu className="w-4 h-4" />}
          label="Breaches"
          value={stats.breaches.toString()}
          subtext="System intact"
          color="danger"
        />
      </div>
    </div>
  );
}
