import { useSiegeStore } from '../../store/siegeStore';
import { AttackCard } from './AttackCard';

export function AttackStream() {
  const attacks = useSiegeStore((state) => state.attacks);

  return (
    <div className="card card-glow h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-2 md:p-3 border-b border-cyan/20">
        <h2 className="font-display text-xs md:text-sm text-cyan tracking-wider">
          ATTACK STREAM
        </h2>
        <p className="text-[10px] md:text-xs text-text-secondary mt-0.5 md:mt-1">
          Real-time rejection feed
        </p>
      </div>

      {/* Attack List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-1.5 md:p-2 space-y-1">
        {attacks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary text-xs md:text-sm">
            Waiting for attacks...
          </div>
        ) : (
          attacks.map((attack) => (
            <AttackCard key={attack.id} attack={attack} />
          ))
        )}
      </div>
    </div>
  );
}
