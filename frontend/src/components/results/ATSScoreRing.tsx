import React from 'react';
import { motion } from 'framer-motion';

interface ATSScoreRingProps {
  score: number;
  sectionScores: Record<string, number>;
  keywords: {
    matched: string[];
    missing: string[];
    irrelevant: string[];
  };
}

export default function ATSScoreRing({ score, sectionScores = {}, keywords = { matched: [], missing: [], irrelevant: [] } }: ATSScoreRingProps) {
  const safeSectionScores = sectionScores || {};
  const safeKeywords = {
    matched: Array.isArray(keywords.matched) ? keywords.matched : [],
    missing: Array.isArray(keywords.missing) ? keywords.missing : [],
    irrelevant: Array.isArray(keywords.irrelevant) ? keywords.irrelevant : [],
  };
  
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getGrade = (s: number) => {
    if (s >= 90) return "A+";
    if (s >= 80) return "A";
    if (s >= 70) return "B";
    if (s >= 60) return "C";
    if (s >= 50) return "D";
    return "F";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          {/* Background Circle */}
          <circle 
            cx="144" cy="144" r={radius} 
            stroke="var(--color-brand-divider)" 
            strokeWidth="12" fill="transparent" 
          />
          {/* Progress Circle */}
          <motion.circle 
            cx="144" cy="144" r={radius} 
            stroke="var(--color-brand-primary)" 
            strokeWidth="12" fill="transparent" 
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono text-7xl text-brand-primary"
          >
            {score}
          </motion.span>
          <span className="font-display text-2xl text-brand-muted mt-1">{getGrade(score)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 w-full max-w-2xl">
        {Object.entries(safeSectionScores).map(([key, val], i) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-muted text-center">
              {key.replace('_', ' ')}
            </span>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="var(--color-brand-divider)" strokeWidth="4" fill="transparent" />
                <motion.circle 
                  cx="32" cy="32" r="28" 
                  stroke={val >= 70 ? "var(--color-brand-primary)" : val >= 40 ? "var(--color-brand-secondary)" : "var(--color-brand-tertiary)"}
                  strokeWidth="4" fill="transparent" 
                  strokeDasharray={2 * Math.PI * 28}
                  initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 28 - (val / 100) * 2 * Math.PI * 28 }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono text-xs text-brand-ink">{val}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 w-full space-y-6">
        <div className="flex flex-wrap gap-2">
          {safeKeywords.matched.map((k, i) => (
            <span key={i} className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-[10px] uppercase rounded-full">
              {k}
            </span>
          ))}
          {safeKeywords.missing.map((k, i) => (
            <span key={i} className="px-3 py-1 bg-brand-tertiary/10 border border-brand-tertiary/30 text-brand-tertiary text-[10px] uppercase rounded-full">
              {k}
            </span>
          ))}
          {safeKeywords.irrelevant.map((k, i) => (
            <span key={i} className="px-3 py-1 bg-brand-ghost border border-brand-divider text-brand-muted text-[10px] uppercase rounded-full">
              {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
