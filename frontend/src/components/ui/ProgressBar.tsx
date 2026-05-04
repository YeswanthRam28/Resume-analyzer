import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  percent: number;
  color?: 'lime' | 'cyan' | 'ember';
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ percent, color = 'lime', className, showLabel = false }: ProgressBarProps) {
  const colors = {
    lime: "bg-brand-primary shadow-[0_0_10px_var(--color-brand-primary)]",
    cyan: "bg-brand-secondary shadow-[0_0_10px_var(--color-brand-secondary)]",
    ember: "bg-brand-tertiary shadow-[0_0_10px_var(--color-brand-tertiary)]"
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-[10px] uppercase tracking-widest text-brand-muted">
          <span>Progress</span>
          <span>{percent}%</span>
        </div>
      )}
      <div className="h-1.5 w-full bg-brand-divider rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", colors[color])}
        />
      </div>
    </div>
  );
}
