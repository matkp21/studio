// src/components/homepage/hero-section.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeartPulse } from "lucide-react"; // Changed from ArrowRight to HeartPulse
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background to-secondary/30 dark:from-background dark:to-secondary/10 py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle animated heartbeat line */}
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto text-primary/10 dark:text-primary/5 opacity-50"
          width="1000" height="300" viewBox="0 0 1000 300" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M-100 150H200L250 100L350 200L400 150L450 180L500 150L750 150L800 120L850 150H1100" stroke="currentColor" strokeWidth="4" className="heartbeat-line" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 fade-in fade-in-delay-1">
          Your Intelligent <span className="text-primary">Medical Assistant</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 fade-in fade-in-delay-3">
          AI-powered diagnostics, imaging analysis, and educational support—all at your fingertips.
        </p>
        <div className="fade-in fade-in-delay-5">
          <Button asChild size="lg" className="rounded-lg group px-8 py-6 text-lg shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105">
            <Link href="#mode-switcher" className="flex items-center">
              Get Started
              <HeartPulse className="ml-2 h-5 w-5 animate-pulse-medical text-primary-foreground/90" />
            </Link>
          </Button>
        </div>
      </div>
       {/* Subtle decorative elements */}
       <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/10 rounded-full opacity-30 animate-pulse delay-500"></div>
       <div className="absolute bottom-1/4 right-10 w-24 h-24 bg-accent/10 rounded-lg opacity-20 animate-pulse delay-1000 transform rotate-45"></div>
    </section>
  );
}

