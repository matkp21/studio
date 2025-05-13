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
    }, 4500); // Total display time: Logo (1.5s) + Pause (0.5s) + Tagline (2s) + FadeOut buffer(0.5s)

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
      transition: { duration: 0.5, delay: 4.0, ease: "easeInOut" } // Start fade out slightly before total duration
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.90, y: 10 }, // Start slightly smaller and lower
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 1.2, // Slightly longer for a graceful entrance
        ease: [0.33, 1, 0.68, 1] // Custom ease-out cubic bezier for Apple-like feel
      } 
    },
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        delay: 1.3, // Start after logo (1.2s) + small pause (0.1s)
        duration: 0.8, 
        ease: "easeOut" 
      }
    },
  };

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden",
        "welcome-screen-gradient" // Apply new gradient class
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        variants={logoVariants}
        className="mb-6 md:mb-8 transform-gpu" // transform-gpu can improve animation smoothness
      >
        {/* Larger logo: Adjust scale directly or ensure Logo component handles 'simple={false}' correctly for size */}
        <div className="scale-[1.4] sm:scale-[1.6] md:scale-[1.8]"> {/* Increased logo size */}
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