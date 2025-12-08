import { Attacker, AttackResult } from './types';
import { HCSClient } from '../api/hcs-client';
import { randomBytes } from 'crypto';

export class TimingAttacker implements Attacker {
  name = 'timing';
  description = 'Mesure les temps de réponse pour détecter des fuites';
  
  private client: HCSClient;
  private measurements: number[] = [];

  constructor(client: HCSClient) {
    this.client = client;
  }

  async execute(): Promise<AttackResult> {
    // Générer un code valide-ish pour mesurer le temps de vérification
    const code = this.generateTimingProbe();
    
    const response = await this.client.verifyCode({ code });
    
    this.measurements.push(response.processingTimeMs);
    
    // Garder les 1000 dernières mesures
    if (this.measurements.length > 1000) {
      this.measurements.shift();
    }
    
    return {
      attackType: this.name,
      timestamp: new Date(),
      success: response.valid,
      responseTimeMs: response.processingTimeMs,
      payload: code,
      response,
      metadata: {
        avgResponseTime: this.getAverageTime(),
        stdDev: this.getStdDev(),
        measurementCount: this.measurements.length,
      },
    };
  }

  private generateTimingProbe(): string {
    // Varier légèrement le QSIG pour voir si le temps de rejet change
    const qsig = randomBytes(32).toString('hex');
    const currentTw = Math.floor(Date.now() / 1000 / 30);
    
    return `HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f50m50|COG:F50C50V50S50Cr50|TW:${currentTw}|CE:${'0'.repeat(32)}|QSIG:${qsig}|B3:${'0'.repeat(64)}`;
  }

  private getAverageTime(): number {
    if (this.measurements.length === 0) return 0;
    return this.measurements.reduce((a, b) => a + b, 0) / this.measurements.length;
  }

  private getStdDev(): number {
    if (this.measurements.length < 2) return 0;
    const avg = this.getAverageTime();
    const squareDiffs = this.measurements.map(m => Math.pow(m - avg, 2));
    return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / this.measurements.length);
  }
}
