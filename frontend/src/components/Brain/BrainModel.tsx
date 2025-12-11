/**
 * BrainModel Component
 * Low-poly holographic brain geometry with region highlighting
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BrainModelProps } from './types';

// Generate brain-like geometry using multiple deformed spheres
const createBrainGeometry = (): THREE.BufferGeometry => {
  const geometry = new THREE.SphereGeometry(50, 32, 24);
  const positions = geometry.attributes.position;

  // Deform sphere to look more brain-like
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);

    // Create hemisphere split (brain has two halves)
    const hemisphereGap = Math.abs(x) < 5 ? 0.85 : 1;

    // Add wrinkles/folds
    const noise1 = Math.sin(x * 0.15) * Math.cos(z * 0.15) * 5;
    const noise2 = Math.sin(y * 0.2 + x * 0.1) * 3;
    const noise3 = Math.cos(z * 0.18 + y * 0.12) * 4;

    // Flatten bottom slightly
    const bottomFlatten = y < -30 ? 0.7 + (y + 50) / 50 * 0.3 : 1;

    // Elongate front (frontal lobe)
    const frontalExtend = z > 20 ? 1 + (z - 20) / 100 : 1;

    // Apply deformations
    const scale = hemisphereGap * bottomFlatten * frontalExtend;
    const newX = x * scale + noise1 * (Math.abs(x) / 50);
    const newY = y * scale + noise2;
    const newZ = z * frontalExtend + noise3;

    positions.setXYZ(i, newX, newY, newZ);
  }

  geometry.computeVertexNormals();
  return geometry;
};


export const BrainModel: React.FC<BrainModelProps> = ({ regionGlows }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  const wireframeMaterialRef = useRef<THREE.LineBasicMaterial>(null);

  // Create brain geometry once
  const brainGeometry = useMemo(() => createBrainGeometry(), []);

  // Create wireframe geometry
  const wireframeGeometry = useMemo(() => {
    return new THREE.WireframeGeometry(brainGeometry);
  }, [brainGeometry]);

  // Calculate emissive color based on active regions
  useFrame((state) => {
    if (!materialRef.current) return;

    const time = state.clock.getElapsedTime();

    // Blend emissive colors from all active regions
    let totalIntensity = 0;
    let r = 0, g = 0, b = 0;

    Object.entries(regionGlows).forEach(([_region, glow]) => {
      if (glow.intensity > 0) {
        const color = new THREE.Color(glow.color);
        r += color.r * glow.intensity;
        g += color.g * glow.intensity;
        b += color.b * glow.intensity;
        totalIntensity += glow.intensity;
      }
    });

    if (totalIntensity > 0) {
      // Active glow state
      materialRef.current.emissive.setRGB(
        r / totalIntensity,
        g / totalIntensity,
        b / totalIntensity
      );
      materialRef.current.emissiveIntensity = Math.min(totalIntensity * 0.8, 1.5);
      materialRef.current.opacity = 0.75 + Math.sin(time * 8) * 0.05;
      
      // Pulse wireframe
      if (wireframeMaterialRef.current) {
        wireframeMaterialRef.current.opacity = 0.2 + totalIntensity * 0.15;
        wireframeMaterialRef.current.color.setRGB(
          r / totalIntensity,
          g / totalIntensity,
          b / totalIntensity
        );
      }
      
      // Pulse inner glow
      if (innerGlowRef.current) {
        const innerMat = innerGlowRef.current.material as THREE.MeshBasicMaterial;
        innerMat.opacity = 0.15 + totalIntensity * 0.1;
        innerMat.color.setRGB(r / totalIntensity, g / totalIntensity, b / totalIntensity);
      }
    } else {
      // Default idle emissive with subtle pulse
      const idlePulse = 0.3 + Math.sin(time * 2) * 0.05;
      materialRef.current.emissive.setHex(0x06B6D4);
      materialRef.current.emissiveIntensity = idlePulse;
      materialRef.current.opacity = 0.7;
      
      // Reset wireframe
      if (wireframeMaterialRef.current) {
        wireframeMaterialRef.current.opacity = 0.15;
        wireframeMaterialRef.current.color.setHex(0x22D3EE);
      }
      
      // Reset inner glow
      if (innerGlowRef.current) {
        const innerMat = innerGlowRef.current.material as THREE.MeshBasicMaterial;
        innerMat.opacity = 0.1;
        innerMat.color.setHex(0x0EA5E9);
      }
    }
  });

  return (
    <group>
      {/* Main brain mesh */}
      <mesh ref={meshRef} geometry={brainGeometry}>
        <meshStandardMaterial
          ref={materialRef}
          color="#0EA5E9"
          emissive="#06B6D4"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.8}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe overlay */}
      <lineSegments ref={wireframeRef} geometry={wireframeGeometry}>
        <lineBasicMaterial
          ref={wireframeMaterialRef}
          color="#22D3EE"
          transparent
          opacity={0.15}
          linewidth={1}
        />
      </lineSegments>

      {/* Inner glow core */}
      <mesh ref={innerGlowRef} scale={0.85}>
        <sphereGeometry args={[50, 16, 12]} />
        <meshBasicMaterial
          color="#0EA5E9"
          transparent
          opacity={0.1}
        />
      </mesh>
      
      {/* Outer glow halo */}
      <mesh scale={1.02}>
        <sphereGeometry args={[50, 24, 18]} />
        <meshBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};
