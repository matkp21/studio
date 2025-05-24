// src/components/welcome/welcome-display.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { AnimatedTagline } from '@/components/layout/animated-tagline'; // Using AnimatedTagline for the tagline

interface WelcomeDisplayProps {
  onDisplayComplete: () => void;
}

// New simpler animated heart icon based on the provided image
const NewAnimatedHeartIcon = () => {
  // IMPORTANT: You need to calculate the actual path length of the .ecg-path-simple polyline
  // and replace the '50' in stroke-dasharray and the animate values below.
  // To do this:
  // 1. Temporarily render this SVG in a browser.
  // 2. Open developer tools, inspect the <polyline class="ecg-path-simple"> element.
  // 3. In the console, type: $0.getTotalLength() (where $0 is the selected element).
  // 4. Use the returned value to replace '50'.
  const ecgPathLength = 50; // Placeholder - UPDATE THIS!

  return (
    <svg
      className="simple-welcome-heart-icon" // Class for sizing and external CSS animations if any
      viewBox="0 0 64 64" // Adjusted viewBox if needed for the new icon proportions
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        .simple-welcome-heart-icon {
          width: var(--heart-icon-splash-size, clamp(100px, 18vw, 150px));
          height: auto;
          filter: drop-shadow(0 2px 8px hsla(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l), 0.3));
        }
        .heart-path-simple {
          stroke-width: var(--heart-stroke-width, 2px);
          fill: hsla(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l), 0.05); /* Very subtle fill */
        }
        .ecg-path-simple {
          stroke-width: var(--ecg-stroke-width, 2px);
          fill: none;
          stroke-dasharray: ${ecgPathLength};
          stroke-dashoffset: ${ecgPathLength};
        }
      `}</style>
      {/* Heart Shape - Simplified to match image */}
      <path
        className="heart-path-simple"
        d="M32 10 C18 10 10 18 10 26 C10 38 32 52 32 52 C32 52 54 38 54 26 C54 18 46 10 32 10 Z" // Standard heart shape, adjust if needed
      >
        <animate
          attributeName="stroke"
          values="hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l)); hsl(var(--heart-stroke-animated-h), var(--heart-stroke-animated-s), var(--heart-stroke-animated-l)); hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l))"
          dur="2.5s" // Slower color pulse
          repeatCount="indefinite" />
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1; 1.03; 1" // Subtle scale pulse
          dur="1.8s"
          repeatCount="indefinite"
          additive="sum"
          calcMode="spline"
          keyTimes="0; 0.5; 1"
          keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
        />
      </path>
      {/* Simplified Single ECG Wave - Centered horizontally, adjust Y for vertical placement */}
      <polyline
        className="ecg-path-simple"
        points="20,33 26,33 30,28 34,38 38,33 44,33" // Example points for a simpler wave
        stroke="hsl(var(--ecg-stroke-color-h), var(--ecg-stroke-color-s), var(--ecg-stroke-color-l))"
      >
        <animate
          attributeName="stroke-dashoffset"
          values={`${ecgPathLength};0;${ecgPathLength}`}
          dur="2.2s"
          begin="0.3s"
          repeatCount="indefinite"
          keyTimes="0; 0.5; 1"
          calcMode="linear"
        />
         <animate attributeName="stroke"
             values="hsl(var(--ecg-stroke-color-h), var(--ecg-stroke-color-s), var(--ecg-stroke-color-l)); hsl(var(--heart-stroke-animated-h), var(--heart-stroke-animated-s), var(--heart-stroke-animated-l)); hsl(var(--ecg-stroke-color-h), var(--ecg-stroke-color-s), var(--ecg-stroke-color-l))"
             dur="2.5s"
             begin="0.3s"
             repeatCount="indefinite" />
      </polyline>
    </svg>
  );
};


const WelcomeDisplay: React.FC<WelcomeDisplayProps> = ({ onDisplayComplete }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const displayTimer = setTimeout(() => {
      onDisplayComplete();
    }, 4500); // Duration of the welcome screen

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

  const taglineContainerVariants = { // Renamed from taglineVariants for clarity
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

  if (!hasMounted) {
    // Render nothing or a very simple placeholder on the server and initial client render
    // to avoid hydration issues with the Web Component or complex animations.
    return <div className="simple-welcome-screen" style={{ opacity: 0 }} onClick={onDisplayComplete}></div>;
  }

  return (
    <motion.div
      className="simple-welcome-screen" // Styled for "Elegant Reveal"
      variants={screenVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onDisplayComplete} // Click anywhere to skip
    >
      <motion.div variants={logoContainerVariants} className="simple-welcome-logo-container">
        <NewAnimatedHeartIcon />
      </motion.div>

      <motion.h1
        variants={appNameVariants}
        className="simple-welcome-appname animated-gradient-text" // Retained gradient for app name
      >
        MediAssistant
      </motion.h1>

      {/* AnimatedTagline component for the tagline */}
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

export default WelcomeDisplay;
