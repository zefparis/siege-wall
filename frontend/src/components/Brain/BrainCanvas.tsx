/**
 * BrainCanvas Component
 * Canvas wrapper for the CognitiveBrain 3D visualization
 * Optimized for performance with proper settings
 */
import { Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { CognitiveBrain } from './CognitiveBrain';
import { BrainAttack } from './types';

interface BrainCanvasProps {
  attacks: BrainAttack[];
  className?: string;
  debug?: boolean;
}

// Loading fallback with pulsing animation
const BrainLoader = () => (
  <mesh>
    <sphereGeometry args={[40, 16, 16]} />
    <meshBasicMaterial color="#0EA5E9" wireframe transparent opacity={0.3} />
  </mesh>
);

// Memoized brain component to prevent unnecessary re-renders
const MemoizedBrain = memo(CognitiveBrain);

export const BrainCanvas: React.FC<BrainCanvasProps> = ({
  attacks,
  className = '',
  debug = false,
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{
          position: [0, 20, 160],
          fov: 50,
          near: 1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]} // Adaptive DPR between 1 and 2
        frameloop="always"
        style={{ background: 'transparent' }}
        performance={{ min: 0.5 }} // Allow frame rate to drop to 30fps under load
      >
        {/* Adaptive performance helpers */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <Suspense fallback={<BrainLoader />}>
          <MemoizedBrain
            attacks={attacks}
            scale={1}
            rotationSpeed={0.0003}
            debug={debug}
          />
        </Suspense>

        {/* Camera controls - subtle interaction */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          rotateSpeed={0.3}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default memo(BrainCanvas);
