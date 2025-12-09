import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import type { Attack } from '../../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/constants';
import { formatNumber } from '../../utils/formatters';

interface AttackCardProps {
  attack: Attack;
}

export function AttackCard({ attack }: AttackCardProps) {
  const categoryColor = CATEGORY_COLORS[attack.category] || '#FF4757';
  const categoryIcon = CATEGORY_ICONS[attack.category] || '❌';

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="attack-item flash-red bg-bg-secondary/50 rounded px-3 py-2 border-l-2"
      style={{ borderLeftColor: categoryColor }}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Left: Icon and Type */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm">{categoryIcon}</span>
          <span className="font-mono text-xs text-white truncate">
            {attack.attacker_name}
          </span>
          <span className="text-text-secondary text-xs">
            #{formatNumber(attack.attempt_number)}
          </span>
        </div>

        {/* Right: Status */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span 
            className="font-mono text-xs px-1.5 py-0.5 rounded"
            style={{ 
              backgroundColor: `${categoryColor}20`,
              color: categoryColor 
            }}
          >
            {attack.confidence_score.toFixed(2)}
          </span>
          <span className="text-text-secondary text-xs">
            {attack.response_time_ms}ms
          </span>
          <XCircle className="w-4 h-4 text-danger" />
        </div>
      </div>

      {/* Bottom: Category and Status */}
      <div className="flex items-center justify-between mt-1">
        <span 
          className="text-xs font-mono"
          style={{ color: categoryColor }}
        >
          {attack.category.replace('_', ' ')}
        </span>
        <span className="text-xs text-danger font-bold">
          REJECTED
        </span>
      </div>
    </motion.div>
  );
}
