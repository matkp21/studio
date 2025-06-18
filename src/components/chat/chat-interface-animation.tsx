
// src/components/chat/chat-interface-animation.tsx
"use client";

import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareHeart, HeartPulse } from 'lucide-react';

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
    hidden: { opacity: 0, y: -30, scale: 0.7 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
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
    initial: { scale: 0, opacity: 0, x: 25, y: 25, rotate: -30 },
    animate: {
        scale: [0, 1.2, 1],
        opacity: [0, 1, 0.9],
        x: [25, -5, 0],
        y: [25, -10, 5],
        rotate: [-30, 20, 15, 0], 
        transition: { duration: 1.0, ease: "circOut", delay: 0.6 }
    }
  };

  const titleTextVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: 0.7, duration: 0.8, type: "spring", stiffness: 100, damping: 15 }
    },
  };

  const subtitleTextVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.9, duration: 0.7, ease: "circOut" }
    },
  };

  const bubbleVariants = (delay: number, fromRight: boolean = false) => ({
    hidden: { opacity: 0, scale: 0.8, x: fromRight ? 30 : -30 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { delay: 1.7 + delay, duration: 0.7, type: "spring", stiffness: 120, damping: 12 }
    }
  });


  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 via-teal-800 to-sky-900 text-white overflow-hidden p-4 chat-loading-bg-animated"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={iconContainerVariants} className="relative mb-8">
        <motion.div variants={botIconVariants} initial="initial" animate="animate">
            <HeartPulse
                className="h-24 w-24 sm:h-28 sm:w-28 text-sky-300 opacity-90 animate-pulse-medical"
                style={{
                    filter: 'drop-shadow(0 0 12px hsl(var(--primary)/0.6))',
                    "--medical-pulse-scale-peak": "1.1",
                    "--medical-pulse-opacity-peak": "0.7"
                } as CSSProperties}
            />
        </motion.div>
         <motion.div variants={heartIconVariants} initial="initial" animate="animate" className="absolute -bottom-3 -right-4">
            <MessageSquareHeart
                className="h-12 w-12 text-teal-300 opacity-90 transform" 
                 style={{
                    filter: 'drop-shadow(0 0 10px hsl(var(--accent)/0.5))'
                } as CSSProperties}
            />
        </motion.div>
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-teal-300 to-cyan-200"
        variants={titleTextVariants} 
        style={{ filter: 'drop-shadow(0 2px 8px rgba(125, 211, 252, 0.3)) drop-shadow(0 0 10px rgba(100, 230, 250, 0.2))' }}
      >
        MediAssistant Chat
      </motion.h1>

      <motion.p
        className="text-md sm:text-lg md:text-xl text-sky-100/80 text-center mb-10"
        variants={subtitleTextVariants} 
      >
        Connecting to your AI medical partner...
      </motion.p>

      <div className="w-full max-w-sm flex flex-col space-y-3 opacity-90">
         <motion.div
            variants={bubbleVariants(0)}
            className="self-start bg-sky-700/80 text-sky-50 p-3 rounded-xl rounded-bl-sm shadow-lg text-sm max-w-[75%]"
          >
            Hello! I&apos;m ready to assist you.
          </motion.div>
          <motion.div
            variants={bubbleVariants(0.3, true)}
            className="self-end bg-teal-700/80 text-teal-50 p-3 rounded-xl rounded-br-sm shadow-lg text-sm max-w-[75%]"
          >
            Great! I have a question about my symptoms...
          </motion.div>
           <motion.div
            variants={bubbleVariants(0.6)}
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
        /* Ensure these are not duplicated if already in globals.css, but safe to include here for component-specific styling */
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

        @keyframes chatLoadingBgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .chat-loading-bg-animated {
          background-size: 180% 180%; /* Larger size for smoother gradient animation */
          animation: chatLoadingBgShift 25s ease infinite;
        }
      `}</style>

    </motion.div>
  );
}
