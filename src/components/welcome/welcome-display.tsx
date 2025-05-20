// src/components/welcome/welcome-display.tsx
"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedTagline } from '@/components/layout/animated-tagline';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

// Define HeartECGIcon Web Component
const defineHeartECGIconWebComponent = () => {
  if (typeof window !== 'undefined' && !customElements.get('heart-ecg-icon')) {
    class HeartECGIcon extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        // IMPORTANT: Calculate the actual length of your polyline points below
        // For points="16,32 24,32 28,40 36,24 40,32 48,32", the length is approx 68-70.
        // Use browser dev tools: select polyline, run element.getTotalLength() in console.
        const ecgPathLength = 68; // <<< UPDATE THIS WITH ACTUAL CALCULATED LENGTH

        shadow.innerHTML = `
          <style>
            :host {
              display: inline-block;
              width: var(--heart-icon-splash-size, clamp(100px, 20vw, 180px));
              height: var(--heart-icon-splash-size, clamp(100px, 20vw, 180px));
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
              fill: none;
              stroke-width: var(--heart-stroke-width, 2.5px);
              stroke: hsl(var(--heart-stroke-initial-h, 210), var(--heart-stroke-initial-s, 100%), var(--heart-stroke-initial-l, 70%));
            }
            .ecg-polyline-splash {
              fill: none;
              stroke-width: var(--ecg-stroke-width, 2.5px);
              stroke-dasharray: ${ecgPathLength};
              stroke-dashoffset: ${ecgPathLength};
              stroke: hsl(var(--ecg-stroke-color-h, 200), var(--ecg-stroke-color-s, 100%), var(--ecg-stroke-color-l, 75%));
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
              <animateTransform attributeName="transform"
                                type="scale"
                                additive="sum"
                                values="0; 0.03; 0; -0.03; 0"
                                dur="1.5s"
                                begin="0s"
                                repeatCount="indefinite"
                                calcMode="spline"
                                keyTimes="0; 0.25; 0.5; 0.75; 1"
                                keySplines="0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1"
                                transform-origin="center"/>
            </path>
            <polyline class="ecg-polyline-splash"
                      points="16,32 24,32 28,40 36,24 40,32 48,32">
              <animate attributeName="stroke-dashoffset"
                       values="${ecgPathLength};0;${ecgPathLength}"
                       dur="2s"
                       begin="0.2s"
                       repeatCount="indefinite" />
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

const numSparks = 7; // Number of spark particles

interface SparkAnimationProps {
  id: number;
  initialX: string;
  initialY: string;
  initialScale: number;
  animateX: string[];
  animateY: string[];
  animateOpacity: number[];
  animateScale: number[];
  duration: number;
  delay: number;
}

const WelcomeDisplay: React.FC<WelcomeDisplayProps> = ({ onDisplayComplete }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [sparkAnimationProps, setSparkAnimationProps] = useState<SparkAnimationProps[]>([]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      defineHeartECGIconWebComponent();

      const generatedProps = [...Array(numSparks)].map((_, i) => ({
        id: i,
        initialX: `${Math.random() * 80 + 10}vw`,
        initialY: `${Math.random() * 80 + 10}vh`,
        initialScale: Math.random() * 0.5 + 0.3,
        animateX: [`${Math.random() * 80 + 10}vw`, `${Math.random() * 80 + 10}vw`],
        animateY: [`${Math.random() * 80 + 10}vh`, `${Math.random() * 80 + 10}vh`],
        animateOpacity: [0, 0.7, 0.7, 0],
        animateScale: [Math.random() * 0.8 + 0.5, Math.random() * 0.6 + 0.3, 0.1],
        duration: Math.random() * 5 + 8,
        delay: i * 0.5 + Math.random() * 2,
      }));
      setSparkAnimationProps(generatedProps);

      const displayTimer = setTimeout(() => {
        onDisplayComplete();
      }, 7000);

      return () => {
        clearTimeout(displayTimer);
      };
    }
  }, [hasMounted, onDisplayComplete]);


  const containerVariants = {
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
      transition: { type: 'spring', stiffness: 100, damping: 15, delay: 0.5 }
    }
  };

  const greetingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delay: 1.5 } }
  };
  
  const appNameVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delay: 2.3 } }
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delay: 3.0 } }
  };

  const continueHintVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 4.0, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 } }
  };

  const greetings = ["Hello", "Hola", "Bonjour", "नमस्ते", "Ciao"];
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);

  useEffect(() => {
    if (hasMounted) {
      const greetingTimer = setInterval(() => {
        setCurrentGreetingIndex(prev => (prev + 1) % greetings.length);
      }, 2000);
      return () => clearInterval(greetingTimer);
    }
  }, [hasMounted, greetings.length]);

  const sparkColors = [
    'bg-[hsl(var(--spark-particle-color-1))]',
    'bg-[hsl(var(--spark-particle-color-2))]',
    'bg-[hsl(var(--spark-particle-color-3))]',
    'bg-[hsl(var(--spark-particle-color-4))]',
  ];

  if (!hasMounted) {
    return null; // Or a very basic loading spinner to avoid hydration issues
  }

  return (
    <motion.div
      className="spark-welcome-screen" // Ensure this class applies the animated gradient background
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onDisplayComplete}
    >
      {/* Spark Particles */}
      {sparkAnimationProps.map((props) => (
        <motion.div
          key={props.id}
          className={cn("spark-particle absolute", sparkColors[props.id % sparkColors.length])}
          initial={{ x: props.initialX, y: props.initialY, scale: props.initialScale, opacity: 0 }}
          animate={{
            x: props.animateX,
            y: props.animateY,
            opacity: props.animateOpacity,
            scale: props.animateScale,
          }}
          transition={{
            duration: props.duration,
            repeat: Infinity,
            repeatType: "mirror",
            delay: props.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div variants={logoVariants} className="mb-4 z-10">
        {/* Ensure heart-ecg-icon is defined and rendered only client-side */}
        <heart-ecg-icon class="heart-ecg-icon-splash-static"></heart-ecg-icon>
      </motion.div>

      <motion.div variants={greetingVariants} className="text-center mb-2 z-10">
        <AnimatePresence mode="wait">
          <motion.span
            key={greetings[currentGreetingIndex]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } }}
            className="text-4xl sm:text-5xl font-bold firebase-gradient-text"
          >
            {greetings[currentGreetingIndex]}
          </motion.span>
        </AnimatePresence>
        <span className="text-4xl sm:text-5xl font-bold ml-2 text-white/90">User!</span>
      </motion.div>
      
      <motion.h1 variants={appNameVariants} className="text-3xl sm:text-4xl font-semibold mb-3 z-10 text-white/95 firebase-gradient-text">
        MediAssistant
      </motion.h1>

      <motion.div variants={taglineVariants} className="z-10">
        <AnimatedTagline className="text-lg sm:text-xl text-white/80" />
      </motion.div>

      <motion.div
        variants={continueHintVariants}
        className="absolute bottom-10 text-xs text-white/60 flex items-center gap-1 z-10"
      >
        Tap to continue <ArrowRight size={14} />
      </motion.div>
    </motion.div>
  );
};

export default WelcomeDisplay;
