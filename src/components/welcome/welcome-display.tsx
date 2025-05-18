// src/components/welcome/welcome-display.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/logo';
import { AnimatedTagline } from '@/components/layout/animated-tagline';
import { cn } from '@/lib/utils';

interface WelcomeDisplayProps {
  onDisplayComplete: () => void;
}

const WelcomeDisplay: React.FC<WelcomeDisplayProps> = ({ onDisplayComplete }) => {
  const [isAnimationSettled, setIsAnimationSettled] = useState(false);

  useEffect(() => {
    // Timer for the initial radiating fill animation to complete
    const fillTimer = setTimeout(() => {
      setIsAnimationSettled(true);
    }, 2800); // Matches the fill animation duration in globals.css

    // Timer for the entire welcome display
    const displayTimer = setTimeout(() => {
      onDisplayComplete();
    }, 5000); // Total display time for the welcome screen (e.g., 5 seconds)

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(displayTimer);
    };
  }, [onDisplayComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5, delay: 4.0 } } // Delay exit to allow content to show
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15, delay: 0.75 } // Delay for background to start forming
    }
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut', delay: 1.8 } // Delay for logo to settle
    }
  };

  return (
    <motion.div
      className={cn(
        "welcome-screen-gradient fixed inset-0 z-[200] flex flex-col items-center justify-center text-white overflow-hidden",
        isAnimationSettled && "settled" // Add 'settled' class after initial fill
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onDisplayComplete} // Allow user to click to skip
    >
      <motion.div variants={logoVariants} className="mb-6">
        {/* Logo component handles its own internal animation */}
        <Logo />
      </motion.div>
      <motion.div variants={taglineVariants}>
        <AnimatedTagline className="text-xl sm:text-2xl text-white/90" />
      </motion.div>
    </motion.div>
  );
};

export default WelcomeDisplay;