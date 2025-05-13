// src/components/chat/chat-interface-animation.tsx
"use client";

import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareHeart, Bot } from 'lucide-react'; 

interface ChatInterfaceAnimationProps {
  onAnimationComplete: () => void;
}

export function ChatInterfaceAnimation({ onAnimationComplete }: ChatInterfaceAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 3500); // Animation duration + buffer

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5, delay: 3 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.5, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { delay: 0.3, duration: 0.9, type: "spring", stiffness: 120, damping: 10 }
    },
  };

  const textVariants = (delay: number) => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: delay, duration: 0.8, ease: "easeOut" }
    },
  });

  const bubbleVariants = (delay: number, xOffset: number = 0) => ({
    hidden: { opacity: 0, y: 20, x: xOffset },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { delay: 1.2 + delay, duration: 0.6, type: "spring", stiffness: 100 }
    }
  });


  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary to-background text-white overflow-hidden p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={iconVariants} className="relative mb-6">
        <Bot
            className="h-20 w-20 sm:h-24 sm:w-24 text-primary opacity-90 animate-pulse-medical"
            style={{
                "--medical-pulse-scale-peak": "1.1",
                "--medical-pulse-opacity-peak": "0.7",
                animationDuration: '2.2s'
            } as CSSProperties}
        />
         <MessageSquareHeart
            className="absolute -bottom-2 -right-3 h-10 w-10 text-accent opacity-80 transform rotate-12"
        />
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 text-center text-transparent bg-clip-text animated-gradient-text"
        variants={textVariants(0.7)}
      >
        MediAssistant Chat
      </motion.h1>

      <motion.p
        className="text-md sm:text-lg md:text-xl text-foreground/80 text-center"
        variants={textVariants(0.9)}
      >
        Connecting to your AI assistant...
      </motion.p>

      {/* Conceptual animated chat bubbles */}
      <div className="absolute bottom-10 w-full max-w-xs flex flex-col items-center space-y-2 opacity-50">
         <motion.div
            variants={bubbleVariants(0, -20)}
            className="self-start bg-primary/20 text-primary-foreground/80 p-2 rounded-lg rounded-bl-none shadow-md text-xs max-w-[70%]"
          >
            Hello! How can I help you today?
          </motion.div>
          <motion.div
            variants={bubbleVariants(0.3, 20)}
            className="self-end bg-secondary/30 text-secondary-foreground/80 p-2 rounded-lg rounded-br-none shadow-md text-xs max-w-[70%]"
          >
            I have a question about...
          </motion.div>
           <motion.div
            variants={bubbleVariants(0.6, -20)}
            className="self-start bg-primary/20 text-primary-foreground/80 p-2 rounded-lg rounded-bl-none shadow-md text-xs max-w-[70%]"
          >
            Thinking... <span className="animate-ping inline-block w-1 h-1 bg-current rounded-full"></span>
          </motion.div>
      </div>

    </motion.div>
  );
}
