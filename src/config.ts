import { config } from 'dotenv';
config();

export const CONFIG = {
  hcs: {
    backendUrl: process.env.HCS_BACKEND_URL || 'https://hcs-u7-backend.onrender.com',
    apiKey: process.env.HCS_API_KEY || '',
  },
  siege: {
    ratePerSecond: parseInt(process.env.ATTACK_RATE_PER_SECOND || '10'),
    durationHours: parseInt(process.env.ATTACK_DURATION_HOURS || '24'),
    enableAiAttacks: process.env.ENABLE_AI_ATTACKS === 'true',
  },
  dashboard: {
    port: parseInt(process.env.DASHBOARD_PORT || process.env.PORT || '3001'),
    wsPort: parseInt(process.env.WEBSOCKET_PORT || '3002'),
  },
  log: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'siege-wall.log',
  },
};
