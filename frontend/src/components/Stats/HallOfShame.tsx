import { useSiegeStore } from '../../store/siegeStore';
import { formatCompactNumber } from '../../utils/formatters';
import { Trophy } from 'lucide-react';

const MEDALS = ['🥇', '🥈', '🥉'];

export function HallOfShame() {
  const attackers = useSiegeStore((state) => state.attackers);
  
  // Sort by total attempts descending
  const sortedAttackers = [...attackers]
    .sort((a, b) => b.total_attempts - a.total_attempts)
    .slice(0, 5);

  return (
    <div className="card card-glow p-3 md:p-4 flex-1">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <Trophy className="w-4 h-4 text-accent-orange" />
        <h2 className="font-display text-xs md:text-sm text-cyan tracking-wider">
          HALL OF SHAME
        </h2>
      </div>

      {sortedAttackers.length === 0 ? (
        <div className="text-center text-text-secondary text-xs md:text-sm py-4">
          No attackers yet...
        </div>
      ) : (
        <div className="space-y-1.5 md:space-y-2">
          {sortedAttackers.map((attacker, index) => (
            <div
              key={attacker.id}
              className="flex items-center justify-between bg-bg-secondary/50 rounded px-2 md:px-3 py-1.5 md:py-2"
            >
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="text-base md:text-lg w-5 md:w-6">
                  {index < 3 ? MEDALS[index] : `${index + 1}.`}
                </span>
                <span className="font-mono text-xs md:text-sm text-white truncate max-w-[80px] md:max-w-[120px]">
                  {attacker.name}
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="font-mono text-[10px] md:text-xs text-text-secondary">
                  {formatCompactNumber(attacker.total_attempts)} fails
                </span>
                <span className="font-mono text-[10px] md:text-xs text-danger font-bold">
                  0%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
