/**
 * EnergyParticles Component
 * Floating energy particles around the brain for ambient effect
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnergyParticlesProps {
  count?: number;
  radius?: number;
  color?: string;
}

export const EnergyParticles: React.FC<EnergyParticlesProps> = ({
  count = 100,
  radius = 70,
  color = '#22D3EE',
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle positions
  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const pha = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Random spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.8 + Math.random() * 0.4);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Random velocities for orbital motion
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Random phase for size oscillation
      pha[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, phases: pha };
  }, [count, radius]);

  // Animation
  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const positions = positionAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Get current position
      let x = positions[i3];
      let y = positions[i3 + 1];
      let z = positions[i3 + 2];

      // Calculate distance from center (used for bounds check)

      // Orbital motion around Y axis
      const angle = 0.002 + (phases[i] * 0.001);
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const newX = x * cosA - z * sinA;
      const newZ = x * sinA + z * cosA;

      // Vertical oscillation
      const yOsc = Math.sin(time * 0.5 + phases[i]) * 0.3;

      // Radial breathing
      const radialBreath = 1 + Math.sin(time * 0.3 + phases[i]) * 0.02;

      // Apply transformations
      positions[i3] = newX * radialBreath;
      positions[i3 + 1] = (y + yOsc) * radialBreath;
      positions[i3 + 2] = newZ * radialBreath;

      // Keep particles within bounds
      const newDist = Math.sqrt(
        positions[i3] ** 2 + 
        positions[i3 + 1] ** 2 + 
        positions[i3 + 2] ** 2
      );
      
      if (newDist > radius * 1.3 || newDist < radius * 0.5) {
        // Reset particle to valid position
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius * (0.8 + Math.random() * 0.4);
        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);
      }
    }

    positionAttr.needsUpdate = true;

    // Rotate entire particle system slowly
    pointsRef.current.rotation.y += 0.0003;
  });

  // Create geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={color}
        size={1.5}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
