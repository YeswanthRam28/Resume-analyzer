import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Wand2, CheckCircle2, History, Copy, Download, Share2, Rocket } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import GlassCard from '../components/ui/GlassCard';
import LimeButton from '../components/ui/LimeButton';
import ProgressBar from '../components/ui/ProgressBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function TailorPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tailoring, setTailoring] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);

  useEffect(() => {
    fetchSession();
    fetchVersions();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/resume/${sessionId}`);
      setSession(response.data);
    } catch (err) {
      console.error("Failed to fetch session:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVersions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tailor/versions/${sessionId}`);
      setVersions(response.data);
      if (response.data.length > 0) {
        // Show the latest version by default
        const latest = response.data[response.data.length - 1];
        setResult({
          tailored_text: latest.tailored_text,
          ats_prediction: latest.ats_score,
          changes_made: ["Loaded from history"],
          explanation: `Tailored for ${latest.role}`
        });
      }
    } catch (err) {
      console.error("Failed to fetch versions:", err);
    }
  };

  const handleTailor = async () => {
    setTailoring(true);
    try {
      const response = await axios.post(`${API_URL}/api/tailor/${sessionId}`);
      setResult(response.data);
      fetchVersions();
    } catch (err) {
      console.error("Tailoring failed:", err);
    } finally {
      setTailoring(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-64 space-y-4">
        <p className="text-center text-[10px] font-mono uppercase tracking-widest text-brand-muted">Loading Session...</p>
        <ProgressBar percent={100} showLabel={false} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink">
      {/* Header */}
      <header className="border-b border-brand-divider bg-brand-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/results/${sessionId}`)}
              className="p-2 hover:bg-brand-card rounded-lg transition-colors text-brand-muted hover:text-brand-ink"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-brand-divider" />
            <div className="flex items-center gap-2">
              <Wand2 size={18} className="text-brand-primary" />
              <h1 className="font-heading uppercase tracking-tight">AI Resume Tailor</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LimeButton 
              onClick={handleTailor} 
              disabled={tailoring}
              className="h-9 px-4 text-xs group"
            >
              {tailoring ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-brand-ink/30 border-t-brand-ink rounded-full animate-spin" />
                  Optimizing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                  Tailor Resume
                </span>
              )}
            </LimeButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Left Column: Original */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-muted">Original Resume</h3>
              <span className="text-[10px] font-mono text-brand-ghost">READ ONLY</span>
            </div>
            <GlassCard className="flex-1 overflow-hidden flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-8 font-sans text-sm leading-relaxed text-brand-muted whitespace-pre-wrap selection:bg-brand-primary/20">
                {session?.resume_text}
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Optimized */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-primary font-bold">AI Optimized Version</h3>
              {result && (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-brand-primary">EST. ATS: {result.ats_prediction}%</span>
                </div>
              )}
            </div>

            <GlassCard className={cn(
              "flex-1 overflow-hidden flex flex-col p-0 border-2 transition-all",
              result ? "border-brand-primary/30" : "border-brand-divider"
            )}>
              <div className="flex-1 overflow-y-auto p-8 prose prose-invert prose-brand max-w-none">
                {tailoring ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto text-brand-primary animate-pulse" size={24} />
                    </div>
                    <div>
                      <p className="font-heading text-xl uppercase tracking-tight">Applying X-Y-Z Formula</p>
                      <p className="text-sm text-brand-muted mt-2">Rewriting impact bullets and removing fluff...</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <ReactMarkdown>
                      {result.tailored_text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
                    <div className="p-4 bg-brand-card rounded-2xl border border-brand-divider">
                      <Rocket size={32} className="text-brand-ghost" />
                    </div>
                    <div>
                      <p className="font-heading text-xl uppercase tracking-tight">Ready for Redemption?</p>
                      <p className="text-sm text-brand-muted mt-2 max-w-xs mx-auto">
                        Click the "Tailor Resume" button to fix the sins found in your analysis and generate a high-impact version.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Improvements & Versions Bar */}
        <AnimatePresence>
          {result && !tailoring && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <GlassCard className="lg:col-span-2">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 size={12} />
                  Improvements Applied
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.changes_made?.map((change: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-brand-muted">
                      <span className="text-brand-primary mt-1">•</span>
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-muted mb-4 flex items-center gap-2">
                  <History size={12} />
                  Version History
                </h4>
                <div className="space-y-2">
                  {versions.map((v: any, i: number) => (
                    <button 
                      key={v.id}
                      onClick={() => setResult({
                        tailored_text: v.tailored_text,
                        ats_prediction: v.ats_score,
                        changes_made: ["Loaded from history"],
                        explanation: `Version ${i + 1}`
                      })}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between group",
                        result.tailored_text === v.tailored_text 
                          ? "bg-brand-primary/10 border-brand-primary text-brand-ink" 
                          : "bg-brand-bg border-brand-divider text-brand-muted hover:border-brand-ghost"
                      )}
                    >
                      <span>Version {i + 1} - {v.role}</span>
                      <span className="text-[10px] text-brand-ghost group-hover:text-brand-primary">
                        {new Date(v.created_at).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .markdown-body h1 { font-family: 'Outfit', sans-serif; font-size: 2rem; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: -0.02em; color: var(--brand-ink); }
        .markdown-body h2 { font-family: 'Outfit', sans-serif; font-size: 1.25rem; margin-top: 2rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--brand-primary); border-bottom: 1px solid var(--brand-divider); padding-bottom: 0.5rem; }
        .markdown-body p { margin-bottom: 1rem; color: var(--brand-ink); line-height: 1.6; }
        .markdown-body ul { list-style: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        .markdown-body li { margin-bottom: 0.5rem; color: var(--brand-muted); }
        .markdown-body strong { color: var(--brand-ink); font-weight: 600; }
      `}} />
    </div>
  );
}
