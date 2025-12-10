import { useSiegeStore } from '../../store/siegeStore';
import { formatSuccessRate } from '../../utils/formatters';

export function SuccessRate() {
  const successRate = useSiegeStore((state) => state.stats.success_rate);

  return (
    <div className="card card-glow p-3 lg:p-6 flex flex-col items-center">
      <div className="text-text-secondary text-[10px] lg:text-xs tracking-wider mb-1 lg:mb-2">
        SUCCESS RATE
      </div>
      <div className="font-mono text-2xl lg:text-4xl font-bold text-danger text-glow-red">
        {formatSuccessRate(successRate)}
      </div>
      <div className="mt-1 lg:mt-2 text-[10px] lg:text-xs text-text-secondary">
        AI BREACH PROBABILITY
      </div>
    </div>
  );
}
