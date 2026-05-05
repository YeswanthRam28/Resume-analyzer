import React from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, ExternalLink, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import LimeButton from '../ui/LimeButton';

interface GitHubSyncPanelProps {
  data: {
    on_resume: Array<{
      repo: string;
      description_score: number;
      improvement: string;
      url?: string;
      language?: string;
      stars?: number;
      forks?: number;
    }>;
    missing_from_resume: Array<{
      repo: string;
      suggested_bullet: string;
      why_include: string;
      url?: string;
      language?: string;
      stars?: number;
      forks?: number;
    }>;
    contradictions: string[];
    github_strength_summary: string;
  };
}

export default function GitHubSyncPanel({ data }: GitHubSyncPanelProps) {
  const safeData = {
    on_resume: Array.isArray(data?.on_resume) ? data.on_resume : [],
    missing_from_resume: Array.isArray(data?.missing_from_resume) ? data.missing_from_resume : [],
    contradictions: Array.isArray(data?.contradictions) ? data.contradictions : [],
    github_strength_summary: data?.github_strength_summary || "No GitHub data linked."
  };

  return (
    <div className="space-y-12">
      <div className="p-8 bg-brand-card border border-brand-divider rounded-xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-brand-ink/10 rounded-xl border border-brand-divider text-brand-ink">
            <Github size={24} />
          </div>
          <div>
            <h3 className="font-heading text-2xl text-brand-ink uppercase tracking-tight">GitHub Portfolio Intelligence</h3>
            <p className="text-[10px] text-brand-primary font-mono uppercase tracking-[0.2em]">{safeData.github_strength_summary}</p>
          </div>
        </div>

        {/* Contribution Grid Simulation */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex gap-1">
            {[...Array(52)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                {[...Array(7)].map((_, j) => {
                  const active = Math.random() > 0.6;
                  const opacity = active ? (Math.random() * 0.8 + 0.2) : 0.05;
                  return (
                    <div
                      key={j}
                      className={cn("w-2.5 h-2.5 rounded-sm", active ? "bg-brand-primary" : "bg-brand-divider")}
                      style={{ opacity }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Missing from Resume */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="text-brand-primary w-4 h-4" />
              <h4 className="text-[10px] uppercase tracking-widest text-brand-muted">Significant Missing Repos</h4>
            </div>

            {safeData.missing_from_resume.map((repo, i) => (
              <div key={i} className="bg-brand-bg border border-brand-divider p-5 rounded-lg group hover:border-brand-primary transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-lg text-brand-ink">{repo.repo}</span>
                    <ExternalLink size={12} className="text-brand-ghost group-hover:text-brand-primary" />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-brand-muted font-mono">
                    <span className="flex items-center gap-1"><Star size={10} className="text-brand-secondary" /> {repo.stars || 0}</span>
                    <span className="flex items-center gap-1"><GitFork size={10} className="text-brand-muted" /> {repo.forks || 0}</span>
                  </div>
                </div>
                <p className="text-[10px] text-brand-primary uppercase tracking-widest mb-2">Suggested Bullet →</p>
                <p className="text-sm text-brand-ink font-sans leading-relaxed mb-4 italic">"{repo.suggested_bullet}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-brand-muted font-sans bg-brand-card px-2 py-1 rounded border border-brand-divider">{repo.language || 'Code'}</span>
                  <LimeButton variant="ghost" className="h-7 px-3 text-[9px]">Add to Resume</LimeButton>
                </div>
              </div>
            ))}
          </div>

          {/* On Resume - Quality Check */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="text-brand-secondary w-4 h-4" />
              <h4 className="text-[10px] uppercase tracking-widest text-brand-muted">Resume-GitHub Alignment</h4>
            </div>

            {safeData.on_resume.map((repo, i) => (
              <div key={i} className="bg-brand-bg border border-brand-divider p-5 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading text-lg text-brand-ink">{repo.repo}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-brand-muted">Quality:</span>
                    <span className={cn(
                      "font-mono text-xs",
                      repo.description_score >= 8 ? "text-brand-primary" : repo.description_score >= 5 ? "text-brand-secondary" : "text-brand-tertiary"
                    )}>
                      {repo.description_score}/10
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-brand-secondary uppercase tracking-widest mb-2">Improvement Tip →</p>
                <p className="text-sm text-brand-muted font-sans leading-relaxed italic">"{repo.improvement}"</p>
              </div>
            ))}

            {safeData.contradictions.length > 0 && (
              <div className="p-5 bg-brand-tertiary/10 border border-brand-tertiary/20 rounded-lg mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={14} className="text-brand-tertiary" />
                  <span className="text-[10px] uppercase tracking-widest text-brand-tertiary font-bold">Contradictions Found</span>
                </div>
                <ul className="space-y-2">
                  {safeData.contradictions.map((c, i) => (
                    <li key={i} className="text-xs text-brand-ink font-sans leading-relaxed">• {c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
