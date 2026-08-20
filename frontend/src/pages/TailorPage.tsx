import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Sparkles, Download, LayoutTemplate, History, 
  ChevronRight, ChevronLeft, X, Check
} from 'lucide-react';
import { UserButton } from '@clerk/react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import GlassCard from '../components/ui/GlassCard';
import LimeButton from '../components/ui/LimeButton';
import ProgressBar from '../components/ui/ProgressBar';

import MinimalistTemplate from '../components/templates/MinimalistTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import ExecutiveTemplate from '../components/templates/ExecutiveTemplate';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TEMPLATES = [
  { id: 'minimalist', name: 'Minimalist Clean', component: MinimalistTemplate, type: 'react' },
  { id: 'modern', name: 'Modern Impact', component: ModernTemplate, type: 'react' },
  { id: 'executive', name: 'Executive Suite', component: ExecutiveTemplate, type: 'react' },
  { id: 'flat', name: 'JSON Flat', type: 'iframe' },
  { id: 'elegant', name: 'JSON Elegant', type: 'iframe' },
  { id: 'macchiato', name: 'JSON Macchiato', type: 'iframe' },
  { id: 'kendall', name: 'JSON Kendall', type: 'iframe' },
  { id: 'spartan', name: 'JSON Spartan', type: 'iframe' },
  { id: 'onepage', name: 'JSON OnePage', type: 'iframe' },
  { id: 'classy', name: 'JSON Classy', type: 'iframe' },
  { id: 'cora', name: 'JSON Cora', type: 'iframe' },
  { id: 'modern', name: 'JSON Modern', type: 'iframe' },
  { id: 'straightforward', name: 'JSON Straightforward', type: 'iframe' },
  { id: 'catppuccin', name: 'JSON Catppuccin', type: 'iframe' },
  { id: 'waterfall', name: 'JSON Waterfall', type: 'iframe' },
  { id: 'msresume', name: 'JSON MSResume', type: 'iframe' },
  { id: 'lowmess', name: 'JSON Lowmess', type: 'iframe' },
  { id: 'even-crewshin', name: 'JSON Even Crewshin', type: 'iframe' },
  { id: 'projects', name: 'JSON Projects', type: 'iframe' },
  { id: 'timeline-fixed', name: 'JSON Timeline Fixed', type: 'iframe' },
  { id: 'even', name: 'JSON Even', type: 'iframe' },
  { id: 'simplyelegant', name: 'JSON Simply Elegant', type: 'iframe' },
  { id: 'dark-classy', name: 'JSON Dark Classy', type: 'iframe' },
  { id: 'engineering', name: 'JSON Engineering', type: 'iframe' },
  { id: 'berlin-grid-ats', name: 'JSON Berlin Grid ATS', type: 'iframe' },
  { id: 'a11y', name: 'JSON A11y', type: 'iframe' },
  { id: 'stackoverflow', name: 'JSON StackOverflow', type: 'iframe' }
];

