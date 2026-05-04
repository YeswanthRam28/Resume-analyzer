import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Flag, XCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CredibilityAlertProps {
  data: {
    credibility_score: number;
    red_flags: Array<{
      claim: string;
      issue: string;
      severity: 'yellow' | 'red' | 'dealbreaker';
      suggestion: string;
    }>;
    green_flags: string[];
    timeline_issues: string[];
    verdict: string;
  };
}

export default function CredibilityAlert({ data }: CredibilityAlertProps) {
  const safeData = {
    credibility_score: data?.credibility_score || 0,
    red_flags: Array.isArray(data?.red_flags) ? data.red_flags : [],
    green_flags: Array.isArray(data?.green_flags) ? data.green_flags : [],
    timeline_issues: Array.isArray(data?.timeline_issues) ? data.timeline_issues : [],
    verdict: data?.verdict || "Credibility analysis unavailable."
  };

  const getStatus = (s: number) => {
    if (s < 40) return { label: "SUSPICIOUS", color: "text-brand-tertiary", icon: XCircle };
    if (s < 65) return { label: "QUESTIONABLE", color: "text-brand-tertiary/70", icon: AlertTriangle };
    if (s < 85) return { label: "CREDIBLE", color: "text-brand-secondary", icon: ShieldCheck };
    return { label: "SOLID", color: "text-brand-primary", icon: ShieldCheck };
  };

  const status = getStatus(safeData.credibility_score);
  const StatusIcon = status.icon;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-brand-card border border-brand-divider rounded-xl">
        <div className="flex items-center gap-6 mb-6 md:mb-0">
          <div className={cn("p-4 rounded-full bg-brand-bg border", status.color.replace('text-', 'border-'))}>
            <StatusIcon className={cn("w-10 h-10", status.color)} />
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-brand-muted mb-1">Credibility Check</h3>
            <div className="flex items-baseline gap-4">
              <span className="font-display text-6xl text-brand-ink">{safeData.credibility_score}</span>
              <span className={cn("font-mono text-xl", status.color)}>{status.label}</span>
            </div>
          </div>
        </div>
        <p className="max-w-xs text-sm text-brand-muted font-sans text-center md:text-right leading-relaxed italic">
          "{safeData.verdict}"
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Red Flags */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="text-brand-tertiary w-4 h-4" />
            <h4 className="text-[10px] uppercase tracking-widest text-brand-muted">Red Flags Detected</h4>
          </div>
          
          {safeData.red_flags.map((flag, i) => (
            <div 
              key={i} 
              className={cn(
                "p-5 rounded-lg border-l-4",
                flag.severity === 'dealbreaker' ? "bg-brand-tertiary/10 border-brand-tertiary" :
                flag.severity === 'red' ? "bg-brand-card border-brand-tertiary/50" :
                "bg-brand-card border-[#EAB308]/50"
              )}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] italic text-brand-muted line-clamp-1">"{flag.claim}"</span>
                <span className={cn(
                  "text-[8px] font-mono px-1.5 py-0.5 rounded border",
                  flag.severity === 'dealbreaker' ? "bg-brand-tertiary text-black border-brand-tertiary" : "text-brand-muted border-brand-divider"
                )}>
                  {flag.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-brand-ink font-sans mb-3">{flag.issue}</p>
              <div className="pt-3 border-t border-brand-divider/30">
                <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">Recommended Fix →</p>
                <p className="text-[13px] text-brand-secondary font-sans leading-relaxed">{flag.suggestion}</p>
              </div>
            </div>
          ))}

          {safeData.timeline_issues.length > 0 && (
            <div className="p-5 bg-brand-card border border-brand-divider rounded-lg">
              <h5 className="text-[10px] text-brand-tertiary uppercase tracking-widest mb-3">Timeline Inconsistencies</h5>
              <ul className="space-y-2">
                {safeData.timeline_issues.map((issue, i) => (
                  <li key={i} className="flex gap-2 text-xs text-brand-muted font-sans">
                    <AlertTriangle size={12} className="text-brand-tertiary shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Green Flags */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="text-brand-primary w-4 h-4" />
            <h4 className="text-[10px] uppercase tracking-widest text-brand-muted">Trust Signals</h4>
          </div>

          <div className="bg-brand-card border border-brand-divider p-6 rounded-lg space-y-4">
            {safeData.green_flags.map((flag, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1">
                  <CheckCircle2 size={16} className="text-brand-primary" />
                </div>
                <p className="text-sm text-brand-muted font-sans leading-relaxed">{flag}</p>
              </div>
            ))}
          </div>

          {safeData.credibility_score < 50 && (
            <div className="p-6 bg-brand-tertiary/20 border border-brand-tertiary/40 rounded-xl">
              <h4 className="text-brand-tertiary font-heading text-lg mb-2">Background Check Risk</h4>
              <p className="text-sm text-brand-ink font-sans leading-relaxed">
                Your resume claims might trigger red flags during a manual background check or technical round. Focus on specificity over superlatives.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
