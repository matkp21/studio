// src/components/welcome/welcome-display.tsx
"use client";

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
    }, 3500); // Display for 3.5 seconds

    return () => clearTimeout(timer);
  }, [onDisplayComplete]);

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden welcome-background-animated",
        "welcome-display-readable-text" // Added class for specific text styling
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 100 }}
        className="mb-8" // Wrapper for Logo
      >
        <Logo simple={false} />
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.9, ease: "circOut" }}
        className="text-center apply-text-shadow-to-children" // Added class for text shadow on static tagline parts
      >
        {/* The !text-white ensures static parts are white, apply-text-shadow-to-children adds shadow */}
        <AnimatedTagline className="text-2xl sm:text-3xl md:text-4xl !text-white" />
      </motion.div>
    </motion.div>
  );
}
