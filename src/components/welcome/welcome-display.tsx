
// src/components/welcome/welcome-display.tsx
"use client";

import type { CSSProperties } from 'react'; 
import { useEffect } from 'react';
import { motion } from 'framer-motion';
// import { Logo } from '@/components/logo'; // Logo component not used as per new HTML structure
import { AnimatedTagline } from '@/components/layout/animated-tagline';
import { cn } from '@/lib/utils';

interface WelcomeDisplayProps {
  onDisplayComplete: () => void;
}

export function WelcomeDisplay({ onDisplayComplete }: WelcomeDisplayProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDisplayComplete();
    }, 7000); // 7 seconds to appreciate visuals

    return () => clearTimeout(timer);
  }, [onDisplayComplete]);

  const logoContainerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        delay: 1.0, // Allow background to establish
        duration: 1.8, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    },
  };

  const textBlockVariants = {
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

  // The root div will now use the .event-splash-screen class for the complex background
  return (
    <motion.div
      className="event-splash-screen" // This class will apply the new Apple Event Poster static background
      initial={{ opacity: 0 }} // Simple fade-in for the whole screen
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 6 } }} // Start fade out before total duration
      onClick={onDisplayComplete} // Allow skip by clicking
    >
      <motion.div
        className="splash-logo-container" // New class for specific logo positioning
        variants={logoContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Heart/ECG SVG as provided in the prompt */}
        <svg className="heart-ecg-icon-splash" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 60s24-13.3 24-34C56 17.9 49.1 12 40.5 12 35.2 12 32 16.5 32 16.5S28.8 12 23.5 12C14.9 12 8 17.9 8 26c0 20.7 24 34 24 34z"
                  stroke="hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l))"
                  strokeWidth="3"
                  fill="none">
                <animate attributeName="stroke" 
                         values="hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l)); hsl(var(--heart-stroke-animated-h), var(--heart-stroke-animated-s), var(--heart-stroke-animated-l)); hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l))" 
                         dur="3s" 
                         repeatCount="indefinite"/>
            </path>
            <polyline id="ecgLineForAnimation" points="16,32 24,32 28,40 36,24 40,32 48,32"
                      stroke="hsl(var(--ecg-stroke-color-h), var(--ecg-stroke-color-s), var(--ecg-stroke-color-l))"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="68" /* Placeholder - get actual length via JS console */
                      strokeDashoffset="68">
                <animate attributeName="strokeDashoffset"
                         values="68;0;68" /* Placeholder - get actual length */
                         dur="2s"
                         begin="0.5s" 
                         repeatCount="indefinite" />
            </polyline>
        </svg>
      </motion.div>

      <motion.div
        className="splash-text-block" // New class for specific text positioning
        variants={textBlockVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="app-name-splash">MediAssistant</h1>
        {/* The AnimatedTagline component itself has internal animations for word cycling */}
        <AnimatedTagline className="tagline-splash" />
      </motion.div>
    </motion.div>
  );
}
