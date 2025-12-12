'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { AttackResult } from '@/hooks/useWebSocket';

// Dynamic import for Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] md:h-[500px] flex items-center justify-center bg-black/50 rounded-xl border border-cyan-500/30">
      <div className="text-cyan-400 animate-pulse">Loading Globe...</div>
    </div>
  ),
});

// Attack origin cities (simulated)
const ATTACK_ORIGINS = [
  { city: 'Moscow', lat: 55.7558, lng: 37.6173, country: 'Russia' },
  { city: 'Beijing', lat: 39.9042, lng: 116.4074, country: 'China' },
  { city: 'New York', lat: 40.7128, lng: -74.0060, country: 'USA' },
  { city: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
  { city: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
  { city: 'São Paulo', lat: -23.5505, lng: -46.6333, country: 'Brazil' },
  { city: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
  { city: 'Lagos', lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
  { city: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India' },
  { city: 'Berlin', lat: 52.5200, lng: 13.4050, country: 'Germany' },
  { city: 'Seoul', lat: 37.5665, lng: 126.9780, country: 'South Korea' },
  { city: 'Dubai', lat: 25.2048, lng: 55.2708, country: 'UAE' },
];

// HCS-U7 HQ location (Alès, France)
const HCS_HQ = { lat: 44.1257, lng: 4.0821, city: 'Alès', country: 'France' };

interface GlobalMapProps {
  attacks: AttackResult[];
}

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  origin: string;
}

export function GlobalMap({ attacks }: GlobalMapProps) {
  const globeRef = useRef<any>(null);
  const [arcsData, setArcsData] = useState<ArcData[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate arcs from attacks
  useEffect(() => {
    if (attacks.length > 0) {
      const lastAttack = attacks[0]; // Most recent
      const origin = ATTACK_ORIGINS[Math.floor(Math.random() * ATTACK_ORIGINS.length)];
      
      const newArc: ArcData = {
        startLat: origin.lat,
        startLng: origin.lng,
        endLat: HCS_HQ.lat,
        endLng: HCS_HQ.lng,
        color: lastAttack.success ? '#ff0000' : '#00ff88',
        origin: origin.city,
      };

      setArcsData(prev => {
        const updated = [newArc, ...prev.slice(0, 29)]; // Keep last 30 arcs
        return updated;
      });
    }
  }, [attacks.length]);

  // Configure globe on mount
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.enableZoom = true;
        controls.minDistance = 200;
        controls.maxDistance = 500;
      }
      globeRef.current.pointOfView({ lat: 35, lng: 10, altitude: 2.2 }, 1000);
    }
  }, [isClient]);

  // HQ marker data
  const hqData = useMemo(() => [{
    lat: HCS_HQ.lat,
    lng: HCS_HQ.lng,
    size: 0.5,
    color: '#00ffff',
    label: '🏰 HCS-U7 HQ',
  }], []);

  if (!isClient) {
    return (
      <div className="h-[400px] md:h-[500px] flex items-center justify-center bg-black/50 rounded-xl border border-cyan-500/30">
        <div className="text-cyan-400 animate-pulse">Initializing Globe...</div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 bg-black/80">
      {/* Glow overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-cyan-500/5 to-transparent pointer-events-none z-10" />
      
      {/* Globe container */}
      <div className="h-[400px] md:h-[500px]">
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          
          // Arcs (attack paths)
          arcsData={arcsData}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={1500}
          arcStroke={0.5}
          
          // HQ Point
          pointsData={hqData}
          pointColor="color"
          pointAltitude={0.01}
          pointRadius="size"
          pointLabel="label"
          
          // Atmosphere
          atmosphereColor="#00ffff"
          atmosphereAltitude={0.15}
          
          // Performance
          animateIn={true}
          width={undefined}
          height={undefined}
        />
      </div>

      {/* Stats overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
        {/* Location info */}
        <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/50 rounded-lg px-4 py-2">
          <div className="text-cyan-400 text-sm font-mono flex items-center gap-2">
            <span className="text-lg">📍</span>
            <span>Protected Zone: {HCS_HQ.city}, {HCS_HQ.country}</span>
          </div>
          <div className="text-green-400 text-xs mt-1">
            {arcsData.length} active attack paths visualized
          </div>
        </div>

        {/* Legend */}
        <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/50 rounded-lg px-3 py-2 text-xs">
          <div className="flex items-center gap-2 text-green-400">
            <span className="w-3 h-0.5 bg-green-400 rounded" />
            <span>Blocked</span>
          </div>
          <div className="flex items-center gap-2 text-red-400 mt-1">
            <span className="w-3 h-0.5 bg-red-400 rounded" />
            <span>Breach</span>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-500/50" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-500/50" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-500/50" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-500/50" />
    </div>
  );
}
