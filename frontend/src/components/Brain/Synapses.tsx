/**
 * Synapses Component
 * Instanced mesh system for 400 synapses with flash animations
 */
import { 
  useRef, 
  useMemo, 
  useEffect, 
  useImperativeHandle, 
  forwardRef,
  useCallback 
} from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Synapse, SynapseSystem, BrainRegion } from './types';

interface SynapsesProps {
  count?: number;
}

// Generate random position within brain bounds
const generateSynapsePosition = (): THREE.Vector3 => {
  // Use spherical distribution for brain-like shape
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const radius = 35 + Math.random() * 15; // Between 35-50 units

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta) * 0.8; // Slightly flattened
  const z = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

// Determine region based on position
const getRegionFromPosition = (pos: THREE.Vector3): BrainRegion => {
  const nz = pos.z / 50;
  const ny = pos.y / 50;

  if (nz > 0.3) return 'frontal';
  if (ny > 0.3 && nz <= 0.3 && nz > -0.3) return 'parietal';
  if (nz < -0.3) return 'occipital';
  return 'temporal';
};

// Generate synapse connections (2-4 nearby synapses)
const generateConnections = (
  synapseId: string,
  position: THREE.Vector3,
  allPositions: Map<string, THREE.Vector3>
): string[] => {
  const connections: string[] = [];
  const maxConnections = 2 + Math.floor(Math.random() * 3); // 2-4 connections
  const maxDistance = 30;

  const distances: Array<{ id: string; dist: number }> = [];

  allPositions.forEach((pos, id) => {
    if (id !== synapseId) {
      const dist = position.distanceTo(pos);
      if (dist < maxDistance) {
        distances.push({ id, dist });
      }
    }
  });

  // Sort by distance and take closest
  distances.sort((a, b) => a.dist - b.dist);
  for (let i = 0; i < Math.min(maxConnections, distances.length); i++) {
    connections.push(distances[i].id);
  }

  return connections;
};

