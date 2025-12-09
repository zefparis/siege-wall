"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const attackPointsRef = useRef<THREE.Points>(null);

  // Generate globe wireframe points
  const globeGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 12);
    return geo;
  }, []);

  // Generate random attack points on sphere surface
  const attackPoints = useMemo(() => {
    const points: number[] = [];
    const colors: number[] = [];
    const count = 50;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = 2.05 * Math.cos(theta) * Math.sin(phi);
      const y = 2.05 * Math.sin(theta) * Math.sin(phi);
      const z = 2.05 * Math.cos(phi);

      points.push(x, y, z);

      // Cyan to violet gradient
      const t = Math.random();
      colors.push(
        t * 0.55 + (1 - t) * 0,
        t * 0 + (1 - t) * 1,
        t * 1 + (1 - t) * 1
      );
    }

    return {
      positions: new Float32Array(points),
      colors: new Float32Array(colors),
    };
  }, []);

  // Generate constellation lines
  const constellationLines = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      points.push(new THREE.Vector3(x, y, z));

      // Connect to nearby point
      const r2 = 4 + Math.random() * 2;
      const theta2 = theta + (Math.random() - 0.5) * 0.5;
      const phi2 = phi + (Math.random() - 0.5) * 0.5;

      const x2 = r2 * Math.sin(phi2) * Math.cos(theta2);
      const y2 = r2 * Math.sin(phi2) * Math.sin(theta2);
      const z2 = r2 * Math.cos(phi2);

      points.push(new THREE.Vector3(x2, y2, z2));
    }

    return points;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    }
    if (attackPointsRef.current) {
      attackPointsRef.current.rotation.y += 0.001;

      // Pulse attack points
      const positions = attackPointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.02;
        positions[i] *= scale / (1 + Math.sin(state.clock.elapsedTime * 2 + i - 0.1) * 0.02);
        positions[i + 1] *= scale / (1 + Math.sin(state.clock.elapsedTime * 2 + i - 0.1) * 0.02);
        positions[i + 2] *= scale / (1 + Math.sin(state.clock.elapsedTime * 2 + i - 0.1) * 0.02);
      }
      attackPointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Globe wireframe */}
      <mesh ref={meshRef} geometry={globeGeometry}>
        <meshBasicMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Inner glow sphere */}
      <Sphere args={[1.95, 32, 32]}>
        <meshBasicMaterial
          color="#8b00ff"
          transparent
          opacity={0.05}
        />
      </Sphere>

      {/* Attack points */}
      <points ref={attackPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={attackPoints.positions.length / 3}
            array={attackPoints.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={attackPoints.colors.length / 3}
            array={attackPoints.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      {/* Constellation lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={constellationLines.length}
            array={new Float32Array(constellationLines.flatMap((v) => [v.x, v.y, v.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00ffff" transparent opacity={0.1} />
      </lineSegments>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
      </mesh>

      <mesh rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[3, 0.005, 16, 100]} />
        <meshBasicMaterial color="#8b00ff" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function AttackGlobe() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <Globe />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
