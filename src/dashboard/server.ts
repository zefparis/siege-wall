import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { SiegeOrchestrator } from '../engine/orchestrator';
import { CONFIG } from '../config';
import { logger } from '../utils/logger';

export function startDashboard(orchestrator: SiegeOrchestrator): void {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  // Clients WebSocket connectés
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    logger.info(`Dashboard client connecté (${clients.size} total)`);
    
    // Envoyer stats initiales
    ws.send(JSON.stringify({
      type: 'stats',
      data: orchestrator.getStats(),
    }));

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Broadcast sur chaque attaque
  orchestrator.on('attack', (result) => {
    const message = JSON.stringify({
      type: 'attack',
      data: {
        ...result,
        stats: orchestrator.getStats(),
        successRate: orchestrator.getSuccessRate(),
      },
    });
    
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  // Alerte breach
  orchestrator.on('breach', (result) => {
    const message = JSON.stringify({
      type: 'breach',
      data: result,
    });
    
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  // API REST simple
  app.get('/api/stats', (req, res) => {
    res.json({
      stats: orchestrator.getStats(),
      successRate: orchestrator.getSuccessRate(),
    });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', running: true });
  });

  // Page HTML Dashboard
  app.get('/', (req, res) => {
    res.send(getDashboardHTML());
  });

  server.listen(CONFIG.dashboard.port, () => {
    logger.info(`📊 Dashboard: http://localhost:${CONFIG.dashboard.port}`);
  });
}

function getDashboardHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🏰 HCS-U7 Siege Wall</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%); 
      color: #0f0; 
      font-family: 'Courier New', monospace; 
      padding: 20px;
      min-height: 100vh;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 { 
      font-size: 2.5rem; 
      text-align: center; 
      margin-bottom: 30px;
      text-shadow: 0 0 20px #0f0;
      animation: glow 2s ease-in-out infinite alternate;
    }
    @keyframes glow {
      from { text-shadow: 0 0 10px #0f0, 0 0 20px #0f0; }
      to { text-shadow: 0 0 20px #0f0, 0 0 40px #0f0, 0 0 60px #0f0; }
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: rgba(0, 255, 0, 0.05);
      border: 1px solid #0f0;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
    }
    .stat-card h3 { font-size: 0.9rem; color: #888; margin-bottom: 10px; }
    .stat-card .value { font-size: 2.5rem; font-weight: bold; }
    .stat-card.danger { border-color: #f00; }
    .stat-card.danger .value { color: #f00; }
    .attacks-container {
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid #333;
      border-radius: 10px;
      padding: 20px;
    }
    .attacks-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .attacks-header h2 { font-size: 1.2rem; }
    .attacks-list {
      height: 400px;
      overflow-y: auto;
      font-size: 0.85rem;
    }
    .attack-item {
      padding: 8px 12px;
      margin: 4px 0;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .attack-item.success { 
      background: rgba(255, 0, 0, 0.2); 
      border-left: 3px solid #f00;
      animation: pulse-red 1s ease-in-out;
    }
    .attack-item.fail { 
      background: rgba(0, 255, 0, 0.1); 
      border-left: 3px solid #0f0;
    }
    @keyframes pulse-red {
      0%, 100% { background: rgba(255, 0, 0, 0.2); }
      50% { background: rgba(255, 0, 0, 0.5); }
    }
    .attack-type { 
      background: rgba(255, 255, 255, 0.1); 
      padding: 2px 8px; 
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .attack-time { color: #666; font-size: 0.75rem; }
    .status-indicator {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 10px;
      animation: blink 1s infinite;
    }
    .status-indicator.online { background: #0f0; }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .breach-alert {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 0, 0, 0.9);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .breach-alert.active { display: flex; }
    .breach-content {
      background: #000;
      padding: 40px;
      border-radius: 10px;
      text-align: center;
      max-width: 600px;
    }
    .breach-content h2 { color: #f00; font-size: 2rem; margin-bottom: 20px; }
    .breach-content pre { 
      text-align: left; 
      background: #111; 
      padding: 15px; 
      border-radius: 5px;
      overflow-x: auto;
      font-size: 0.8rem;
    }
    .breach-content button {
      margin-top: 20px;
      padding: 10px 30px;
      background: #f00;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
    }
    .attack-types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin-top: 20px;
    }
    .attack-type-stat {
      background: rgba(0, 255, 0, 0.05);
      border: 1px solid #333;
      border-radius: 5px;
      padding: 10px;
      text-align: center;
    }
    .attack-type-stat .name { font-size: 0.8rem; color: #888; }
    .attack-type-stat .count { font-size: 1.2rem; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🏰 HCS-U7 SIEGE WALL</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3><span class="status-indicator online"></span>STATUS</h3>
        <div class="value" id="status">ACTIVE</div>
      </div>
      <div class="stat-card">
        <h3>TOTAL ATTACKS</h3>
        <div class="value" id="total">0</div>
      </div>
      <div class="stat-card danger">
        <h3>SUCCESS RATE</h3>
        <div class="value" id="rate">0.000000%</div>
      </div>
      <div class="stat-card">
        <h3>AVG RESPONSE</h3>
        <div class="value" id="avg-time">0ms</div>
      </div>
    </div>

    <div class="attack-types-grid" id="attack-types"></div>

    <div class="attacks-container">
      <div class="attacks-header">
        <h2>📜 Live Attack Feed</h2>
        <span id="connection-status">Connecting...</span>
      </div>
      <div class="attacks-list" id="attacks"></div>
    </div>
  </div>

  <div class="breach-alert" id="breach-alert">
    <div class="breach-content">
      <h2>🚨 BREACH DETECTED!</h2>
      <p>An attack has successfully bypassed the HCS-U7 verification!</p>
      <pre id="breach-details"></pre>
      <button onclick="closeBreach()">Acknowledge</button>
    </div>
  </div>

  <script>
    let ws;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 10;
    
    function connect() {
      const wsProtocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
      ws = new WebSocket(wsProtocol + location.host);
      
      ws.onopen = () => {
        document.getElementById('connection-status').textContent = '🟢 Connected';
        reconnectAttempts = 0;
      };
      
      ws.onclose = () => {
        document.getElementById('connection-status').textContent = '🔴 Disconnected';
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          setTimeout(connect, 2000);
        }
      };
      
      ws.onerror = () => {
        document.getElementById('connection-status').textContent = '🔴 Error';
      };
      
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        handleMessage(msg);
      };
    }
    
    function handleMessage(msg) {
      if (msg.type === 'attack' || msg.type === 'stats') {
        const stats = msg.data.stats || msg.data;
        document.getElementById('total').textContent = (stats.totalAttacks || 0).toLocaleString();
        document.getElementById('rate').textContent = (msg.data.successRate || 0).toFixed(6) + '%';
        document.getElementById('avg-time').textContent = Math.round(stats.avgResponseTime || 0) + 'ms';
        
        // Update attack types
        if (stats.attacksByType) {
          updateAttackTypes(stats.attacksByType);
        }
        
        if (msg.type === 'attack') {
          addAttackToFeed(msg.data);
        }
      }
      
      if (msg.type === 'breach') {
        showBreach(msg.data);
      }
    }
    
    function updateAttackTypes(types) {
      const container = document.getElementById('attack-types');
      container.innerHTML = Object.entries(types).map(([name, data]) => \`
        <div class="attack-type-stat">
          <div class="name">\${name}</div>
          <div class="count">\${data.total}</div>
          <div class="name" style="color: \${data.success > 0 ? '#f00' : '#0f0'}">
            \${data.success} success
          </div>
        </div>
      \`).join('');
    }
    
    function addAttackToFeed(data) {
      const attacksDiv = document.getElementById('attacks');
      const div = document.createElement('div');
      div.className = 'attack-item ' + (data.success ? 'success' : 'fail');
      
      const time = new Date().toISOString().slice(11, 23);
      div.innerHTML = \`
        <span>
          <span class="attack-time">\${time}</span>
          <span class="attack-type">\${data.attackType}</span>
          \${data.success ? '🚨 SUCCESS' : '✅ Rejected'}
        </span>
        <span>\${data.responseTimeMs}ms</span>
      \`;
      
      attacksDiv.insertBefore(div, attacksDiv.firstChild);
      
      // Keep max 100 entries
      while (attacksDiv.children.length > 100) {
        attacksDiv.removeChild(attacksDiv.lastChild);
      }
    }
    
    function showBreach(data) {
      document.getElementById('breach-details').textContent = JSON.stringify(data, null, 2);
      document.getElementById('breach-alert').classList.add('active');
    }
    
    function closeBreach() {
      document.getElementById('breach-alert').classList.remove('active');
    }
    
    connect();
  </script>
</body>
</html>`;
}
