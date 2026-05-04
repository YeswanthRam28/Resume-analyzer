import React from 'react';
import { cn } from '../../lib/utils';

interface LimeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'ember';
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export default function LimeButton({ 
  variant = 'primary', 
  children, 
  className, 
  ...props 
}: LimeButtonProps) {
  const variants = {
    primary: "bg-brand-primary text-brand-bg hover:shadow-[0_0_28px_rgba(198,255,74,0.15)] font-semibold",
    ghost: "border border-brand-divider text-brand-ink hover:border-brand-primary",
    ember: "bg-brand-tertiary text-black hover:shadow-[0_0_28px_rgba(255,107,53,0.15)] font-semibold"
  };

  return (
    <button 
      className={cn(
        "h-10 px-6 uppercase tracking-wider text-xs transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