export const Synapses = forwardRef<SynapseSystem, SynapsesProps>(
  ({ count = 400 }, ref) => {
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
    const linesRef = useRef<THREE.LineSegments>(null);

    // Store synapse data
    const synapsesRef = useRef<Synapse[]>([]);
    const flashQueueRef = useRef<Map<string, { color: string; endTime: number }>>(
      new Map()
    );

    // Color attribute for per-instance colors
    const colorArrayRef = useRef<Float32Array | null>(null);

    // Generate synapses once
    const { synapses, linePositions } = useMemo(() => {
      const positions = new Map<string, THREE.Vector3>();
      const synapseList: Synapse[] = [];

      // First pass: generate positions
      for (let i = 0; i < count; i++) {
        const id = `synapse-${i}`;
        const position = generateSynapsePosition();
        positions.set(id, position);
      }

      // Second pass: create synapses with connections
      positions.forEach((position, id) => {
        const region = getRegionFromPosition(position);
        const connections = generateConnections(id, position, positions);

        synapseList.push({
          id,
          position,
          connections,
          region,
          isActive: false,
          flashColor: null,
          flashProgress: 0,
        });
      });

      // Generate line positions for connections
      const linePositionArray: number[] = [];
      const processedPairs = new Set<string>();

      synapseList.forEach((synapse) => {
        synapse.connections.forEach((connId) => {
          const pairKey = [synapse.id, connId].sort().join('-');
          if (!processedPairs.has(pairKey)) {
            processedPairs.add(pairKey);
            const connSynapse = synapseList.find((s) => s.id === connId);
            if (connSynapse) {
              linePositionArray.push(
                synapse.position.x,
                synapse.position.y,
                synapse.position.z,
                connSynapse.position.x,
                connSynapse.position.y,
                connSynapse.position.z
              );
            }
          }
        });
      });

      return {
        synapses: synapseList,
        linePositions: new Float32Array(linePositionArray),
      };
    }, [count]);

    // Store synapses in ref
    useEffect(() => {
      synapsesRef.current = synapses;
    }, [synapses]);

    // Initialize instanced mesh positions
    useEffect(() => {
      if (!instancedMeshRef.current) return;

      const mesh = instancedMeshRef.current;
      const matrix = new THREE.Matrix4();
      const color = new THREE.Color('#0EA5E9');

      // Initialize color array
      colorArrayRef.current = new Float32Array(count * 3);

      synapses.forEach((synapse, i) => {
        matrix.setPosition(synapse.position);
        mesh.setMatrixAt(i, matrix);
        mesh.setColorAt(i, color);

        // Store in color array
        colorArrayRef.current![i * 3] = color.r;
        colorArrayRef.current![i * 3 + 1] = color.g;
        colorArrayRef.current![i * 3 + 2] = color.b;
      });

      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
      }
    }, [synapses, count]);

    // Reusable color objects to avoid GC pressure
    const baseColorRef = useRef(new THREE.Color('#0EA5E9'));
    const tempColorRef = useRef(new THREE.Color());
    const flashColorRef = useRef(new THREE.Color());
    
    // Synapse index lookup map for O(1) access
    const synapseIndexMap = useMemo(() => {
      const map = new Map<string, number>();
      synapses.forEach((s, i) => map.set(s.id, i));
      return map;
    }, [synapses]);

    // Animation frame - handle flashing and idle sparkle
    useFrame(() => {
      if (!instancedMeshRef.current) return;

      const mesh = instancedMeshRef.current;
      const now = Date.now();
      const baseColor = baseColorRef.current;
      const tempColor = tempColorRef.current;
      const flashColor = flashColorRef.current;
      let needsUpdate = false;
      const toDelete: string[] = [];

      // Process flash queue with optimized lookup
      flashQueueRef.current.forEach((flash, id) => {
        const index = synapseIndexMap.get(id);
        if (index === undefined) return;

        if (now < flash.endTime) {
          // Still flashing - use easing for smoother animation
          const elapsed = flash.endTime - now;
          const duration = 300;
          const progress = Math.max(0, elapsed / duration);
          const easedProgress = progress * progress; // Ease out quad
          
          flashColor.set(flash.color);
          tempColor.copy(baseColor).lerp(flashColor, easedProgress);
          mesh.setColorAt(index, tempColor);
          needsUpdate = true;
        } else {
          // Flash ended
          mesh.setColorAt(index, baseColor);
          toDelete.push(id);
          needsUpdate = true;
        }
      });

      // Clean up completed flashes
      toDelete.forEach(id => flashQueueRef.current.delete(id));

      // Idle sparkle - reduced frequency for performance
      if (Math.random() < 0.08) {
        const randomIndex = Math.floor(Math.random() * synapses.length);
        const synapse = synapses[randomIndex];
        if (!flashQueueRef.current.has(synapse.id)) {
          flashQueueRef.current.set(synapse.id, {
            color: '#22D3EE',
            endTime: now + 120,
          });
        }
      }

      if (needsUpdate && mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
      }
    });

    // Expose synapse system API
    const flashSynapse = useCallback((id: string, color: string, duration: number) => {
      flashQueueRef.current.set(id, {
        color,
        endTime: Date.now() + duration,
      });
    }, []);

    const getSynapsesByRegion = useCallback((region: BrainRegion): Synapse[] => {
      return synapsesRef.current.filter((s) => s.region === region);
    }, []);

    const flashRegion = useCallback(
      (region: BrainRegion, color: string, delayBetween: number) => {
        const regionSynapses = getSynapsesByRegion(region);
        
        // Sort synapses by distance from center of region for wave effect
        const centerZ = region === 'frontal' ? 40 : region === 'occipital' ? -40 : 0;
        const centerY = region === 'parietal' ? 30 : 0;
        
        const sortedSynapses = [...regionSynapses].sort((a, b) => {
          const distA = Math.sqrt(
            Math.pow(a.position.z - centerZ, 2) + 
            Math.pow(a.position.y - centerY, 2)
          );
          const distB = Math.sqrt(
            Math.pow(b.position.z - centerZ, 2) + 
            Math.pow(b.position.y - centerY, 2)
          );
          return distA - distB;
        });

        // Flash in cascade with propagation to connected synapses
        sortedSynapses.forEach((synapse, index) => {
          setTimeout(() => {
            // Flash main synapse
            flashSynapse(synapse.id, color, 400);
            
            // Propagate to connected synapses with slight delay
            synapse.connections.forEach((connId, connIndex) => {
              setTimeout(() => {
                flashSynapse(connId, color, 250);
              }, 30 * (connIndex + 1));
            });
          }, index * delayBetween);
        });
      },
      [getSynapsesByRegion, flashSynapse]
    );

    // Expose API via ref
    useImperativeHandle(
      ref,
      () => ({
        synapses: synapsesRef.current,
        getSynapsesByRegion,
        flashSynapse,
        flashRegion,
      }),
      [getSynapsesByRegion, flashSynapse, flashRegion]
    );

    // Line geometry for connections
    const lineGeometry = useMemo(() => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(linePositions, 3)
      );
      return geometry;
    }, [linePositions]);

    return (
      <group>
        {/* Synapse spheres (instanced) */}
        <instancedMesh
          ref={instancedMeshRef}
          args={[undefined, undefined, count]}
          frustumCulled={false}
        >
          <sphereGeometry args={[0.8, 6, 6]} />
          <meshStandardMaterial
            color="#0EA5E9"
            emissive="#06B6D4"
            emissiveIntensity={0.5}
            roughness={0.4}
            metalness={0.6}
          />
        </instancedMesh>

        {/* Connection lines */}
        <lineSegments ref={linesRef} geometry={lineGeometry}>
          <lineBasicMaterial
            color="#0EA5E9"
            transparent
            opacity={0.15}
            linewidth={1}
          />
        </lineSegments>
      </group>
    );
  }
);

Synapses.displayName = 'Synapses';
