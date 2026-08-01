import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/react';
import { useStore } from '../lib/store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'interviewer' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { getToken } = useAuth();
  const { setUserRole } = useStore();

  const handleSave = async () => {
    if (!selectedRole) return;
    setIsSaving(true);
    
    try {
      const token = await getToken();
      await axios.post(`${API_URL}/api/dashboard/role`, 
        { role: selectedRole }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUserRole(selectedRole);
      onComplete();
    } catch (error) {
      console.error("Failed to save role", error);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-3xl bg-brand-surface border border-brand-divider rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Welcome to RÉSCORE</h2>
            <p className="text-brand-muted font-mono uppercase tracking-widest text-sm">
              How do you plan to use this intelligence platform?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Candidate Option */}
            <button
              onClick={() => setSelectedRole('candidate')}
              className={`relative p-8 rounded-xl border text-left transition-all duration-300 ${
                selectedRole === 'candidate' 
                  ? 'border-brand-primary bg-brand-primary/10 shadow-[0_0_30px_rgba(198,255,74,0.15)]' 
                  : 'border-brand-divider bg-brand-card hover:border-brand-primary/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors ${
                selectedRole === 'candidate' ? 'bg-brand-primary text-brand-bg' : 'bg-brand-surface text-brand-primary'
              }`}>
                <User size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Candidate</h3>
              <p className="text-brand-muted text-sm leading-relaxed mb-6">
                I want to upload my resume, get ATS scoring, receive brutal roasts, and auto-tailor my resume to specific jobs.
              </p>
              
              <div className={`absolute top-6 right-6 transition-opacity ${selectedRole === 'candidate' ? 'opacity-100 text-brand-primary' : 'opacity-0'}`}>
                <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-brand-bg">
                  <div className="w-2 h-2 rounded-full bg-brand-bg" />
                </div>
              </div>
            </button>

            {/* Recruiter Option */}
            <button
              onClick={() => setSelectedRole('interviewer')}
              className={`relative p-8 rounded-xl border text-left transition-all duration-300 ${
                selectedRole === 'interviewer' 
                  ? 'border-brand-secondary bg-brand-secondary/10 shadow-[0_0_30px_rgba(0,220,255,0.15)]' 
                  : 'border-brand-divider bg-brand-card hover:border-brand-secondary/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors ${
                selectedRole === 'interviewer' ? 'bg-brand-secondary text-brand-bg' : 'bg-brand-surface text-brand-secondary'
              }`}>
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Recruiter / Hiring Manager</h3>
              <p className="text-brand-muted text-sm leading-relaxed mb-6">
                I want to upload incoming candidate resumes to generate structured professional summaries and extract core technical skills.
              </p>
              
              <div className={`absolute top-6 right-6 transition-opacity ${selectedRole === 'interviewer' ? 'opacity-100 text-brand-secondary' : 'opacity-0'}`}>
                <div className="w-6 h-6 rounded-full bg-brand-secondary flex items-center justify-center text-brand-bg">
                  <div className="w-2 h-2 rounded-full bg-brand-bg" />
                </div>
              </div>
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSave}
              disabled={!selectedRole || isSaving}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-mono uppercase tracking-widest text-sm transition-all duration-300 ${
                !selectedRole
                  ? 'bg-brand-surface text-brand-muted cursor-not-allowed border border-brand-divider'
                  : selectedRole === 'candidate'
                    ? 'bg-brand-primary text-brand-bg hover:shadow-[0_0_20px_rgba(198,255,74,0.4)]'
                    : 'bg-brand-secondary text-brand-bg hover:shadow-[0_0_20px_rgba(0,220,255,0.4)]'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
