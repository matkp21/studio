// src/components/welcome/welcome-display.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface WelcomeDisplayProps {
  onDisplayComplete: () => void;
}

const tourSteps = [
  {
    title: "Welcome to MediAssistant!",
    content: "Let's quickly guide you through the main features.",
    target: "body", // Global target for initial step
  },
  {
    title: "Main Navigation",
    content: "This is where you can access different sections like Chat, Medications, Patient Management, and more.",
    target: ".sidebar-nav", // Target the sidebar navigation
  },
  {
    title: "Chat with AI",
    content: "Our AI assistant can help you with symptom analysis, drug interactions, and medical information.",
    target: 'a[href="/chat"]', // Target the link to the chat page
  },
  {
    title: "Medication Management",
    content: "Keep track of patient medications and check for interactions easily.",
    target: 'a[href="/medications"]', // Target the link to the medications page
  },
  {
    title: "Patient Management (Pro)",
    content: "For Pro users, manage patient records and streamline workflows.",
    target: 'a[href="/patient-management"]', // Target the link to the patient management page
  },
];

export function WelcomeDisplay({ onDisplayComplete }: WelcomeDisplayProps) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Only show the welcome tour if onboarding is not complete and it hasn't been shown this session
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    const welcomeDisplayShown = sessionStorage.getItem('welcomeDisplayShown');

    if (!onboardingComplete && !welcomeDisplayShown) {
      setIsTourOpen(true);
    } else {
      // If onboarding is complete or tour has been shown, call onDisplayComplete immediately
      onDisplayComplete();
    }

    // Define the HeartECGIcon Web Component if it doesn't exist
    // This part remains the same as your original code
    // Define the HeartECGIcon Web Component
    if (typeof window !== 'undefined' && !customElements.get('heart-ecg-icon')) {
      // Calculate actual length for stroke-dasharray for the ECG polyline
      // You MUST calculate this accurately for your specific polyline points.
      // Example: For points="16,32 24,32 28,40 36,24 40,32 48,32"
      // You can do this by:
      // 1. Creating an SVG with just the polyline.
      // 2. In the browser console: document.getElementById('yourPolylineId').getTotalLength();
      const ecgPathLength = 68; // <<<< IMPORTANT: REPLACE 68 with your calculated length

      class HeartECGIcon extends HTMLElement {
        constructor() {
          super();
          const shadow = this.attachShadow({ mode: 'open' });
          shadow.innerHTML = `
            <style>
              :host {
                display: inline-block;
                width: var(--heart-icon-splash-size, 150px);
                height: var(--heart-icon-splash-size, 150px);
              }
              svg {
                width: 100%;
                height: 100%;
                display: block;
                stroke-linecap: round;
                stroke-linejoin: round;
                overflow: visible;
              }
              .heart-path {
                fill: none;
                stroke-width: var(--heart-stroke-width, 2.5px);
              }
              .ecg-polyline {
                fill: none;
                stroke-width: var(--ecg-stroke-width, 2.5px);
                stroke-dasharray: ${ecgPathLength};
                stroke-dashoffset: ${ecgPathLength};
              }
            </style>
            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <path class="heart-path"
                    d="M32 60s24-13.3 24-34C56 17.9 49.1 12 40.5 12 35.2 12 32 16.5 32 16.5S28.8 12 23.5 12C14.9 12 8 17.9 8 26c0 20.7 24 34 24 34z"
                    stroke="hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l))">
                <animate attributeName="stroke"
                         values="hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l));
                                 hsl(var(--heart-stroke-animated-h), var(--heart-stroke-animated-s), var(--heart-stroke-animated-l));
                                 hsl(var(--heart-stroke-initial-h), var(--heart-stroke-initial-s), var(--heart-stroke-initial-l))"
                         dur="3s"
                         repeatCount="indefinite"/>
                <animateTransform attributeName="transform"
                                  type="scale"
                                  additive="sum"
                                  values="0; 0.03; 0; -0.03; 0"
                                  dur="1.5s"
                                  begin="0s"
                                  repeatCount="indefinite"
                                  calcMode="spline"
                                  keyTimes="0; 0.25; 0.5; 0.75; 1"
                                  keySplines="0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1"
                                  transform-origin="center"/>
              </path>
              <polyline class="ecg-polyline"
                        points="16,32 24,32 28,40 36,24 40,32 48,32"
                        stroke="hsl(var(--ecg-stroke-color-h), var(--ecg-stroke-color-s), var(--ecg-stroke-color-l))">
                <animate attributeName="stroke-dashoffset"
                         values="${ecgPathLength};0;${ecgPathLength}"
                         dur="2s"
                         begin="0.2s"
                         repeatCount="indefinite" />
              </polyline>
            </svg>
          `;
        }
      }
      customElements.define('heart-ecg-icon', HeartECGIcon);
    }

  }, [onDisplayComplete]);

  useEffect(() => {
    if (!isTourOpen) return;

    const step = tourSteps[currentStep];
    const element = document.querySelector(step.target) as HTMLElement;

    if (element) {
      setTargetElement(element);
      // Calculate tooltip position relative to the target element
      const rect = element.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom + 10 + window.scrollY, // Position below the element
        left: rect.left + window.scrollX,
      });
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // If the target element is not found (e.g., on a different page), skip the step or handle it
      console.warn(`Tour target not found for step ${currentStep}: ${step.target}`);
      handleNext(); // Move to the next step
    }

  }, [currentStep, isTourOpen]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSkip(); // End tour if it's the last step
    }
  };

  const handleSkip = () => {
    setIsTourOpen(false);
    sessionStorage.setItem('welcomeDisplayShown', 'true');
    onDisplayComplete();
  };

  // The initial splash screen logic remains the same but is now conditional
  // on the onboarding not being complete and the welcome display not shown this session.
  // If the tour opens, the splash screen effect effectively fades out or is covered.
  useEffect(() => {
    const timer = setTimeout(() => {
      onDisplayComplete();
    }, 7000); // Increased duration

    return () => clearTimeout(timer);
  }, [onDisplayComplete]);

  return (
    <>
      {/* Splash Screen (only visible initially if tour is needed) */}
      {!sessionStorage.getItem('welcomeDisplayShown') && !localStorage.getItem('onboardingComplete') && (
        <div
          className="event-poster-splash-screen" // This class will use the static background image
          // onClick={onDisplayComplete} // Click anywhere to continue (removed to allow tour to start)
        >
          <div className="central-icon-container splash-element-fade-in">
            {/* Use the Web Component. External CSS will style it further (e.g., overall pulse/glow) */}
            <heart-ecg-icon class="heart-ecg-icon-splash-static"></heart-ecg-icon>
          </div>

          <div className="bottom-text-container-splash splash-element-fade-in">
            <h1 className="app-name-splash-static">MediAssistant</h1>
            <p className="tagline-splash-static">
              Simply #Smart. Always <span className="emoji" role="img" aria-label="sparks">✨</span><span className="emoji animate-heart-pulse-subtle" role="img" aria-label="brain">🧠</span>
            </p>
          </div>
        </div>
      )}

      {/* Welcome Tour */}
      <Sheet open={isTourOpen} onOpenChange={setIsTourOpen}>
        <SheetContent side="bottom" className="w-full max-w-md mx-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{tourSteps[currentStep].title}</h3>
            <p className="text-sm text-gray-600 mb-4">{tourSteps[currentStep].content}</p>

            {/* Highlight and Tooltip */}
            {targetElement && (
              <div
                className="fixed z-50 border-2 border-blue-500 transition-all duration-300 ease-in-out"
                style={{
                  top: targetElement.getBoundingClientRect().top + window.scrollY,
                  left: targetElement.getBoundingClientRect().left + window.scrollX,
                  width: targetElement.getBoundingClientRect().width,
                  height: targetElement.getBoundingClientRect().height,
                  pointerEvents: 'none', // Allow clicks to pass through
                }}
              ></div>
            )}

            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={handleSkip}>Skip Tour</Button>
              <div className="text-sm text-gray-500">{currentStep + 1}/{tourSteps.length}</div>
              <Button onClick={handleNext}>
                {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}