
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
    }, 7000); // Increased duration to 7 seconds

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
    hidden: { opacity: 0, scale: 0.85, y: 20 }, // Start slightly smaller and lower
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        delay: 1.0, // Delay to allow background to establish
        duration: 1.5, 
        ease: [0.22, 1, 0.36, 1] // Smooth, slightly anticipatory easing
      } 
    },
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        delay: 2.5, // Appear after logo is well-established
        duration: 1.0, 
        ease: "easeOut" 
      }
    },
  };

  return (
    <motion.div
      className={cn(
        "apple-event-splash-screen" // Applies the complex background animation
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onDisplayComplete} // Click anywhere to skip/complete
    >
      <motion.div
        variants={logoVariants}
        className="mb-6 md:mb-8 transform-gpu" 
      >
        {/* Apply specific styling for the logo on this screen if needed, e.g., forcing white color */}
        <div className="scale-[1.5] sm:scale-[1.8] md:scale-[2.0] text-white"> 
          {/* Text color forced to white, might need adjustment if logo SVG has internal colors */}
          <Logo simple={false} className="[&_span]:text-white [&_svg]:text-white" /> 
        </div>
      </motion.div>

      <motion.div
        variants={taglineVariants}
        className="text-center absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full px-4" // Positioning at bottom
      >
        {/* Tagline color also forced to white for contrast */}
        <AnimatedTagline className="text-lg sm:text-xl md:text-2xl text-white/90 drop-shadow-md" />
      </motion.div>
    </motion.div>
  );
}
