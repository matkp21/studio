
"use client";

import type { HTMLAttributes } from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterTextProps extends HTMLAttributes<HTMLParagraphElement> {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypewriterText({ text, speed = 50, onComplete, className, ...props }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset when text or onComplete handler changes to ensure re-animation
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text, onComplete]); // Added onComplete to dependencies

  useEffect(() => {
    if (!text) return; // Guard against empty or null text early

    if (currentIndex < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    } else if (currentIndex === text.length && text.length > 0) {
      // Ensure onComplete is called only once after text is fully displayed
      if (displayedText === text) {
        onComplete?.();
      }
    }
  }, [currentIndex, text, speed, onComplete, displayedText]);

  return <p className={cn("text-sm whitespace-pre-wrap", className)} {...props}>{displayedText}</p>;
}
