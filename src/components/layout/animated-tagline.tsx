// src/components/layout/animated-tagline.tsx
"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const smartWords = [
  "Smart", "Intelligent", "Caring", "Healing", "Diagnosing", "Supportive", "Better", "Helping"
];

interface AnimatedTaglineProps {
  className?: string;
}

export function AnimatedTagline({ className }: AnimatedTaglineProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % smartWords.length);
    }, 2500); // Change word every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("flex items-center justify-center text-sm sm:text-md text-foreground/80", className)}>
      <span className="mr-1.5">Simply</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={smartWords[currentWordIndex]}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="font-semibold firebase-gradient-text"
        >
          #{smartWords[currentWordIndex]}
        </motion.span>
      </AnimatePresence>
      <span className="ml-1.5">. Always ✨</span>
    </div>
  );
}