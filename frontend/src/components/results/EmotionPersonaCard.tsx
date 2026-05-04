import React from 'react';
import { motion } from 'framer-motion';
import { Brain, User, Target, Zap, Ghost, Bot, Swords } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmotionPersonaCardProps {
  data: {
    archetype: string;
    archetype_description: string;
    archetype_roast: string;
    confidence_score: number;
    passive_verb_count: number;
    active_verb_count: number;
    passive_examples: string[];
    active_examples: string[];
    bold_usage_verdict: string;
    tone_summary: string;
    fix_strategy: string[];
  };
}

const icons: Record<string, any> = {
  "The Imposter": Brain,
  "The Peacock": Zap,
  "The Robot": Bot,
  "The Soldier": Swords,
  "The Storyteller": User,
  "The Overachiever": Target,
  "The Ghost": Ghost
};

export default function EmotionPersonaCard({ data }: EmotionPersonaCardProps) {
  const safeData = {
    archetype: data?.archetype || "The Unknown",
    archetype_description: data?.archetype_description || "Writing style analysis unavailable.",
    archetype_roast: data?.archetype_roast || "Even the AI doesn't know what to say about this.",
    confidence_score: data?.confidence_score || 50,
    active_verb_count: data?.active_verb_count || 0,
    passive_verb_count: data?.passive_verb_count || 0,
    bold_usage_verdict: data?.bold_usage_verdict || "Standard usage.",
    fix_strategy: Array.isArray(data?.fix_strategy) ? data.fix_strategy : []
  };

  const Icon = icons[safeData.archetype] || User;
  
  const getConfidenceLabel = (s: number) => {
    if (s < 40) return "Underselling";
    if (s > 70) return "Overclaiming";
    return "Calibrated";
  };

  return (
    <div className="bg-brand-card p-10 rounded-xl border border-brand-divider relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-brand-primary/10 rounded-xl border border-brand-primary/20 text-brand-primary">
              <Icon size={32} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-brand-muted">Writing Persona</span>
          </div>
          
          <h2 className="font-display text-7xl md:text-8xl text-brand-ink leading-none mb-6">
            {safeData.archetype}
          </h2>
          
          <p className="font-sans text-brand-muted text-lg leading-relaxed mb-8">
            {safeData.archetype_description}
          </p>

          <blockquote className="border-l-4 border-brand-primary pl-6 italic text-xl text-brand-ink font-heading mb-10">
            "{safeData.archetype_roast}"
          </blockquote>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-brand-muted">Confidence Meter</span>
                <span className={cn(
                  safeData.confidence_score > 70 || safeData.confidence_score < 40 ? "text-brand-tertiary" : "text-brand-primary"
                )}>
                  {getConfidenceLabel(safeData.confidence_score)}
                </span>
              </div>
              <div className="h-1 w-full bg-brand-divider rounded-full relative">
                <motion.div 
                  initial={{ left: "50%" }}
                  animate={{ left: `${safeData.confidence_score}%` }}
                  transition={{ duration: 1.5, ease: "backOut" }}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-brand-bg shadow-xl",
                    safeData.confidence_score > 70 || safeData.confidence_score < 40 ? "bg-brand-tertiary" : "bg-brand-primary"
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-brand-bg border border-brand-divider rounded-lg">
              <span className="text-brand-primary font-mono text-4xl block mb-1">{safeData.active_verb_count}</span>
              <span className="text-[10px] uppercase tracking-widest text-brand-muted">Active Verbs</span>
            </div>
            <div className="p-6 bg-brand-bg border border-brand-divider rounded-lg">
              <span className="text-brand-tertiary font-mono text-4xl block mb-1">{safeData.passive_verb_count}</span>
              <span className="text-[10px] uppercase tracking-widest text-brand-muted">Passive Verbs</span>
            </div>
          </div>

          <div className="p-6 bg-brand-bg border border-brand-divider rounded-lg">
            <h4 className="text-[10px] uppercase tracking-widest text-brand-muted mb-4">Bold Usage Verdict</h4>
            <p className="text-brand-ink text-sm font-sans">{safeData.bold_usage_verdict}</p>
          </div>

          <div className="p-6 bg-brand-bg border border-brand-divider rounded-lg">
            <h4 className="text-[10px] uppercase tracking-widest text-brand-muted mb-4">Fix Strategy</h4>
            <ul className="space-y-3">
              {safeData.fix_strategy.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-brand-muted font-sans">
                  <span className="text-brand-primary font-mono shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Decorative SVG */}
      <div className="absolute -bottom-20 -right-20 opacity-5 text-brand-primary pointer-events-none">
        <Icon size={400} />
      </div>
    </div>
  );
}
