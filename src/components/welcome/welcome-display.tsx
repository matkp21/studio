
// src/components/welcome/welcome-display.tsx
"use client";

import type { CSSProperties } from 'react'; 
import { useEffect } from 'react';
// Framer Motion removed for static CSS focus, can be re-added for overall screen transition later
// import { motion } from 'framer-motion'; 
// AnimatedTagline replaced by static paragraph as per user's HTML for this specific splash
// import { AnimatedTagline } from '@/components/layout/animated-tagline';
import { cn } from '@/lib/utils';

interface WelcomeDisplayProps {
  onDisplayComplete: () => void;
}

export function WelcomeDisplay({ onDisplayComplete }: WelcomeDisplayProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDisplayComplete();
    }, 7000); // Duration of the splash screen

    return () => clearTimeout(timer);
  }, [onDisplayComplete]);

  // Note: Framer Motion animations for logo/text entrance are removed
  // to focus on the static CSS rendering of the background and elements
  // as per the user's latest prompt. These can be re-added later.

  return (
    // Root div now uses the class for the Apple Event Poster style
    <div
      className="event-splash-screen" 
      onClick={onDisplayComplete} // Allow skip by clicking
    >
      <div className="splash-logo-container">
        {/* SVG for Heart/ECG icon directly embedded as per user's HTML example */}
        <svg className="heart-ecg-icon-splash" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 60s24-13.3 24-34C56 17.9 49.1 12 40.5 12 35.2 12 32 16.5 32 16.5S28.8 12 23.5 12C14.9 12 8 17.9 8 26c0 20.7 24 34 24 34z"
                  stroke="hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l))"
                  strokeWidth="3" // stroke-width in SVG, not strokeWidth
                  fill="none">
                <animate attributeName="stroke" 
                         values="hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l)); hsl(var(--heart-stroke-animated-h), var(--heart-stroke-animated-s), var(--heart-stroke-animated-l)); hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l))" 
                         dur="3s" 
                         repeatCount="indefinite"/>
            </path>
            <polyline id="ecgLineForAnimation" points="16,32 24,32 28,40 36,24 40,32 48,32"
                      stroke="hsl(var(--ecg-stroke-color-h), var(--ecg-stroke-color-s), var(--ecg-stroke-color-l))"
                      strokeWidth="3" // stroke-width in SVG
                      fill="none"
                      strokeDasharray="68" /* User to replace 68 with actual calculated length */
                      strokeDashoffset="68">
                <animate attributeName="strokeDashoffset"
                         values="68;0;68" /* User to replace 68 with actual length */
                         dur="2s"
                         begin="0.5s" 
                         repeatCount="indefinite" />
            </polyline>
        </svg>
      </div>

      <div className="splash-text-block">
        <h1 className="app-name-splash">MediAssistant</h1>
        {/* Static tagline as per user's HTML example for this iteration */}
        <p className="tagline-splash">
          Simply #Smart. Always <span className="emoji" role="img" aria-label="sparks">✨</span><span className="emoji" role="img" aria-label="brain">🧠</span>
        </p>
      </div>
    </div>
  );
}
