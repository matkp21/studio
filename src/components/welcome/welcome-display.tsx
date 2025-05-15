
// src/components/welcome/welcome-display.tsx
"use client";

import type { CSSProperties } from 'react'; 
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
    }, 7000); // Extended to 7 seconds

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
      transition: { duration: 0.5, delay: 6.5, ease: "easeInOut" } 
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        delay: 1.0, // Delay for background to establish
        duration: 1.8, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    },
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        delay: 2.5, // Appear after logo
        duration: 1.2, 
        ease: "easeOut" 
      }
    },
  };

  return (
    <motion.div
      className={cn(
        "apple-event-splash-screen" 
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onDisplayComplete} 
    >
      <motion.div
        variants={logoVariants}
        className="mb-6 md:mb-8 transform-gpu" 
      >
        <div className="scale-[1.6] sm:scale-[1.9] md:scale-[2.2]"> 
           {/* Force white text/icons for the logo on this dark, vibrant background */}
          <Logo simple={false} className="[&_span]:text-white [&_svg]:text-white" />
        </div>
      </motion.div>

      <motion.div
        variants={taglineVariants}
        className="text-center absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full px-4" // Positioned lower
      >
        <AnimatedTagline className="text-lg sm:text-xl md:text-2xl text-slate-100/90 drop-shadow-lg" /> {/* Ensure good contrast */}
      </motion.div>
    </motion.div>
  );
}
