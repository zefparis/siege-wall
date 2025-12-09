import { useEffect, useRef, useCallback } from 'react';
import { useSiegeStore } from '../store/siegeStore';
import { WS_URL, INTERVALS } from '../utils/constants';
import type { Attack, SiegeStats, Milestone, WSMessage } from '../types';

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  
  const { setConnected, setStats, addAttack, updateMilestone } = useSiegeStore();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

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
      
      // Auto-reconnect
      reconnectTimeoutRef.current = window.setTimeout(() => {
        console.log('[WS] Attempting to reconnect...');
        connect();
      }, INTERVALS.RECONNECT_DELAY);
    };

    ws.onerror = (error) => {
      console.error('[WS] WebSocket error:', error);
    };
  }, [setConnected, setStats, addAttack, updateMilestone]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { connect, disconnect };
}
