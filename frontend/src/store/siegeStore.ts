import { create } from 'zustand';
import type { Attack, AttackerStats, Milestone, SiegeStats, SiegeState } from '../types';
import { MAX_ATTACKS_DISPLAY } from '../utils/constants';
import { MILESTONE_VALUES } from '../types';

const initialStats: SiegeStats = {
  total_attacks: 0,
  success_rate: 0,
  uptime_seconds: 0,
  attacks_per_second: 0,
  active_vectors: 0,
  total_vectors: 47,
  breaches: 0,
  start_time: new Date().toISOString(),
};

const initialMilestones: Milestone[] = MILESTONE_VALUES.map((m) => ({
  value: m.value,
  label: m.label,
  reached: false,
}));

export const useSiegeStore = create<SiegeState>((set) => ({
  connected: false,
  stats: initialStats,
  attacks: [],
  attackers: [],
  milestones: initialMilestones,

  setConnected: (connected: boolean) => set({ connected }),

  setStats: (stats: SiegeStats) =>
    set((state) => {
      // Auto-update milestones based on total attacks
      const updatedMilestones = state.milestones.map((m) => {
        if (!m.reached && stats.total_attacks >= m.value) {
          return { ...m, reached: true, reached_at: new Date().toISOString() };
        }
        return m;
      });
      return { stats, milestones: updatedMilestones };
    }),

  addAttack: (attack: Attack) =>
    set((state) => {
      const newAttacks = [attack, ...state.attacks].slice(0, MAX_ATTACKS_DISPLAY);
      return { attacks: newAttacks };
    }),

  setAttackers: (attackers: AttackerStats[]) => set({ attackers }),

  updateMilestone: (milestone: Milestone) =>
    set((state) => ({
      milestones: state.milestones.map((m) =>
        m.value === milestone.value ? milestone : m
      ),
    })),
}));
