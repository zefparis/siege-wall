/**
 * useAttackResponse Hook
 * Handles brain reactions to incoming attacks
 */
import { useCallback, useRef } from 'react';
import { 
  BrainAttack, 
  BrainRegion, 
  ATTACK_REGION_MAP, 
  SynapseSystem,
  BRAIN_REGIONS 
} from '../types';

interface RegionGlow {
  intensity: number;
  color: string;
  timeoutId: number | null;
}

interface AttackResponseState {
  regionGlows: Record<BrainRegion, RegionGlow>;
  activeShockwaves: Array<{
    id: string;
    position: [number, number, number];
    color: string;
  }>;
}

export const useAttackResponse = (
  synapseSystemRef: React.RefObject<SynapseSystem | null>,
  onPulse: (intensity: number, duration: number) => void,
  onShockwave: (position: [number, number, number], color: string) => void
) => {
  const stateRef = useRef<AttackResponseState>({
    regionGlows: {
      frontal: { intensity: 0, color: BRAIN_REGIONS.frontal.color, timeoutId: null },
      parietal: { intensity: 0, color: BRAIN_REGIONS.parietal.color, timeoutId: null },
      temporal: { intensity: 0, color: BRAIN_REGIONS.temporal.color, timeoutId: null },
      occipital: { intensity: 0, color: BRAIN_REGIONS.occipital.color, timeoutId: null },
    },
    activeShockwaves: [],
  });

  const glowRegion = useCallback((region: BrainRegion, color: string, duration: number) => {
    const glow = stateRef.current.regionGlows[region];
    
    // Clear existing timeout
    if (glow.timeoutId) {
      clearTimeout(glow.timeoutId);
    }

    // Set glow
    glow.intensity = 1.5;
    glow.color = color;

    // Fade out over duration
    const fadeSteps = 20;
    const fadeInterval = duration / fadeSteps;
    let step = 0;

    const fadeOut = () => {
      step++;
      const progress = step / fadeSteps;
      // Ease-in-out curve
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      glow.intensity = 1.5 * (1 - eased);

      if (step < fadeSteps) {
        glow.timeoutId = window.setTimeout(fadeOut, fadeInterval);
      } else {
        glow.intensity = 0;
        glow.timeoutId = null;
      }
    };

    glow.timeoutId = window.setTimeout(fadeOut, fadeInterval);
  }, []);

  const processAttack = useCallback((attack: BrainAttack) => {
    // 1. Identify brain region
    const region = ATTACK_REGION_MAP[attack.type] || 'frontal';
    const attackColor = attack.color || BRAIN_REGIONS[region].color;

    // 2. Flash synapses in cascade
    if (synapseSystemRef.current) {
      synapseSystemRef.current.flashRegion(region, attackColor, 50);
    }

    // 3. Glow the region
    glowRegion(region, attackColor, 2000);

    // 4. Emit shockwave
    const bounds = BRAIN_REGIONS[region].bounds;
    const impactPoint: [number, number, number] = attack.impactPoint
      ? [attack.impactPoint.x, attack.impactPoint.y, attack.impactPoint.z]
      : [
          (bounds.minX + bounds.maxX) / 2 * 50,
          (bounds.minY + bounds.maxY) / 2 * 50,
          (bounds.minZ + bounds.maxZ) / 2 * 50,
        ];
    
    setTimeout(() => {
      onShockwave(impactPoint, attackColor);
    }, 100);

    // 5. Pulse the brain
    setTimeout(() => {
      onPulse(1.05, 200);
    }, 200);

    // Debug log (using import.meta.env for Vite)
    if (import.meta.env.DEV) {
      console.log('[CognitiveBrain] Attack processed:', {
        type: attack.type,
        region,
        color: attackColor,
      });
    }
  }, [synapseSystemRef, glowRegion, onShockwave, onPulse]);

  const getRegionGlows = useCallback(() => {
    const glows: Record<BrainRegion, { intensity: number; color: string }> = {
      frontal: { 
        intensity: stateRef.current.regionGlows.frontal.intensity,
        color: stateRef.current.regionGlows.frontal.color,
      },
      parietal: { 
        intensity: stateRef.current.regionGlows.parietal.intensity,
        color: stateRef.current.regionGlows.parietal.color,
      },
      temporal: { 
        intensity: stateRef.current.regionGlows.temporal.intensity,
        color: stateRef.current.regionGlows.temporal.color,
      },
      occipital: { 
        intensity: stateRef.current.regionGlows.occipital.intensity,
        color: stateRef.current.regionGlows.occipital.color,
      },
    };
    return glows;
  }, []);

  return {
    processAttack,
    getRegionGlows,
    stateRef,
  };
};
