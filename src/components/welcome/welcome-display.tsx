// src/components/welcome/welcome-display.tsx
"use client";

import type { CSSProperties } from 'react'; // Ensure CSSProperties is imported
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/logo';
import { AnimatedTagline } from '@/components/layout/animated-tagline';
import { cn } from '@/lib/utils';

interface WelcomeDisplayProps {
  onDisplayComplete: () => void;
}

export function WelcomeDisplay({ onDisplayComplete }: WelcomeDisplayProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDisplayComplete();
    }, 4500); // Total display time

    return () => clearTimeout(timer);
  }, [onDisplayComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" }
    },
    exit: { 
      opacity: 0, 
      transition: { duration: 0.5, delay: 4.0, ease: "easeInOut" } 
    }
  };

  // Adjusted delays: Logo starts animating after ~0.5s of background "reveal"
  // Tagline starts after logo is mostly visible and background is settling
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.90, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        delay: 0.75, // Delayed to appear on the evolving background
        duration: 1.2, 
        ease: [0.33, 1, 0.68, 1] 
      } 
    },
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        delay: 1.8, // Further delayed to appear after logo and background settles
        duration: 0.8, 
        ease: "easeOut" 
      }
    },
  };

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden",
        "welcome-screen-gradient" // This class now handles the multi-stage gradient animation
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        variants={logoVariants}
        className="mb-6 md:mb-8 transform-gpu" 
      >
        <div className="scale-[1.4] sm:scale-[1.6] md:scale-[1.8]"> 
          <Logo simple={false} /> 
        </div>
      </motion.div>

      <motion.div
        variants={taglineVariants}
        className="text-center"
      >
        <AnimatedTagline className="text-xl sm:text-2xl md:text-3xl text-foreground/90 dark:text-foreground/80" />
      </motion.div>
    </motion.div>
  );
}
