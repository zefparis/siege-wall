import { EventEmitter } from 'events';
import { HCSClient } from '../api/hcs-client';
import { AttackResult, Attacker } from '../attacks/types';
import { BruteForceAttacker } from '../attacks/brute-force';
import { ReplayAttacker } from '../attacks/replay';
import { ExpiredCodeAttacker } from '../attacks/expired-code';
import { MalformedAttacker } from '../attacks/malformed';
import { TimingAttacker } from '../attacks/timing';
import { GradientAttacker } from '../attacks/gradient';
import { AISimulationAttacker } from '../attacks/ai-simulation';
import { CONFIG } from '../config';
import { logger } from '../utils/logger';

export interface SiegeStats {
  totalAttacks: number;
  successfulAttacks: number;  // Attaques qui ont RÉUSSI (= failles)
  failedAttacks: number;      // Attaques rejetées (= système OK)
  attacksByType: Record<string, { total: number; success: number }>;
  avgResponseTime: number;
  startTime: Date;
  lastAttack: Date;
}

export class SiegeOrchestrator extends EventEmitter {
  private client: HCSClient;
  private attackers: Attacker[] = [];
  private stats: SiegeStats;
  private running = false;
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.client = new HCSClient();
    this.stats = this.initStats();
    this.initAttackers();
  }

  private initStats(): SiegeStats {
    return {
      totalAttacks: 0,
      successfulAttacks: 0,
      failedAttacks: 0,
      attacksByType: {},
      avgResponseTime: 0,
      startTime: new Date(),
      lastAttack: new Date(),
    };
  }

  private initAttackers(): void {
    this.attackers = [
      new BruteForceAttacker(this.client),
      new ReplayAttacker(this.client),
      new ExpiredCodeAttacker(this.client),
      new MalformedAttacker(this.client),
      new TimingAttacker(this.client),
      new GradientAttacker(this.client),
      new AISimulationAttacker(this.client),
    ];
    
    // Initialiser stats par type
    for (const attacker of this.attackers) {
      this.stats.attacksByType[attacker.name] = { total: 0, success: 0 };
    }
  }

  async start(): Promise<void> {
    // Vérifier que le backend est accessible
    const healthy = await this.client.health();
    if (!healthy) {
      throw new Error('Backend HCS-U7 non accessible');
    }

    logger.info('🏰 Siege Wall démarré');
    logger.info(`📡 Backend: ${CONFIG.hcs.backendUrl}`);
    logger.info(`⚔️ Rate: ${CONFIG.siege.ratePerSecond} attaques/sec`);
    
    this.running = true;
    this.stats.startTime = new Date();
    
    // Lancer les attaques
    const intervalMs = 1000 / CONFIG.siege.ratePerSecond;
    this.interval = setInterval(() => this.runAttack(), intervalMs);
  }

  stop(): void {
    this.running = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    logger.info('🏰 Siege Wall arrêté');
  }

  private async runAttack(): Promise<void> {
    if (!this.running) return;

    // Sélectionner un attaquant au hasard
    const attacker = this.attackers[Math.floor(Math.random() * this.attackers.length)];
    
    try {
      const result = await attacker.execute();
      this.recordResult(result);
      this.emit('attack', result);
    } catch (error) {
      logger.error(`Erreur attaque ${attacker.name}:`, error);
    }
  }

  private recordResult(result: AttackResult): void {
    this.stats.totalAttacks++;
    this.stats.lastAttack = result.timestamp;
    
    if (result.success) {
      this.stats.successfulAttacks++;
      this.stats.attacksByType[result.attackType].success++;
      
      // ALERTE: Une attaque a réussi!
      logger.warn(`🚨 ATTAQUE RÉUSSIE: ${result.attackType}`);
      logger.warn(`   Payload: ${result.payload.slice(0, 80)}...`);
      this.emit('breach', result);
    } else {
      this.stats.failedAttacks++;
    }
    
    this.stats.attacksByType[result.attackType].total++;
    
    // Moyenne mobile du temps de réponse
    this.stats.avgResponseTime = 
      (this.stats.avgResponseTime * (this.stats.totalAttacks - 1) + result.responseTimeMs) 
      / this.stats.totalAttacks;
  }

  getStats(): SiegeStats {
    return { ...this.stats };
  }

  getSuccessRate(): number {
    if (this.stats.totalAttacks === 0) return 0;
    return (this.stats.successfulAttacks / this.stats.totalAttacks) * 100;
  }
}
