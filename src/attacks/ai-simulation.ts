import { Attacker, AttackResult } from './types';
import { HCSClient } from '../api/hcs-client';
import { randomBytes } from 'crypto';

/**
 * AI Simulation Attacker
 * Simulates patterns that an AI might use to try to forge HCS codes
 */
export class AISimulationAttacker implements Attacker {
  name = 'ai-simulation';
  description = 'Simule des patterns IA pour forger des codes';
  
  private client: HCSClient;
  private patterns = [
    // Pattern 1: Valeurs cognitives parfaitement équilibrées (suspect)
    { f: 50, c: 50, v: 50, s: 50, cr: 50 },
    // Pattern 2: Valeurs maximales (trop parfait)
    { f: 100, c: 100, v: 100, s: 100, cr: 100 },
    // Pattern 3: Valeurs minimales
    { f: 0, c: 0, v: 0, s: 0, cr: 0 },
    // Pattern 4: Progression linéaire
    { f: 20, c: 40, v: 60, s: 80, cr: 100 },
    // Pattern 5: Fibonacci-like
    { f: 1, c: 1, v: 2, s: 3, cr: 5 },
    // Pattern 6: Puissances de 2
    { f: 2, c: 4, v: 8, s: 16, cr: 32 },
    // Pattern 7: Valeurs répétées
    { f: 42, c: 42, v: 42, s: 42, cr: 42 },
  ];
  private patternIndex = 0;

  constructor(client: HCSClient) {
    this.client = client;
  }

  async execute(): Promise<AttackResult> {
    const pattern = this.patterns[this.patternIndex];
    this.patternIndex = (this.patternIndex + 1) % this.patterns.length;
    
    const code = this.generateAICode(pattern);
    const response = await this.client.verifyCode({ code });
    
    return {
      attackType: this.name,
      timestamp: new Date(),
      success: response.valid,
      score: response.score,
      responseTimeMs: response.processingTimeMs,
      payload: code,
      response,
      metadata: {
        pattern: pattern,
        patternName: this.getPatternName(this.patternIndex - 1),
      },
    };
  }

  private generateAICode(params: { f: number; c: number; v: number; s: number; cr: number }): string {
    const currentTw = Math.floor(Date.now() / 1000 / 30);
    const qsig = randomBytes(32).toString('hex');
    const b3 = randomBytes(32).toString('hex');
    const ce = randomBytes(16).toString('hex');
    
    return `HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f50m50|COG:F${params.f}C${params.c}V${params.v}S${params.s}Cr${params.cr}|TW:${currentTw}|CE:${ce}|QSIG:${qsig}|B3:${b3}`;
  }

  private getPatternName(index: number): string {
    const names = [
      'balanced',
      'maximal',
      'minimal',
      'linear',
      'fibonacci',
      'powers-of-2',
      'repeated',
    ];
    return names[index] || 'unknown';
  }
}
