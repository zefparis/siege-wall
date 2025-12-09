import { motion } from 'framer-motion';

interface GlowTextProps {
  children: React.ReactNode;
  className?: string;
  color?: 'cyan' | 'red' | 'purple' | 'orange';
  animate?: boolean;
}

const colorMap = {
  cyan: {
    text: 'text-cyan',
    glow: 'rgba(0, 255, 209, 0.5)',
  },
  red: {
    text: 'text-danger',
    glow: 'rgba(255, 71, 87, 0.5)',
  },
  purple: {
    text: 'text-accent-purple',
    glow: 'rgba(155, 89, 182, 0.5)',
  },
  orange: {
    text: 'text-accent-orange',
    glow: 'rgba(243, 156, 18, 0.5)',
  },
};

export function GlowText({ 
  children, 
  className = '', 
  color = 'cyan',
  animate = true 
}: GlowTextProps) {
  const { text, glow } = colorMap[color];

  if (!animate) {
    return (
      <span 
        className={`${text} ${className}`}
        style={{ textShadow: `0 0 10px ${glow}, 0 0 20px ${glow}` }}
      >
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={`${text} ${className}`}
      animate={{
        textShadow: [
          `0 0 10px ${glow}, 0 0 20px ${glow}`,
          `0 0 20px ${glow}, 0 0 40px ${glow}`,
          `0 0 10px ${glow}, 0 0 20px ${glow}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span>
  );
}
