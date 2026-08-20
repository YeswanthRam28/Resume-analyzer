import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ChevronDown, ChevronUp, Share2, AlertTriangle, Radiation, BrainCircuit, Copy, CheckCheck, X } from 'lucide-react';
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
  fullAnalysis?: any;
  resumeText?: string; // the actual resume text, pre-fetched from the session
}

function generatePrompt(data: any, fullAnalysis: any, resumeText: string): string {
  const redFlags = fullAnalysis?.credibility?.red_flags?.map((f: any) => `- [${f.severity?.toUpperCase() || 'FLAG'}] ${f.issue}: ${f.explanation || ''}`).join('\n') || 'None identified.';
  const missingKeywords = fullAnalysis?.ats?.keyword_match?.missing?.join(', ') || 'None identified.';
  const presentKeywords = fullAnalysis?.ats?.keyword_match?.present?.join(', ') || 'None.';
  const githubMissing = fullAnalysis?.github_portfolio?.missing_from_resume?.map((r: any) => `- ${r.repo} (${r.language}, ★${r.stars}): ${r.suggested_bullet}`).join('\n') || 'None identified.';
  const persona = fullAnalysis?.emotion?.archetype || 'Unknown';
  const personaFix = fullAnalysis?.emotion?.recommendation || '';
  const atsScore = fullAnalysis?.ats?.ats_score || '?';
  const indianMarketTips = fullAnalysis?.indian_market?.top_recommendations?.join(', ') || 'N/A';
  const lineRoasts = data?.line_roasts?.map((l: any) => `- ORIGINAL: "${l.original_line}"\n  ISSUE: ${l.roast}\n  FIX: ${l.fix}`).join('\n\n') || '';

  return `You are a world-class resume writer. Using the detailed analysis below, rewrite my resume so it is high-impact, ATS-optimized, and credible.

---
## RÉSCORE ANALYSIS REPORT

### 1. ATS Intelligence
- Current ATS Score: ${atsScore}/100
- Keywords Already Present: ${presentKeywords}
- Missing Keywords to Add: ${missingKeywords}

### 2. Writing Style Diagnosis
- Detected Archetype: ${persona}
- Recommendation: ${personaFix}

### 3. Credibility Red Flags (Must Fix All)
${redFlags}

### 4. Line-by-Line Roast & Fixes
${lineRoasts}

### 5. GitHub Portfolio (Add These to Resume)
${githubMissing}

### 6. Indian Market Optimization Tips
${indianMarketTips}

---
## REWRITE INSTRUCTIONS
1. Fix every red flag and line-level issue listed above.
2. Rewrite ALL experience bullets using the X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]."
3. Eliminate every vague word ("helped", "worked on", "assisted", "familiar with"). Replace with strong verbs ("engineered", "reduced", "automated", "designed").
4. Incorporate the missing ATS keywords naturally — do NOT keyword-stuff.
5. Add the high-value GitHub projects as quantified bullet points under a Projects section.
6. Keep it to one page. Be ruthlessly concise. Every word must earn its place.

---
## MY RESUME (Rewrite This)

${resumeText || '[Resume text not found]'}

---
Return ONLY the full rewritten resume in clean Markdown. No explanation, no preamble.`.trim();
}

export default function RoastPanel({ data, fullAnalysis, resumeText }: RoastPanelProps) {
  const safeData = {
    roast_rating: data?.roast_rating || 'medium-rare',
    overall_roast: data?.overall_roast || "Roast failed to generate. You're safe for now.",
    line_roasts: Array.isArray(data?.line_roasts) ? data.line_roasts : [],
    biggest_sin: data?.biggest_sin || "Being unroastable.",
    verdict: data?.verdict || "No verdict."
  };

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const prompt = generatePrompt(safeData, fullAnalysis, resumeText || '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'nuclear': return <Radiation className="w-4 h-4 text-brand-tertiary" />;
      case 'spicy': return <Flame className="w-4 h-4 text-brand-tertiary" />;
      default: return <AlertTriangle className="w-4 h-4 text-brand-secondary" />;
    }
  };

  return (
    <>
      <div className="bg-[#0F0A08] p-4 sm:p-8 rounded-xl border border-brand-divider overflow-hidden relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-tertiary/20 rounded-lg shrink-0">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-brand-tertiary" />
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-2xl text-brand-ink uppercase tracking-tight">Roast Mode Active</h3>
              <p className="text-[10px] text-brand-tertiary font-mono uppercase tracking-[0.2em]">Severity: {safeData.roast_rating}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <button
              onClick={() => setShowPromptModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-brand-primary/30 bg-brand-primary/5 text-brand-primary hover:bg-brand-primary/10 transition-all text-[10px] sm:text-[11px] font-mono uppercase tracking-wider group"
            >
              <BrainCircuit size={14} className="group-hover:rotate-12 transition-transform shrink-0" />
              <span>Prompt?</span>
            </button>
            <LimeButton variant="ghost" className="flex-1 sm:flex-initial h-9 px-3 text-[10px] justify-center">
              <Share2 size={12} className="mr-1.5 shrink-0" /> Share My Roast
            </LimeButton>
          </div>
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

      {/* Prompt Modal */}
      <AnimatePresence>
        {showPromptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPromptModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-3xl bg-brand-card border border-brand-primary/30 rounded-2xl overflow-hidden shadow-2xl shadow-brand-primary/10"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-brand-divider bg-brand-primary/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/20 rounded-lg">
                    <BrainCircuit size={18} className="text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg uppercase tracking-tight">Fix-My-Resume Prompt</h3>
                    <p className="text-[10px] text-brand-muted font-mono">Paste this into ChatGPT, Claude, or Gemini</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPromptModal(false)}
                  className="p-2 hover:bg-brand-card rounded-lg text-brand-muted hover:text-brand-ink transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Prompt Text */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-xs text-brand-muted font-mono leading-relaxed bg-brand-bg rounded-lg p-5 border border-brand-divider selection:bg-brand-primary/20">
                  {prompt}
                </pre>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-brand-divider flex items-center justify-between">
                <p className="text-[10px] text-brand-ghost font-mono uppercase tracking-widest">
                  Synthesized from Roast + Credibility + GitHub + ATS Data
                </p>
                <LimeButton onClick={handleCopy} className="h-9 px-5 text-xs">
                  {copied ? (
                    <span className="flex items-center gap-2"><CheckCheck size={14} /> Copied!</span>
                  ) : (
                    <span className="flex items-center gap-2"><Copy size={14} /> Copy Prompt</span>
                  )}
                </LimeButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
