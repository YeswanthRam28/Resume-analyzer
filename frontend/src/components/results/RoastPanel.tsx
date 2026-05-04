import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ChevronDown, ChevronUp, Share2, AlertTriangle, Radiation } from 'lucide-react';
import TerminalBox from '../ui/TerminalBox';
import { cn } from '../../lib/utils';
import LimeButton from '../ui/LimeButton';

interface RoastPanelProps {
  data: {
    roast_rating: 'medium-rare' | 'well-done' | 'cremated';
    overall_roast: string;
    line_roasts: Array<{
      original_line: string;
      roast: string;
      fix: string;
      severity: 'mild' | 'spicy' | 'nuclear';
    }>;
    biggest_sin: string;
    verdict: string;
  };
}

export default function RoastPanel({ data }: RoastPanelProps) {
  const safeData = {
    roast_rating: data?.roast_rating || 'medium-rare',
    overall_roast: data?.overall_roast || "Roast failed to generate. You're safe for now.",
    line_roasts: Array.isArray(data?.line_roasts) ? data.line_roasts : [],
    biggest_sin: data?.biggest_sin || "Being unroastable.",
    verdict: data?.verdict || "No verdict."
  };

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'nuclear': return <Radiation className="w-4 h-4 text-brand-tertiary" />;
      case 'spicy': return <Flame className="w-4 h-4 text-brand-tertiary" />;
      default: return <AlertTriangle className="w-4 h-4 text-brand-secondary" />;
    }
  };

  return (
    <div className="bg-[#0F0A08] p-8 rounded-xl border border-brand-divider overflow-hidden relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-tertiary/20 rounded-lg">
            <Flame className="w-6 h-6 text-brand-tertiary" />
          </div>
          <div>
            <h3 className="font-heading text-2xl text-brand-ink uppercase tracking-tighter">Roast Mode Active</h3>
            <p className="text-[10px] text-brand-tertiary font-mono uppercase tracking-[0.2em]">Severity: {safeData.roast_rating}</p>
          </div>
        </div>
        <LimeButton variant="ghost" className="h-9 px-4 text-[10px]">
          <Share2 size={12} className="mr-2" /> Share My Roast
        </LimeButton>
      </div>

      <TerminalBox 
        text={safeData.overall_roast} 
        className="mb-12 border-brand-tertiary/20 bg-black/50" 
      />

      <div className="space-y-4">
        {safeData.line_roasts.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "border-l-2 p-5 bg-brand-card transition-all cursor-pointer group",
              item.severity === 'nuclear' ? "border-brand-tertiary" : "border-brand-divider hover:border-brand-tertiary/50"
            )}
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <p className="text-[10px] text-brand-muted italic font-sans line-clamp-1 group-hover:line-clamp-none">
                  "{item.original_line}"
                </p>
                <div className="flex items-center gap-2">
                  {getSeverityIcon(item.severity)}
                  <p className="text-sm text-brand-ink font-sans leading-relaxed">{item.roast}</p>
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <span className={cn(
                  "text-[9px] font-mono px-2 py-0.5 rounded border",
                  item.severity === 'nuclear' ? "text-brand-tertiary border-brand-tertiary/30 bg-brand-tertiary/5" : "text-brand-muted border-brand-divider"
                )}>
                  {item.severity.toUpperCase()}
                </span>
                {expandedIndex === i ? <ChevronUp size={14} className="text-brand-muted" /> : <ChevronDown size={14} className="text-brand-muted" />}
              </div>
            </div>

            <AnimatePresence>
              {expandedIndex === i && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-brand-divider/30"
                >
                  <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-2">The Fix →</p>
                  <p className="text-brand-primary text-sm font-sans leading-relaxed italic">{item.fix}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-6 border border-brand-tertiary/30 bg-brand-tertiary/5 rounded-lg">
        <h4 className="text-[10px] font-mono text-brand-tertiary uppercase tracking-[0.3em] mb-2">Biggest Sin</h4>
        <p className="text-brand-ink text-lg font-heading leading-tight italic">{safeData.biggest_sin}</p>
      </div>

      <div className="mt-8 text-center">
        <p className="font-mono text-[11px] text-brand-muted italic">"{safeData.verdict}"</p>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-tertiary/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
