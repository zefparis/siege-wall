import { Attacker, AttackResult } from './types';
import { HCSClient } from '../api/hcs-client';
import { randomBytes } from 'crypto';

export class GradientAttacker implements Attacker {
  name = 'gradient';
  description = 'Tente d\'optimiser le score par essais successifs';
  
  private client: HCSClient;
  private bestScore = 0;
  private bestParams = { f: 50, c: 50, v: 50, s: 50, cr: 50 };
  private attempts = 0;

  constructor(client: HCSClient) {
    this.client = client;
  }

  async execute(): Promise<AttackResult> {
    this.attempts++;
    
    // Mutation des paramètres autour du meilleur score
    const params = this.mutateParams();
    const code = this.generateCode(params);
    
    const response = await this.client.verifyCode({ code });
    
    // Si meilleur score, mémoriser
    if (response.score && response.score > this.bestScore) {
      this.bestScore = response.score;
      this.bestParams = params;
    }
    
    return {
      attackType: this.name,
      timestamp: new Date(),
      success: response.valid,
      score: response.score,
      responseTimeMs: response.processingTimeMs,
      payload: code,
      response,
      metadata: {
        attempt: this.attempts,
        bestScore: this.bestScore,
        currentParams: params,
        improvement: response.score ? response.score > this.bestScore : false,
      },
    };
  }

  private mutateParams(): typeof this.bestParams {
    return {
      f: this.mutate(this.bestParams.f),
      c: this.mutate(this.bestParams.c),
      v: this.mutate(this.bestParams.v),
      s: this.mutate(this.bestParams.s),
      cr: this.mutate(this.bestParams.cr),
    };
  }

  private mutate(value: number): number {
    const delta = Math.floor(Math.random() * 20) - 10; // -10 à +10
    return Math.max(0, Math.min(100, value + delta));
  }

  private generateCode(params: typeof this.bestParams): string {
    const currentTw = Math.floor(Date.now() / 1000 / 30);
    const qsig = randomBytes(32).toString('hex');
    const b3 = randomBytes(32).toString('hex');
    
    return `HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f50m50|COG:F${params.f}C${params.c}V${params.v}S${params.s}Cr${params.cr}|TW:${currentTw}|CE:${'0'.repeat(32)}|QSIG:${qsig}|B3:${b3}`;
  }
}
