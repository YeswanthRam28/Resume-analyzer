import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Timer, Zap, Eye, Video, 
  AlertCircle, CheckCircle2, TrendingUp, BarChart
} from 'lucide-react';
import { cn } from '../../lib/utils';
import ProgressBar from '../ui/ProgressBar';

interface VideoAnalysisResultProps {
  data: {
    transcript: string;
    content: {
      structure_score: number;
      structure_feedback: string;
      red_flag_statements: string[];
    };
    delivery: {
      filler_words: Record<string, number>;
      filler_per_minute: number;
      words_per_minute: number;
      pacing_verdict: 'too fast' | 'ideal' | 'too slow';
    };
    emotion: {
      dominant_emotion: string;
      confidence_score: number;
      body_language_signals: string[];
    };
    eye_contact: {
      score: number;
      presence_feedback: string;
    };
    visual: {
      background_score: number;
      lighting_score: number;
      visual_feedback: string;
    };
    overall_score: number;
    roast: string;
    top_3_fixes: string[];
    verdict: string;
  };
}

export default function VideoAnalysisResult({ data }: VideoAnalysisResultProps) {
  return (
    <div className="space-y-12">
      {/* Overall Video Health */}
      <div className="p-8 bg-brand-card border border-brand-divider rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-brand-secondary/10 rounded-full border border-brand-secondary/20">
              <Video className="w-8 h-8 text-brand-secondary" />
            </div>
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-brand-muted mb-1">Communication Index</h3>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-6xl text-brand-ink">{data.overall_score}</span>
                <span className="font-mono text-xl text-brand-secondary">EXPERT</span>
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-md">
            <p className="text-sm text-brand-muted font-sans leading-relaxed italic mb-4">
              "{data.verdict}"
            </p>
            <ProgressBar percent={data.overall_score} color="cyan" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery & Pacing */}
        <div className="bg-brand-card border border-brand-divider p-8 rounded-xl space-y-8">
          <div className="flex items-center gap-3">
            <Timer className="text-brand-primary" />
            <h4 className="font-heading text-xl">Delivery & Pacing</h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-brand-bg rounded-lg border border-brand-divider text-center">
              <span className="text-3xl font-mono text-brand-primary block">{data.delivery.words_per_minute}</span>
              <span className="text-[10px] uppercase tracking-widest text-brand-muted">Words / Min</span>
              <span className="text-[10px] text-brand-primary block mt-1">{data.delivery.pacing_verdict.toUpperCase()}</span>
            </div>
            <div className="p-4 bg-brand-bg rounded-lg border border-brand-divider text-center">
              <span className="text-3xl font-mono text-brand-tertiary block">{data.delivery.filler_per_minute}</span>
              <span className="text-[10px] uppercase tracking-widest text-brand-muted">Fillers / Min</span>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] uppercase tracking-widest text-brand-muted">Filler Words Frequency</h5>
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.delivery.filler_words).map(([word, count]) => (
                <div key={word} className="flex items-center gap-2 px-3 py-1 bg-brand-card border border-brand-divider rounded">
                  <span className="text-xs font-mono text-brand-ink">{word}</span>
                  <span className="text-[10px] text-brand-tertiary">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confidence & Emotion */}
        <div className="bg-brand-card border border-brand-divider p-8 rounded-xl space-y-8">
          <div className="flex items-center gap-3">
            <Zap className="text-brand-secondary" />
            <h4 className="font-heading text-xl">Confidence & Presence</h4>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-brand-muted">Confidence Score</span>
                <span className="text-brand-secondary">{data.emotion.confidence_score}%</span>
              </div>
              <ProgressBar percent={data.emotion.confidence_score} color="cyan" />
              
              <div className="flex justify-between text-[10px] uppercase tracking-widest pt-4">
                <span className="text-brand-muted">Eye Contact Score</span>
                <span className="text-brand-primary">{data.eye_contact.score}%</span>
              </div>
              <ProgressBar percent={data.eye_contact.score} color="lime" />
            </div>
            <div className="shrink-0 text-center">
              <span className="text-[10px] uppercase tracking-widest text-brand-muted block mb-2">Dominant</span>
              <span className="px-4 py-2 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary text-xs rounded-full font-mono">
                {data.emotion.dominant_emotion.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-[10px] uppercase tracking-widest text-brand-muted">Body Language Signals</h5>
            <ul className="space-y-2">
              {data.emotion.body_language_signals.map((signal, i) => (
                <li key={i} className="flex gap-2 text-xs text-brand-muted font-sans italic">
                  <CheckCircle2 size={12} className="text-brand-primary shrink-0" />
                  {signal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Transcript & Roast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-brand-card border border-brand-divider p-8 rounded-xl space-y-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-brand-muted" />
            <h4 className="font-heading text-xl">Transcript Review</h4>
          </div>
          <div className="p-6 bg-brand-bg border border-brand-divider rounded-lg max-h-64 overflow-y-auto custom-scrollbar">
            <p className="text-sm text-brand-muted font-sans leading-relaxed">
              {data.transcript}
            </p>
          </div>
          {data.content.red_flag_statements.length > 0 && (
            <div className="p-4 bg-brand-tertiary/10 border border-brand-tertiary/20 rounded-lg">
              <h5 className="text-[10px] text-brand-tertiary uppercase tracking-widest mb-2 font-bold">Red Flag Statements</h5>
              <ul className="space-y-1">
                {data.content.red_flag_statements.map((s, i) => (
                  <li key={i} className="text-xs text-brand-ink font-sans">• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-[#0F0A08] border border-brand-tertiary/30 p-8 rounded-xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-brand-tertiary w-4 h-4" />
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-brand-tertiary font-bold">Communication Roast</h4>
          </div>
          <p className="text-lg font-heading text-brand-ink italic mb-8">
            "{data.roast}"
          </p>
          <div className="space-y-4">
            <h5 className="text-[10px] uppercase tracking-widest text-brand-muted">Top Fixes</h5>
            {data.top_3_fixes.map((fix, i) => (
              <div key={i} className="flex gap-3 text-xs text-brand-muted font-sans">
                <span className="text-brand-tertiary font-mono">{i + 1}.</span>
                {fix}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
