'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export interface AttackResult {
  attackType: string;
  timestamp: string;
  success: boolean;
  score?: number;
  responseTimeMs: number;
  payload: string;
  response: any;
  metadata?: Record<string, any>;
}

export interface SiegeStats {
  totalAttacks: number;
  successfulAttacks: number;
  failedAttacks: number;
  attacksByType: Record<string, { total: number; success: number }>;
  avgResponseTime: number;
  startTime: string;
  lastAttack: string;
  successRate?: number;
}

interface WebSocketMessage {
  type: 'attack' | 'stats' | 'breach';
  data: {
    stats?: SiegeStats;
    successRate?: number;
  } & Partial<AttackResult>;
}

export function useWebSocket(url: string) {
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState<SiegeStats>({
    totalAttacks: 0,
    successfulAttacks: 0,
    failedAttacks: 0,
    attacksByType: {},
    avgResponseTime: 0,
    startTime: new Date().toISOString(),
    lastAttack: new Date().toISOString(),
  });
  const [attacks, setAttacks] = useState<AttackResult[]>([]);
  const [breaches, setBreaches] = useState<AttackResult[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        
        // Reconnect with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        reconnectAttemptsRef.current++;
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(`Reconnecting... (attempt ${reconnectAttemptsRef.current})`);
          connect();
        }, delay);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.type === 'stats' || message.type === 'attack') {
            if (message.data.stats) {
              setStats({
                ...message.data.stats,
                successRate: message.data.successRate,
              });
            }
            
            if (message.type === 'attack' && message.data.attackType) {
              const attack: AttackResult = {
                attackType: message.data.attackType!,
                timestamp: message.data.timestamp || new Date().toISOString(),
                success: message.data.success || false,
                score: message.data.score,
                responseTimeMs: message.data.responseTimeMs || 0,
                payload: message.data.payload || '',
                response: message.data.response,
                metadata: message.data.metadata,
              };
              
              setAttacks(prev => [attack, ...prev.slice(0, 499)]);
            }
          }
          
          if (message.type === 'breach') {
            const breach: AttackResult = {
              attackType: message.data.attackType!,
              timestamp: message.data.timestamp || new Date().toISOString(),
              success: true,
              responseTimeMs: message.data.responseTimeMs || 0,
              payload: message.data.payload || '',
              response: message.data.response,
            };
            setBreaches(prev => [breach, ...prev]);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    connected,
    stats,
    attacks,
    breaches,
  };
}
