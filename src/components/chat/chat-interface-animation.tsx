
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
    }, 3800); 

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
    hidden: { opacity: 0, y: -30, scale: 0.8, rotate: -5 }, // Added initial scale and rotate
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { delay: 0.3, duration: 0.9, type: "spring", stiffness: 120, damping: 10 } // Adjusted params
    },
  };

  const botIconVariants = { // This is for the HeartPulse wrapper div
    initial: { scale: 0.8, rotate: -10 },
    animate: { 
      scale: [0.8, 1.1, 1], 
      rotate: [-10, 10, 0],
      transition: { duration: 1, ease: "easeInOut", delay: 0.5 } // Starts after iconContainer is visible
    },
  };
  
  const heartIconVariants = { // This is for the MessageSquareHeart
    initial: { scale: 0, opacity: 0, x: 10, y:10 },
    animate: {
        scale: [0, 1.2, 1],
        opacity: [0, 1, 0.9],
        x: [10, 0, 5],
        y: [10, -5, 0],
        transition: { duration: 0.9, ease: "easeOut", delay: 0.8 } // Starts after iconContainer
    }
  };

  const starVariants = (i: number) => ({
    initial: { opacity: 0, scale: 0 },
    animate: {
      opacity: [0, 0.8, 0], 
      scale: [0, 1.1, 0], 
      x: Math.random() * 60 - 30, 
      y: Math.random() * 60 - 30,
      rotate: Math.random() * 360,
      transition: {
        delay: 1.2 + i * 0.15, 
        duration: 1.2, 
        repeat: Infinity,
        repeatDelay: 2, 
        ease: "circOut"
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
      transition: { delay: 1.7 + delay, duration: 0.7, type: "spring", stiffness: 120, damping: 12 } // Adjusted base delay and damping
    }
  });


  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 via-teal-800 to-sky-900 text-white overflow-hidden p-4 chat-loading-bg-animated" // Added chat-loading-bg-animated
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={iconContainerVariants} className="relative mb-8">
        {/* Main Icon - HeartPulse already has animate-pulse-medical via globals.css, which is a CSS animation */}
        <motion.div variants={botIconVariants} initial="initial" animate="animate">
            <HeartPulse 
                className="h-24 w-24 sm:h-28 sm:w-28 text-sky-300 opacity-90 animate-pulse-medical" // Kept CSS animation for continuous pulse
                style={{
                    filter: 'drop-shadow(0 0 12px hsl(var(--primary)/0.6))',
                    "--medical-pulse-scale-peak": "1.1", // Customize pulse via CSS var
                    "--medical-pulse-opacity-peak": "0.7"
                } as CSSProperties}
            />
        </motion.div>
         <motion.div variants={heartIconVariants} initial="initial" animate="animate" className="absolute -bottom-3 -right-4">
            <MessageSquareHeart
                className="h-12 w-12 text-teal-300 opacity-90 transform rotate-[15deg]"
                 style={{
                    filter: 'drop-shadow(0 0 10px hsl(var(--accent)/0.5))'
                } as CSSProperties}
            />
        </motion.div>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            variants={starVariants(i)}
            initial="initial"
            animate="animate"
            className="absolute"
            style={{
              left: `${40 + Math.random() * 20}%`, 
              top: `${40 + Math.random() * 20}%`,
            }}
          >
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-300 opacity-70" />
          </motion.div>
        ))}
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-teal-300 to-cyan-200"
        variants={textVariants(0.8)} // Adjusted delay
        style={{ filter: 'drop-shadow(0 2px 8px rgba(125, 211, 252, 0.3))' }} 
      >
        MediAssistant Chat
      </motion.h1>

      <motion.p
        className="text-md sm:text-lg md:text-xl text-sky-100/80 text-center mb-10"
        variants={textVariants(1.0)} // Adjusted delay
      >
        Connecting to your AI medical partner...
      </motion.p>

      <div className="w-full max-w-sm flex flex-col space-y-3 opacity-90">
         <motion.div
            variants={bubbleVariants(0)} // Base delay for bubbles starts at 1.7s now
            className="self-start bg-sky-700/80 text-sky-50 p-3 rounded-xl rounded-bl-sm shadow-lg text-sm max-w-[75%]"
          >
            Hello! I&apos;m ready to assist you.
          </motion.div>
          <motion.div
            variants={bubbleVariants(0.3, true)} // Staggered delay: 1.7 + 0.3 = 2.0s
            className="self-end bg-teal-700/80 text-teal-50 p-3 rounded-xl rounded-br-sm shadow-lg text-sm max-w-[75%]"
          >
            Great! I have a question about my symptoms...
          </motion.div>
           <motion.div
            variants={bubbleVariants(0.6)} // Staggered delay: 1.7 + 0.6 = 2.3s
            className="self-start bg-sky-700/80 text-sky-50 p-3 rounded-xl rounded-bl-sm shadow-lg text-sm max-w-[60%]"
          >
            Processing your query... <span className="inline-block ml-1">
                <span className="animate-pulse-dot-light delay-0 inline-block w-1.5 h-1.5 bg-sky-100 rounded-full"></span>
                <span className="animate-pulse-dot-light delay-150 inline-block w-1.5 h-1.5 bg-sky-100 rounded-full ml-0.5"></span>
                <span className="animate-pulse-dot-light delay-300 inline-block w-1.5 h-1.5 bg-sky-100 rounded-full ml-0.5"></span>
            </span>
          </motion.div>
      </div>
      
      <style jsx global>{`
        @keyframes pulseDotLight { 
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .animate-pulse-dot-light {
          animation: pulseDotLight 1.2s infinite ease-in-out;
        }
        .delay-0 { animation-delay: 0s; }
        .delay-150 { animation-delay: 0.15s; }
        .delay-300 { animation-delay: 0.3s; }

        @keyframes chatLoadingBgShift { /* Added for background animation */
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .chat-loading-bg-animated { /* Added for background animation */
          background-size: 180% 180%; 
          animation: chatLoadingBgShift 25s ease infinite;
        }
      `}</style>

    </motion.div>
  );
}
