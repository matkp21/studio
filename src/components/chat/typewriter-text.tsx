
"use client";

import type { HTMLAttributes } from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterTextProps extends HTMLAttributes<HTMLParagraphElement> {
  text: string;
  speed?: number; // Speed now means delay between words/whitespace segments
  onComplete?: () => void;
}

export function TypewriterText({ text, speed = 150, onComplete, className, ...props }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Reset when text prop changes
    setDisplayedText('');
    setCurrentWordIndex(0);
    setIsCompleted(false);
    if (text) {
      // Split by whitespace (including newlines) while keeping the delimiters
      // This treats words and whitespace blocks (spaces, newlines) as items to animate.
      // filter(Boolean) removes any empty strings that might result from split.
      setWords(text.split(/(\s+)/).filter(Boolean));
    } else {
      setWords([]);
    }
  }, [text]);

  useEffect(() => {
    if (isCompleted) return;

    if (words.length === 0) {
      // If there are no words (e.g., empty or null text prop), call onComplete.
      if (!isCompleted && (text === '' || text === null)) {
        onComplete?.();
        setIsCompleted(true);
      }
      return;
    }

    if (currentWordIndex < words.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + words[currentWordIndex]);
        setCurrentWordIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    } else if (currentWordIndex === words.length && !isCompleted) {
      // All words/segments have been appended
      onComplete?.();
      setIsCompleted(true);
    }
  }, [currentWordIndex, words, speed, onComplete, text, isCompleted, displayedText]);

  return <p className={cn("text-sm whitespace-pre-wrap", className)} {...props}>{displayedText}</p>;
}

