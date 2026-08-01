import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Download, LayoutTemplate, History } from 'lucide-react';
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
  const [activeVersionIndex, setActiveVersionIndex] = useState<number>(-1); // -1 means original parsed data

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
      // Fetch the structured JSON representation of the resume
      const parsedRes = await axios.get(`${API_URL}/api/resume/${sessionId}/parsed`);
      setResumeData(parsedRes.data);
      
      // Fetch AI tailoring history
      const versionsRes = await axios.get(`${API_URL}/api/tailor/versions/${sessionId}`);
      setVersions(versionsRes.data);
      
      // If there are tailored versions, load the latest one automatically
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
      // Refresh versions
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

  // Determine which data to show: the original parsed data, or one of the tailored JSON versions
  const getCurrentData = () => {
    if (activeVersionIndex >= 0 && versions.length > 0) {
      try {
        const tailoredStr = versions[activeVersionIndex].tailored_text;
        return JSON.parse(tailoredStr);
      } catch (e) {
        console.error("Failed to parse tailored JSON version", e);
      }
    }
    return resumeData; // Fallback to original
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

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-brand-divider bg-brand-bg/80 backdrop-blur-md shrink-0">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/results/${sessionId}`)}
              className="p-2 hover:bg-brand-card rounded-lg transition-colors text-brand-muted hover:text-brand-ink"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-brand-divider" />
            <div className="flex items-center gap-2">
              <LayoutTemplate size={18} className="text-brand-primary" />
              <h1 className="font-heading uppercase tracking-tight">Resume Templates</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LimeButton 
              onClick={handleTailor} 
              disabled={tailoring}
              className="h-9 px-4 text-xs group bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-bg"
            >
              {tailoring ? 'AI is Tailoring...' : 'AI Tailor (Rewrite)'}
            </LimeButton>
            
            <LimeButton 
              onClick={handlePrint}
              className="h-9 px-4 text-xs flex items-center gap-2"
            >
              <Download size={14} /> Export PDF
            </LimeButton>
            <div className="ml-2 flex items-center">
              <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border border-brand-divider" } }} />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-[1400px] mx-auto w-full">
        {/* Left Sidebar: Settings & Templates */}
        <div className="w-80 border-r border-brand-divider overflow-y-auto p-6 flex flex-col gap-8 shrink-0">
          
          <div>
            <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-muted mb-4">Choose Template</h2>
            <div className="space-y-3">
              {TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedTemplateId === template.id 
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-ink' 
                      : 'border-brand-divider bg-brand-card text-brand-muted hover:border-brand-ghost'
                  }`}
                >
                  <div className="font-heading text-lg">{template.name}</div>
                  <div className="text-[10px] font-sans mt-1 opacity-70">A4 • Optimized for ATS</div>
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
                onClick={() => setActiveVersionIndex(-1)}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                  activeVersionIndex === -1 
                    ? 'border-brand-primary text-brand-primary bg-brand-bg' 
                    : 'border-brand-divider text-brand-muted hover:border-brand-ghost'
                }`}
              >
                Original Parsed Resume
              </button>
              {versions.map((v: any, i: number) => (
                <button 
                  key={v.id}
                  onClick={() => setActiveVersionIndex(i)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between group ${
                    activeVersionIndex === i 
                      ? 'bg-brand-primary/10 border-brand-primary text-brand-ink' 
                      : 'bg-brand-bg border-brand-divider text-brand-muted hover:border-brand-ghost'
                  }`}
                >
                  <span>AI Tailored #{i + 1}</span>
                  <span className="text-[10px] text-brand-ghost">{new Date(v.created_at).toLocaleDateString()}</span>
                </button>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Main Area: Live Preview */}
        <div className="flex-1 bg-brand-card/50 overflow-y-auto p-8 relative flex justify-center custom-scrollbar">
          {tailoring && (
            <div className="absolute inset-0 z-10 bg-brand-bg/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                <Sparkles className="absolute inset-0 m-auto text-brand-primary animate-pulse" size={24} />
              </div>
              <p className="font-heading text-xl uppercase tracking-tight mt-6">AI is rewriting your resume...</p>
              <p className="text-sm text-brand-muted mt-2">Applying impact formulas and target keywords.</p>
            </div>
          )}

          {/* The print container that will be exported */}
          <div className="shadow-2xl ring-1 ring-brand-divider transition-all duration-300 transform scale-[0.85] origin-top md:scale-100 bg-white">
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
