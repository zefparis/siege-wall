import { Attacker, AttackResult } from './types';
import { HCSClient } from '../api/hcs-client';

export class ReplayAttacker implements Attacker {
  name = 'replay';
  description = 'Réutilise un code capturé précédemment';
  
  private client: HCSClient;
  private capturedCodes: string[] = [];

  constructor(client: HCSClient) {
    this.client = client;
  }

  captureCode(code: string): void {
    this.capturedCodes.push(code);
    // Garder max 100 codes
    if (this.capturedCodes.length > 100) {
      this.capturedCodes.shift();
    }
  }

  async execute(): Promise<AttackResult> {
    // Prendre un code capturé au hasard
    const code = this.capturedCodes.length > 0
      ? this.capturedCodes[Math.floor(Math.random() * this.capturedCodes.length)]
      : this.generateFakeOldCode();
    
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
        codeAge: this.estimateCodeAge(code),
      },
    };
  }

  private generateFakeOldCode(): string {
    // Générer un code avec TW expiré (> 2 fenêtres = > 60 secondes)
    const oldWindow = Math.floor(Date.now() / 1000 / 30) - 5; // 5 fenêtres avant
    return `HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f50m50|COG:F50C50V50S50Cr50|TW:${oldWindow}|CE:${'a'.repeat(32)}|QSIG:${'b'.repeat(64)}|B3:${'c'.repeat(64)}`;
  }

  private estimateCodeAge(code: string): number {
    const match = code.match(/TW:(\d+)/);
    if (!match) return -1;
    const tw = parseInt(match[1]);
    const currentTw = Math.floor(Date.now() / 1000 / 30);
    return (currentTw - tw) * 30; // Age en secondes
  }
}
