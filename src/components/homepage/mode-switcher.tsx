// src/components/homepage/mode-switcher.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Stethoscope, ScanSearch, BookOpenText } from "lucide-react";

export type ActiveMode = 'symptom' | 'image' | 'education';

interface ModeSwitcherProps {
  activeMode: ActiveMode;
  setActiveMode: (mode: ActiveMode) => void;
}

const modes = [
  { id: 'symptom', label: 'Symptom Analysis', icon: Stethoscope },
  { id: 'image', label: 'Image Processing', icon: ScanSearch },
  { id: 'education', label: 'Educational Support', icon: BookOpenText },
] as const;

export function ModeSwitcher({ activeMode, setActiveMode }: ModeSwitcherProps) {
  return (
    <div id="mode-switcher" className="flex justify-center slide-in-bottom fade-in-delay-7">
      <div className="flex space-x-1 bg-muted p-1 rounded-xl shadow-md">
        {modes.map((mode) => (
          <Button
            key={mode.id}
            variant="ghost"
            onClick={() => setActiveMode(mode.id)}
            className={cn(
              "flex-1 justify-center px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
              activeMode === mode.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:bg-background/50 hover:text-foreground"
            )}
          >
            <mode.icon className="mr-2 h-5 w-5" />
            {mode.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
