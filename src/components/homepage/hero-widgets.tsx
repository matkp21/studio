// src/components/homepage/hero-widgets.tsx
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { CalendarDays, Clock, Dot, TimerIcon, BellRing, AlarmClockCheck } from "lucide-react";
import { ClockWidget } from './clock-widget'; 
import { useToast } from '@/hooks/use-toast'; 

export interface HeroTask {
  id: string;
  date: Date;
  title: string;
  description: string;
}

interface HeroWidgetsProps {
  tasks: HeroTask[];
}

export const HeroWidgets: React.FC<HeroWidgetsProps> = ({ tasks }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(new Date());
  const [isCalendarPopoverOpen, setIsCalendarPopoverOpen] = useState(false);
  const [isClockWidgetPopoverOpen, setIsClockWidgetPopoverOpen] = useState(false);
  const { toast } = useToast(); 

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); 
    return () => clearInterval(timerId);
  }, []);

  const tasksForSelectedDate = tasks.filter(task => selectedCalendarDate && isSameDay(task.date, selectedCalendarDate));

  return (
    <div 
      className={cn(
        "mt-4 flex w-full max-w-md mx-auto items-center justify-between gap-2 md:gap-4 py-2 px-3 rounded-lg shadow-sm", // General layout
        "bg-background border border-border/40" // Subtle panel style
      )}
      aria-label="Date and Time Information Panel"
    >
      {/* Left Side: Compact Functional Calendar */}
      <Popover open={isCalendarPopoverOpen} onOpenChange={setIsCalendarPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost" 
            className="flex-1 justify-center text-left font-normal text-xs sm:text-sm rounded-md h-auto p-2 text-foreground hover:bg-accent/10 focus-visible:ring-ring"
            aria-label="Open calendar and tasks"
          >
            <CalendarDays className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-semibold">{format(currentDateTime, "E, MMM d")}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-2 border-[hsl(var(--welcome-color-1))] bg-card" align="start">
          <Calendar
            mode="single"
            selected={selectedCalendarDate}
            onSelect={setSelectedCalendarDate}
            initialFocus
            modifiers={{
              taskDay: tasks.map(task => task.date),
            }}
            modifiersStyles={{
              taskDay: { position: 'relative' },
            }}
            classNames={{
              day_selected: "bg-[hsl(var(--welcome-color-2))] text-background hover:bg-[hsl(var(--welcome-color-2))] hover:text-background",
              day_today: "border-2 border-[hsl(var(--welcome-color-2))] text-[hsl(var(--welcome-color-1))] font-bold",
            }}
            components={{
              DayContent: (props) => {
                const isTaskDay = tasks.some(task => isSameDay(task.date, props.date));
                return (
                  <div className="relative flex items-center justify-center h-full w-full">
                    {props.date.getDate()}
                    {isTaskDay && <Dot className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-4 w-4 text-[hsl(var(--welcome-color-2))] fill-[hsl(var(--welcome-color-2))]" />}
                  </div>
                );
              }
            }}
          />
          {selectedCalendarDate && tasksForSelectedDate.length > 0 && (
            <div className="p-4 border-t border-[hsl(var(--welcome-color-1))/30]">
              <h4 className="text-sm font-semibold mb-2 text-[hsl(var(--welcome-color-1))]">Tasks for {format(selectedCalendarDate, "PPP")}:</h4>
              <ScrollArea className="h-[100px]">
                <ul className="space-y-1.5 text-xs">
                  {tasksForSelectedDate.map(task => (
                    <li key={task.id} className="p-1.5 bg-secondary/50 rounded-md border border-[hsl(var(--welcome-color-1))/20]">
                      <p className="font-medium text-secondary-foreground">{task.title}</p>
                      <p className="text-muted-foreground">{task.description}</p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          )}
          {selectedCalendarDate && tasksForSelectedDate.length === 0 && (
              <div className="p-4 border-t border-[hsl(var(--welcome-color-1))/30] text-center">
                   <p className="text-xs text-muted-foreground">No tasks for {format(selectedCalendarDate, "PPP")}.</p>
              </div>
          )}
           <div className="p-2 border-t border-[hsl(var(--welcome-color-1))/30] text-center">
               <Button variant="link" size="sm" className="text-xs text-[hsl(var(--welcome-color-1))] hover:text-[hsl(var(--welcome-color-2))]">View Full Schedule</Button>
           </div>
        </PopoverContent>
      </Popover>

      {/* Separator */}
      <div className="h-6 w-px bg-border" />

      {/* Right Side: Clock */}
      <Popover open={isClockWidgetPopoverOpen} onOpenChange={setIsClockWidgetPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost" 
            className="flex-1 justify-center text-left font-normal text-xs sm:text-sm rounded-md h-auto p-2 text-foreground hover:bg-accent/10 focus-visible:ring-ring"
            aria-label="Open clock, timer, and reminders widget"
          >
            <span className="font-semibold">{format(currentDateTime, "p")}</span>
            <Clock className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 rounded-xl shadow-xl border-2 border-[hsl(var(--welcome-color-3))] bg-card" align="end">
          <ClockWidget onClose={() => setIsClockWidgetPopoverOpen(false)} />
        </PopoverContent>
      </Popover>
    </div>
  );
};
