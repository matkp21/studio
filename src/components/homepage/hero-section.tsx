
// src/components/homepage/hero-section.tsx
"use client";

import type { CSSProperties } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeartPulse, BookHeart, BriefcaseMedical, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProMode } from '@/contexts/pro-mode-context';
import { HeroWidgets, type HeroTask } from './hero-widgets';

const greetings = [
  { lang: "en", text: "Hello," },
  { lang: "hi", text: "नमस्ते," },
  { lang: "ml", text: "നമസ്കാരം," },
  { lang: "es", text: "Hola," },
  { lang: "fr", text: "Bonjour," },
];

const userName = "User"; // Replace with actual user name fetching

const gradientStyle: CSSProperties = {
  backgroundImage: 'linear-gradient(to right, hsl(var(--firebase-color-1-light-h), var(--firebase-color-1-light-s), var(--firebase-color-1-light-l)), hsl(var(--firebase-color-2-light-h), var(--firebase-color-2-light-s), var(--firebase-color-2-light-l)), hsl(var(--firebase-color-3-light-h), var(--firebase-color-3-light-s), var(--firebase-color-3-light-l)), hsl(var(--firebase-color-4-light-h), var(--firebase-color-4-light-s), var(--firebase-color-4-light-l)))',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent'
};
const darkGradientStyle: CSSProperties = {
  backgroundImage: 'linear-gradient(to right, hsl(var(--firebase-color-1-dark-h), var(--firebase-color-1-dark-s), var(--firebase-color-1-dark-l)), hsl(var(--firebase-color-2-dark-h), var(--firebase-color-2-dark-s), var(--firebase-color-2-dark-l)), hsl(var(--firebase-color-3-dark-h), var(--firebase-color-3-dark-s), var(--firebase-color-3-dark-l)), hsl(var(--firebase-color-4-dark-h), var(--firebase-color-4-dark-s), var(--firebase-color-4-dark-l)))',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent'
};


