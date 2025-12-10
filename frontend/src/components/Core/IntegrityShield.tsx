import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSiegeStore } from '../../store/siegeStore';
import { Shield } from 'lucide-react';

export function IntegrityShield() {
  const attacks = useSiegeStore((state) => state.attacks);
  const [isPulsing, setIsPulsing] = useState(false);

  // Pulse on new attack
  useEffect(() => {
    if (attacks.length > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [attacks.length]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,209,0.2) 0%, transparent 70%)',
        }}
        animate={{
          scale: isPulsing ? [1, 1.2, 1] : 1,
          opacity: isPulsing ? [0.5, 1, 0.5] : 0.5,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Hexagon container */}
      <div className="relative hexagon w-28 h-28 md:w-40 md:h-40 bg-bg-card border-2 border-cyan/30 flex items-center justify-center">
        {/* Inner glow */}
        <div 
          className="absolute inset-0 hexagon"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,209,0.1) 0%, transparent 70%)',
          }}
        />

        {/* Shield icon */}
        <motion.div
          animate={{
            filter: isPulsing ? 'brightness(1.5)' : 'brightness(1)',
          }}
          transition={{ duration: 0.3 }}
          className="relative z-10 flex flex-col items-center"
        >
          <Shield className="w-10 h-10 md:w-16 md:h-16 text-cyan" strokeWidth={1.5} />
          <div className="mt-1 md:mt-2 text-cyan font-display text-xs md:text-sm tracking-wider">
            HCS-U7
          </div>
        </motion.div>

        {/* Rotating border effect */}
        <motion.div
          className="absolute inset-0 hexagon border-2 border-cyan/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: 'center' }}
        />
      </div>

      {/* Integrity text */}
      <div className="absolute -bottom-6 md:-bottom-8 text-center">
        <span className="text-cyan font-mono text-sm md:text-lg font-bold">
          INTEGRITY: 100%
        </span>
      </div>

      {/* Attack deflection particles */}
      {isPulsing && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-danger rounded-full"
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
              }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 6) * 100,
                y: Math.sin((i * Math.PI * 2) / 6) * 100,
                opacity: 0,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
