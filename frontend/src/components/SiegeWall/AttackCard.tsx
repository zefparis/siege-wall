/**
 * AttackCard Component
 * Displays a single attack attempt with status and details
 */
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { AttackVector, ATTACK_VECTORS } from '../../lib/siege-wall-attacks';

interface AttackCardProps {
  attack: AttackVector;
  index: number;
}

export const AttackCard: React.FC<AttackCardProps> = ({ attack, index }) => {
  const vectorInfo = ATTACK_VECTORS.find(v => v.id === attack.type);
  const isBreach = attack.status === 'BREACH';
  
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`
        relative overflow-hidden rounded-lg border backdrop-blur-sm
        ${isBreach 
          ? 'bg-red-950/80 border-red-500 animate-pulse' 
          : 'bg-slate-900/80 border-slate-700/50'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700/30">
        <div className="flex items-center gap-2">
          <span className="text-lg">{vectorInfo?.icon || '❓'}</span>
          <div>
            <div className="text-xs font-mono text-slate-400">Attack Vector</div>
            <div className="text-sm font-bold text-white">{vectorInfo?.name || attack.type}</div>
          </div>
        </div>
        <div className={`
          px-2 py-1 rounded text-xs font-bold font-mono
          ${isBreach 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }
        `}>
          {attack.status}
        </div>
      </div>
      
      {/* Method */}
      <div className="px-3 py-2 border-b border-slate-700/30">
        <div className="text-xs text-cyan-400 font-mono">{attack.method}</div>
      </div>
      
      {/* Details */}
      <div className="px-3 py-2 border-b border-slate-700/30">
        <div className="text-xs text-slate-500 truncate">{attack.details}</div>
      </div>
      
      {/* Footer Stats */}
      <div className="flex items-center justify-between px-3 py-2 text-xs font-mono text-slate-500">
        <span>{new Date(attack.timestamp).toLocaleTimeString()}</span>
        <span>{attack.responseTime}ms</span>
        <span>Conf: {(attack.confidence * 100).toFixed(0)}%</span>
      </div>
      
      {/* Breach Warning Overlay */}
      {isBreach && (
        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-500 animate-bounce" />
        </div>
      )}
    </motion.div>
  );
};

export default AttackCard;
