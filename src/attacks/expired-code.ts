import { Attacker, AttackResult } from './types';
import { HCSClient } from '../api/hcs-client';
import { randomBytes } from 'crypto';

export class ExpiredCodeAttacker implements Attacker {
  name = 'expired-code';
  description = 'Envoie des codes avec TW expiré';
  
  private client: HCSClient;

  constructor(client: HCSClient) {
    this.client = client;
  }

  async execute(): Promise<AttackResult> {
    // Générer un code expiré (TW = il y a 2-10 fenêtres)
    const offset = 2 + Math.floor(Math.random() * 8); // 2 à 10 fenêtres
    const expiredTw = Math.floor(Date.now() / 1000 / 30) - offset;
    
    const code = `HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f50m50|COG:F50C50V50S50Cr50|TW:${expiredTw}|CE:${randomBytes(16).toString('hex')}|QSIG:${randomBytes(32).toString('hex')}|B3:${randomBytes(32).toString('hex')}`;
    
    const response = await this.client.verifyCode({ code });
    
    return {
      attackType: this.name,
      timestamp: new Date(),
      success: response.valid,
      responseTimeMs: response.processingTimeMs,
      payload: code,
      response,
      metadata: {
        windowOffset: offset,
        expectedResult: 'rejected (expired)',
      },
    };
  }
}
