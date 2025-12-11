/**
 * AttackVectorPanel Component
 * Panel for manually triggering specific attack vectors
 */
import { ChevronRight, Zap } from 'lucide-react';
import { ATTACK_VECTORS } from '../../lib/siege-wall-attacks';

interface AttackVectorPanelProps {
  selectedVector: string | null;
  isManualAttacking: boolean;
  onExecuteAttack: (vectorId: string) => void;
}

export const AttackVectorPanel: React.FC<AttackVectorPanelProps> = ({
  selectedVector,
  isManualAttacking,
  onExecuteAttack,
}) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
      <h2 className="text-sm font-mono text-slate-400 mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4" />
        ATTACK VECTORS
      </h2>
      
      <div className="grid grid-cols-2 gap-2">
        {ATTACK_VECTORS.map((vector) => (
          <button
            key={vector.id}
            onClick={() => onExecuteAttack(vector.id)}
            disabled={isManualAttacking}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-left
              transition-all duration-200 border
              ${selectedVector === vector.id
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-800/50 border-slate-700/30 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600/50'
              }
              ${isManualAttacking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="text-lg">{vector.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono truncate">{vector.name}</div>
            </div>
            <ChevronRight className={`w-3 h-3 transition-transform ${
              selectedVector === vector.id ? 'translate-x-1' : ''
            }`} />
          </button>
        ))}
      </div>
      
      {isManualAttacking && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 rounded-full">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-xs font-mono text-cyan-400">
              Executing attack...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttackVectorPanel;
