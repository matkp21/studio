// src/components/layout/animated-tagline.tsx
"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react'; // Changed from Sparkles, Brain, Lightbulb, Telescope

const smartWords = [
  "Smart", "Intelligent", "Caring", "Healing", "Diagnosing", "Supportive", "Better", "Helping", "Insightful", "Efficient", "Constructive", "Decisive"
];

interface AnimatedTaglineProps {
  className?: string;
}

export function AnimatedTagline({ className }: AnimatedTaglineProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % smartWords.length);
    }, 2500); // Change word every 2.5 seconds

    return () => {
      clearInterval(wordInterval);
    };
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
      <span className="ml-1.5">. Always</span>
      <motion.div
        key="heart-icon" // Ensure key for AnimatePresence if it were to change, though here it's static
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4, type: "spring", stiffness: 200, damping: 15 }}
        className="ml-1.5 inline-block"
      >
        <Heart className="h-4 w-4 text-primary animate-heart-pulse-subtle" />
      </motion.div>
    </div>
  );
}
