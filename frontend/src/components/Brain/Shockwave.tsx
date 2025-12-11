/**
 * Shockwave Component
 * Expanding ring effect triggered on attack impact
 */
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ShockwaveProps } from './types';

// Easing functions
const easeOutQuad = (t: number): number => 1 - (1 - t) * (1 - t);
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const Shockwave: React.FC<ShockwaveProps> = ({
  position,
  color,
  onComplete,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const startTimeRef = useRef<number>(Date.now());
  const completedRef = useRef<boolean>(false);

  const duration = 500; // 500ms for more dramatic effect

  useEffect(() => {
    startTimeRef.current = Date.now();
    completedRef.current = false;
  }, [position, color]);

  useFrame(() => {
    if (!groupRef.current || completedRef.current) return;

    const elapsed = Date.now() - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);

    // Ring 1: Main expanding ring
    if (ring1Ref.current) {
      const scale1 = 1 + easeOutCubic(progress) * 6;
      ring1Ref.current.scale.set(scale1, scale1, scale1);
      const mat1 = ring1Ref.current.material as THREE.MeshBasicMaterial;
      mat1.opacity = (1 - easeOutQuad(progress)) * 0.8;
    }

    // Ring 2: Delayed secondary ring
    if (ring2Ref.current) {
      const delayedProgress = Math.max(0, (progress - 0.1) / 0.9);
      const scale2 = 1 + easeOutCubic(delayedProgress) * 4;
      ring2Ref.current.scale.set(scale2, scale2, scale2);
      const mat2 = ring2Ref.current.material as THREE.MeshBasicMaterial;
      mat2.opacity = (1 - easeOutQuad(delayedProgress)) * 0.5;
    }

    // Ring 3: Inner pulse
    if (ring3Ref.current) {
      const pulseProgress = Math.max(0, (progress - 0.05) / 0.95);
      const scale3 = 0.5 + easeOutQuad(pulseProgress) * 3;
      ring3Ref.current.scale.set(scale3, scale3, scale3);
      const mat3 = ring3Ref.current.material as THREE.MeshBasicMaterial;
      mat3.opacity = (1 - easeOutCubic(pulseProgress)) * 0.6;
    }

    // Rotate group for dynamic effect
    groupRef.current.rotation.x += 0.015;
    groupRef.current.rotation.y += 0.01;
    groupRef.current.rotation.z += 0.005;

    // Complete
    if (progress >= 1 && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main ring */}
      <mesh ref={ring1Ref}>
        <ringGeometry args={[6, 8, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[4, 5.5, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner pulse sphere */}
      <mesh ref={ring3Ref}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};
