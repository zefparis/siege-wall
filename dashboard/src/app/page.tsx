'use client';

import { useWebSocket } from '@/hooks/useWebSocket';
import { Dashboard } from '@/components/ui/Dashboard';

// WebSocket URL - connects to the Siege Wall backend
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002';

export default function SiegeWallDashboard() {
  const { stats, attacks, connected } = useWebSocket(WS_URL);

  return (
    <Dashboard 
      stats={stats}
      attacks={attacks}
      connected={connected}
    />
  );
}
