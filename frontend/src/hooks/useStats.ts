import { useEffect } from 'react';
import { useSiegeStore } from '../store/siegeStore';
import { INTERVALS } from '../utils/constants';

/**
 * Hook to manage uptime counter updates
 */
export function useUptimeCounter() {
  const stats = useSiegeStore((state) => state.stats);
  const setStats = useSiegeStore((state) => state.setStats);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        ...stats,
        uptime_seconds: stats.uptime_seconds + 1,
      });
    }, INTERVALS.UPTIME_UPDATE);

    return () => clearInterval(interval);
  }, [stats, setStats]);

  return stats.uptime_seconds;
}

/**
 * Hook to get current stats
 */
export function useCurrentStats() {
  return useSiegeStore((state) => state.stats);
}

/**
 * Hook to get attack stream
 */
export function useAttackStream() {
  return useSiegeStore((state) => state.attacks);
}

/**
 * Hook to get attacker leaderboard
 */
export function useAttackerLeaderboard() {
  const attackers = useSiegeStore((state) => state.attackers);
  return [...attackers].sort((a, b) => b.total_attempts - a.total_attempts);
}

/**
 * Hook to get milestones
 */
export function useMilestones() {
  return useSiegeStore((state) => state.milestones);
}

/**
 * Hook to get connection status
 */
export function useConnectionStatus() {
  return useSiegeStore((state) => state.connected);
}
