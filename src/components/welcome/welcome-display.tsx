
// src/components/welcome/welcome-display.tsx
"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedTagline } from '@/components/layout/animated-tagline';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/logo'; // Using the standard Logo component

// Web Component for Heart/ECG Icon (Internal SMIL animations)
const defineHeartECGIconWebComponent = () => {
  if (typeof window !== 'undefined' && !customElements.get('heart-ecg-icon')) {
    class HeartECGIcon extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const ecgPathLength = 68; // Pre-calculated length

        shadow.innerHTML = `
          <style>
            :host {
              display: inline-block;
              width: var(--heart-icon-splash-size, 120px); /* Adjusted default size */
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
              stroke: hsl(var(--heart-stroke-initial-h, 210), var(--heart-stroke-initial-s, 100%), var(--heart-stroke-initial-l, 85%));
              fill: none;
              stroke-width: var(--heart-stroke-width, 2px); /* Slightly thinner */
            }
            .ecg-polyline-splash {
              stroke: hsl(var(--ecg-stroke-color-h, 200), var(--ecg-stroke-color-s, 100%), var(--ecg-stroke-color-l, 90%));
              fill: none;
              stroke-width: var(--ecg-stroke-width, 2px); /* Slightly thinner */
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

const numFlowParticles = 30; // Increased number of particles for a denser flow

const WelcomeDisplay: React.FC<WelcomeDisplayProps> = ({ onDisplayComplete }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [flowParticleProps, setFlowParticleProps] = useState<any[]>([]);

  useEffect(() => {
    defineHeartECGIconWebComponent();
    setHasMounted(true);

    const displayTimer = setTimeout(() => {
      onDisplayComplete();
    }, 7000); // 7 seconds total for the splash

    return () => clearTimeout(displayTimer);
  }, [onDisplayComplete]);

  useEffect(() => {
    if (hasMounted) {
      const generatedProps = [...Array(numFlowParticles)].map((_, i) => {
        const duration = Math.random() * 5 + 5; // 5-10 seconds duration for a slow flow
        const initialY = Math.random() * 100; // Start anywhere vertically
        const initialX = Math.random() * 100;
        return {
          id: `flow-particle-${i}`,
          initial: { 
            x: `${initialX}vw`, 
            y: `${initialY}vh`, 
            opacity: 0,
            scale: Math.random() * 0.4 + 0.1 // smaller particles
          },
          animate: {
            x: [`${initialX}vw`, `${Math.random() * 100}vw`, `${Math.random() * 100}vw`], // More horizontal drift
            y: [`${initialY}vh`, `${(initialY + 20 + Math.random() * 30) % 100}vh`, `${(initialY + 50 + Math.random() * 50) % 100}vh`], // Slow downward/upward drift
            opacity: [0, Math.random() * 0.3 + 0.1, 0], // Softer opacity
            scale: [Math.random() * 0.4 + 0.1, Math.random() * 0.6 + 0.2, Math.random() * 0.4 + 0.1],
          },
          transition: {
            duration: duration,
            repeat: Infinity,
            repeatType: "loop", // Loop instead of mirror for continuous flow
            ease: "linear",
            delay: Math.random() * duration, // Random start times for a less synchronized look
          },
          colorClass: `flow-particle-color-${(i % 4) + 1}` // Cycle through 4 colors
        };
      });
      setFlowParticleProps(generatedProps);
    }
  }, [hasMounted]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5, delay: 0.3 } }
  };

  // Staggered reveal for text elements
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 2.0, // Start revealing text after logo forms
        staggerChildren: 0.4,
      },
    },
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } },
  };
  
  // Logo "morphing" simulation: particles converge, then logo appears
  const logoParticleCount = 15;
  const [logoParticles, setLogoParticles] = useState<any[]>([]);
  const [showActualLogo, setShowActualLogo] = useState(false);

  useEffect(() => {
    if (hasMounted) {
      const particles = Array.from({ length: logoParticleCount }).map((_, i) => ({
        id: `logo-p-${i}`,
        initialX: `${Math.random() * 60 + 20}vw`, // Start scattered more centrally
        initialY: `${Math.random() * 60 + 20}vh`,
        finalX: `calc(50vw + ${Math.cos(i * (2 * Math.PI / logoParticleCount)) * 50 - 20}px)`, // Converge to a circle around logo
        finalY: `calc(40vh + ${Math.sin(i * (2 * Math.PI / logoParticleCount)) * 50 - 20}px)`, // Adjust Y for logo position
      }));
      setLogoParticles(particles);

      // Trigger actual logo appearance
      const logoTimer = setTimeout(() => {
        setShowActualLogo(true);
      }, 1800); // Time for particles to converge

      return () => clearTimeout(logoTimer);
    }
  }, [hasMounted]);


  return (
    <motion.div
      className="nebula-flow-welcome-screen" // New class for this theme
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onDisplayComplete}
    >
      {/* Flowing Particles Background */}
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
        {!showActualLogo && hasMounted && logoParticles.map(p => (
            <motion.div
              key={p.id}
              className="logo-morph-particle"
              initial={{ x: p.initialX, y: p.initialY, scale:0.2, opacity: 0.8 }}
              animate={{ x: p.finalX, y: p.finalY, scale:0.05, opacity:0.3 }}
              transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
            />
        ))}
        
        {/* Actual Logo - fades in after particles converge */}
        {hasMounted && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={showActualLogo ? { opacity: 1, scale: 1, transition: { duration: 0.7, delay:0.1, ease:"backOut" }} : {}}
            className="mb-5" // Adjusted margin
          >
             {/* Using the Logo component directly might be simpler if it handles its own animation well enough */}
             {/* <Logo simple={false} /> */}
             {/* Or if the web component is preferred for specific control: */}
            <heart-ecg-icon class="heart-ecg-icon-nebula"></heart-ecg-icon>
          </motion.div>
        )}

        {/* Animated Text Block */}
        <motion.div
          variants={textContainerVariants}
          initial="hidden"
          animate={hasMounted && showActualLogo ? "visible" : "hidden"} // Only animate text after logo is shown
          className="space-y-2"
        >
          <motion.p variants={textItemVariants} className="text-3xl sm:text-4xl font-medium text-neutral-200">
            Welcome, User!
          </motion.p>
          <motion.div variants={textItemVariants}>
             <Logo simple={false} className="justify-center nebula-text-logo" />
          </motion.div>
          <motion.div variants={textItemVariants}>
            <AnimatedTagline className="text-md sm:text-lg text-neutral-300/80 nebula-tagline" />
          </motion.div>
        </motion.div>
      </div>

      {/* Tap to Continue Hint */}
      {hasMounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 5.0 } }} // Appears later
          className="absolute bottom-8 text-xs text-neutral-400/70 flex items-center gap-1 z-20"
        >
          Tap to continue <ArrowRight size={14} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default WelcomeDisplay;

    