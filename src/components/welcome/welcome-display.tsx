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
        "fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden",
        "bg-gray-100 dark:bg-gray-900", // Apple-inspired clean background
        "text-gray-800 dark:text-gray-100" // Ensuring text contrast
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }} // Gentle slide from top
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} // Smoother, Apple-like ease
        className="mb-8" 
      >
        <Logo simple={false} />
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }} // Gentle slide from bottom
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} // Smoother, Apple-like ease
        className="text-center"
      >
        {/* AnimatedTagline uses gradient text; kept as per prior requests for dynamic elements */}
        <AnimatedTagline className="text-2xl sm:text-3xl md:text-4xl" />
      </motion.div>
    </motion.div>
  );
}
