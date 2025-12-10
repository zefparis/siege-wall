// Proxy to HCS-U7 backends (Render for /v1/verify, Railway for /api/verify-human)
const HCS_RENDER_URL = 'https://hcs-u7-backend.onrender.com';
const HCS_RAILWAY_URL = 'https://hcs-u7-backend-production.up.railway.app';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Attack-Vector, X-Attack-Method');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Determine which backend to use based on request
    const isRailwayAttack = req.body?.hcsToken || req.body?.context;
    const backendUrl = isRailwayAttack ? HCS_RAILWAY_URL : HCS_RENDER_URL;
    const endpoint = isRailwayAttack ? '/api/verify-human' : '/v1/verify';
    
    const response = await fetch(`${backendUrl}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent'] || 'HCS-U7-Siege-Wall/1.0',
        'X-Attack-Vector': req.headers['x-attack-vector'] || '',
        'X-Attack-Method': req.headers['x-attack-method'] || '',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Backend unreachable', message: error.message });
  }
}
