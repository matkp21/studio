// src/components/welcome/welcome-display.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { AnimatedTagline } from '@/components/layout/animated-tagline';

interface WelcomeDisplayProps {
  onDisplayComplete: () => void;
}

const WelcomeDisplay: React.FC<WelcomeDisplayProps> = ({ onDisplayComplete }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const displayTimer = setTimeout(() => {
      onDisplayComplete();
    }, 4500); // Adjusted duration

    return () => clearTimeout(displayTimer);
  }, [onDisplayComplete]);

  // Framer Motion Variants
  const screenVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5, delay: 0.3 } }
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

  const taglineVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: 1.2 }
    }
  };

  const continueHintVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { delay: 2.5, duration: 0.5 } }
  };

  // New refined SVG icon with SMIL animations
  const NewAnimatedHeartIcon = () => (
    <svg
      className="simple-welcome-heart-icon"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        .simple-welcome-heart-icon {
          width: var(--heart-icon-splash-size, clamp(100px, 18vw, 150px)); /* Responsive size */
          height: auto;
          filter: drop-shadow(0 2px 8px hsla(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l), 0.3));
        }
        .heart-path-simple {
          stroke: hsl(var(--heart-stroke-initial-h, 205), var(--heart-stroke-initial-s, 85%), var(--heart-stroke-initial-l, 60%));
          stroke-width: var(--heart-stroke-width, 2px); /* Corrected from 2.5px to 2px */
          fill: hsla(var(--heart-stroke-initial-h, 205), var(--heart-stroke-initial-s, 85%), var(--heart-stroke-initial-l, 60%), 0.1);
        }
        .ecg-path-simple {
          stroke: hsl(var(--ecg-stroke-color-h, 205), var(--ecg-stroke-color-s, 90%), var(--ecg-stroke-color-l, 65%));
          stroke-width: var(--ecg-stroke-width, 2px); /* Corrected from 3px to 2px */
          fill: none;
          stroke-dasharray: 50; /* Approximate length of the new ECG path. ADJUST THIS! */
          stroke-dashoffset: 50;
        }
      `}</style>
      {/* Heart Shape */}
      <path
        className="heart-path-simple"
        d="M32 52.7C16 40 8 30 8 21.3 8 15.1 13.1 10 19.3 10c4.8 0 8.5 2.8 11.2 6.1L32 18.2l1.5-2.1c2.7-3.3 6.4-6.1 11.2-6.1 6.2 0 11.3 5.1 11.3 11.3 0 8.7-8 18.7-24 31.4z"
      >
        {/* Subtle pulse animation for the heart scale */}
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1; 1.03; 1" // Slightly more subtle scale
          dur="1.8s"
          repeatCount="indefinite"
          additive="sum"
          calcMode="spline"
          keyTimes="0; 0.5; 1"
          keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
          // Removed transform-origin="center"
        />
         <animate attributeName="stroke"
             values="hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l));
                     hsl(var(--heart-stroke-animated-h), var(--heart-stroke-animated-s), var(--heart-stroke-animated-l));
                     hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l))"
             dur="3s"
             repeatCount="indefinite"/>
      </path>
      {/* Simplified Single ECG Wave */}
      <path
        className="ecg-path-simple"
        d="M18 32 H 25 L 30 26 L 34 38 L 39 32 H 46" // Simpler ECG path
      >
        <animate
          attributeName="stroke-dashoffset"
          values="50;0;50" /* Replace 50 with actual calculated length */
          dur="2.2s"
          begin="0.3s"
          repeatCount="indefinite"
          keyTimes="0; 0.5; 1" // Draw, hold briefly, reset
          calcMode="linear"
        />
        <animate
          attributeName="stroke"
          values="hsl(var(--ecg-stroke-color-h), var(--ecg-stroke-color-s), var(--ecg-stroke-color-l)); hsl(var(--heart-stroke-animated-h), var(--heart-stroke-animated-s), var(--heart-stroke-animated-l)); hsl(var(--ecg-stroke-color-h), var(--ecg-stroke-color-s), var(--ecg-stroke-color-l))"
          dur="2.2s"
          begin="0.3s"
          repeatCount="indefinite" />
      </path>
    </svg>
  );


  return (
    <motion.div
      className="simple-welcome-screen" // Re-styled for "Elegant Reveal"
      variants={screenVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onDisplayComplete} // Click anywhere to skip
    >
      {hasMounted && (
        <motion.div variants={logoContainerVariants} className="simple-welcome-logo-container">
          <NewAnimatedHeartIcon />
        </motion.div>
      )}

      <motion.h1
        variants={appNameVariants}
        className="simple-welcome-appname animated-gradient-text"
      >
        MediAssistant
      </motion.h1>

      {hasMounted && (
        <motion.div variants={taglineVariants}>
          <AnimatedTagline className="simple-welcome-tagline" />
        </motion.div>
      )}

      <motion.div
        variants={continueHintVariants}
        className="absolute bottom-8 text-xs text-muted-foreground/80 flex items-center gap-1 z-20"
      >
        Tap to continue <ArrowRight size={14} />
      </motion.div>
    </motion.div>
  );
};

export default WelcomeDisplay;
