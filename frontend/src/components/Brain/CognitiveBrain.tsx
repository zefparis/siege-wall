/**
 * CognitiveBrain Component
 * Main holographic brain visualization with attack response
 */
import { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BrainModel } from './BrainModel';
import { Synapses } from './Synapses';
import { Shockwave } from './Shockwave';
import { EnergyParticles } from './EnergyParticles';
import { useBrainAnimation } from './hooks/useBrainAnimation';
import { useAttackResponse } from './hooks/useAttackResponse';
import { 
  CognitiveBrainProps, 
  SynapseSystem, 
  BrainRegion,
  BRAIN_THEME 
} from './types';

interface ActiveShockwave {
  id: string;
  position: THREE.Vector3;
  color: string;
}

export const CognitiveBrain: React.FC<CognitiveBrainProps> = ({
  attacks,
  scale = 1,
  rotationSpeed = 0.0005,
  debug = false,
}) => {
  const brainRef = useRef<THREE.Group>(null);
  const synapseSystemRef = useRef<SynapseSystem | null>(null);
  const lastAttackIdRef = useRef<string | null>(null);

  // Active shockwaves
  const [shockwaves, setShockwaves] = useState<ActiveShockwave[]>([]);

  // Animation hooks
  const { getScale, triggerPulse } = useBrainAnimation();

  // Shockwave handler
  const handleShockwave = useCallback(
    (position: [number, number, number], color: string) => {
      const id = `shockwave-${Date.now()}-${Math.random()}`;
      setShockwaves((prev) => [
        ...prev,
        {
          id,
          position: new THREE.Vector3(...position),
          color,
        },
      ]);
    },
    []
  );

  // Remove completed shockwave
  const handleShockwaveComplete = useCallback((id: string) => {
    setShockwaves((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Attack response hook
  const { processAttack, getRegionGlows } = useAttackResponse(
    synapseSystemRef,
    triggerPulse,
    handleShockwave
  );

  // Region glows state for rendering
  const [regionGlows, setRegionGlows] = useState<
    Record<BrainRegion, { intensity: number; color: string }>
  >({
    frontal: { intensity: 0, color: BRAIN_THEME.frontal },
    parietal: { intensity: 0, color: BRAIN_THEME.parietal },
    temporal: { intensity: 0, color: BRAIN_THEME.temporal },
    occipital: { intensity: 0, color: BRAIN_THEME.occipital },
  });

  // Rotation & breathing animation
  useFrame(() => {
    if (!brainRef.current) return;

    // Subtle rotation
    brainRef.current.rotation.y += rotationSpeed;

    // Breathing + pulse effect
    const s = scale * getScale();
    brainRef.current.scale.set(s, s, s);

    // Update region glows
    setRegionGlows(getRegionGlows());
  });

  // Listen to new attacks
  useEffect(() => {
    if (attacks.length === 0) return;

    const lastAttack = attacks[attacks.length - 1];
    
    // Only process new attacks
    if (lastAttack.id !== lastAttackIdRef.current) {
      lastAttackIdRef.current = lastAttack.id;
      processAttack(lastAttack);
    }
  }, [attacks, processAttack]);

  return (
    <group ref={brainRef}>
      {/* Ambient lighting for the brain */}
      <ambientLight intensity={0.4} />
      <pointLight position={[100, 100, 100]} intensity={1} color="#ffffff" />
      <pointLight position={[-100, -50, -100]} intensity={0.5} color="#06B6D4" />
      <pointLight position={[0, -100, 50]} intensity={0.3} color="#8B5CF6" />

      {/* Brain model with region highlighting */}
      <BrainModel regionGlows={regionGlows} />

      {/* Synapse system */}
      <Synapses ref={synapseSystemRef} count={400} />

      {/* Energy particles floating around */}
      <EnergyParticles count={80} radius={70} color="#22D3EE" />
      <EnergyParticles count={40} radius={85} color="#8B5CF6" />

      {/* Active shockwaves */}
      {shockwaves.map((shockwave) => (
        <Shockwave
          key={shockwave.id}
          position={shockwave.position}
          color={shockwave.color}
          onComplete={() => handleShockwaveComplete(shockwave.id)}
        />
      ))}

      {/* Debug helpers */}
      {debug && (
        <>
          {/* Axes helper */}
          <axesHelper args={[100]} />
          
          {/* Bounding sphere */}
          <mesh>
            <sphereGeometry args={[55, 16, 16]} />
            <meshBasicMaterial 
              color="#ff0000" 
              wireframe 
              transparent 
              opacity={0.2} 
            />
          </mesh>
        </>
      )}
    </group>
  );
};

export default CognitiveBrain;
