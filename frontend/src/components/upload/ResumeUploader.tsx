import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import LimeButton from '../ui/LimeButton';
import ProgressBar from '../ui/ProgressBar';

interface ResumeUploaderProps {
  onUpload: (file: File) => void;
}

export default function ResumeUploader({ onUpload }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const droppedFile = files[0];
      const ext = droppedFile.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf' || ext === 'docx') {
        setFile(droppedFile);
        onUpload(droppedFile);
      } else {
        alert("Please upload only .pdf or .docx files.");
      }
    }
  }, [onUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onUpload(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative group border-2 border-dashed border-brand-divider bg-brand-card rounded-xl p-12 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer",
          isDragging && "border-brand-primary bg-[var(--color-brand-primary-glow)] scale-[1.02]",
          file && "border-brand-primary/50"
        )}
      >
        <input 
          type="file" 
          onChange={handleChange}
          accept=".pdf,.docx"
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {!file ? (
          <>
            <div className="mb-4 p-4 rounded-full bg-brand-bg border border-brand-divider group-hover:border-brand-primary transition-colors">
              <Upload className="w-8 h-8 text-brand-muted group-hover:text-brand-primary transition-colors" />
            </div>
            <h3 className="font-heading text-xl text-brand-ink mb-2">Drop your resume here</h3>
            <p className="text-brand-muted text-sm font-sans">PDF or DOCX only. Max 10MB.</p>
          </>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="mb-4 p-4 rounded-full bg-brand-bg border border-brand-primary">
              <FileText className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="font-heading text-xl text-brand-ink mb-1 truncate max-w-full px-4">{file.name}</h3>
            <p className="text-brand-muted text-xs font-mono mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            
            <div className="w-full max-w-[200px] mb-2">
              <ProgressBar percent={100} color="lime" />
            </div>
            <div className="flex items-center gap-1 text-[10px] text-brand-primary font-mono uppercase">
              <CheckCircle2 size={12} /> Ready for analysis
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="absolute top-4 right-4 p-2 text-brand-muted hover:text-brand-tertiary transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
