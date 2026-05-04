import React from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
}

export default function GlassCard({ children, className, hoverGlow = false }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "bg-brand-card border border-brand-divider rounded-xl overflow-hidden transition-all duration-300",
        hoverGlow && "hover:border-brand-primary hover:shadow-[0_0_20px_var(--color-brand-primary-glow)]",
        className
      )}
    >
      {children}
    </div>
  );
}
