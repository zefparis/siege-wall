'use client';

import { useState, useEffect } from 'react';

interface EngineStatus {
  running: boolean;
  total_attackers: number;
  total_attacks: number;
  uptime_seconds: number;
}

export default function AdminControlPage() {
  const [apiKey, setApiKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<EngineStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_SIEGE_BACKEND_URL || 'http://localhost:8000';

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/control/status`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStatus();
      const interval = setInterval(fetchStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setIsAuthenticated(true);
      fetchStatus();
    }
  };

  const callControlEndpoint = async (action: 'start' | 'stop' | 'reset') => {
    setLoading(true);
    setMessage(null);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/control/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': apiKey,
        },
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        fetchStatus();
      } else {
        setMessage({ type: 'error', text: data.detail || data.message || 'Request failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error - check backend connection' });
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="bg-[#0d1117] border border-cyan-900/50 rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-cyan-400 mb-2 font-orbitron">🔐 SIEGE CONTROL</h1>
          <p className="text-gray-500 text-sm mb-6">Admin access required</p>
          
          <form onSubmit={handleLogin}>
            <label className="block text-gray-400 text-sm mb-2">Admin API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#161b22] border border-gray-700 rounded px-4 py-3 text-white mb-4 focus:border-cyan-500 focus:outline-none"
              placeholder="Enter your admin key..."
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded transition-colors"
            >
              ACCESS CONTROL PANEL
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 font-orbitron">⚙️ SIEGE ENGINE CONTROL</h1>
          <p className="text-gray-500 mt-1">Admin panel - Do not share this URL</p>
        </div>

        {/* Status Card */}
        <div className="bg-[#0d1117] border border-cyan-900/50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">ENGINE STATUS</h2>
          
          {status ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#161b22] rounded p-4">
                <div className="text-gray-500 text-sm">Status</div>
                <div className={`text-2xl font-bold ${status.running ? 'text-green-400' : 'text-red-400'}`}>
                  {status.running ? '● RUNNING' : '○ STOPPED'}
                </div>
              </div>
              <div className="bg-[#161b22] rounded p-4">
                <div className="text-gray-500 text-sm">Uptime</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {formatUptime(status.uptime_seconds)}
                </div>
              </div>
              <div className="bg-[#161b22] rounded p-4">
                <div className="text-gray-500 text-sm">Total Attacks</div>
                <div className="text-2xl font-bold text-white">
                  {status.total_attacks.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#161b22] rounded p-4">
                <div className="text-gray-500 text-sm">Active Attackers</div>
                <div className="text-2xl font-bold text-white">
                  {status.total_attackers}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Loading status...</div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="bg-[#0d1117] border border-cyan-900/50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">CONTROLS</h2>
          
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => callControlEndpoint('start')}
              disabled={loading || status?.running}
              className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded transition-colors"
            >
              ▶ START
            </button>
            <button
              onClick={() => callControlEndpoint('stop')}
              disabled={loading || !status?.running}
              className="flex-1 min-w-[120px] bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded transition-colors"
            >
              ⏹ STOP
            </button>
            <button
              onClick={() => callControlEndpoint('reset')}
              disabled={loading || status?.running}
              className="flex-1 min-w-[120px] bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded transition-colors"
            >
              ↻ RESET
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded ${message.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
          <p className="text-yellow-500 text-sm">
            ⚠️ <strong>Cost Warning:</strong> The siege engine generates API calls to HCS-U7. 
            Stop the engine when not needed to avoid unnecessary costs.
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setApiKey('');
            setStatus(null);
          }}
          className="mt-6 text-gray-500 hover:text-gray-300 text-sm"
        >
          ← Logout
        </button>
      </div>
    </div>
  );
}
