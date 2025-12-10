import { useEffect, useRef, useCallback } from 'react';
import { useSiegeStore } from '../store/siegeStore';
import { WS_URL } from '../utils/constants';
import type { Attack, SiegeStats, Milestone, WSMessage, AttackCategory } from '../types';
import { COUNTRIES } from '../types';

const SIMULATION_MODE = (import.meta as any).env.VITE_SIMULATION_MODE !== 'false'; // Par défaut en simulation, 'false' pour le réel

const mapEngineStatsToFrontend = (engineStats: any): SiegeStats => {
  if (!engineStats) {
    const now = new Date().toISOString();
    return {
      total_attacks: 0,
      success_rate: 100,
      uptime_seconds: 0,
      attacks_per_second: 0,
      active_vectors: 0,
      total_vectors: 0,
      breaches: 0,
      start_time: now,
    };
  }

  const totalAttacks = Number(engineStats.totalAttacks ?? 0);
  const successfulAttacks = Number(engineStats.successfulAttacks ?? 0);
  const startTime = engineStats.startTime ? new Date(engineStats.startTime) : new Date();
  const now = new Date();
  const uptimeSeconds = Math.max(0, Math.floor((now.getTime() - startTime.getTime()) / 1000));

  const breachRate = totalAttacks > 0 ? (successfulAttacks / totalAttacks) * 100 : 0;
  const successRate = 100 - breachRate;
  const attacksPerSecond = uptimeSeconds > 0 ? totalAttacks / uptimeSeconds : 0;

  const attacksByType = engineStats.attacksByType || {};
  const totalVectors = Object.keys(attacksByType).length;
  const activeVectors = Object.values(attacksByType).filter((entry: any) => {
    const e = entry as { total?: number };
    return (e.total ?? 0) > 0;
  }).length;

  return {
    total_attacks: totalAttacks,
    success_rate: successRate,
    uptime_seconds: uptimeSeconds,
    attacks_per_second: attacksPerSecond,
    active_vectors: activeVectors,
    total_vectors: totalVectors,
    breaches: successfulAttacks,
    start_time: startTime.toISOString(),
  };
};

const mapAttackTypeToCategory = (attackType: string | undefined): AttackCategory => {
  const normalized = (attackType || '').toLowerCase();
  if (normalized.includes('brute')) return 'BRUTE_FORCE';
  if (normalized.includes('replay')) return 'REPLAY';
  if (normalized.includes('timing')) return 'TIMING';
  if (normalized.includes('gradient')) return 'ADVERSARIAL';
  if (normalized.includes('ai')) return 'AI_IMITATION';
  if (normalized.includes('malformed') || normalized.includes('expired')) return 'NETWORK';
  return 'CRYPTO';
};

const mapEngineAttackToFrontend = (raw: any): Attack => {
  const category = mapAttackTypeToCategory(raw.attackType);
  const timestamp = raw.timestamp
    ? new Date(raw.timestamp).toISOString()
    : new Date().toISOString();
  const score = typeof raw.score === 'number' ? raw.score : 0.99;
  const responseTimeMs = typeof raw.responseTimeMs === 'number' ? raw.responseTimeMs : 0;

  return {
    id: raw.id || crypto.randomUUID(),
    timestamp,
    type: raw.attackType || 'unknown',
    category,
    attacker_id: raw.attackType || 'unknown',
    attacker_name: `Attack Vector: ${raw.attackType || 'unknown'}`,
    attempt_number:
      (raw.metadata && typeof raw.metadata.attempt === 'number')
        ? raw.metadata.attempt
        : 1,
    confidence_score: score,
    response_time_ms: responseTimeMs,
    status: 'REJECTED',
    origin_country: '??',
  };
};

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const simulationIntervalRef = useRef<number | null>(null);
  
  const { setConnected, setStats, addAttack, updateMilestone } = useSiegeStore();

  // --- LOGIQUE DE SIMULATION ---
  const startSimulation = useCallback(() => {
    if (simulationIntervalRef.current) return;
    
    console.log('[SIM] Starting realistic attack simulation');
    setConnected(true);

    let totalAttacks = 847293; 
    const startTime = Date.now();


    simulationIntervalRef.current = window.setInterval(() => {
      // Générer une attaque aléatoire
      const categories: AttackCategory[] = ['BRUTE_FORCE', 'AI_IMITATION', 'TIMING', 'REPLAY', 'NETWORK', 'CRYPTO', 'ADVERSARIAL', 'SWARM'];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      
      const attack: Attack = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        type: `${category.toLowerCase()}_attack`,
        category,
        attacker_id: `actor_${Math.floor(Math.random() * 1000)}`,
        attacker_name: `Threat Actor ${Math.floor(Math.random() * 1000)}`,
        attempt_number: Math.floor(Math.random() * 10) + 1,
        confidence_score: 0.8 + Math.random() * 0.2,
        response_time_ms: 15 + Math.random() * 20,
        status: 'REJECTED', // HCS-U7 bloque tout !
        origin_country: country
      };

      addAttack(attack);
      totalAttacks++;


      // Mettre à jour les stats
      const stats: SiegeStats = {
        total_attacks: totalAttacks,
        success_rate: 100, // 100% blocked
        breaches: 0,
        active_vectors: Math.floor(Math.random() * 50),
        attacks_per_second: 5,
        total_vectors: 8,
        uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
        start_time: new Date(startTime).toISOString()
      };
      
      setStats(stats);

    }, 200); // 5 attaques par seconde

  }, [setConnected, setStats, addAttack]);

  const stopSimulation = useCallback(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  }, []);

  // --- LOGIQUE WEBSOCKET (Réelle) ---
  const connect = useCallback(() => {
    if (SIMULATION_MODE) {
      startSimulation();
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
        console.log('[WS] Connected to siege server');
        setConnected(true);
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        };

        ws.onmessage = (event) => {
        try {
            const message: WSMessage & { data: any } = JSON.parse(event.data);
            
            switch (message.type) {
            case 'attack': {
                const raw = message.data || {};
                const attack = mapEngineAttackToFrontend(raw);
                addAttack(attack);

                if (raw.stats) {
                  const mappedStats = mapEngineStatsToFrontend(raw.stats);
                  setStats(mappedStats);
                }
                break;
            }
            case 'stats': {
                const mappedStats = mapEngineStatsToFrontend(message.data);
                setStats(mappedStats);
                break;
            }
            case 'milestone':
                updateMilestone(message.data as Milestone);
                break;
            case 'connected':
                console.log('[WS] Server acknowledged connection');
                break;
            default:
                console.warn('[WS] Unknown message type:', message.type);
            }
        } catch (err) {
            console.error('[WS] Failed to parse message:', err);
        }
        };

        ws.onclose = () => {
        console.log('[WS] Disconnected from siege server');
        setConnected(false);
        wsRef.current = null;
        
        // Reconnect after delay
        reconnectTimeoutRef.current = window.setTimeout(connect, 3000);
        };

        ws.onerror = (error) => {
        console.error('[WS] WebSocket error:', error);
        if (wsRef.current) {
          wsRef.current.close();
        }
        };
    } catch (e) {
        console.error('WebSocket connection failed:', e);
        reconnectTimeoutRef.current = window.setTimeout(connect, 3000);
    }
  }, [setConnected, setStats, addAttack, updateMilestone, startSimulation]);

  const disconnect = useCallback(() => {
    stopSimulation();
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, [stopSimulation]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { connect, disconnect };
}
