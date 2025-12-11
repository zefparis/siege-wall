/**
 * Brain Component Types
 * Type definitions for the Cognitive Brain visualization
 */
import * as THREE from 'three';

// ============================================================================
// BRAIN REGIONS
// ============================================================================

export type BrainRegion = 'frontal' | 'parietal' | 'temporal' | 'occipital';

export interface BrainRegionConfig {
  name: string;
  color: string;
  defense: string;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
}

export const BRAIN_REGIONS: Record<BrainRegion, BrainRegionConfig> = {
  frontal: {
    name: 'Frontal Lobe',
    color: '#8B5CF6', // Violet
    defense: 'Cognitive Firewall',
    bounds: { minX: -1, maxX: 1, minY: 0, maxY: 1, minZ: 0.3, maxZ: 1 },
  },
  parietal: {
    name: 'Parietal Lobe',
    color: '#EC4899', // Magenta
    defense: 'Behavioral Biometrics',
    bounds: { minX: -1, maxX: 1, minY: 0.5, maxY: 1, minZ: -0.5, maxZ: 0.3 },
  },
  temporal: {
    name: 'Temporal Lobe',
    color: '#F59E0B', // Orange
    defense: 'Celestial Entropy',
    bounds: { minX: -1, maxX: 1, minY: -0.5, maxY: 0.5, minZ: -0.3, maxZ: 0.3 },
  },
  occipital: {
    name: 'Occipital Lobe',
    color: '#06B6D4', // Cyan
    defense: 'Quantum Hardening',
    bounds: { minX: -1, maxX: 1, minY: -1, maxY: 0.5, minZ: -1, maxZ: -0.3 },
  },
};

// ============================================================================
// ATTACK MAPPING
// ============================================================================

export type AttackType =
  | 'brute-force'
  | 'ai-simulation'
  | 'timing'
  | 'replay'
  | 'adversarial'
  | 'sql-injection'
  | 'bot-simulation'
  | 'celestial-prediction'
  | 'quantum-bypass';

export const ATTACK_REGION_MAP: Record<string, BrainRegion> = {
  'brute-force': 'frontal',
  'ai-simulation': 'frontal',
  'timing': 'occipital',
  'replay': 'temporal',
  'adversarial': 'parietal',
  'sql-injection': 'frontal',
  'bot-simulation': 'parietal',
  'celestial-prediction': 'temporal',
  'quantum-bypass': 'occipital',
};

// ============================================================================
// SYNAPSE
// ============================================================================

export interface Synapse {
  id: string;
  position: THREE.Vector3;
  connections: string[];
  region: BrainRegion;
  isActive: boolean;
  flashColor: string | null;
  flashProgress: number;
}

export interface SynapseSystem {
  synapses: Synapse[];
  getSynapsesByRegion: (region: BrainRegion) => Synapse[];
  flashSynapse: (id: string, color: string, duration: number) => void;
  flashRegion: (region: BrainRegion, color: string, delay: number) => void;
}

// ============================================================================
// ATTACK INTERFACE
// ============================================================================

export interface BrainAttack {
  id: string;
  type: string;
  timestamp: number;
  blocked: boolean;
  color: string;
  impactPoint?: THREE.Vector3;
}

// ============================================================================
// THEME COLORS
// ============================================================================

export const BRAIN_THEME = {
  // Base
  primary: '#0EA5E9',
  secondary: '#06B6D4',
  accent: '#22D3EE',

  // Regions (when activated)
  frontal: '#8B5CF6',
  parietal: '#EC4899',
  temporal: '#F59E0B',
  occipital: '#06B6D4',

  // States
  idle: '#0EA5E9',
  active: '#22D3EE',
  blocked: '#10B981',
  breach: '#EF4444',
};

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface CognitiveBrainProps {
  attacks: BrainAttack[];
  scale?: number;
  rotationSpeed?: number;
  debug?: boolean;
}

export interface BrainModelProps {
  regionGlows: Record<BrainRegion, { intensity: number; color: string }>;
}

export interface SynapsesProps {
  count?: number;
  onReady?: (system: SynapseSystem) => void;
}

export interface ShockwaveProps {
  position: THREE.Vector3;
  color: string;
  onComplete: () => void;
}
