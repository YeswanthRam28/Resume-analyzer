import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Flame, User, ShieldCheck, Map, Trophy, Github, 
  ArrowLeft, Download, ExternalLink, ChevronRight, Video, Wand2, Sparkles,
  Menu, X, LayoutDashboard
} from 'lucide-react';
import { UserButton } from '@clerk/react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

// Components
import ATSScoreRing from '../components/results/ATSScoreRing';
import RoastPanel from '../components/results/RoastPanel';
import EmotionPersonaCard from '../components/results/EmotionPersonaCard';
import CredibilityAlert from '../components/results/CredibilityAlert';
import IndianMarketLens from '../components/results/IndianMarketLens';
import HackathonScorer from '../components/results/HackathonScorer';
import GitHubSyncPanel from '../components/results/GitHubSyncPanel';
import VideoAnalysisResult from '../components/results/VideoAnalysisResult';
import ProgressBar from '../components/ui/ProgressBar';
import LimeButton from '../components/ui/LimeButton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const sections = [
  { id: 'ats', label: 'ATS Score', icon: BarChart3 },
  { id: 'roast', label: 'Roast Mode', icon: Flame },
  { id: 'persona', label: 'Persona', icon: User },
  { id: 'credibility', label: 'Credibility', icon: ShieldCheck },
  { id: 'india', label: 'India Lens', icon: Map },
  { id: 'projects', label: 'Project Scorer', icon: Trophy },
  { id: 'github', label: 'GitHub Sync', icon: Github },
];

