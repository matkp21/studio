// src/components/welcome/welcome-display.tsx
"use client";
import React, { useEffect } from 'react';

// Web Component for Heart/ECG Icon
// Note: The actual definition of HeartECGIcon class should be here or imported globally if not already.
// For brevity, assuming it's correctly defined as per previous discussions.

interface WelcomeDisplayProps {
  onDisplayComplete: () => void;
}

const WelcomeDisplay: React.FC<WelcomeDisplayProps> = ({ onDisplayComplete }) => {
  useEffect(() => {
    // Define the HeartECGIcon Web Component if it doesn't exist
    if (typeof window !== 'undefined' && !customElements.get('heart-ecg-icon')) {
      const ecgPathLength = 68; // IMPORTANT: Replace 68 with your actual calculated length

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
                        id="ecgLineForAnimationWelcome" /* Ensure unique ID if used elsewhere */
                        points="16,32 24,32 28,40 36,24 40,32 48,32"
                        stroke="hsl(var(--ecg-stroke-color-h), var(--ecg-stroke-color-s), var(--ecg-stroke-color-l))">
                <animate attributeName="stroke-dashoffset"
                         values="${ecgPathLength};0;${ecgPathLength}"
                         dur="2s"
                         begin="0.5s"
                         repeatCount="indefinite" />
              </polyline>
            </svg>
          `;
        }
      }
      customElements.define('heart-ecg-icon', HeartECGIcon);
    }

    const timer = setTimeout(() => {
      onDisplayComplete();
    }, 7000); // Duration for the splash screen

    // Optional: Calculate polyline length for debugging or dynamic setting if needed
    // This is for information; the SMIL animation uses the hardcoded ecgPathLength
    // const ecgLine = document.getElementById("ecgLineForAnimationWelcome");
    // if (ecgLine && typeof (ecgLine as SVGPolylineElement).getTotalLength === 'function') {
    //   console.log("Polyline length for ECG in WelcomeDisplay:", (ecgLine as SVGPolylineElement).getTotalLength());
    // }

    return () => clearTimeout(timer);
  }, [onDisplayComplete]);

  return (
    <div className="event-poster-splash-screen" onClick={onDisplayComplete}>
      <div className="central-icon-container splash-element-fade-in">
        {/* The Web Component for the animated heart/ECG icon */}
        <heart-ecg-icon class="heart-ecg-icon-splash-static"></heart-ecg-icon>
      </div>
      <div className="bottom-text-container-splash splash-element-fade-in">
        <h1 className="app-name-splash-static">MediAssistant</h1>
        <p className="tagline-splash-static">Simply #Smart. Always <span className="emoji" role="img" aria-label="sparks and brain">✨🧠</span></p>
      </div>
      {/* The problematic line that caused the error has been removed from here.
          It was: {!localStorage.getItem('onboardingComplete') && <OnboardingTour onComplete={onDisplayComplete} />}
          The OnboardingTour logic is handled by AppLayout.tsx and OnboardingModal.tsx.
      */}
    </div>
  );
};

export default WelcomeDisplay;
