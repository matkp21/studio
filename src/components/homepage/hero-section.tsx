// src/components/homepage/hero-section.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeartPulse } from "lucide-react"; 
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

export function HeroSection() {
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreetingIndex((prevIndex) => (prevIndex + 1) % greetings.length);
    }, 3000); // Change greeting every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-background to-secondary/30 dark:from-background dark:to-secondary/10 py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle animated heartbeat line */}
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto text-primary/10 dark:text-primary/5 opacity-50"
          width="1000" height="300" viewBox="0 0 1000 300" fill="none" xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M-100 150H200L250 100L350 200L400 150L450 180L500 150L750 150L800 120L850 150H1100" stroke="currentColor" strokeWidth="4" className="heartbeat-line" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.h1
            key={greetings[currentGreetingIndex].text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-6xl sm:text-7xl md:text-8xl font-bold text-center welcome-text-fg-animated mb-8"
            lang={greetings[currentGreetingIndex].lang}
          >
            {greetings[currentGreetingIndex].text}
          </motion.h1>
        </AnimatePresence>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground/90 dark:text-background/90 mb-6"
        >
          Welcome to <span className="animated-gradient-text bg-clip-text text-transparent">MediAssistant</span>.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl text-foreground/80 dark:text-background/80 max-w-3xl mx-auto mb-10"
        >
          Your intelligent partner for AI-powered diagnostics, imaging analysis, and educational support—all at your fingertips.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <Button asChild size="lg" className="rounded-lg group px-8 py-6 text-lg shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105" aria-label="Get started with MediAssistant features">
            <Link href="/chat" className="flex items-center">
              Get Started
              <HeartPulse className="ml-2 h-6 w-6 animate-pulse-medical text-red-400 group-hover:scale-110 group-hover:text-red-300" style={{"--medical-pulse-opacity-base": "0.7", "--medical-pulse-opacity-peak": "1", "--medical-pulse-scale-peak": "1.25"} as React.CSSProperties}/>
            </Link>
          </Button>
        </motion.div>
      </div>
       {/* Subtle decorative elements */}
       <div aria-hidden="true" className="absolute top-1/4 left-10 w-20 h-20 bg-primary/10 rounded-full opacity-30 animate-pulse delay-500"></div>
       <div aria-hidden="true" className="absolute bottom-1/4 right-10 w-24 h-24 bg-accent/10 rounded-lg opacity-20 animate-pulse delay-1000 transform rotate-45"></div>
    </section>
  );
}
