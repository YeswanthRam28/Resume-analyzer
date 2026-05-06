import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeUploader from '../components/upload/ResumeUploader';
import LimeButton from '../components/ui/LimeButton';
import { useStore } from '../lib/store';
import axios from 'axios';
import ProgressBar from '../components/ui/ProgressBar';
import { Terminal, Shield, Target, Github, Briefcase, User } from 'lucide-react';
import { cn } from '../lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingLines, setLoadingLines] = useState<string[]>([]);
  const [mode, setMode] = useState<'candidate' | 'recruiter'>('candidate');
  
  const navigate = useNavigate();
  const { setSession, setAnalysis } = useStore();

  const handleUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
  };

  const startAnalysis = async () => {
    if (!file) return;
    setIsAnalyzing(true);

    if (mode === 'recruiter') {
      setLoadingLines(["Initializing Recruiter Intelligence...", "Parsing resume structure..."]);
      const formData = new FormData();
      formData.append('file', file);
      try {
        setTimeout(() => setLoadingLines(prev => [...prev, "Mapping resume sections..."]), 1000);
        setTimeout(() => setLoadingLines(prev => [...prev, "Running personality profiling..."]), 2500);
        setTimeout(() => setLoadingLines(prev => [...prev, "Generating professional assessment..."]), 4000);

        const response = await axios.post(`${API_URL}/api/recruiter/analyze`, formData);
        setLoadingLines(prev => [...prev, "Report complete. Redirecting..."]);
        setTimeout(() => {
          navigate('/recruiter', { state: { data: response.data } });
        }, 800);
      } catch (error) {
        console.error("Recruiter analysis failed", error);
        setLoadingLines(prev => [...prev, "ERROR: Analysis failed. Please try again."]);
        setIsAnalyzing(false);
      }
      return;
    }

    // Candidate mode
    setLoadingLines(["Initializing RÉSCORE engine...", "Parsing document structure..."]);
    const formData = new FormData();
    formData.append('file', file);
    if (targetRole) formData.append('target_role', targetRole);
    if (githubUsername) formData.append('github_username', githubUsername);
    if (jdText) formData.append('jd_text', jdText);

    try {
      setTimeout(() => setLoadingLines(prev => [...prev, "Running ATS Scoring Engine..."]), 1000);
      setTimeout(() => setLoadingLines(prev => [...prev, "Activating Roast Mode 🔥"]), 2000);
      setTimeout(() => setLoadingLines(prev => [...prev, "Scanning Personality Signals..."]), 3000);
      setTimeout(() => setLoadingLines(prev => [...prev, "Checking Credibility Flags..."]), 4000);

      const response = await axios.post(`${API_URL}/api/resume/analyze`, formData);
      setSession(response.data.session_id);
      setAnalysis(response.data.analysis);
      setLoadingLines(prev => [...prev, "Analysis complete. Redirecting..."]);
      setTimeout(() => {
        navigate(`/results/${response.data.session_id}`);
      }, 1000);
    } catch (error) {
      console.error("Analysis failed", error);
      setLoadingLines(prev => [...prev, "ERROR: Analysis failed. Please try again."]);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink pt-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-6xl md:text-8xl mb-4">
            {mode === 'recruiter' ? 'RECRUITER INTELLIGENCE' : 'ANALYZE YOUR POTENTIAL'}
          </h1>
          <p className="text-brand-muted font-sans text-lg">
            {mode === 'recruiter' 
              ? "Professional resume parsing and candidate assessment for recruiters."
              : "Upload your resume and let RÉSCORE dismantle it."}
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center bg-brand-card border border-brand-divider rounded-xl p-1 gap-1">
            <button
              onClick={() => setMode('candidate')}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all duration-200",
                mode === 'candidate'
                  ? "bg-brand-primary text-brand-bg shadow-[0_0_15px_rgba(198,255,74,0.3)]"
                  : "text-brand-muted hover:text-brand-ink"
              )}
            >
              <User size={14} />
              Candidate Mode
            </button>
            <button
              onClick={() => setMode('recruiter')}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all duration-200",
                mode === 'recruiter'
                  ? "bg-brand-secondary text-brand-bg shadow-[0_0_15px_rgba(0,220,255,0.3)]"
                  : "text-brand-muted hover:text-brand-ink"
              )}
            >
              <Briefcase size={14} />
              Recruiter Mode
            </button>
          </div>
        </motion.div>

        {/* Recruiter mode note */}
        <AnimatePresence>
          {mode === 'recruiter' && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-4 border border-brand-secondary/20 bg-brand-secondary/5 rounded-lg text-center"
            >
              <p className="text-xs text-brand-secondary font-mono uppercase tracking-widest">
                Recruiter mode generates a structured professional report — no roast, no ATS scoring. Just clean signal.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!isAnalyzing ? (
          <div className="space-y-12 pb-24">
            <ResumeUploader onUpload={handleUpload} />

            <AnimatePresence>
              {file && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  {/* Candidate-only fields */}
                  <AnimatePresence>
                    {mode === 'candidate' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-brand-muted flex items-center gap-2">
                            <Target size={12} className="text-brand-primary" /> Target Role
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g. SDE-1, Product Manager"
                            className="w-full bg-brand-card border border-brand-divider p-4 rounded-lg focus:border-brand-primary outline-none transition-colors font-sans"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-brand-muted flex items-center gap-2">
                            <Github size={12} className="text-brand-primary" /> GitHub Username
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g. janesmith"
                            className="w-full bg-brand-card border border-brand-divider p-4 rounded-lg focus:border-brand-primary outline-none transition-colors font-sans"
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-brand-muted flex items-center gap-2">
                            <Shield size={12} className="text-brand-primary" /> Job Description (Optional)
                          </label>
                          <textarea 
                            placeholder="Paste the JD here for tailored ATS scoring..."
                            className="w-full bg-brand-card border border-brand-divider p-4 rounded-lg focus:border-brand-primary outline-none transition-colors font-sans min-h-[120px] resize-none"
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-center pt-4">
                    <LimeButton 
                      onClick={startAnalysis}
                      className={cn(
                        "h-14 px-12 text-sm",
                        mode === 'recruiter' 
                          ? "shadow-[0_0_40px_rgba(0,220,255,0.2)]"
                          : "shadow-[0_0_40px_rgba(198,255,74,0.2)]"
                      )}
                    >
                      {mode === 'recruiter' ? 'Generate Recruiter Report →' : 'Initialize Analysis →'}
                    </LimeButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-full max-w-md bg-black border border-brand-divider rounded-lg p-6 font-mono text-sm overflow-hidden relative">
              <div className="flex items-center gap-2 mb-6 border-b border-brand-divider pb-2">
                <Terminal size={14} className={mode === 'recruiter' ? 'text-brand-secondary' : 'text-brand-primary'} />
                <span className="text-brand-muted text-[10px] uppercase tracking-widest">
                  {mode === 'recruiter' ? 'RECRUITER_ENGINE_v1.0' : 'RESCORE_ENGINE_v1.0'}
                </span>
              </div>
              <div className="space-y-2">
                {loadingLines.map((line, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2"
                  >
                    <span className={mode === 'recruiter' ? 'text-brand-secondary' : 'text-brand-primary'}>{">"}</span>
                    <span className="text-brand-ink">{line}</span>
                  </motion.div>
                ))}
                <motion.div 
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className={cn("inline-block w-2 h-4", mode === 'recruiter' ? 'bg-brand-secondary' : 'bg-brand-primary')}
                />
              </div>
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>
            
            <div className="mt-12 w-full max-w-sm">
              <ProgressBar 
                percent={Math.min(loadingLines.length * (mode === 'recruiter' ? 20 : 15), 100)} 
                color={mode === 'recruiter' ? 'cyan' : 'lime'} 
                showLabel 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

