/**
 * HCS-U7 Siege Wall Demo
 * 
 * Real-time security demonstration launching REAL attacks against HCS-U7 backend.
 * This is NOT a simulation - actual HTTP requests are made to prove invulnerability.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Play, Square, Zap, Target, 
  Activity, AlertTriangle, ChevronRight, Wifi, WifiOff
} from 'lucide-react';
import { BrainCanvas, BrainAttack, BRAIN_THEME } from './Brain';
import {
  AttackVector,
  SiegeStats,
  ATTACK_VECTORS,
  executeAttack,
  launchSiegeWall,
  getInitialStats,
} from '../lib/siege-wall-attacks';

// ============================================================================
// ATTACK CARD COMPONENT
// ============================================================================
interface AttackCardProps {
  attack: AttackVector;
  index: number;
}

const AttackCard = ({ attack, index }: AttackCardProps) => {
  const vectorInfo = ATTACK_VECTORS.find(v => v.id === attack.type);
  const isBreach = attack.status === 'BREACH';
  
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`
        relative overflow-hidden rounded-lg border backdrop-blur-sm
        ${isBreach 
          ? 'bg-red-950/80 border-red-500 animate-pulse' 
          : 'bg-slate-900/80 border-slate-700/50'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700/30">
        <div className="flex items-center gap-2">
          <span className="text-lg">{vectorInfo?.icon || '❓'}</span>
          <div>
            <div className="text-xs font-mono text-slate-400">Attack Vector</div>
            <div className="text-sm font-bold text-white">{vectorInfo?.name || attack.type}</div>
          </div>
        </div>
        <div className={`
          px-2 py-1 rounded text-xs font-bold font-mono
          ${isBreach 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }
        `}>
          {attack.status}
        </div>
      </div>
      
      {/* Method */}
      <div className="px-3 py-2 border-b border-slate-700/30">
        <div className="text-xs text-cyan-400 font-mono">{attack.method}</div>
      </div>
      
      {/* Details */}
      <div className="px-3 py-2 border-b border-slate-700/30">
        <div className="text-xs text-slate-500 truncate">{attack.details}</div>
      </div>
      
      {/* Footer Stats */}
      <div className="flex items-center justify-between px-3 py-2 text-xs font-mono text-slate-500">
        <span>{new Date(attack.timestamp).toLocaleTimeString()}</span>
        <span>{attack.responseTime}ms</span>
        <span>Conf: {(attack.confidence * 100).toFixed(0)}%</span>
      </div>
      
      {/* Breach Warning Overlay */}
      {isBreach && (
        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-500 animate-bounce" />
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// MAIN SIEGE WALL DEMO COMPONENT
// ============================================================================
export default function SiegeWallDemo() {
  const [isLive, setIsLive] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [attacks, setAttacks] = useState<AttackVector[]>([]);
  const [stats, setStats] = useState<SiegeStats>(getInitialStats());
  const [hallOfShame, setHallOfShame] = useState<{ method: string; count: number }[]>([]);
  const [selectedVector, setSelectedVector] = useState<string | null>(null);
  const [isManualAttacking, setIsManualAttacking] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [customResult, setCustomResult] = useState<string | null>(null);
  const [isExecutingCustom, setIsExecutingCustom] = useState(false);
  
  const siegeControllerRef = useRef<{ stop: () => void } | null>(null);
  const uptimeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Attack type to color mapping for brain visualization
  const attackTypeColors: Record<string, string> = {
    'brute-force': BRAIN_THEME.frontal,
    'ai-simulation': BRAIN_THEME.frontal,
    'timing': BRAIN_THEME.occipital,
    'replay': BRAIN_THEME.temporal,
    'adversarial': BRAIN_THEME.parietal,
    'sql-injection': BRAIN_THEME.frontal,
    'bot-simulation': BRAIN_THEME.parietal,
    'celestial-prediction': BRAIN_THEME.temporal,
    'quantum-bypass': BRAIN_THEME.occipital,
  };
  
  // Convert attacks to BrainAttack format for 3D visualization
  const brainAttacks: BrainAttack[] = useMemo(() => {
    return attacks.slice(0, 20).map(attack => ({
      id: attack.id,
      type: attack.type,
      timestamp: attack.timestamp,
      blocked: attack.status !== 'BREACH',
      color: attackTypeColors[attack.type] || BRAIN_THEME.primary,
    }));
  }, [attacks]);
  
  // Handle new attack result
  const handleAttackComplete = useCallback((attack: AttackVector) => {
    setAttacks(prev => [attack, ...prev].slice(0, 50));
    
    setStats(prev => {
      const newTotal = prev.totalAttacks + 1;
      const newBreaches = attack.status === 'BREACH' ? prev.breaches + 1 : prev.breaches;
      const newSuccessRate = ((newTotal - newBreaches) / newTotal) * 100;
      
      // Update vector-specific stats
      const vectors = { ...prev.vectors };
      if (attack.type === 'ai-simulation' || attack.type === 'bot-simulation') {
        vectors.cognitive.blocked++;
      } else if (attack.type === 'celestial-prediction') {
        vectors.celestial.entropy = 99.5 + Math.random() * 0.5;
      } else if (attack.type === 'quantum-bypass') {
        vectors.quantum.secure = attack.status !== 'BREACH';
      }
      vectors.behavioral.anomalies = attack.status === 'BREACH' ? vectors.behavioral.anomalies + 1 : vectors.behavioral.anomalies;
      
      return {
        ...prev,
        totalAttacks: newTotal,
        breaches: newBreaches,
        successRate: Number(newSuccessRate.toFixed(6)),
        vectors,
      };
    });
    
    // Update Hall of Shame
    setHallOfShame(prev => {
      const existing = prev.find(h => h.method === attack.method);
      if (existing) {
        return prev.map(h => 
          h.method === attack.method ? { ...h, count: h.count + 1 } : h
        ).sort((a, b) => b.count - a.count).slice(0, 10);
      }
      return [...prev, { method: attack.method, count: 1 }]
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    });
  }, []);
  
  // Start/Stop siege
  const toggleSiege = useCallback(() => {
    if (isLive) {
      siegeControllerRef.current?.stop();
      siegeControllerRef.current = null;
      if (uptimeIntervalRef.current) {
        clearInterval(uptimeIntervalRef.current);
        uptimeIntervalRef.current = null;
      }
    } else {
      siegeControllerRef.current = launchSiegeWall(handleAttackComplete, 4.99);
      uptimeIntervalRef.current = setInterval(() => {
        setStats(prev => ({ ...prev, uptime: prev.uptime + 1 }));
      }, 1000);
    }
    setIsLive(!isLive);
  }, [isLive, handleAttackComplete]);
  
  // Manual attack
  const executeManualAttack = useCallback(async (vectorId: string) => {
    setIsManualAttacking(true);
    setSelectedVector(vectorId);
    
    try {
      const attack = await executeAttack(vectorId);
      handleAttackComplete(attack);
    } catch (error) {
      console.error('Manual attack failed:', error);
      setIsConnected(false);
    }
    
    setIsManualAttacking(false);
    setSelectedVector(null);
  }, [handleAttackComplete]);
  
  // Execute custom attack from textarea
  const executeCustomAttack = useCallback(async () => {
    if (!customCode.trim()) {
      setCustomResult('❌ Please enter attack code');
      return;
    }
    
    setIsExecutingCustom(true);
    setCustomResult(null);
    
    try {
      // Try to parse as JSON, otherwise use as raw code
      let attackCode = customCode.trim();
      try {
        const parsed = JSON.parse(customCode);
        attackCode = parsed.hcsCode || parsed.code || JSON.stringify(parsed);
      } catch {
        // Use raw text as attack code
      }
      
      const startTime = Date.now();
      // Direct call to Render backend
      const apiUrl = 'https://hcs-u7-backend.onrender.com/v1/verify';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: attackCode }),
      });
      
      const elapsed = Date.now() - startTime;
      const data = await response.json();
      
      // Create attack record
      const attack: AttackVector = {
        id: Math.random().toString(36).substring(2, 9),
        type: 'brute-force',
        status: data.isHuman === true ? 'BREACH' : 'REJECTED',
        timestamp: Date.now(),
        confidence: 0.5,
        method: 'Custom Attack',
        details: data.error || data.message || `HTTP ${response.status}`,
        responseTime: elapsed,
        payload: attackCode.slice(0, 50) + '...',
      };
      
      handleAttackComplete(attack);
      
      if (data.isHuman === true) {
        setCustomResult(`⚠️ BREACH! Response: ${JSON.stringify(data)} (${elapsed}ms)`);
      } else {
        setCustomResult(`✓ REJECTED: ${data.error || 'Invalid code'} (${elapsed}ms)`);
      }
    } catch (error: any) {
      setCustomResult(`❌ Network error: ${error.message}`);
      setIsConnected(false);
    }
    
    setIsExecutingCustom(false);
  }, [customCode, handleAttackComplete]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      siegeControllerRef.current?.stop();
      if (uptimeIntervalRef.current) {
        clearInterval(uptimeIntervalRef.current);
      }
    };
  }, []);
  
  // Format uptime
  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };
  
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Hexagonal Grid Background */}
      <div className="fixed inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
              <polygon 
                points="25,0 50,14.4 50,43.4 25,57.7 0,43.4 0,14.4" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
                className="text-cyan-500"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
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
              onClick={toggleSiege}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-mono font-bold text-sm
                transition-all duration-300 transform hover:scale-105
                ${isLive 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black shadow-lg shadow-green-500/30'
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
        
        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Stats & Hall of Shame */}
          <div className="col-span-3 space-y-4">
            {/* Live Statistics */}
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
              <h2 className="text-sm font-mono text-cyan-400 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                LIVE STATISTICS
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Attacks/sec</span>
                  <span className="font-mono text-lg text-white">{stats.attacksPerSecond.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Total Attacks</span>
                  <span className="font-mono text-lg text-cyan-400">{stats.totalAttacks.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Vectors Active</span>
                  <span className="font-mono text-lg text-purple-400">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Breaches</span>
                  <span className={`font-mono text-lg ${stats.breaches > 0 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                    {stats.breaches}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Hall of Shame */}
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
              <h2 className="text-sm font-mono text-orange-400 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" />
                HALL OF SHAME
              </h2>
              
              <div className="space-y-2">
                {hallOfShame.length === 0 ? (
                  <div className="text-xs text-slate-600 text-center py-4">
                    No failed attacks yet...
                  </div>
                ) : (
                  hallOfShame.map((item, idx) => (
                    <div key={item.method} className="flex items-center gap-2 text-xs">
                      <span className="text-slate-600 w-4">{idx + 1}.</span>
                      <span className="text-slate-400 flex-1 truncate">{item.method}</span>
                      <span className="text-red-400 font-mono">{item.count}x</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Manual Attack Buttons */}
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
              <h2 className="text-sm font-mono text-red-400 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                MANUAL ATTACKS
              </h2>
              
              <div className="grid grid-cols-2 gap-2">
                {ATTACK_VECTORS.map(vector => (
                  <button
                    key={vector.id}
                    onClick={() => executeManualAttack(vector.id)}
                    disabled={isManualAttacking}
                    className={`
                      flex items-center gap-1.5 px-2 py-2 rounded text-xs font-mono
                      transition-all duration-200
                      ${selectedVector === vector.id 
                        ? 'bg-red-500 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }
                      ${isManualAttacking ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <span>{vector.icon}</span>
                    <span className="truncate">{vector.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Center Column - Main Display */}
          <div className="col-span-6 flex flex-col items-center">
            {/* Holographic Brain Visualization */}
            <div className="relative mb-6">
              {/* Glow effect container */}
              <div 
                className={`
                  absolute inset-0 rounded-full blur-3xl transition-all duration-700
                  ${isLive 
                    ? 'bg-linear-to-br from-cyan-500/30 via-purple-500/20 to-cyan-500/30 scale-110' 
                    : 'bg-cyan-500/10 scale-100'
                  }
                `}
                style={{
                  animation: isLive ? 'pulse 3s ease-in-out infinite' : 'none',
                }}
              />
              
              {/* 3D Brain Canvas */}
              <div className={`
                relative w-[420px] h-[380px] transition-all duration-500
                ${isLive ? 'opacity-100' : 'opacity-70'}
              `}>
                <BrainCanvas 
                  attacks={brainAttacks}
                  className="w-full h-full"
                />
              </div>
              
              {/* Stats Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {/* Attack Counter */}
                <motion.div
                  key={stats.totalAttacks}
                  initial={{ scale: 1.2, color: '#22c55e' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  transition={{ duration: 0.3 }}
                  className="text-6xl font-bold font-mono drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                >
                  {stats.totalAttacks.toLocaleString()}
                </motion.div>
                <div className="text-sm text-cyan-400 font-mono tracking-[0.3em] mt-1 drop-shadow-lg">
                  ATTACKS BLOCKED
                </div>
                
                {/* Breaches */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-slate-400 tracking-wider">BREACHES</span>
                  <span className={`text-2xl font-bold font-mono ${
                    stats.breaches > 0 ? 'text-red-500 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                  }`}>
                    {stats.breaches}
                  </span>
                </div>
                
                {/* Stats Row */}
                <div className="mt-3 flex items-center gap-6 bg-slate-900/60 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-center">
                    <div className={`text-lg font-mono font-bold ${
                      stats.successRate === 100 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stats.successRate.toFixed(4)}%
                    </div>
                    <div className="text-[9px] text-slate-500 tracking-wider">SUCCESS</div>
                  </div>
                  <div className="w-px h-6 bg-slate-600" />
                  <div className="text-center">
                    <div className="text-lg font-mono font-bold text-cyan-400">
                      {formatUptime(stats.uptime)}
                    </div>
                    <div className="text-[9px] text-slate-500 tracking-wider">UPTIME</div>
                  </div>
                </div>
                
                {/* Defense Status Indicators */}
                <div className="mt-2 flex items-center gap-2 bg-slate-900/40 backdrop-blur-sm rounded-full px-3 py-1">
                  {[
                    { color: stats.vectors.cognitive.active ? '#22c55e' : '#475569', label: 'COG' },
                    { color: stats.vectors.celestial.synced ? '#a855f7' : '#475569', label: 'CEL' },
                    { color: stats.vectors.quantum.secure ? '#06b6d4' : '#475569', label: 'QTM' },
                    { color: stats.vectors.behavioral.monitoring ? '#f59e0b' : '#475569', label: 'BIO' },
                  ].map((layer, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: layer.color,
                          boxShadow: layer.color !== '#475569' ? `0 0 8px ${layer.color}` : 'none'
                        }}
                      />
                      <span className="text-[9px] font-mono text-slate-400">{layer.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Custom Attack Input */}
            <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs font-mono text-slate-400">custom_attack.js</span>
                </div>
                <button
                  onClick={executeCustomAttack}
                  disabled={isExecutingCustom}
                  className={`
                    flex items-center gap-2 px-4 py-1.5 rounded text-xs font-mono font-bold
                    transition-all
                    ${isExecutingCustom 
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                    }
                  `}
                >
                  <Zap className="w-3 h-3" />
                  {isExecutingCustom ? 'ATTACKING...' : 'EXECUTE ATTACK'}
                </button>
              </div>
              <textarea
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder={`// Paste or write your attack code here
// Example: Try to forge an HCS-U7 code
{
  "hcsCode": "HCS-U7|V:8.0|ALG:QS|YOUR_ATTACK_HERE",
  "method": "custom_injection"
}`}
                className="w-full h-32 p-4 bg-transparent text-green-400 font-mono text-sm resize-none focus:outline-none placeholder:text-slate-600"
                spellCheck={false}
              />
              {customResult && (
                <div className={`px-4 py-2 border-t border-slate-700/50 text-xs font-mono ${
                  customResult.includes('REJECTED') ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
                }`}>
                  {customResult}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Attack Stream */}
          <div className="col-span-3">
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 h-[calc(100vh-180px)] flex flex-col">
              <h2 className="text-sm font-mono text-red-400 mb-4 flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                ATTACK STREAM
                {isLive && (
                  <span className="ml-auto flex items-center gap-1 text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    LIVE
                  </span>
                )}
              </h2>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                <AnimatePresence mode="popLayout">
                  {attacks.length === 0 ? (
                    <div className="text-center text-slate-600 text-sm py-12">
                      <Shield className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No attacks yet.</p>
                      <p className="text-xs mt-2">Click "TRY TO HACK" to start the siege.</p>
                    </div>
                  ) : (
                    attacks.map((attack, index) => (
                      <AttackCard key={attack.id} attack={attack} index={index} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-6 text-center text-xs text-slate-600 font-mono">
          <p>HCS-U7 Cognitive Authentication • Patents FR2514274 + FR2514546</p>
          <p className="mt-1">Backend: Railway • Frontend: Vercel • Real-time Security Validation</p>
        </footer>
      </div>
      
      {/* Breach Alert Overlay */}
      <AnimatePresence>
        {stats.breaches > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-red-950/90 flex items-center justify-center"
          >
            <div className="text-center">
              <AlertTriangle className="w-24 h-24 text-red-500 mx-auto animate-bounce" />
              <h2 className="text-4xl font-bold text-red-500 mt-6 animate-pulse">
                ⚠️ CRITICAL: BREACH DETECTED ⚠️
              </h2>
              <p className="text-xl text-red-300 mt-4">
                This should NEVER happen. Report immediately!
              </p>
              <p className="text-sm text-red-400 mt-2 font-mono">
                {stats.breaches} breach(es) detected
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
