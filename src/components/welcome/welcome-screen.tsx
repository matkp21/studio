// src/components/welcome/welcome-screen.tsx
"use client";

import { useState, useEffect, type ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion"; // For smoother animations
import { ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

const greetings = [
  { lang: "en", text: "Hello" },
  { lang: "es", text: "Hola" },
  { lang: "fr", text: "Bonjour" },
  { lang: "de", text: "Hallo" },
  { lang: "it", text: "Ciao" },
  { lang: "pt", text: "Olá" },
  { lang: "zh", text: "你好" },
  { lang: "ko", text: "안녕하세요" },
  { lang: "ja", text: "こんにちは" },
  { lang: "hi", text: "नमस्ते" },
  { lang: "ar", text: "مرحباً" },
];

export function WelcomeScreen({ isOpen, onClose }: WelcomeScreenProps) {
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentGreetingIndex((prevIndex) => (prevIndex + 1) % greetings.length);
    }, 3000); // Change greeting every 3 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center welcome-background-animated text-background p-8"
      )}
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={greetings[currentGreetingIndex].text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-7xl sm:text-8xl md:text-9xl font-bold text-center welcome-text-fg-animated"
          lang={greetings[currentGreetingIndex].lang}
        >
          {greetings[currentGreetingIndex].text}
        </motion.h1>
      </AnimatePresence>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-12 text-xl md:text-2xl text-center text-background/80 max-w-2xl"
      >
        Welcome to MediAssistant. Your intelligent partner for a healthier tomorrow.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="mt-16"
      >
        <Button
          onClick={onClose}
          size="lg"
          className="bg-background/20 text-background hover:bg-background/30 backdrop-blur-sm rounded-full px-8 py-6 text-lg group"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
