// src/components/chat/chat-interface-animation.tsx
"use client";

import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareHeart, Star, HeartPulse } from 'lucide-react'; 

interface ChatInterfaceAnimationProps {
  onAnimationComplete: () => void;
}

export function ChatInterfaceAnimation({ onAnimationComplete }: ChatInterfaceAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 3800); // Slightly increased duration for a more graceful animation

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "circOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4, ease: "circIn", delay: 3.2 }
    }
  };

  const iconContainerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.8, type: "spring", stiffness: 100, damping: 12 }
    },
  };

  const botIconVariants = {
    initial: { scale: 0.8, rotate: -10 },
    animate: { 
      scale: [0.8, 1.1, 1], 
      rotate: [-10, 10, 0],
      transition: { duration: 1, ease: "easeInOut", delay: 0.5 }
    },
  };
  
  const heartIconVariants = {
    initial: { scale: 0, opacity: 0, x: 10, y:10 },
    animate: {
        scale: [0, 1.2, 1],
        opacity: [0, 1, 0.9],
        x: [10, 0, 5],
        y: [10, -5, 0],
        transition: { duration: 0.9, ease: "easeOut", delay: 0.8 }
    }
  };

  const starVariants = (i: number) => ({ // Changed from sparklesVariants
    initial: { opacity: 0, scale: 0 },
    animate: {
      opacity: [0, 0.9, 0], // Adjusted opacity
      scale: [0, 1.1, 0], // Adjusted scale
      x: Math.random() * 50 - 25, // Slightly wider spread
      y: Math.random() * 50 - 25,
      rotate: Math.random() * 360, // Add random rotation
      transition: {
        delay: 1.2 + i * 0.18, // Slightly adjusted delay
        duration: 1.3, // Adjusted duration
        repeat: Infinity,
        repeatDelay: 1.8, // Adjusted repeat delay
        ease: "circOut" // Changed ease
      }
    }
  });


  const textVariants = (delay: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: delay, duration: 0.9, ease: "circOut" }
    },
  });
  
  const bubbleVariants = (delay: number, fromRight: boolean = false) => ({
    hidden: { opacity: 0, scale: 0.8, x: fromRight ? 30 : -30 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { delay: 1.5 + delay, duration: 0.6, type: "spring", stiffness: 120, damping: 15 }
    }
  });


  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-background via-card to-secondary/20 text-foreground overflow-hidden p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={iconContainerVariants} className="relative mb-8">
        <motion.div variants={botIconVariants} initial="initial" animate="animate">
            <HeartPulse 
                className="h-24 w-24 sm:h-28 sm:w-28 text-primary opacity-90 drop-shadow-lg"
                style={{
                    filter: 'drop-shadow(0 0 10px hsl(var(--primary)/0.5))'
                } as CSSProperties}
            />
        </motion.div>
         <motion.div variants={heartIconVariants} initial="initial" animate="animate" className="absolute -bottom-3 -right-4">
            <MessageSquareHeart
                className="h-12 w-12 text-accent opacity-90 transform rotate-[15deg] drop-shadow-md"
                 style={{
                    filter: 'drop-shadow(0 0 8px hsl(var(--accent)/0.4))'
                } as CSSProperties}
            />
        </motion.div>
        {[...Array(5)].map((_, i) => ( // Increased count of stars
          <motion.div
            key={`star-${i}`} // Changed key prefix
            variants={starVariants(i)} // Use starVariants
            initial="initial"
            animate="animate"
            className="absolute"
            style={{
              left: `${40 + Math.random() * 20}%`, 
              top: `${40 + Math.random() * 20}%`,
            }}
          >
            <Star className="h-4 w-4 text-accent opacity-70" /> {/* Changed Sparkles to Star and color */}
          </motion.div>
        ))}
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-center text-transparent bg-clip-text animated-gradient-text"
        variants={textVariants(0.5)}
      >
        MediAssistant Chat
      </motion.h1>

      <motion.p
        className="text-md sm:text-lg md:text-xl text-foreground/70 text-center mb-10"
        variants={textVariants(0.7)}
      >
        Connecting to your AI medical partner...
      </motion.p>

      <div className="w-full max-w-sm flex flex-col space-y-3 opacity-80">
         <motion.div
            variants={bubbleVariants(0.2)}
            className="self-start bg-primary/80 text-primary-foreground p-3 rounded-xl rounded-bl-sm shadow-lg text-sm max-w-[75%]"
          >
            Hello! I'm ready to assist you.
          </motion.div>
          <motion.div
            variants={bubbleVariants(0.5, true)}
            className="self-end bg-secondary text-secondary-foreground p-3 rounded-xl rounded-br-sm shadow-lg text-sm max-w-[75%]"
          >
            Great! I have a question about my symptoms...
          </motion.div>
           <motion.div
            variants={bubbleVariants(0.8)}
            className="self-start bg-primary/80 text-primary-foreground p-3 rounded-xl rounded-bl-sm shadow-lg text-sm max-w-[60%]"
          >
            Processing your query... <span className="inline-block ml-1">
                <span className="animate-pulse-dot delay-0 inline-block w-1.5 h-1.5 bg-current rounded-full"></span>
                <span className="animate-pulse-dot delay-150 inline-block w-1.5 h-1.5 bg-current rounded-full ml-0.5"></span>
                <span className="animate-pulse-dot delay-300 inline-block w-1.5 h-1.5 bg-current rounded-full ml-0.5"></span>
            </span>
          </motion.div>
      </div>
      
      <style jsx global>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-pulse-dot {
          animation: pulseDot 1.2s infinite ease-in-out;
        }
        .delay-0 { animation-delay: 0s; }
        .delay-150 { animation-delay: 0.15s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>

    </motion.div>
  );
}
