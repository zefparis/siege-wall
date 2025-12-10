import { useEffect, useState } from 'react';
import { useSiegeStore } from '../../store/siegeStore';
import { formatUptime } from '../../utils/formatters';

export function UptimeCounter() {
  const uptimeSeconds = useSiegeStore((state) => state.stats.uptime_seconds);
  const [localUptime, setLocalUptime] = useState(uptimeSeconds);

  // Local counter that ticks every second
  useEffect(() => {
    setLocalUptime(uptimeSeconds);
  }, [uptimeSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalUptime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card card-glow p-3 md:p-6 flex flex-col items-center">
      <div className="text-text-secondary text-[10px] md:text-xs tracking-wider mb-1 md:mb-2">
        UPTIME
      </div>
      <div className="font-mono text-xl md:text-3xl font-bold text-cyan text-glow-cyan">
        {formatUptime(localUptime)}
      </div>
      <div className="mt-1 md:mt-2 text-[10px] md:text-xs text-text-secondary">
        CONTINUOUS DEFENSE
      </div>
    </div>
  );
}
