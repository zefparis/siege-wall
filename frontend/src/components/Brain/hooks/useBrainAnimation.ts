/**
 * useBrainAnimation Hook
 * Handles idle breathing animation for the brain
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface BrainAnimationState {
  breathingScale: number;
  pulseScale: number;
  isPulsing: boolean;
}

export const useBrainAnimation = () => {
  const stateRef = useRef<BrainAnimationState>({
    breathingScale: 1,
    pulseScale: 1,
    isPulsing: false,
  });

  const pulseTimeoutRef = useRef<number | null>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Breathing effect: subtle ±2% oscillation
    const breathingScale = 1 + Math.sin(time * 0.5) * 0.02;
    stateRef.current.breathingScale = breathingScale;

    // Pulse decay
    if (stateRef.current.isPulsing) {
      stateRef.current.pulseScale = Math.max(
        1,
        stateRef.current.pulseScale - 0.002
      );
      if (stateRef.current.pulseScale <= 1) {
        stateRef.current.isPulsing = false;
      }
    }
  });

  const triggerPulse = (intensity: number = 1.05, duration: number = 200) => {
    stateRef.current.pulseScale = intensity;
    stateRef.current.isPulsing = true;

    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current);
    }

    pulseTimeoutRef.current = window.setTimeout(() => {
      stateRef.current.isPulsing = false;
      stateRef.current.pulseScale = 1;
    }, duration);
  };

  const getScale = () => {
    return stateRef.current.breathingScale * stateRef.current.pulseScale;
  };

  return {
    getScale,
    triggerPulse,
    stateRef,
  };
};
