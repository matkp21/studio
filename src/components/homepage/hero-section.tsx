// src/components/homepage/hero-section.tsx
"use client";

import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeartPulse, BookHeart, BriefcaseMedical } from "lucide-react"; 
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProMode } from '@/contexts/pro-mode-context';
import { HeroWidgets, type HeroTask } from './hero-widgets'; 

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
  const { userRole } = useProMode();
  const [heroTasks, setHeroTasks] = useState<HeroTask[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreetingIndex((prevIndex) => (prevIndex + 1) % greetings.length);
    }, 3000);

    // Sample tasks for pro users - replace with actual data fetching if needed
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
      setHeroTasks([]); // No tasks for other roles or clear existing if role changes
    }

    return () => clearInterval(interval);
  }, [userRole]);

  let ctaLink = "/chat";
  let ctaText = "Get Started";
  let CtaIcon = HeartPulse;
  let ctaAriaLabel = "Get started with MediAssistant features";
  let ctaColorClasses = "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-primary/30";

  if (userRole === 'medico') {
    ctaLink = "/medico";
    ctaText = "Medico Study Hub";
    CtaIcon = BookHeart;
    ctaAriaLabel = "Go to Medico Study Hub";
    ctaColorClasses = "bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 hover:from-sky-600 hover:to-sky-800 text-white hover:shadow-sky-500/40";
  } else if (userRole === 'pro') {
    ctaLink = "/pro";
    ctaText = "Pro Clinical Suite";
    CtaIcon = BriefcaseMedical;
    ctaAriaLabel = "Go to Professional Clinical Suite";
    ctaColorClasses = "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white hover:shadow-purple-500/40";
  }


  return (
    <section className="relative bg-background py-16 md:py-20 overflow-hidden"> {/* Adjusted padding */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translatey-1/2 w-full h-auto text-primary/10 dark:text-primary/5 opacity-50"
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
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-center firebase-gradient-text mb-6"
            lang={greetings[currentGreetingIndex].lang}
          >
            {greetings[currentGreetingIndex].text}
          </motion.h1>
        </AnimatePresence>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground/90 dark:text-foreground/90 mb-4"
        >
          Welcome to <span className="animated-gradient-text bg-clip-text text-transparent">MediAssistant</span>.
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
          className="mb-10" // Adjusted margin for spacing before ribbon
        >
          <Button 
            asChild 
            size="lg" 
            className={cn(
              "rounded-lg group px-8 py-6 text-lg shadow-lg transition-all duration-300 transform hover:scale-105",
              ctaColorClasses
            )} 
            aria-label={ctaAriaLabel}
          >
            <Link href={ctaLink} className="flex items-center">
              {ctaText}
              <CtaIcon 
                className={cn(
                  "ml-2 h-7 w-7 group-hover:scale-110 animate-pulse-medical",
                   "text-white" 
                )} 
                style={{"--medical-pulse-opacity-base": "0.8", "--medical-pulse-opacity-peak": "1", "--medical-pulse-scale-peak": "1.35"} as CSSProperties}
              />
            </Link>
          </Button>
        </motion.div>

        {/* Conditionally render HeroWidgets (now the ribbon) for 'pro' users */}
        {userRole === 'pro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="mt-6" // Ensure spacing above the ribbon
          >
            <HeroWidgets tasks={heroTasks} />
          </motion.div>
        )}
      </div>
       <div aria-hidden="true" className="absolute top-1/4 left-10 w-20 h-20 bg-primary/10 rounded-full opacity-30 animate-pulse delay-500"></div>
       <div aria-hidden="true" className="absolute bottom-1/4 right-10 w-24 h-24 bg-accent/10 rounded-lg opacity-20 animate-pulse delay-1000 transform rotate-45"></div>
    </section>
  );
}