// src/components/layout/animated-tagline.tsx
"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const smartWords = [
  "Smart", "Intelligent", "Caring", "Healing", "Diagnosing", "Supportive", "Better", "Helping", "Insightful", "Efficient", "Constructive", "Decisive"
];

interface AnimatedTaglineProps {
  className?: string;
}

export function AnimatedTagline({ className }: AnimatedTaglineProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentEmoji, setCurrentEmoji] = useState("✨");
  const emojis = ["✨", "🧠", "💡", "🚀"]; // Example emojis to cycle through

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % smartWords.length);
    }, 2500); // Change word every 2.5 seconds

    const emojiInterval = setInterval(() => {
      setCurrentEmoji(prevEmoji => {
        const currentIndex = emojis.indexOf(prevEmoji);
        return emojis[(currentIndex + 1) % emojis.length];
      });
    }, 1250); // Change emoji slightly faster

    return () => {
      clearInterval(wordInterval);
      clearInterval(emojiInterval);
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
          className="font-semibold firebase-gradient-text" // Apply Firebase gradient here
        >
          #{smartWords[currentWordIndex]}
        </motion.span>
      </AnimatePresence>
      <span className="ml-1.5">. Always</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentEmoji}
          initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 15 }}
          className="ml-1.5 inline-block"
        >
          {currentEmoji}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}