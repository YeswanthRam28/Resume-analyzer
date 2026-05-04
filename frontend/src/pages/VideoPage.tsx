import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import VideoRecorder from '../components/upload/VideoRecorder';
import axios from 'axios';
import { Terminal, Video, Brain, Sparkles } from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function VideoPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingLines, setLoadingLines] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleVideoUpload = async (file: File) => {
    setIsAnalyzing(true);
    setLoadingLines(["Initializing Video IQ...", "Uploading to Gemini Secure Node..."]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setTimeout(() => setLoadingLines(prev => [...prev, "Processing frame-by-frame audio/visual..."]), 1500);
      setTimeout(() => setLoadingLines(prev => [...prev, "Detecting filler words & pacing..."]), 3000);
      setTimeout(() => setLoadingLines(prev => [...prev, "Analyzing eye contact & confidence..."]), 4500);
      setTimeout(() => setLoadingLines(prev => [...prev, "Generating communication roast 🔥"]), 6000);

      const response = await axios.post(`${API_URL}/api/video/analyze`, formData);
      
      setLoadingLines(prev => [...prev, "Video analysis complete. Finalizing report..."]);
      
      setTimeout(() => {
        // Since I haven't defined a separate Video results route yet, 
        // I'll reuse the results structure or just redirect to results if integrated.
        // For now, let's assume video results are part of the same flow or a special page.
        navigate(`/results/${response.data.session_id}`); 
      }, 1000);

    } catch (error) {
      console.error("Video analysis failed", error);
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
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-brand-secondary/10 border border-brand-secondary/20 rounded-2xl text-brand-secondary">
              <Video size={40} />
            </div>
          </div>
          <h1 className="font-display text-6xl md:text-8xl mb-4">VIDEO INTELLIGENCE</h1>
          <p className="text-brand-muted font-sans text-lg max-w-xl mx-auto">Analyze your communication, body language, and confidence with Gemini-powered AI.</p>
        </motion.div>

        {!isAnalyzing ? (
          <div className="pb-24">
            <VideoRecorder onUpload={handleVideoUpload} />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="flex gap-4">
                <Brain className="text-brand-primary shrink-0" size={24} />
                <div>
                  <h4 className="font-heading text-brand-ink mb-1">Emotion Detection</h4>
                  <p className="text-sm text-brand-muted font-sans">We track confidence levels and dominant emotions throughout your delivery.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Sparkles className="text-brand-secondary shrink-0" size={24} />
                <div>
                  <h4 className="font-heading text-brand-ink mb-1">AI Script Rewrite</h4>
                  <p className="text-sm text-brand-muted font-sans">Get a polished version of your transcript with filler words removed.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-full max-w-md bg-black border border-brand-divider rounded-lg p-6 font-mono text-sm overflow-hidden relative">
              <div className="flex items-center gap-2 mb-6 border-b border-brand-divider pb-2">
                <Terminal size={14} className="text-brand-secondary" />
                <span className="text-brand-muted text-[10px] uppercase tracking-widest">GEMINI_VIDEO_IQ_v1.5</span>
              </div>
              <div className="space-y-2 h-[200px]">
                {loadingLines.map((line, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2"
                  >
                    <span className="text-brand-secondary">{">"}</span>
                    <span className="text-brand-ink">{line}</span>
                  </motion.div>
                ))}
                <motion.div 
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-brand-secondary"
                />
              </div>
            </div>
            
            <div className="mt-12 w-full max-w-sm">
              <ProgressBar percent={Math.min(loadingLines.length * 15, 100)} color="cyan" showLabel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
