import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FileText, Video, Calendar, ArrowRight, 
  ChevronRight, BarChart3, Target, Trash2 
} from 'lucide-react';
import { cn } from '../lib/utils';
import GlassCard from '../components/ui/GlassCard';
import LimeButton from '../components/ui/LimeButton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function DashboardPage() {
  const [history, setHistory] = useState<any>({ resumes: [], videos: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/history/history`);
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink pt-24 px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="font-display text-6xl mb-2">DASHBOARD</h1>
            <p className="text-brand-muted font-sans text-lg">Your resume and video intelligence history.</p>
          </div>
          <Link to="/analyze">
            <LimeButton className="h-12 px-8">New Analysis +</LimeButton>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Resume Sessions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <FileText className="text-brand-primary" />
                <h2 className="font-heading text-2xl">Resume Analysis</h2>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-brand-muted">{(history?.resumes || []).length} total</span>
            </div>

            <div className="space-y-4">
              {(history?.resumes || []).map((session: any, i: number) => (
                <motion.div 
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/results/${session.id}`}>
                    <GlassCard hoverGlow className="p-6 flex items-center gap-6 group">
                      <div className="p-3 bg-brand-bg rounded-lg border border-brand-divider text-brand-primary">
                        <BarChart3 size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-lg text-brand-ink truncate mb-1">{session.file_name || 'Untitled'}</h4>
                        <div className="flex items-center gap-4 text-[10px] text-brand-muted uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(session.created_at).toLocaleDateString()}</span>
                          {session.target_role && <span className="flex items-center gap-1"><Target size={12} /> {session.target_role}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs font-mono text-brand-primary">{session.ats_score || 'N/A'}</p>
                          <p className="text-[8px] text-brand-muted uppercase tracking-widest">ATS Score</p>
                        </div>
                        <ChevronRight className="text-brand-ghost group-hover:text-brand-primary transition-colors" />
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
              {history.resumes.length === 0 && (
                <div className="p-12 text-center border border-dashed border-brand-divider rounded-xl">
                  <p className="text-brand-muted font-sans">No resumes analyzed yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Video Sessions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Video className="text-brand-secondary" />
                <h2 className="font-heading text-2xl">Video Insights</h2>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-brand-muted">{(history?.videos || []).length} total</span>
            </div>

            <div className="space-y-4">
              {(history?.videos || []).map((session: any, i: number) => (
                <motion.div 
                  key={session.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/results/${session.id}`}>
                    <GlassCard hoverGlow className="p-6 flex items-center gap-6 group">
                      <div className="p-3 bg-brand-bg rounded-lg border border-brand-divider text-brand-secondary">
                        <Video size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-lg text-brand-ink truncate mb-1">Video Session</h4>
                        <div className="flex items-center gap-4 text-[10px] text-brand-muted uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(session.created_at).toLocaleDateString()}</span>
                          <span className="text-brand-secondary">{session.emotion_detected || 'Processing'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs font-mono text-brand-secondary">{session.confidence_score || 'N/A'}%</p>
                          <p className="text-[8px] text-brand-muted uppercase tracking-widest">Confidence</p>
                        </div>
                        <ChevronRight className="text-brand-ghost group-hover:text-brand-secondary transition-colors" />
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
              {history.videos.length === 0 && (
                <div className="p-12 text-center border border-dashed border-brand-divider rounded-xl">
                  <p className="text-brand-muted font-sans">No videos recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
