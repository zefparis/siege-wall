import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiegeStore } from '../../store/siegeStore';
import { formatNumber } from '../../utils/formatters';

interface DigitProps {
  digit: number;
  index: number;
}

function Digit({ digit, index }: DigitProps) {
  const [prevDigit, setPrevDigit] = useState(digit);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (digit !== prevDigit) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setPrevDigit(digit);
        setIsAnimating(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [digit, prevDigit]);

  return (
    <div 
      className="relative w-[1ch] h-[1.2em] overflow-hidden"
      style={{ animationDelay: `${index * 20}ms` }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={digit}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`absolute inset-0 flex items-center justify-center ${
            isAnimating ? 'text-cyan' : ''
          }`}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function MainCounter() {
  const totalAttacks = useSiegeStore((state) => state.stats.total_attacks);
  const breaches = useSiegeStore((state) => state.stats.breaches);
  const prevTotalRef = useRef(totalAttacks);
  const [isPulsing, setIsPulsing] = useState(false);

  // Check for milestone
  useEffect(() => {
    const milestones = [1000000, 10000000, 50000000, 100000000, 500000000, 1000000000];
    const prevTotal = prevTotalRef.current;
    
    for (const milestone of milestones) {
      if (prevTotal < milestone && totalAttacks >= milestone) {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 2000);
        break;
      }
    }
    
    prevTotalRef.current = totalAttacks;
  }, [totalAttacks]);

  // Format number with commas and get individual digits
  const formattedNumber = formatNumber(totalAttacks);
  const chars = formattedNumber.split('');

  return (
    <div className={`flex flex-col items-center ${isPulsing ? 'pulse-milestone' : ''}`}>
      {/* Main Counter */}
      <div className="flex items-center font-mono text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white text-glow-cyan">
        {chars.map((char, index) => (
          char === ',' ? (
            <span key={`comma-${index}`} className="text-cyan/50 mx-0.5 md:mx-1">,</span>
          ) : (
            <Digit key={`digit-${index}`} digit={parseInt(char)} index={index} />
          )
        ))}
      </div>
      
      {/* Label */}
      <div className="mt-1 md:mt-2 text-cyan text-sm md:text-lg tracking-[0.2em] md:tracking-[0.3em] font-display">
        ATTACKS BLOCKED
      </div>

      {/* Breaches Counter */}
      <div className="mt-2 md:mt-4 flex items-center gap-2">
        <span className="text-text-secondary text-xs md:text-sm">BREACHES:</span>
        <span className="font-mono text-xl md:text-2xl text-danger text-glow-red font-bold">
          {breaches}
        </span>
      </div>
    </div>
  );
}
