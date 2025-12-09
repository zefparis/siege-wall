import { useSiegeStore } from '../../store/siegeStore';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

export function Timeline() {
  const milestones = useSiegeStore((state) => state.milestones);
  const totalAttacks = useSiegeStore((state) => state.stats.total_attacks);

  // Calculate progress to next milestone
  const nextMilestone = milestones.find((m) => !m.reached);
  const prevMilestone = [...milestones].reverse().find((m) => m.reached);
  
  const progressPercent = nextMilestone
    ? ((totalAttacks - (prevMilestone?.value || 0)) / 
       (nextMilestone.value - (prevMilestone?.value || 0))) * 100
    : 100;

  return (
    <div className="card card-glow p-4">
      <h2 className="font-display text-xs text-cyan tracking-wider mb-4">
        MILESTONE PROGRESS
      </h2>

      <div className="relative">
        {/* Progress line background */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-bg-secondary" />
        
        {/* Progress line filled */}
        <motion.div
          className="absolute top-3 left-0 h-0.5 bg-cyan"
          initial={{ width: 0 }}
          animate={{ 
            width: `${Math.min(
              ((milestones.filter(m => m.reached).length) / milestones.length) * 100 +
              (progressPercent / milestones.length),
              100
            )}%` 
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Milestone points */}
        <div className="relative flex justify-between">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.value}
              className="flex flex-col items-center"
            >
              {/* Circle */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: milestone.reached ? 1 : 0.8,
                }}
                className={`relative z-10 ${
                  milestone.reached ? 'text-cyan' : 'text-text-secondary'
                }`}
              >
                {milestone.reached ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </motion.div>

              {/* Label */}
              <span
                className={`mt-2 font-mono text-xs ${
                  milestone.reached ? 'text-cyan' : 'text-text-secondary'
                }`}
              >
                {milestone.label}
              </span>

              {/* Reached indicator */}
              {milestone.reached && (
                <span className="text-xs text-cyan/50 mt-0.5">✓</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next milestone info */}
      {nextMilestone && (
        <div className="mt-4 text-center text-xs text-text-secondary">
          Next: <span className="text-cyan font-mono">{nextMilestone.label}</span>
          {' '}attacks ({progressPercent.toFixed(1)}% complete)
        </div>
      )}
    </div>
  );
}
