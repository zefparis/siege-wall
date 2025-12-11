/**
 * HallOfShame Component
 * Displays the most frequently attempted attack methods
 */
import { Skull } from 'lucide-react';

interface HallOfShameProps {
  entries: { method: string; count: number }[];
}

export const HallOfShame: React.FC<HallOfShameProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <h2 className="text-sm font-mono text-slate-400 mb-4 flex items-center gap-2">
          <Skull className="w-4 h-4" />
          HALL OF SHAME
        </h2>
        <p className="text-xs text-slate-500 font-mono text-center py-4">
          No attacks recorded yet
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...entries.map(e => e.count));

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
      <h2 className="text-sm font-mono text-slate-400 mb-4 flex items-center gap-2">
        <Skull className="w-4 h-4" />
        HALL OF SHAME
      </h2>
      
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div key={entry.method} className="relative">
            {/* Progress bar background */}
            <div 
              className="absolute inset-0 bg-red-500/10 rounded"
              style={{ width: `${(entry.count / maxCount) * 100}%` }}
            />
            
            {/* Content */}
            <div className="relative flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">
                  #{index + 1}
                </span>
                <span className="text-xs font-mono text-slate-300 truncate max-w-[120px]">
                  {entry.method}
                </span>
              </div>
              <span className="text-xs font-mono text-red-400">
                {entry.count}x
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallOfShame;
