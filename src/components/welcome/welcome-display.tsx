
// src/components/welcome/welcome-display.tsx
"use client";

import { useEffect } from 'react';
import { Logo } from '@/components/logo'; // Kept for potential fallback or other uses, but splash uses custom icon
import { cn } from '@/lib/utils';

interface WelcomeDisplayProps {
  onDisplayComplete: () => void;
}

export function WelcomeDisplay({ onDisplayComplete }: WelcomeDisplayProps) {
  useEffect(() => {
    // Define the HeartECGIcon Web Component
    if (typeof window !== 'undefined' && !customElements.get('heart-ecg-icon')) {
      const ecgPathLength = 68; // Placeholder - User needs to calculate and replace

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
                    d="M32 60s24-13.3 24-34C56 17.9 49.1 12 40.5 12 35.2 12 32 16.5 32 16.5S28.8 12 23.5 12C14.9 12 8 17.9 8 26c0 20.7 24 34 24 34z">
                <animate attributeName="stroke"
                         values="hsl(var(--heart-stroke-initial-h, 210), var(--heart-stroke-initial-s, 100%), var(--heart-stroke-initial-l, 70%));
                                 hsl(var(--heart-stroke-animated-h, 330), var(--heart-stroke-animated-s, 100%), var(--heart-stroke-animated-l, 70%));
                                 hsl(var(--heart-stroke-initial-h, 210), var(--heart-stroke-initial-s, 100%), var(--heart-stroke-initial-l, 70%))"
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
                        stroke="hsl(var(--ecg-stroke-color-h, 200), var(--ecg-stroke-color-s, 100%), var(--ecg-stroke-color-l, 75%))">
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

    const timer = setTimeout(() => {
      onDisplayComplete();
    }, 7000); // Keep duration for the overall splash

    return () => clearTimeout(timer);
  }, [onDisplayComplete]);

  return (
    <div
      className="event-splash-screen" // This class will provide the Apple Event Poster background
      onClick={onDisplayComplete}
    >
      <div className="splash-logo-container">
        {/* Use the Web Component. The class applies external pulse/glow. */}
        <heart-ecg-icon class="heart-ecg-icon-splash"></heart-ecg-icon>
      </div>

      <div className="splash-text-block">
        <h1 className="app-name-splash">MediAssistant</h1>
        <p className="tagline-splash">
          Simply #Smart. Always <span className="emoji" role="img" aria-label="sparks">✨</span><span className="emoji" role="img" aria-label="brain">🧠</span>
        </p>
      </div>
    </div>
  );
}
