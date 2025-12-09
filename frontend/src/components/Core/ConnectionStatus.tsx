import { useSiegeStore } from '../../store/siegeStore';

export function ConnectionStatus() {
  const connected = useSiegeStore((state) => state.connected);

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`status-dot ${connected ? 'connected' : 'disconnected'}`}
      />
      <span className="text-xs text-text-secondary font-mono">
        {connected ? 'LIVE' : 'CONNECTING...'}
      </span>
    </div>
  );
}
