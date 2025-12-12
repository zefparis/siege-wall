import { useState } from 'react';
import { Home } from 'lucide-react';
import { useWebSocket } from './hooks/useWebSocket';
import { SiegeWall } from './components/Layout/SiegeWall';
import SiegeWallLive from './components/SiegeWallDemo';

function App() {
  const [showSiege, setShowSiege] = useState(true); // Default to siege wall
  
  // Initialize WebSocket connection for original view
  useWebSocket();

  return (
    <>
      {/* View Toggle */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <a
          href="https://hcs-u7.com"
          className="px-3 py-1.5 text-xs font-mono rounded transition-all bg-slate-800 text-slate-400 hover:bg-slate-700 flex items-center gap-1.5"
        >
          <Home className="w-3 h-3" />
          ACCUEIL
        </a>
        <button
          onClick={() => setShowSiege(false)}
          className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
            !showSiege 
              ? 'bg-cyan-500 text-black' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          MONITOR
        </button>
        <button
          onClick={() => setShowSiege(true)}
          className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
            showSiege 
              ? 'bg-red-500 text-white' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          SIEGE WALL
        </button>
      </div>
      
      {showSiege ? <SiegeWallLive /> : <SiegeWall />}
    </>
  );
}

export default App;
