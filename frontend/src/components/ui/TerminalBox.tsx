import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TerminalBoxProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export default function TerminalBox({ text, speed = 30, className, onComplete }: TerminalBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div className={`font-mono text-[13px] bg-brand-card p-4 border border-brand-divider rounded-lg ${className}`}>
      <span className="text-brand-ink">{displayedText}</span>
      {!isComplete && (
        <motion.span 
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-brand-primary ml-1 align-middle"
        />
      )}
    </div>
  );
}
