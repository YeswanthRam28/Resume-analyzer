import React from 'react';
import { motion } from 'framer-motion';

interface IndianMarketLensProps {
  data: {
    india_ats_score: number;
    placement_readiness: {
      tier1_campus: number;
      faang_india: number;
      indian_unicorn_startup: number;
      service_company: number;
    };
    india_specific_issues: string[];
    india_specific_strengths: string[];
    missing_for_india: string[];
    verdict: string;
  };
}

export default function IndianMarketLens({ data }: IndianMarketLensProps) {
  const safeData = {
    india_ats_score: data?.india_ats_score || 0,
    placement_readiness: data?.placement_readiness || {
      tier1_campus: 0,
      faang_india: 0,
      indian_unicorn_startup: 0,
      service_company: 0
    },
    india_specific_issues: Array.isArray(data?.india_specific_issues) ? data.india_specific_issues : [],
    india_specific_strengths: Array.isArray(data?.india_specific_strengths) ? data.india_specific_strengths : [],
    missing_for_india: Array.isArray(data?.missing_for_india) ? data.missing_for_india : [],
    verdict: data?.verdict || "Indian market analysis unavailable."
  };

  const axes = [
    { label: "Tier 1 Campus", key: "tier1_campus" },
    { label: "FAANG India", key: "faang_india" },
    { label: "Startup", key: "indian_unicorn_startup" },
    { label: "Service Co", key: "service_company" }
  ];

  const size = 300;
  const center = size / 2;
  const radius = center - 40;

  const getPoint = (score: number, index: number) => {
    const angle = (index * 2 * Math.PI) / axes.length - Math.PI / 2;
    const r = (score / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const points = axes.map((axis, i) => 
    getPoint((safeData.placement_readiness as any)[axis.key], i)
  );

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-brand-card p-10 rounded-xl border border-brand-divider">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="relative shrink-0">
          <svg width={size} height={size} className="overflow-visible">
            {/* Grid Circles */}
            {[0.2, 0.4, 0.6, 0.8, 1].map((p, i) => (
              <circle 
                key={i} 
                cx={center} cy={center} r={radius * p} 
                fill="none" stroke="var(--color-brand-divider)" strokeWidth="1"
              />
            ))}
            
            {/* Axes */}
            {axes.map((axis, i) => {
              const p = getPoint(100, i);
              return (
                <line 
                  key={i} 
                  x1={center} y1={center} x2={p.x} y2={p.y} 
                  stroke="var(--color-brand-divider)" strokeWidth="1"
                />
              );
            })}

            {/* Polygon */}
            <motion.polygon 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              points={polygonPath}
              fill="rgba(198, 255, 74, 0.15)"
              stroke="var(--color-brand-primary)"
              strokeWidth="2"
            />

            {/* Labels */}
            {axes.map((axis, i) => {
              const p = getPoint(115, i);
              const score = (safeData.placement_readiness as any)[axis.key];
              return (
                <g key={i}>
                  <text 
                    x={p.x} y={p.y} 
                    textAnchor="middle" 
                    className="text-[10px] fill-brand-muted uppercase tracking-widest font-sans"
                  >
                    {axis.label}
                  </text>
                  <text 
                    x={p.x} y={p.y + 15} 
                    textAnchor="middle" 
                    className="text-xs fill-brand-primary font-mono"
                  >
                    {score}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex-1 space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-brand-muted">Indian Market Verdict</span>
              <div className="h-px bg-brand-divider flex-1" />
            </div>
            <p className="text-2xl font-heading text-brand-ink leading-tight italic">
              "{safeData.verdict}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest text-brand-primary font-bold">Strengths</h4>
              <ul className="space-y-2">
                {safeData.india_specific_strengths.map((s, i) => (
                  <li key={i} className="text-sm text-brand-muted font-sans flex gap-2">
                    <span className="text-brand-primary">✦</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest text-brand-tertiary font-bold">Weaknesses</h4>
              <ul className="space-y-2">
                {safeData.india_specific_issues.map((s, i) => (
                  <li key={i} className="text-sm text-brand-muted font-sans flex gap-2">
                    <span className="text-brand-tertiary">✦</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 bg-brand-bg border border-brand-divider rounded-lg">
            <h4 className="text-[10px] uppercase tracking-widest text-brand-secondary mb-2">Missing for Indian Context</h4>
            <div className="flex flex-wrap gap-2">
              {safeData.missing_for_india.map((item, i) => (
                <span key={i} className="px-2 py-1 bg-brand-secondary/5 border border-brand-secondary/20 text-brand-secondary text-[10px] rounded">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
