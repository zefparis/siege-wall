'use client';

import { useEffect, useRef } from 'react';

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Matrix characters (HCS-U7 + Japanese + numbers)
    const chars = 'HCS-U7QSIGBLAKEアイウエオカキクケコサシスセソタチツテト01234567890ABCDEF'.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    // Colors for variety
    const colors = ['#00ff00', '#00ffff', '#00ff88', '#88ff00'];

    function draw() {
      // Fade effect
      ctx!.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      ctx!.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Random color with brighter head
        const isHead = Math.random() > 0.95;
        ctx!.fillStyle = isHead ? '#ffffff' : colors[Math.floor(Math.random() * colors.length)];
        
        // Add glow effect for head characters
        if (isHead) {
          ctx!.shadowColor = '#00ffff';
          ctx!.shadowBlur = 10;
        } else {
          ctx!.shadowBlur = 0;
        }

        ctx!.fillText(char, x, y);

        // Reset drop when it reaches bottom
        if (y > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 35);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-30 pointer-events-none"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0f1a1a 50%, #0a0a0f 100%)' }}
    />
  );
}
