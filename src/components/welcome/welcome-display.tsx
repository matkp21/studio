// src/components/welcome/welcome-display.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
// Removed AnimatedTagline as we'll use a static one for simplicity here.
// The Logo component is not used here; we use the heart-ecg-icon web component directly.

// Web Component for Heart/ECG Icon (Internal SMIL animations)
const defineHeartECGIconWebComponent = () => {
  if (typeof window !== 'undefined' && !customElements.get('heart-ecg-icon')) {
    class HeartECGIcon extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        // Calculated length for points="16,32 24,32 28,40 36,24 40,32 48,32" is approx 39.6
        // However, the example used 68. If your SVG points are different, this needs recalculation.
        // For the specific path "16,32 24,32 28,40 36,24 40,32 48,32", a more precise calculation is needed.
        // Let's use a placeholder and assume it was calculated for *some* version.
        // For this example, if the points are exactly "16,32 24,32 28,40 36,24 40,32 48,32"
        // The segments are: 8, sqrt((4^2)+(8^2))=8.94, sqrt((8^2)+(-16^2))=17.88, sqrt((4^2)+(8^2))=8.94, 8. Total = 51.76
        const ecgPathLength = 52; // Approximate calculated length for the given points

        shadow.innerHTML = `
          <style>
            :host {
              display: inline-block;
              width: var(--heart-icon-splash-size, 120px); /* Default size */
              height: var(--heart-icon-splash-size, 120px);
            }
            svg {
              width: 100%;
              height: 100%;
              display: block;
              stroke-linecap: round;
              stroke-linejoin: round;
              overflow: visible;
            }
            .heart-path-splash {
              stroke: hsl(var(--heart-stroke-initial-h, 210), var(--heart-stroke-initial-s, 100%), var(--heart-stroke-initial-l, 70%));
              fill: hsla(var(--heart-stroke-initial-h, 210), var(--heart-stroke-initial-s, 100%), var(--heart-stroke-initial-l, 70%), 0.1); /* Very subtle fill */
              stroke-width: var(--heart-stroke-width, 2px);
            }
            .ecg-polyline-splash {
              stroke: hsl(var(--ecg-stroke-color-h, 180), var(--ecg-stroke-color-s, 100%), var(--ecg-stroke-color-l, 85%));
              fill: none;
              stroke-width: var(--ecg-stroke-width, 2px);
              stroke-dasharray: ${ecgPathLength};
              stroke-dashoffset: ${ecgPathLength};
            }
          </style>
          <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path class="heart-path-splash"
                  d="M32 60s24-13.3 24-34C56 17.9 49.1 12 40.5 12 35.2 12 32 16.5 32 16.5S28.8 12 23.5 12C14.9 12 8 17.9 8 26c0 20.7 24 34 24 34z">
              <animate attributeName="stroke"
                       values="hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l));
                               hsl(var(--heart-stroke-animated-h), var(--heart-stroke-animated-s), var(--heart-stroke-animated-l));
                               hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l))"
                       dur="2.5s" 
                       repeatCount="indefinite"/>
              <animateTransform attributeName="transform" type="scale" additive="sum"
                                values="0; 0.025; 0; -0.025; 0" dur="1.6s" begin="0s"
                                repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.25; 0.5; 0.75; 1"
                                keySplines="0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1" transform-origin="center"/>
            </path>
            <polyline id="ecgLineForAnimationWelcome" class="ecg-polyline-splash"
                      points="16,32 24,32 28,40 36,24 40,32 48,32">
              <animate attributeName="stroke-dashoffset" values="${ecgPathLength};0;${ecgPathLength}"
                       dur="2.2s" begin="0.3s" repeatCount="indefinite" />
            </polyline>
          </svg>
        `;
      }
    }
    customElements.define('heart-ecg-icon', HeartECGIcon);
  }
};

interface WelcomeDisplayProps {
  onDisplayComplete: () => void;
}

const WelcomeDisplay: React.FC<WelcomeDisplayProps> = ({ onDisplayComplete }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    defineHeartECGIconWebComponent();
    setHasMounted(true);

    const displayTimer = setTimeout(() => {
      onDisplayComplete();
    }, 4000); // Total duration for welcome screen

    return () => clearTimeout(displayTimer);
  }, [onDisplayComplete]);

  const screenVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5, delay: 0.3 } }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1], delay: 0.3 } // Custom ease for a smooth arrival
    }
  };

  const appNameVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.8 } // After logo
    }
  };
  
  const taglineVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut", delay: 1.2 } // After app name
    }
  };

  const continueHintVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 2.5, duration: 0.5 } }
  };

  return (
    <motion.div
      className="simple-welcome-screen" // New class for this version
      variants={screenVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onDisplayComplete} // Click anywhere to skip
    >
      {hasMounted && (
        <motion.div variants={logoVariants} className="mb-5 simple-welcome-logo-container">
          <heart-ecg-icon class="simple-welcome-heart-icon"></heart-ecg-icon>
        </motion.div>
      )}

      <motion.h1 
        variants={appNameVariants} 
        className="simple-welcome-appname text-4xl sm:text-5xl font-semibold animated-gradient-text"
      >
        MediAssistant
      </motion.h1>
      
      <motion.p 
        variants={taglineVariants} 
        className="simple-welcome-tagline text-md sm:text-lg text-muted-foreground"
      >
        Simply #Smart. Always <span className="emoji" role="img" aria-label="sparks brain">✨🧠</span>
      </motion.p>

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
