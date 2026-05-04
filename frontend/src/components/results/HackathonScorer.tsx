import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HackathonScorerProps {
  data: {
    projects: Array<{
      name: string;
      type: 'hackathon' | 'personal' | 'academic' | 'open-source';
      impact_score: number;
      framing_score: number;
      vague_claims: string[];
      tech_stacking_detected: boolean;
      tech_stacking_note?: string;
      outcome_evidence: 'present' | 'weak' | 'absent';
      roast: string;
      reframed_bullet: string;
      original_bullet?: string;
    }>;
    overall_project_score: number;
    top_project: string;
    biggest_project_sin: string;
  };
}

export default function HackathonScorer({ data }: HackathonScorerProps) {
  const safeData = {
    projects: Array.isArray(data?.projects) ? data.projects : [],
    overall_project_score: data?.overall_project_score || 0,
    top_project: data?.top_project || "None",
    biggest_project_sin: data?.biggest_project_sin || "No projects found."
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between p-8 bg-brand-card border border-brand-divider rounded-xl">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-brand-primary/10 rounded-full border border-brand-primary/20">
            <Zap className="w-8 h-8 text-brand-primary" />
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-brand-muted mb-1">Project Impact Score</h3>
            <div className="flex items-baseline gap-4">
              <span className="font-display text-6xl text-brand-ink">{safeData.overall_project_score}</span>
              <span className="font-mono text-xl text-brand-primary">STRENGTH</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">Top Project</p>
          <p className="text-xl font-heading text-brand-ink">{safeData.top_project}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {safeData.projects.map((project, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-brand-card border border-brand-divider rounded-xl p-8 relative overflow-hidden group"
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-mono uppercase rounded-full border",
                    project.type === 'hackathon' ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20" : "bg-brand-bg text-brand-muted border-brand-divider"
                  )}>
                    {project.type}
                  </span>
                  <h4 className="font-heading text-2xl text-brand-ink">{project.name}</h4>
                </div>

                <div className="flex gap-8 mb-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-brand-muted mb-2">Impact</span>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="24" cy="24" r="20" stroke="var(--color-brand-divider)" strokeWidth="3" fill="transparent" />
                          <motion.circle 
                            cx="24" cy="24" r="20" 
                            stroke="var(--color-brand-primary)" 
                            strokeWidth="3" fill="transparent" 
                            strokeDasharray={2 * Math.PI * 20}
                            initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 20 - (project.impact_score / 100) * 2 * Math.PI * 20 }}
                            transition={{ duration: 1, delay: 0.8 }}
                          />
                        </svg>
                        <span className="absolute font-mono text-xs">{project.impact_score}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-brand-muted mb-2">Framing</span>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="24" cy="24" r="20" stroke="var(--color-brand-divider)" strokeWidth="3" fill="transparent" />
                          <motion.circle 
                            cx="24" cy="24" r="20" 
                            stroke="var(--color-brand-secondary)" 
                            strokeWidth="3" fill="transparent" 
                            strokeDasharray={2 * Math.PI * 20}
                            initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 20 - (project.framing_score / 100) * 2 * Math.PI * 20 }}
                            transition={{ duration: 1, delay: 1 }}
                          />
                        </svg>
                        <span className="absolute font-mono text-xs">{project.framing_score}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-brand-bg border border-brand-divider rounded-lg">
                    <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-2">The Reframed Bullet →</p>
                    <p className="text-brand-primary text-sm font-sans leading-relaxed italic">"{project.reframed_bullet}"</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-72 space-y-4">
                {project.vague_claims.length > 0 && (
                  <div className="p-4 bg-brand-tertiary/10 border border-brand-tertiary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={14} className="text-brand-tertiary" />
                      <span className="text-[9px] uppercase tracking-widest text-brand-tertiary font-bold">Vague Claims</span>
                    </div>
                    <ul className="space-y-1">
                      {project.vague_claims.map((claim, idx) => (
                        <li key={idx} className="text-[11px] text-brand-muted font-sans">• {claim}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.tech_stacking_detected && (
                  <div className="p-4 bg-brand-secondary/10 border border-brand-secondary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle size={14} className="text-brand-secondary" />
                      <span className="text-[9px] uppercase tracking-widest text-brand-secondary font-bold">Tech Stacking</span>
                    </div>
                    <p className="text-[10px] text-brand-muted font-sans">{project.tech_stacking_note}</p>
                  </div>
                )}

                <div className="p-4 border border-brand-divider rounded-lg">
                  <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-2 font-mono italic">AI Verdict</p>
                  <p className="text-[11px] text-brand-ink font-sans italic">"{project.roast}"</p>
                </div>
              </div>
            </div>

            {/* Evidence Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <CheckCircle2 size={12} className={cn(project.outcome_evidence === 'present' ? "text-brand-primary" : "text-brand-muted")} />
              <span className="text-[8px] uppercase tracking-widest text-brand-muted">Evidence: {project.outcome_evidence}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 border border-brand-tertiary/30 bg-brand-tertiary/5 rounded-lg">
        <h4 className="text-[10px] font-mono text-brand-tertiary uppercase tracking-[0.3em] mb-2">Biggest Project Sin</h4>
        <p className="text-brand-ink text-lg font-heading leading-tight italic">{safeData.biggest_project_sin}</p>
      </div>
    </div>
  );
}
