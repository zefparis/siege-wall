// Attack categories
export type AttackCategory =
  | 'BRUTE_FORCE'
  | 'AI_IMITATION'
  | 'TIMING'
  | 'REPLAY'
  | 'NETWORK'
  | 'CRYPTO'
  | 'ADVERSARIAL'
  | 'SWARM';

// Attack status
export type AttackStatus = 'REJECTED' | 'PENDING';

// Individual attack event
export interface Attack {
  id: string;
  timestamp: string;
  type: string;
  category: AttackCategory;
  attacker_id: string;
  attacker_name: string;
  attempt_number: number;
  confidence_score: number;
  response_time_ms: number;
  status: AttackStatus;
  origin_country: string;
}

// Attacker statistics
export interface AttackerStats {
  id: string;
  name: string;
  category: AttackCategory;
  total_attempts: number;
  success_rate: number;
  last_attempt: string;
}

// Overall statistics
export interface SiegeStats {
  total_attacks: number;
  success_rate: number;
  uptime_seconds: number;
  attacks_per_second: number;
  active_vectors: number;
  total_vectors: number;
  breaches: number;
  start_time: string;
}

// Milestone
export interface Milestone {
  value: number;
  label: string;
  reached: boolean;
  reached_at?: string;
}

// WebSocket message types
export type WSMessageType = 'attack' | 'stats' | 'milestone' | 'connected';

export interface WSMessage {
  type: WSMessageType;
  data: Attack | SiegeStats | Milestone;
}

// Store state
export interface SiegeState {
  connected: boolean;
  stats: SiegeStats;
  attacks: Attack[];
  attackers: AttackerStats[];
  milestones: Milestone[];
  setConnected: (connected: boolean) => void;
  setStats: (stats: SiegeStats) => void;
  addAttack: (attack: Attack) => void;
  setAttackers: (attackers: AttackerStats[]) => void;
  updateMilestone: (milestone: Milestone) => void;
}

// Category colors
export const CATEGORY_COLORS: Record<AttackCategory, string> = {
  BRUTE_FORCE: '#FF4757',
  AI_IMITATION: '#9B59B6',
  TIMING: '#F39C12',
  REPLAY: '#3498DB',
  NETWORK: '#E74C3C',
  CRYPTO: '#1ABC9C',
  ADVERSARIAL: '#E91E63',
  SWARM: '#FF5722',
};

// Country codes for simulation
export const COUNTRIES = [
  'US', 'CN', 'RU', 'DE', 'GB', 'FR', 'JP', 'KR', 'BR', 'IN',
  'AU', 'CA', 'NL', 'SG', 'SE', 'CH', 'IL', 'AE', 'HK', 'TW',
];

// Milestones
export const MILESTONE_VALUES = [
  { value: 1_000_000, label: '1M' },
  { value: 10_000_000, label: '10M' },
  { value: 50_000_000, label: '50M' },
  { value: 100_000_000, label: '100M' },
  { value: 500_000_000, label: '500M' },
  { value: 1_000_000_000, label: '1B' },
];
