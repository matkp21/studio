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
    }, 3500); // Total display time for the welcome screen

    return () => clearTimeout(timer);
  }, [onDisplayComplete]);

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: [0.42, 0, 0.58, 1] } // Smoother ease-out like
    },
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    },
  };

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden",
        "bg-background dark:bg-background", // Use theme background for consistency
        "text-foreground dark:text-foreground" 
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Logo with increased size and subtle animation */}
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        className="mb-6 transform-gpu" // Added transform-gpu for potentially smoother scaling
      >
        {/* Apply scaling via CSS or by adjusting Logo's internal simple prop, or wrapper if Logo doesn't support direct scaling easily */}
        <div className="scale-[1.3]"> {/* Increased logo size; adjust scale factor as needed */}
          <Logo simple={false} /> {/* simple={false} usually means larger version of logo */}
        </div>
      </motion.div>

      {/* Animated Tagline with delayed appearance */}
      <motion.div
        variants={taglineVariants}
        initial="hidden"
        animate="visible"
        // Delay tagline animation to start after logo animation + a brief pause
        // Logo animation is 1s. Pause of 0.3s. So, delay is 1.3s.
        transition={{ delay: 1.3, duration: 0.7, ease: "easeOut" }} 
        className="text-center"
      >
        <AnimatedTagline className="text-2xl sm:text-3xl md:text-4xl" />
      </motion.div>
    </motion.div>
  );
}

