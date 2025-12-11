/**
 * SiegeWallStats Component
 * Displays live statistics for the siege wall
 */
import { Shield, Zap, Activity, Target } from 'lucide-react';
import { SiegeStats } from '../../lib/siege-wall-attacks';

interface SiegeWallStatsProps {
  stats: SiegeStats;
  formatUptime: (seconds: number) => string;
}

export const SiegeWallStats: React.FC<SiegeWallStatsProps> = ({
  stats,
  formatUptime,
}) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
      <h2 className="text-sm font-mono text-slate-400 mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4" />
        LIVE STATISTICS
      </h2>
      
      <div className="space-y-4">
        {/* Total Attacks */}
        <div>
          <div className="text-xs text-slate-500 font-mono">TOTAL ATTACKS</div>
          <div className="text-3xl font-bold text-cyan-400 font-mono">
            {stats.totalAttacks.toLocaleString()}
          </div>
        </div>
        
        {/* Success Rate */}
        <div>
          <div className="text-xs text-slate-500 font-mono">DEFENSE RATE</div>
          <div className="text-2xl font-bold text-green-400 font-mono">
            {stats.successRate.toFixed(6)}%
          </div>
        </div>
        
        {/* Breaches */}
        <div>
          <div className="text-xs text-slate-500 font-mono">BREACHES</div>
          <div className={`text-2xl font-bold font-mono ${
            stats.breaches > 0 ? 'text-red-500 animate-pulse' : 'text-green-400'
          }`}>
            {stats.breaches}
          </div>
        </div>
        
        {/* Uptime */}
        <div>
          <div className="text-xs text-slate-500 font-mono">UPTIME</div>
          <div className="text-lg font-mono text-slate-300">
            {formatUptime(stats.uptime)}
          </div>
        </div>
        
        {/* Attack Rate */}
        <div>
          <div className="text-xs text-slate-500 font-mono">ATTACKS/SEC</div>
          <div className="text-lg font-mono text-yellow-400">
            {stats.attacksPerSecond.toFixed(2)}
          </div>
        </div>
      </div>
      
      {/* Defense Vectors */}
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <h3 className="text-xs text-slate-500 font-mono mb-3">DEFENSE VECTORS</h3>
        <div className="space-y-2">
          <VectorStatus 
            icon={<Shield className="w-3 h-3" />}
            label="Cognitive"
            status={stats.vectors.cognitive.active ? 'ACTIVE' : 'INACTIVE'}
            value={`${stats.vectors.cognitive.blocked} blocked`}
            isActive={stats.vectors.cognitive.active}
          />
          <VectorStatus 
            icon={<Zap className="w-3 h-3" />}
            label="Celestial"
            status={stats.vectors.celestial.synced ? 'SYNCED' : 'DESYNCED'}
            value={`${stats.vectors.celestial.entropy.toFixed(1)}% entropy`}
            isActive={stats.vectors.celestial.synced}
          />
          <VectorStatus 
            icon={<Target className="w-3 h-3" />}
            label="Quantum"
            status={stats.vectors.quantum.secure ? 'SECURE' : 'VULNERABLE'}
            value={stats.vectors.quantum.hardening}
            isActive={stats.vectors.quantum.secure}
          />
          <VectorStatus 
            icon={<Activity className="w-3 h-3" />}
            label="Behavioral"
            status={stats.vectors.behavioral.monitoring ? 'MONITORING' : 'OFFLINE'}
            value={`${stats.vectors.behavioral.anomalies} anomalies`}
            isActive={stats.vectors.behavioral.monitoring}
          />
        </div>
      </div>
    </div>
  );
};

interface VectorStatusProps {
  icon: React.ReactNode;
  label: string;
  status: string;
  value: string;
  isActive: boolean;
}

const VectorStatus: React.FC<VectorStatusProps> = ({
  icon,
  label,
  status,
  value,
  isActive,
}) => (
  <div className="flex items-center justify-between text-xs">
    <div className="flex items-center gap-2">
      <span className={isActive ? 'text-green-400' : 'text-red-400'}>
        {icon}
      </span>
      <span className="text-slate-400">{label}</span>
    </div>
    <div className="text-right">
      <div className={`font-mono ${isActive ? 'text-green-400' : 'text-red-400'}`}>
        {status}
      </div>
      <div className="text-slate-500 text-[10px]">{value}</div>
    </div>
  </div>
);

export default SiegeWallStats;
