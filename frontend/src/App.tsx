import { useWebSocket } from './hooks/useWebSocket';
import { SiegeWall } from './components/Layout/SiegeWall';

function App() {
  // Initialize WebSocket connection
  useWebSocket();

  return <SiegeWall />;
}

export default App;
