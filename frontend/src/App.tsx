import { useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { SiegeWall } from './components/Layout/SiegeWall';
import SiegeWallDemo from './components/SiegeWallDemo';

function App() {
  const [showDemo, setShowDemo] = useState(true); // Default to new demo
  
  // Initialize WebSocket connection for original view
  useWebSocket();

  return (
    <>
      {/* View Toggle */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setShowDemo(false)}
          className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
            !showDemo 
              ? 'bg-cyan-500 text-black' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          MONITOR
        </button>
        <button
          onClick={() => setShowDemo(true)}
          className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
            showDemo 
              ? 'bg-red-500 text-white' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          SIEGE DEMO
        </button>
      </div>
      
      {showDemo ? <SiegeWallDemo /> : <SiegeWall />}
    </>
  );
}

export default App;