export function HeroSection() {
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);
  const { userRole } = useProMode();
  const [heroTasks, setHeroTasks] = useState<HeroTask[]>([]);
  const [currentGradientStyle, setCurrentGradientStyle] = useState(gradientStyle); // Default to light

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreetingIndex((prevIndex) => (prevIndex + 1) % greetings.length);
    }, 3000);

    if (userRole === 'pro') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);

      setHeroTasks([
        { id: '1', date: today, title: 'Review Mr. Smith\'s X-Ray', description: 'Uploaded at 10:00 AM' },
        { id: '2', date: today, title: 'Team Meeting', description: 'Scheduled for 2:00 PM' },
        { id: '3', date: tomorrow, title: 'Follow-up: Patient A', description: 'Check medication adherence' },
        { id: '4', date: dayAfterTomorrow, title: 'Case Conference', description: 'Discuss complex cases' },
      ]);
    } else {
      setHeroTasks([]);
    }
     // For theme-aware gradient text
    const updateGradientStyleForTheme = () => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setCurrentGradientStyle(darkGradientStyle);
      } else {
        setCurrentGradientStyle(gradientStyle);
      }
    };
    updateGradientStyleForTheme(); // Set initial style
    const mediaQueryListener = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQueryListener.addEventListener('change', updateGradientStyleForTheme);


    return () => {
      clearInterval(interval);
      mediaQueryListener.removeEventListener('change', updateGradientStyleForTheme);
    }
  }, [userRole]);

  let ctaLink = "/chat";
  let ctaText = "Get Started";
  let CtaIcon = HeartPulse;
  let ctaAriaLabel = "Get started with MediAssistant features";
  let ctaBaseClasses = "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-primary/30";
  let ctaSpecificAnimation = "";


  if (userRole === 'medico') {
    ctaLink = "/medico";
    ctaText = "Medico Study Hub";
    CtaIcon = BookHeart;
    ctaAriaLabel = "Go to Medico Study Hub";
    ctaBaseClasses = `
      bg-gradient-to-r 
      from-[hsl(var(--firebase-color-1-light-h),var(--firebase-color-1-light-s),var(--firebase-color-1-light-l))] 
      via-[hsl(var(--firebase-color-2-light-h),var(--firebase-color-2-light-s),var(--firebase-color-2-light-l))] 
      to-[hsl(var(--firebase-color-3-light-h),var(--firebase-color-3-light-s),var(--firebase-color-3-light-l))] 
      dark:from-[hsl(var(--firebase-color-1-dark-h),var(--firebase-color-1-dark-s),var(--firebase-color-1-dark-l))] 
      dark:via-[hsl(var(--firebase-color-2-dark-h),var(--firebase-color-2-dark-s),var(--firebase-color-2-dark-l))] 
      dark:to-[hsl(var(--firebase-color-3-dark-h),var(--firebase-color-3-dark-s),var(--firebase-color-3-dark-l))] 
      text-white 
      firebase-button-interactive
    `;
    ctaSpecificAnimation = "gemini-cta-button";
  } else if (userRole === 'pro') {
    ctaLink = "/pro";
    ctaText = "Pro Clinical Suite";
    CtaIcon = BriefcaseMedical;
    ctaAriaLabel = "Go to Professional Clinical Suite";
    ctaBaseClasses = "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white hover:shadow-purple-500/40 firebase-button-interactive";
    ctaSpecificAnimation = "gemini-cta-button"; 
  }


  return (
    <section className="relative bg-background py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="softWavePattern" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="scale(1) rotate(0)">
              <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="hsl(var(--primary)/0.2)" strokeWidth="0.5" fill="none"/>
              <path d="M0 60 Q 25 35, 50 60 T 100 60" stroke="hsl(var(--accent)/0.15)" strokeWidth="0.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#softWavePattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <AnimatePresence mode="wait">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-center mb-6">
            <motion.span
              key={greetings[currentGreetingIndex].text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={currentGradientStyle}
              lang={greetings[currentGreetingIndex].lang}
              className="inline-block" 
            >
              {greetings[currentGreetingIndex].text}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="ml-2 text-foreground dark:text-foreground" 
            >{userName}</motion.span>
           </h1>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground/90 dark:text-foreground/90 mb-4"
        >
          Welcome to <span className="animated-gradient-text">MediAssistant</span>.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-md sm:text-lg md:text-xl text-foreground/80 dark:text-foreground/80 max-w-3xl mx-auto mb-8"
        >
          Your intelligent partner for AI-powered diagnostics, imaging analysis, and educational support—all at your fingertips.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mb-10"
        >
          <Button
            asChild
            size="lg"
            className={cn(
              "rounded-lg group px-8 py-6 text-lg shadow-lg transition-all duration-300 transform hover:scale-105",
              ctaBaseClasses,
              ctaSpecificAnimation
            )}
            aria-label={ctaAriaLabel}
          >
            <Link href={ctaLink} className="flex items-center">
              {ctaText}
              <CtaIcon
                className={cn(
                  "ml-2 h-6 w-6 group-hover:scale-110 animate-pulse-medical", 
                   userRole === 'pro' || userRole === 'medico' ? "text-white" : "text-primary-foreground"
                )}
                style={{"--medical-pulse-opacity-base": "0.8", "--medical-pulse-opacity-peak": "1", "--medical-pulse-scale-peak": "1.15"} as CSSProperties}
              />
            </Link>
          </Button>
        </motion.div>

        {userRole === 'pro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="mt-12"
          >
            <HeroWidgets tasks={heroTasks} />
          </motion.div>
        )}
      </div>
       <div aria-hidden="true" className="absolute top-1/4 left-10 w-20 h-20 bg-primary/5 rounded-full opacity-30 animate-pulse delay-500"></div>
       <div aria-hidden="true" className="absolute bottom-1/4 right-10 w-24 h-24 bg-accent/5 rounded-lg opacity-20 animate-pulse delay-1000 transform rotate-45"></div>
    </section>
  );
}