export default function TailorPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [tailoring, setTailoring] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('minimalist');
  const [activeVersionIndex, setActiveVersionIndex] = useState<number>(-1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const printRef = useRef(null);
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Rescore_Tailored_Resume',
  });

  useEffect(() => {
    fetchData();
  }, [sessionId]);

  const fetchData = async () => {
    try {
      const parsedRes = await axios.get(`${API_URL}/api/resume/${sessionId}/parsed`);
      setResumeData(parsedRes.data);
      
      const versionsRes = await axios.get(`${API_URL}/api/tailor/versions/${sessionId}`);
      setVersions(versionsRes.data);
      
      if (versionsRes.data.length > 0) {
        setActiveVersionIndex(versionsRes.data.length - 1);
      }
    } catch (err) {
      console.error("Failed to fetch resume data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTailor = async () => {
    setTailoring(true);
    try {
      const response = await axios.post(`${API_URL}/api/tailor/${sessionId}`);
      const versionsRes = await axios.get(`${API_URL}/api/tailor/versions/${sessionId}`);
      setVersions(versionsRes.data);
      if (versionsRes.data.length > 0) {
        setActiveVersionIndex(versionsRes.data.length - 1);
      }
    } catch (err) {
      console.error("Tailoring failed:", err);
    } finally {
      setTailoring(false);
    }
  };

  const getCurrentData = () => {
    if (activeVersionIndex >= 0 && versions.length > 0) {
      try {
        const tailoredStr = versions[activeVersionIndex].tailored_text;
        return JSON.parse(tailoredStr);
      } catch (e) {
        console.error("Failed to parse tailored JSON version", e);
      }
    }
    return resumeData;
  };

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];
  const SelectedTemplateComponent = selectedTemplate.component as React.ElementType;
  const currentDataToRender = getCurrentData();

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-64 space-y-4">
        <p className="text-center text-[10px] font-mono uppercase tracking-widest text-brand-muted">Loading Templates...</p>
        <ProgressBar percent={100} showLabel={false} />
      </div>
    </div>
  );

  const sidebarContent = (
    <>
      <div>
        <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-muted mb-4">Choose Template</h2>
        <div className="space-y-2.5">
          {TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => {
                setSelectedTemplateId(template.id);
                setDrawerOpen(false);
              }}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                selectedTemplateId === template.id 
                  ? 'border-brand-primary bg-brand-primary/10 text-brand-ink font-medium' 
                  : 'border-brand-divider bg-brand-card text-brand-muted hover:border-brand-ghost'
              }`}
            >
              <div className="font-heading text-base sm:text-lg flex items-center justify-between">
                <span>{template.name}</span>
                {selectedTemplateId === template.id && <Check size={16} className="text-brand-primary" />}
              </div>
              <div className="text-[10px] font-sans mt-0.5 opacity-70">A4 • Optimized for ATS</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-muted mb-4 flex items-center gap-2">
          <History size={12} /> Version History
        </h2>
        <div className="space-y-2">
          <button 
            onClick={() => {
              setActiveVersionIndex(-1);
              setDrawerOpen(false);
            }}
            className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
              activeVersionIndex === -1 
                ? 'border-brand-primary text-brand-primary bg-brand-bg font-medium' 
                : 'border-brand-divider text-brand-muted hover:border-brand-ghost'
            }`}
          >
            Original Parsed Resume
          </button>
          {versions.map((v: any, i: number) => (
            <button 
              key={v.id}
              onClick={() => {
                setActiveVersionIndex(i);
                setDrawerOpen(false);
              }}
              className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between group ${
                activeVersionIndex === i 
                  ? 'bg-brand-primary/10 border-brand-primary text-brand-ink font-medium' 
                  : 'bg-brand-bg border-brand-divider text-brand-muted hover:border-brand-ghost'
              }`}
            >
              <span>AI Tailored #{i + 1}</span>
              <span className="text-[10px] text-brand-ghost">{new Date(v.created_at).toLocaleDateString()}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink flex flex-col overflow-hidden relative">
      {/* Header */}
      <header className="border-b border-brand-divider bg-brand-bg/90 backdrop-blur-md shrink-0 z-30">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button 
              onClick={() => navigate(`/results/${sessionId}`)}
              className="p-1.5 sm:p-2 hover:bg-brand-card rounded-lg transition-colors text-brand-muted hover:text-brand-ink shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="hidden sm:block h-6 w-px bg-brand-divider" />
            <div className="flex items-center gap-2 min-w-0">
              <LayoutTemplate size={18} className="text-brand-primary shrink-0" />
              <h1 className="font-heading text-sm sm:text-base uppercase tracking-tight truncate">
                <span className="hidden sm:inline">Resume Templates</span>
                <span className="sm:hidden">Templates</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Template Drawer Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-brand-primary/40 bg-brand-primary/10 text-brand-primary text-xs font-mono"
            >
              <LayoutTemplate size={14} />
              <span className="text-[11px]">Templates</span>
            </button>

            <LimeButton 
              onClick={handleTailor} 
              disabled={tailoring}
              className="h-8 sm:h-9 px-2.5 sm:px-4 text-[10px] sm:text-xs bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-bg whitespace-nowrap"
            >
              <Sparkles size={12} className="inline mr-1" />
              {tailoring ? 'Tailoring...' : 'AI Rewrite'}
            </LimeButton>
            
            <LimeButton 
              onClick={handlePrint}
              className="h-8 sm:h-9 px-2.5 sm:px-4 text-[10px] sm:text-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </LimeButton>
            
            <div className="ml-1 sm:ml-2 flex items-center">
              <UserButton appearance={{ elements: { avatarBox: "w-7 h-7 sm:w-9 sm:h-9 border border-brand-divider" } }} />
            </div>
          </div>
        </div>
      </header>

      {/* Floating Pull-Tab for Mobile Template Drawer */}
      <button
        onClick={() => setDrawerOpen(!drawerOpen)}
        className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-30 bg-brand-primary text-brand-bg px-1.5 py-3 rounded-r-xl font-mono text-[10px] font-bold shadow-xl flex flex-col items-center gap-1 hover:bg-brand-primary/90 transition-all"
        title="Pull Out Template Tab"
      >
        <LayoutTemplate size={16} />
        <span className="[writing-mode:vertical-lr] tracking-widest uppercase text-[9px] py-1">Templates</span>
        {drawerOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* Mobile Slide-Over Template Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden flex justify-start"
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-4/5 max-w-xs h-full bg-brand-bg border-r border-brand-divider p-5 overflow-y-auto flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-divider">
                <div className="flex items-center gap-2">
                  <LayoutTemplate size={18} className="text-brand-primary" />
                  <h3 className="font-heading uppercase text-sm">Choose Template</h3>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 text-brand-muted hover:text-white rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
              {sidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden max-w-[1400px] mx-auto w-full relative">
        {/* Desktop Left Sidebar: Settings & Templates */}
        <div className="w-80 border-r border-brand-divider overflow-y-auto p-6 hidden lg:flex flex-col gap-8 shrink-0">
          {sidebarContent}
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 bg-brand-card/50 overflow-y-auto p-3 sm:p-8 relative flex justify-center custom-scrollbar">
          {tailoring && (
            <div className="absolute inset-0 z-20 bg-brand-bg/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                <Sparkles className="absolute inset-0 m-auto text-brand-primary animate-pulse" size={24} />
              </div>
              <p className="font-heading text-xl uppercase tracking-tight mt-6">AI is rewriting your resume...</p>
              <p className="text-sm text-brand-muted mt-2">Applying impact formulas and target keywords.</p>
            </div>
          )}

          {/* The print container scaled for mobile devices */}
          <div className="shadow-2xl ring-1 ring-brand-divider transition-all duration-300 transform scale-[0.55] xs:scale-[0.65] sm:scale-[0.85] lg:scale-100 origin-top bg-white my-2 sm:my-0">
            <div ref={printRef} className="print:overflow-hidden print:w-[210mm] print:h-fit">
              {selectedTemplate.type === 'react' ? (
                <div className="w-[210mm] min-h-[297mm]">
                  <SelectedTemplateComponent data={currentDataToRender} />
                </div>
              ) : (
                <iframe 
                  src={`${API_URL}/api/resume/${sessionId}/theme/${selectedTemplate.id}${activeVersionIndex !== -1 ? `?version_id=${versions[activeVersionIndex].id}` : ''}`} 
                  title="Resume Preview"
                  className="w-[210mm] min-h-[297mm] border-0"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
