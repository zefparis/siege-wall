export interface AttackResult {
  attackType: string;
  timestamp: Date;
  success: boolean;           // true = attaque a réussi (MAUVAIS pour nous)
  score?: number;
  responseTimeMs: number;
  payload: string;            // Code envoyé
  response: any;              // Réponse backend
  metadata?: Record<string, any>;
}

export interface Attacker {
  name: string;
  description: string;
  execute(): Promise<AttackResult>;
}
