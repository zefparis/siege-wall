import { Attacker, AttackResult } from './types';
import { HCSClient } from '../api/hcs-client';

export class MalformedAttacker implements Attacker {
  name = 'malformed';
  description = 'Envoie des codes malformés pour tester le parsing';
  
  private client: HCSClient;
  private malformations = [
    // QSIG trop court
    () => 'HCS-U7|V:7.0|ALG:QS|QSIG:abc123|B3:def456',
    // B3 trop long
    () => `HCS-U7|V:7.0|ALG:QS|QSIG:${'a'.repeat(64)}|B3:${'b'.repeat(128)}`,
    // Segments manquants
    () => 'HCS-U7|V:7.0',
    // Injection SQL
    () => `HCS-U7|V:7.0|ALG:QS|COG:'; DROP TABLE users; --`,
    // XSS
    () => `HCS-U7|V:7.0|ALG:QS|COG:<script>alert('xss')</script>`,
    // Unicode
    () => `HCS-U7|V:7.0|ALG:QS|COG:F50C50V50S50Cr50|QSIG:${'\u0000'.repeat(32)}`,
    // Très long
    () => `HCS-U7|V:7.0|ALG:QS|COG:${'A'.repeat(10000)}`,
    // Vide
    () => '',
    // Null bytes
    () => `HCS-U7\x00|V:7.0\x00|ALG:QS`,
    // Format v1 (ancien)
    () => `HCS-U7|V:7.0|ALG:QS|QSIG:${'a'.repeat(22)}|B3:${'b'.repeat(22)}`,
  ];

  constructor(client: HCSClient) {
    this.client = client;
  }

  async execute(): Promise<AttackResult> {
    const malformIdx = Math.floor(Math.random() * this.malformations.length);
    const code = this.malformations[malformIdx]();
    
    const response = await this.client.verifyCode({ code });
    
    return {
      attackType: this.name,
      timestamp: new Date(),
      success: response.valid,
      responseTimeMs: response.processingTimeMs,
      payload: code.slice(0, 100) + (code.length > 100 ? '...' : ''),
      response,
      metadata: {
        malformationType: malformIdx,
        expectedResult: 'rejected (malformed)',
      },
    };
  }
}