export default function ResultsPage() {
  const { sessionId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('ats');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/resume/${sessionId}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sessionId]);

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center">
      <h1 className="text-2xl font-display mb-4 text-brand-tertiary">Session not found</h1>
      <Link to="/analyze">
        <LimeButton variant="ghost">Back to Upload</LimeButton>
      </Link>
    </div>
  );

  const analysis = data.analysis;

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col lg:flex-row relative">
      {/* Mobile Top Navigation Header */}
      <header className="lg:hidden sticky top-0 z-40 h-16 border-b border-brand-divider bg-brand-bg/90 backdrop-blur-xl px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-2 text-brand-muted hover:text-white rounded-lg hover:bg-brand-card transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="flex items-center gap-1">
            <span className="font-display text-xl text-brand-primary">R/</span>
            <span className="font-display text-lg text-brand-ink">ÉSCORE</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <button className="text-xs text-brand-primary font-mono flex items-center gap-1 px-2 py-1 border border-brand-primary/30 rounded">
              <LayoutDashboard size={12} /> Dashboard
            </button>
          </Link>
          <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 border border-brand-divider" } }} />
        </div>
      </header>

      {/* Desktop User Button */}
      <div className="hidden lg:block absolute top-6 right-6 z-40">
        <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 border border-brand-divider" } }} />
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex justify-start"
            onClick={() => setMobileNavOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-4/5 max-w-xs h-full bg-brand-bg border-r border-brand-divider p-6 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-divider">
                  <Link to="/" className="flex items-center gap-1">
                    <span className="font-display text-2xl text-brand-primary">R/</span>
                    <span className="font-display text-xl text-brand-ink">ÉSCORE</span>
                  </Link>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="p-2 text-brand-muted hover:text-white rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleNavClick(s.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans transition-all text-left",
                        activeSection === s.id 
                          ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 font-medium" 
                          : "text-brand-muted hover:text-brand-ink hover:bg-brand-card"
                      )}
                    >
                      <s.icon size={18} className={activeSection === s.id ? "text-brand-primary" : "text-brand-ghost"} />
                      {s.label}
                    </button>
                  ))}
                </nav>

                <div className="pt-6 mt-6 border-t border-brand-divider">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-brand-ghost mb-3">Post-Analysis</p>
                  <Link 
                    to={`/tailor/${sessionId}`}
                    onClick={() => setMobileNavOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans text-brand-primary bg-brand-primary/10 border border-brand-primary/20 font-medium"
                  >
                    <Wand2 size={18} />
                    <span>AI Redemption</span>
                    <Sparkles size={12} className="ml-auto animate-pulse" />
                  </Link>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-divider space-y-3">
                <Link to="/video" onClick={() => setMobileNavOpen(false)}>
                  <LimeButton variant="ghost" className="w-full text-xs h-10 justify-center">
                    <Video size={14} className="mr-2" /> Video Analysis
                  </LimeButton>
                </Link>
                <div className="flex gap-2 pt-2">
                  <Link to="/analyze" className="flex-1" onClick={() => setMobileNavOpen(false)}>
                    <button className="w-full py-2 bg-brand-card border border-brand-divider text-xs font-mono text-brand-ink rounded text-center">New</button>
                  </Link>
                  <Link to="/dashboard" className="flex-1" onClick={() => setMobileNavOpen(false)}>
                    <button className="w-full py-2 bg-brand-primary text-brand-bg text-xs font-mono font-bold rounded text-center">Dashboard</button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 h-screen sticky top-0 border-r border-brand-divider bg-brand-bg/50 backdrop-blur-xl hidden lg:flex flex-col p-6">
        <Link to="/" className="flex items-center gap-1 mb-12">
          <span className="font-display text-2xl text-brand-primary">R/</span>
          <span className="font-display text-xl text-brand-ink">ÉSCORE</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSection(s.id);
                document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans transition-all group",
                activeSection === s.id 
                  ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
                  : "text-brand-muted hover:text-brand-ink hover:bg-brand-card"
              )}
            >
              <s.icon size={18} className={cn(activeSection === s.id ? "text-brand-primary" : "text-brand-ghost group-hover:text-brand-muted")} />
              {s.label}
              {activeSection === s.id && <motion.div layoutId="sidebar-active" className="ml-auto w-1 h-4 bg-brand-primary rounded-full" />}
            </button>
          ))}

          <div className="pt-8 mt-8 border-t border-brand-divider">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-brand-ghost mb-4">Post-Analysis</h4>
            <Link 
              to={`/tailor/${sessionId}`}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans text-brand-primary hover:bg-brand-primary/5 border border-brand-primary/20 bg-brand-primary/5 transition-all group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Wand2 size={18} className="relative z-10" />
              <span className="relative z-10">AI Redemption</span>
              <Sparkles size={12} className="ml-auto relative z-10 animate-pulse" />
            </Link>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-brand-divider">
          <Link to="/video">
            <LimeButton variant="ghost" className="w-full text-[10px] h-10">
              <Video size={14} className="mr-2" /> Video Analysis
            </LimeButton>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-12 space-y-12 sm:space-y-24 max-w-5xl mx-auto overflow-y-auto w-full">
        {/* Responsive Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 sm:pb-12 border-b border-brand-divider">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Link to="/dashboard" className="p-2 hover:bg-brand-card rounded-lg transition-colors shrink-0">
                <ArrowLeft size={18} className="text-brand-muted" />
              </Link>
              <h1 className="font-display text-2xl sm:text-4xl truncate max-w-[200px] sm:max-w-md uppercase tracking-tight">{data.file_name}</h1>
            </div>
            <p className="text-brand-muted font-mono text-[10px] sm:text-xs ml-10 truncate">Session ID: {sessionId}</p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
            <LimeButton variant="ghost" className="h-10 text-[10px] flex-1 sm:flex-initial justify-center">
              <Download size={14} className="mr-2" /> PDF Report
            </LimeButton>
            <LimeButton className="h-10 text-[10px] flex-1 sm:flex-initial justify-center">
              Publish Results <ExternalLink size={14} className="ml-2" />
            </LimeButton>
          </div>
        </div>

        {/* ATS Section */}
        {analysis.ats && (
          <section id="ats" className="scroll-mt-24">
            <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-display text-3xl sm:text-5xl">ATS ANALYTICS</h2>
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-widest text-brand-muted">Overall Match</span>
                <div className="w-32 h-1.5 bg-brand-divider rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.ats.ats_score}%` }}
                    className="h-full bg-brand-primary"
                  />
                </div>
              </div>
            </div>
            <ATSScoreRing 
              score={analysis.ats.ats_score} 
              sectionScores={analysis.ats.section_scores} 
              keywords={analysis.ats.keyword_match}
            />
          </section>
        )}

        {/* Roast Section */}
        {analysis.roast && (
          <section id="roast" className="scroll-mt-24">
            <h2 className="font-display text-3xl sm:text-5xl mb-8 sm:mb-12 text-brand-tertiary">BRUTAL FEEDBACK</h2>
            <RoastPanel data={analysis.roast} fullAnalysis={analysis} resumeText={data.resume_text} />
          </section>
        )}

        {/* Persona Section */}
        {analysis.emotion && (
          <section id="persona" className="scroll-mt-24">
            <h2 className="font-display text-3xl sm:text-5xl mb-8 sm:mb-12">THE WRITER Archetype</h2>
            <EmotionPersonaCard data={analysis.emotion} />
          </section>
        )}

        {/* Credibility Section */}
        {analysis.credibility && (
          <section id="credibility" className="scroll-mt-24">
            <h2 className="font-display text-3xl sm:text-5xl mb-8 sm:mb-12">CREDIBILITY INDEX</h2>
            <CredibilityAlert data={analysis.credibility} />
          </section>
        )}

        {/* Indian Market Section */}
        {analysis.indian_market && (
          <section id="india" className="scroll-mt-24">
            <h2 className="font-display text-3xl sm:text-5xl mb-8 sm:mb-12">INDIAN MARKET LENS</h2>
            <IndianMarketLens data={analysis.indian_market} />
          </section>
        )}

        {/* Projects Section */}
        {analysis.hackathons && (
          <section id="projects" className="scroll-mt-24">
            <h2 className="font-display text-3xl sm:text-5xl mb-8 sm:mb-12">PROJECT IMPACT</h2>
            <HackathonScorer data={analysis.hackathons} />
          </section>
        )}

        {/* GitHub Section */}
        <section id="github" className="scroll-mt-24">
          <h2 className="font-display text-3xl sm:text-5xl mb-8 sm:mb-12">GITHUB SYNC</h2>
          <GitHubSyncPanel data={analysis.github_portfolio || {
            on_resume: [],
            missing_from_resume: [],
            contradictions: [],
            github_strength_summary: "No GitHub data linked."
          }} />
        </section>

        {/* Video Section */}
        {data.video_analysis && (
          <section id="video" className="scroll-mt-24">
            <h2 className="font-display text-3xl sm:text-5xl mb-8 sm:mb-12 text-brand-secondary">VIDEO INTELLIGENCE</h2>
            <VideoAnalysisResult data={data.video_analysis} />
          </section>
        )}

        <footer className="pt-24 border-t border-brand-divider text-center text-brand-muted font-sans text-sm">
          <p>Analysis powered by RÉSCORE Engine v1.0. Results based on GLM-4 Intelligence.</p>
          <div className="mt-4 flex justify-center gap-6">
            <Link to="/analyze" className="hover:text-brand-primary transition-colors">New Analysis</Link>
            <Link to="/dashboard" className="hover:text-brand-primary transition-colors">History</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
