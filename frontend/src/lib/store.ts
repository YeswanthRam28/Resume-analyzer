import { create } from 'zustand';

interface AnalysisState {
  sessionId: string | null;
  resumeText: string | null;
  analysis: any | null;
  status: Record<string, 'idle' | 'loading' | 'done' | 'error'>;
  videoSession: any | null;
  setSession: (id: string) => void;
  setResumeText: (text: string) => void;
  setAnalysis: (analysis: any) => void;
  setStatus: (key: string, status: 'idle' | 'loading' | 'done' | 'error') => void;
  setVideoSession: (session: any) => void;
  reset: () => void;
}

export const useStore = create<AnalysisState>((set) => ({
  sessionId: null,
  resumeText: null,
  analysis: null,
  status: {},
  videoSession: null,
  setSession: (id) => set({ sessionId: id }),
  setResumeText: (text) => set({ resumeText: text }),
  setAnalysis: (analysis) => set({ analysis }),
  setStatus: (key, status) => set((state) => ({ status: { ...state.status, [key]: status } })),
  setVideoSession: (session) => set({ videoSession: session }),
  reset: () => set({ sessionId: null, resumeText: null, analysis: null, status: {}, videoSession: null }),
}));
