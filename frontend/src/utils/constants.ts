import type { AttackCategory } from '../types';

// WebSocket URL
const ENV_API_URL = (import.meta as any).env?.VITE_API_URL;
const ENV_WS_URL = (import.meta as any).env?.VITE_WS_URL;

export const API_URL = ENV_API_URL || 'http://localhost:8000';

export const WS_URL = ENV_WS_URL || (API_URL.replace(/^http/, 'ws') + '/ws');

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

// Maximum attacks to keep in memory for display
export const MAX_ATTACKS_DISPLAY = 100;

// Animation durations (ms)
export const ANIMATION = {
  ATTACK_SLIDE_IN: 300,
  ATTACK_FADE_OUT: 500,
  COUNTER_ROLL: 200,
  PULSE_DURATION: 2000,
  PARTICLE_LIFETIME: 1500,
};

// Update intervals (ms)
export const INTERVALS = {
  STATS_UPDATE: 1000,
  UPTIME_UPDATE: 1000,
  RECONNECT_DELAY: 3000,
};

// Sound effects (optional)
export const SOUNDS = {
  ATTACK_REJECTED: '/sounds/blip.mp3',
  MILESTONE_REACHED: '/sounds/achievement.mp3',
  NEW_ATTACKER: '/sounds/whoosh.mp3',
};

// Attack type display names
export const ATTACK_TYPE_NAMES: Record<string, string> = {
  brute_force: 'Brute Force',
  dictionary: 'Dictionary Attack',
  gpt4_turbo: 'GPT-4 Turbo',
  gpt4_vision: 'GPT-4 Vision',
  claude_3_5: 'Claude 3.5 Sonnet',
  claude_3_opus: 'Claude 3 Opus',
  gemini_ultra: 'Gemini Ultra',
  llama_3: 'Llama 3 70B',
  mistral_large: 'Mistral Large',
  gan_cognitive: 'GAN Cognitive',
  timing_mimic: 'Timing Mimic',
  jitter_injection: 'Jitter Injection',
  fatigue_sim: 'Fatigue Simulation',
  session_replay: 'Session Replay',
  mosaic: 'Mosaic Attack',
  mitm: 'MITM Attack',
  api_fuzzer: 'API Fuzzer',
  hash_collision: 'Hash Collision',
  entropy_analysis: 'Entropy Analysis',
  gradient: 'Gradient Attack',
  boundary_probe: 'Boundary Probe',
  swarm: 'Swarm Attack',
};

// Category icons (using emoji for simplicity)
export const CATEGORY_ICONS: Record<string, string> = {
  BRUTE_FORCE: '🔨',
  AI_IMITATION: '🤖',
  TIMING: '⏱️',
  REPLAY: '🔄',
  NETWORK: '🌐',
  CRYPTO: '🔐',
  ADVERSARIAL: '⚔️',
  SWARM: '🐝',
};
