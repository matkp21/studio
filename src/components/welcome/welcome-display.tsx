
// src/components/welcome/welcome-display.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { AnimatedTagline } from '@/components/layout/animated-tagline';
// import { Logo } from '@/components/logo'; // Logo component is not used in this simple version

// Simpler Animated Heart Icon for "Elegant Reveal"
const SimpleAnimatedHeartIcon = () => {
  return (
    <svg
      className="simple-welcome-heart-icon" // This class will control size via globals.css
      viewBox="0 0 64 58" // Adjusted viewBox for a more typical heart shape
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 55.74C31.28 55.47 1.5 34.82 1.5 20.48C1.5 10.13 10.08 2.26 20.25 2.26C27.19 2.26 32 7.49 32 7.49S36.81 2.26 43.75 2.26C53.92 2.26 62.5 10.13 62.5 20.48C62.5 34.82 32.72 55.47 32 55.74Z"
        fill="hsl(var(--simple-heart-fill-h, 205), var(--simple-heart-fill-s, 90%), var(--simple-heart-fill-l, 70%))"
        stroke="hsl(var(--simple-heart-fill-h, 205), var(--simple-heart-fill-s, 80%), calc(var(--simple-heart-fill-l, 70%) - 10%))" // Slightly darker stroke
        strokeWidth="1.5" // Thinner stroke for a cleaner look
      >
        {/* Breathing animation for fill opacity */}
        <animate
          attributeName="fill-opacity"
          values="0.7; 1; 0.7"
          dur="2.2s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0; 0.5; 1"
          keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
        />
        {/* Subtle scale pulse for heartbeat effect */}
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1; 1.05; 1" // Increased scale for more visible pulse
          dur="1.6s" // Slightly faster, more heartbeat-like
          repeatCount="indefinite"
          additive="sum" // Ensures scaling is from the center of the path's own coordinate system
          calcMode="spline"
          keyTimes="0; 0.3; 1" // Quicker peak
          keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
          transform-origin="center"
        />
      </path>
    </svg>
  );
};


interface WelcomeDisplayProps {
  onDisplayComplete: () => void;
}

const WelcomeDisplay: React.FC<WelcomeDisplayProps> = ({ onDisplayComplete }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const displayTimer = setTimeout(() => {
      onDisplayComplete();
    }, 4500); // Total duration of the welcome screen

    return () => clearTimeout(displayTimer);
  }, [onDisplayComplete]);


  if (!hasMounted) {
    // Fallback for SSR or before mount to prevent hydration issues with framer-motion
    // Applying basic styles inline to avoid className issues pre-hydration
    return (
      <div
        className="simple-welcome-screen"
        style={{ opacity: 0 }}
        onClick={onDisplayComplete} // Allow click to skip even if JS for animation hasn't run
      >
        {/* Optionally, a very simple static version of the logo or app name here */}
      </div>
    );
  }

  // Framer Motion Variants
  const screenVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.5, delay: 0.3,  ease: "easeInOut" } }
  };

  const logoContainerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.3 }
    }
  };

  const appNameVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.8 }
    }
  };

  const taglineContainerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: 1.2 }
    }
  };

  const continueHintVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { delay: 2.5, duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div
      className="simple-welcome-screen"
      variants={screenVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onDisplayComplete} // Click anywhere to skip
    >
      <motion.div variants={logoContainerVariants} className="simple-welcome-logo-container">
        <SimpleAnimatedHeartIcon />
      </motion.div>

      <motion.h1
        variants={appNameVariants}
        className="simple-welcome-appname firebase-gradient-text"
      >
        MediAssistant
      </motion.h1>

      <motion.div variants={taglineContainerVariants}>
        <AnimatedTagline className="simple-welcome-tagline" />
      </motion.div>

      <motion.div
        variants={continueHintVariants}
        className="absolute bottom-8 text-xs text-muted-foreground/80 flex items-center gap-1 z-20"
      >
        Tap to continue <ArrowRight size={14} />
      </motion.div>
    </motion.div>
  );
};

export default WelcomeDisplay; // Added default export
