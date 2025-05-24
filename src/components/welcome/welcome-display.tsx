// src/components/welcome/welcome-display.tsx
"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
// Removed AnimatedTagline import as it's no longer used here

// Web Component for Heart/ECG Icon (Internal SMIL animations)
const defineHeartECGIconWebComponent = () => {
  if (typeof window !== 'undefined' && !customElements.get('heart-ecg-icon')) {
    class HeartECGIcon extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const ecgPathLength = 68; 

        shadow.innerHTML = `
          <style>
            :host {
              display: inline-block;
              width: var(--heart-icon-splash-size, 120px);
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
              stroke: hsl(var(--heart-stroke-initial-h, 200), var(--heart-stroke-initial-s, 100%), var(--heart-stroke-initial-l, 85%));
              fill: none;
              stroke-width: var(--heart-stroke-width, 2px);
            }
            .ecg-polyline-splash {
              stroke: hsl(var(--ecg-stroke-color-h, 180), var(--ecg-stroke-color-s, 100%), var(--ecg-stroke-color-l, 90%));
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
                       dur="3s"
                       repeatCount="indefinite"/>
              <animateTransform attributeName="transform" type="scale" additive="sum"
                                values="0; 0.02; 0; -0.02; 0" dur="1.8s" begin="0s"
                                repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.25; 0.5; 0.75; 1"
                                keySplines="0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1" transform-origin="center"/>
            </path>
            <polyline id="ecgLineForAnimationWelcome" class="ecg-polyline-splash"
                      points="16,32 24,32 28,40 36,24 40,32 48,32">
              <animate attributeName="stroke-dashoffset" values="${ecgPathLength};0;${ecgPathLength}"
                       dur="2.5s" begin="0.3s" repeatCount="indefinite" />
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

const numFlowParticles = 35; // Number of flowing particles
const numLogoParticles = 20; // Number of particles for logo morph

const WelcomeDisplay: React.FC<WelcomeDisplayProps> = ({ onDisplayComplete }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [flowParticleProps, setFlowParticleProps] = useState<any[]>([]);
  const [logoParticleProps, setLogoParticleProps] = useState<any[]>([]);
  const [showActualLogo, setShowActualLogo] = useState(false);
  const [showAppName, setShowAppName] = useState(false);

  useEffect(() => {
    defineHeartECGIconWebComponent();
    setHasMounted(true);

    const logoMorphTimer = setTimeout(() => {
      setShowActualLogo(true);
    }, 1500); // Time for logo particles to converge

    const appNameTimer = setTimeout(() => {
      setShowAppName(true);
    }, 2200); // App name appears after logo

    const displayTimer = setTimeout(() => {
      onDisplayComplete();
    }, 4500); // Shorter duration now

    return () => {
      clearTimeout(logoMorphTimer);
      clearTimeout(appNameTimer);
      clearTimeout(displayTimer);
    };
  }, [onDisplayComplete]);

  useEffect(() => {
    if (hasMounted) {
      // Flowing particles
      const generatedFlowProps = [...Array(numFlowParticles)].map((_, i) => {
        const duration = Math.random() * 6 + 7; // 7-13 seconds duration
        const initialY = Math.random() * 100;
        const initialX = Math.random() * 100;
        return {
          id: `flow-particle-${i}`,
          initial: { x: `${initialX}vw`, y: `${initialY}vh`, opacity: 0, scale: Math.random() * 0.5 + 0.2 },
          animate: {
            x: [`${initialX}vw`, `${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
            y: [`${initialY}vh`, `${(initialY + 20 + Math.random() * 40) % 100}vh`, `${(initialY + 60 + Math.random() * 40) % 100}vh`],
            opacity: [0, Math.random() * 0.4 + 0.2, 0],
            scale: [Math.random() * 0.5 + 0.2, Math.random() * 0.8 + 0.3, Math.random() * 0.5 + 0.2],
          },
          transition: { duration: duration, repeat: Infinity, repeatType: "loop", ease: "linear", delay: Math.random() * duration },
          colorClass: `flow-particle-color-${(i % 4) + 1}`
        };
      });
      setFlowParticleProps(generatedFlowProps);

      // Logo morphing particles
      const generatedLogoProps = [...Array(numLogoParticles)].map((_, i) => {
        const angle = (i / numLogoParticles) * 2 * Math.PI;
        const radius = 40 + Math.random() * 20; // pixels
        return {
          id: `logo-morph-particle-${i}`,
          initial: { 
            x: `calc(50vw + ${Math.cos(angle) * (radius + 100 + Math.random() * 100)}px - 2.5px)`, // Start further out
            y: `calc(40vh + ${Math.sin(angle) * (radius + 100 + Math.random() * 100)}px - 2.5px)`, // Adjusted Y for logo position
            scale: 0.1 + Math.random() * 0.3, 
            opacity: 0 
          },
          animate: { 
            x: `calc(50vw + ${Math.cos(angle) * radius}px - 2.5px)`, // Converge towards a circle
            y: `calc(40vh + ${Math.sin(angle) * radius}px - 2.5px)`,
            opacity: [0, 0.8, 0.6, 0], // Fade in, become prominent, then fade as logo appears
            scale: [0.1, 1, 0.8, 0.2],
          },
          transition: { duration: 1.5, ease: "circOut", delay: i * 0.02 } // Staggered start
        };
      });
      setLogoParticleProps(generatedLogoProps);
    }
  }, [hasMounted]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5, delay: 0.3 } }
  };

  const appNameTextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const actualLogoVariants = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, type: "spring", stiffness:150, damping:15, delay: 0.2 } }, // Delay slightly more
  };

  return (
    <motion.div
      className="nebula-flow-welcome-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onDisplayComplete} // Click anywhere to skip
    >
      {/* Flowing Background Particles */}
      {hasMounted && flowParticleProps.map(props => (
        <motion.div
          key={props.id}
          className={cn("flow-particle", props.colorClass)}
          initial={props.initial}
          animate={props.animate}
          transition={props.transition}
        />
      ))}

      {/* Central Content Area */}
      <div className="z-10 flex flex-col items-center justify-center text-center h-full">
        {/* Logo Morphing Particles - visible before actual logo */}
        {hasMounted && !showActualLogo && logoParticleProps.map(p => (
            <motion.div
              key={p.id}
              className="logo-morph-particle" // Ensure this class has appropriate styling (size, color, blur)
              initial={p.initial}
              animate={p.animate}
              transition={p.transition}
            />
        ))}
        
        {/* Actual Logo - appears after particles converge */}
        {hasMounted && (
          <motion.div 
            className="mb-3" // Reduced margin
            initial="hidden"
            animate={showActualLogo ? "visible" : "hidden"}
            variants={actualLogoVariants}
          >
            <heart-ecg-icon class="heart-ecg-icon-nebula"></heart-ecg-icon>
          </motion.div>
        )}

        {/* App Name - appears after logo */}
        {hasMounted && (
          <motion.div
            initial="hidden"
            animate={showAppName ? "visible" : "hidden"}
            variants={appNameTextVariants}
          >
            <h1 className="text-4xl sm:text-5xl font-semibold nebula-text-logo">
              MediAssistant
            </h1>
          </motion.div>
        )}
      </div>

      {/* Tap to Continue Hint - appears later */}
      {hasMounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 3.5 } }} // Appears later
          className="absolute bottom-8 text-xs text-neutral-400/70 flex items-center gap-1 z-20"
        >
          Tap to continue <ArrowRight size={14} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default WelcomeDisplay;
