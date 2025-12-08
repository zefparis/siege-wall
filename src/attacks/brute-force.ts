import { Attacker, AttackResult } from './types';
import { HCSClient } from '../api/hcs-client';
import { randomBytes } from 'crypto';

export class BruteForceAttacker implements Attacker {
  name = 'brute-force';
  description = 'Génère des codes HCS aléatoires';
  
  private client: HCSClient;

  constructor(client: HCSClient) {
    this.client = client;
  }

  async execute(): Promise<AttackResult> {
    // Générer un code HCS aléatoire
    const fakeCode = this.generateRandomCode();
    
    const response = await this.client.verifyCode({ code: fakeCode });
    
    return {
      attackType: this.name,
      timestamp: new Date(),
      success: response.valid,  // Si valid = attaque réussie (mauvais!)
      score: response.score,
      responseTimeMs: response.processingTimeMs,
      payload: fakeCode,
      response,
    };
  }

  private generateRandomCode(): string {
    const version = 'V:7.0';
    const alg = 'ALG:QS';
    const element = 'E:' + ['E', 'W', 'F', 'A'][Math.floor(Math.random() * 4)];
    const mod = `MOD:c${this.rand(100)}f${this.rand(100)}m${this.rand(100)}`;
    const cog = `COG:F${this.rand(100)}C${this.rand(100)}V${this.rand(100)}S${this.rand(100)}Cr${this.rand(100)}`;
    const tw = `TW:${Math.floor(Date.now() / 1000 / 30)}`;
    const ce = `CE:${randomBytes(16).toString('hex')}`;
    const qsig = `QSIG:${randomBytes(32).toString('hex')}`;
    const b3 = `B3:${randomBytes(32).toString('hex')}`;
    
    return `HCS-U7|${version}|${alg}|${element}|${mod}|${cog}|${tw}|${ce}|${qsig}|${b3}`;
  }

  private rand(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
