'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface AttackPoint {
  id: string;
  x: number;
  y: number;
  intensity: number;
}

export function GlobalMap() {
  const [points, setPoints] = useState<AttackPoint[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random attack points
  useEffect(() => {
    const generatePoint = () => {
      const newPoint: AttackPoint = {
        id: Math.random().toString(36).substr(2, 9),
        x: Math.random() * 100,
        y: 20 + Math.random() * 60, // Keep points in middle area
        intensity: 0.5 + Math.random() * 0.5,
      };
      
      setPoints(prev => [...prev.slice(-20), newPoint]);
    };

    const interval = setInterval(generatePoint, 800);
    return () => clearInterval(interval);
  }, []);

  // Draw particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles from attack points
      points.forEach(point => {
        if (Math.random() > 0.95) {
          particles.push({
            x: (point.x / 100) * canvas.offsetWidth,
            y: (point.y / 100) * canvas.offsetHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
          });
        }
      });

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.life * 0.5})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [points]);

  return (
    <section className="px-4 md:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              Global Attack Map
            </h2>
            <p className="text-sm text-white/40 mt-1">Real-time threat visualization</p>
          </div>
        </div>

        {/* Map container */}
        <div className="relative rounded-2xl bg-black border border-white/10 overflow-hidden h-80">
          {/* Grid background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Particle canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />

          {/* Attack points */}
          {points.map(point => (
            <motion.div
              key={point.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: point.intensity }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Glow */}
              <div 
                className="absolute w-8 h-8 rounded-full bg-cyan-500/30 blur-md"
                style={{ transform: 'translate(-50%, -50%)' }}
              />
              {/* Core */}
              <div 
                className="absolute w-3 h-3 rounded-full bg-cyan-400"
                style={{ 
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 20px rgba(0, 240, 255, 0.8), 0 0 40px rgba(0, 240, 255, 0.4)',
                }}
              />
              {/* Pulse ring */}
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute w-4 h-4 rounded-full border border-cyan-400"
                style={{ transform: 'translate(-50%, -50%)' }}
              />
            </motion.div>
          ))}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none opacity-50" />

          {/* Stats overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
            <div className="px-3 py-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
              <span className="text-xs text-white/40">Active Threats</span>
              <p className="text-lg font-mono font-bold text-cyan-400">{points.length}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
              <span className="text-xs text-white/40">Regions</span>
              <p className="text-lg font-mono font-bold text-white">47</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
              <span className="text-xs text-white/40">Blocked</span>
              <p className="text-lg font-mono font-bold text-emerald-400">100%</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
