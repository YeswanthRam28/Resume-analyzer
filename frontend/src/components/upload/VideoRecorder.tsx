import React, { useState, useRef, useCallback } from 'react';
import { Camera, StopCircle, Play, RotateCcw, Upload, Video as VideoIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import LimeButton from '../ui/LimeButton';
import ProgressBar from '../ui/ProgressBar';

interface VideoRecorderProps {
  onUpload: (file: File) => void;
}

export default function VideoRecorder({ onUpload }: VideoRecorderProps) {
  const [mode, setMode] = useState<'record' | 'upload'>('record');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        setRecordedBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error accessing camera", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (stream) stream.getTracks().forEach(track => track.stop());
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  const handleReset = () => {
    setRecordedBlob(null);
    setTimeLeft(180);
  };

  const handleSubmit = () => {
    if (recordedBlob) {
      const file = new File([recordedBlob], "recording.mp4", { type: 'video/mp4' });
      onUpload(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex bg-brand-card p-1 rounded-lg border border-brand-divider">
        <button 
          onClick={() => setMode('record')}
          className={cn("flex-1 py-2 text-xs font-mono uppercase rounded transition-all", mode === 'record' ? "bg-brand-primary text-brand-bg" : "text-brand-muted hover:text-brand-ink")}
        >
          Record
        </button>
        <button 
          onClick={() => setMode('upload')}
          className={cn("flex-1 py-2 text-xs font-mono uppercase rounded transition-all", mode === 'upload' ? "bg-brand-primary text-brand-bg" : "text-brand-muted hover:text-brand-ink")}
        >
          Upload
        </button>
      </div>

      <div className="bg-brand-card border border-brand-divider rounded-xl overflow-hidden aspect-video relative flex flex-col items-center justify-center">
        {mode === 'record' ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className={cn("w-full h-full object-cover", !isRecording && !recordedBlob && "hidden")}
            />
            
            {!isRecording && !recordedBlob && (
              <div className="text-center p-8">
                <Camera size={48} className="text-brand-ghost mx-auto mb-4" />
                <h3 className="font-heading text-xl text-brand-ink mb-2">Ready to record?</h3>
                <p className="text-sm text-brand-muted max-w-xs mx-auto mb-6">Position yourself in good lighting and look directly at the camera.</p>
                <LimeButton onClick={startRecording}>Enable Camera</LimeButton>
              </div>
            )}

            {isRecording && (
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-tertiary rounded-full animate-pulse" />
                <span className="font-mono text-xl text-white shadow-sm">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}

            {!isRecording && recordedBlob && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-8">
                <VideoIcon size={48} className="text-brand-primary mb-4" />
                <h3 className="font-heading text-xl text-brand-ink mb-6">Recording Complete</h3>
                <div className="flex gap-4">
                  <LimeButton variant="ghost" onClick={handleReset}><RotateCcw size={16} className="mr-2" /> Redo</LimeButton>
                  <LimeButton onClick={handleSubmit}>Analyze Video →</LimeButton>
                </div>
              </div>
            )}

            {isRecording && (
              <button 
                onClick={stopRecording}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 p-4 bg-brand-tertiary text-white rounded-full hover:scale-110 transition-all shadow-[0_0_20px_rgba(255,107,53,0.3)]"
              >
                <StopCircle size={32} />
              </button>
            )}
          </>
        ) : (
          <div className="p-12 text-center w-full h-full flex flex-col items-center justify-center">
            <Upload size={48} className="text-brand-ghost mb-4" />
            <h3 className="font-heading text-xl text-brand-ink mb-2">Upload Video Resume</h3>
            <p className="text-sm text-brand-muted mb-8">MP4, MOV, or WEBM. Max 100MB.</p>
            <input 
              type="file" 
              accept="video/*" 
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <LimeButton variant="ghost">Select File</LimeButton>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-brand-bg border border-brand-divider rounded-lg">
          <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1 font-mono">Lighting</p>
          <p className="text-xs text-brand-ink">Bright & even face lighting is best.</p>
        </div>
        <div className="p-4 bg-brand-bg border border-brand-divider rounded-lg">
          <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1 font-mono">Audio</p>
          <p className="text-xs text-brand-ink">Minimize background noise.</p>
        </div>
        <div className="p-4 bg-brand-bg border border-brand-divider rounded-lg">
          <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1 font-mono">Framing</p>
          <p className="text-xs text-brand-ink">Centered, eye-level camera.</p>
        </div>
      </div>
    </div>
  );
}
