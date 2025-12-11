/**
 * SiegeWallHeader Component
 * Header section with title, connection status, and siege toggle button
 */
import { Shield, Play, Square, Wifi, WifiOff } from 'lucide-react';

interface SiegeWallHeaderProps {
  isConnected: boolean;
  isLive: boolean;
  onToggleSiege: () => void;
}

export const SiegeWallHeader: React.FC<SiegeWallHeaderProps> = ({
  isConnected,
  isLive,
  onToggleSiege,
}) => {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Shield className="w-8 h-8 text-cyan-400" />
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-wider text-cyan-400">
            HCS-U7 SIEGE WALL
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            LIVE SECURITY CHALLENGE • REAL ATTACKS
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono ${
          isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {isConnected ? 'CONNECTED' : 'OFFLINE'}
        </div>
        
        {/* Live Toggle */}
        <button
          onClick={onToggleSiege}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-mono font-bold text-sm
            transition-all duration-300 transform hover:scale-105
            ${isLive 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30' 
              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black shadow-lg shadow-green-500/30'
            }
          `}
        >
          {isLive ? (
            <>
              <Square className="w-4 h-4" />
              STOP SIEGE
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              TRY TO HACK
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default SiegeWallHeader;
