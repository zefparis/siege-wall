import { useEffect, useRef, useCallback } from 'react';
import { useSiegeStore } from '../store/siegeStore';
import { WS_URL, INTERVALS } from '../utils/constants';
import type { Attack, SiegeStats, Milestone, WSMessage, AttackCategory } from '../types';
import { COUNTRIES } from '../types';

const SIMULATION_MODE = true; // Activer la simulation par défaut pour la démo Vercel

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
    let lastAttackTime = startTime;

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
      lastAttackTime = Date.now();

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
            const message: WSMessage = JSON.parse(event.data);
            
            switch (message.type) {
            case 'attack':
                addAttack(message.data as Attack);
                break;
            case 'stats':
                setStats(message.data as SiegeStats);
                break;
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
        
        // Fallback simulation si déconnecté
        startSimulation();
        };

        ws.onerror = (error) => {
        console.error('[WS] WebSocket error:', error);
        startSimulation();
        };
    } catch (e) {
        console.error('WebSocket connection failed:', e);
        startSimulation();
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
