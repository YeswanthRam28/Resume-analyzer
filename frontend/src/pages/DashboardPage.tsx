import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserButton } from '@clerk/react';
import { 
  FileText, ArrowRight, ChevronRight, BarChart3, Target, 
  Briefcase, Search, CheckCircle2 
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import LimeButton from '../components/ui/LimeButton';
import { useStore } from '../lib/store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function DashboardPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { userRole: role } = useStore();
  
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/');
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!isLoaded || !isSignedIn) return;
      try {
        const token = await getToken();
        // 2. Get resumes based on role
        const resumeRes = await axios.get(`${API_URL}/api/dashboard/resumes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setResumes(resumeRes.data.resumes || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [isLoaded, isSignedIn, getToken]);



  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );



  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink pt-24 px-6 pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-5xl md:text-6xl">DASHBOARD</h1>
              <span className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest ${role === 'candidate' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'bg-brand-tertiary/10 text-brand-tertiary border border-brand-tertiary/20'}`}>
                {role} mode
              </span>
            </div>
            <p className="text-brand-muted font-sans text-lg">
              {role === 'candidate' ? 'Your resume intelligence history.' : 'Your candidate screening history.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to={role === 'candidate' ? "/analyze" : "/recruiter"}>
              <LimeButton className="h-12 px-8">
                {role === 'candidate' ? 'New Analysis +' : 'Screen Candidate +'}
              </LimeButton>
            </Link>
            <UserButton appearance={{ elements: { avatarBox: "w-12 h-12 border-2 border-brand-divider" } }} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FileText className={role === 'candidate' ? 'text-brand-primary' : 'text-brand-tertiary'} />
              <h2 className="font-heading text-2xl">Recent Sessions</h2>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-brand-muted">{resumes.length} total</span>
          </div>

          <div className="space-y-4">
            {resumes.map((session: any, i: number) => (
              <motion.div 
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={role === 'candidate' ? `/results/${session.id}` : `/recruiter/${session.id}`}>
                  <GlassCard hoverGlow className="p-6 flex flex-col md:flex-row md:items-center gap-6 group cursor-pointer">
                    <div className={`p-3 bg-brand-bg rounded-lg border border-brand-divider ${role === 'candidate' ? 'text-brand-primary' : 'text-brand-tertiary'}`}>
                      {role === 'candidate' ? <BarChart3 size={20} /> : <CheckCircle2 size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-lg text-brand-ink truncate mb-1">
                        {role === 'candidate' ? (session.file_name || 'Untitled Resume') : (session.candidate_name || session.file_name || 'Unknown Candidate')}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-brand-muted uppercase tracking-widest">
                        <span>{new Date(session.created_at).toLocaleDateString()}</span>
                        {role === 'candidate' && session.target_role && (
                          <span className="flex items-center gap-1"><Target size={12} /> {session.target_role}</span>
                        )}
                        {role === 'interviewer' && session.career_level && (
                          <span className="text-brand-tertiary">{session.career_level}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0">
                      <div className="text-left md:text-right">
                        <p className={`text-sm md:text-xs font-mono ${role === 'candidate' ? 'text-brand-primary' : 'text-brand-tertiary'}`}>
                          {role === 'candidate' ? (session.ats_score || 'N/A') : (session.overall_score || 'N/A')}
                        </p>
                        <p className="text-[10px] md:text-[8px] text-brand-muted uppercase tracking-widest">
                          {role === 'candidate' ? 'ATS Score' : 'Overall Score'}
                        </p>
                      </div>
                      
                      {role === 'interviewer' && (
                        <div className="text-left md:text-right">
                          <p className="text-sm md:text-xs font-mono text-white">
                            {session.hire_recommendation || 'N/A'}
                          </p>
                          <p className="text-[10px] md:text-[8px] text-brand-muted uppercase tracking-widest">Recommendation</p>
                        </div>
                      )}
                      
                      <ChevronRight className="text-brand-ghost group-hover:text-white transition-colors" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
            
            {resumes.length === 0 && (
              <div className="p-12 text-center border border-dashed border-brand-divider rounded-xl">
                <p className="text-brand-muted font-sans">
                  {role === 'candidate' 
                    ? "You haven't analyzed any resumes yet." 
                    : "You haven't screened any candidates yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
