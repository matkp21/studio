// src/components/homepage/hero-widgets.tsx
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { CalendarDays, Clock, Dot } from "lucide-react"; // Changed icons
import { ClockWidget } from './clock-widget';

export interface HeroTask {
  id: string;
  date: Date;
  title: string;
  description: string;
}

interface CompactCalendarProps {
  tasks: HeroTask[];
}

const CompactCalendar: React.FC<CompactCalendarProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCalendarPopoverOpen, setIsCalendarPopoverOpen] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timerId);
  }, []);

  const tasksForSelectedDate = tasks.filter(task => selectedDate && isSameDay(task.date, selectedDate));

  return (
    <Popover open={isCalendarPopoverOpen} onOpenChange={setIsCalendarPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-auto min-w-[160px] justify-start text-left font-normal text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 h-12 bg-card hover:bg-card/90 border-2 border-[hsl(var(--welcome-color-1))] text-foreground"
          aria-label="Open calendar"
        >
          <CalendarDays className="mr-2 h-5 w-5 text-[hsl(var(--welcome-color-1))]" />
          <span className="font-semibold">{format(currentDate, "E, MMM d")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-2 border-[hsl(var(--welcome-color-1))] bg-card" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          initialFocus
          modifiers={{
            taskDay: tasks.map(task => task.date),
          }}
          modifiersStyles={{
            taskDay: { position: 'relative' },
            selected: { backgroundColor: 'hsl(var(--welcome-color-2))', color: 'hsl(var(--background))' },
            today: { borderColor: 'hsl(var(--welcome-color-2))', fontWeight: 'bold'},
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
        {selectedDate && tasksForSelectedDate.length > 0 && (
          <div className="p-4 border-t border-[hsl(var(--welcome-color-1))/30]">
            <h4 className="text-sm font-semibold mb-2 text-[hsl(var(--welcome-color-1))]">Tasks for {format(selectedDate, "PPP")}:</h4>
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
        {selectedDate && tasksForSelectedDate.length === 0 && (
            <div className="p-4 border-t border-[hsl(var(--welcome-color-1))/30] text-center">
                 <p className="text-xs text-muted-foreground">No tasks for {format(selectedDate, "PPP")}.</p>
            </div>
        )}
         <div className="p-2 border-t border-[hsl(var(--welcome-color-1))/30] text-center">
             <Button variant="link" size="sm" className="text-xs text-[hsl(var(--welcome-color-1))] hover:text-[hsl(var(--welcome-color-2))]">View Full Schedule</Button>
         </div>
      </PopoverContent>
    </Popover>
  );
};

const DigitalClockDisplayTrigger = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <Button
        variant="outline"
        className="w-auto min-w-[120px] justify-start text-left font-normal text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 h-12 bg-card hover:bg-card/90 border-2 border-[hsl(var(--welcome-color-3))] text-foreground"
        aria-label="Open clock widget"
      >
      <Clock className="mr-2 h-5 w-5 text-[hsl(var(--welcome-color-3))]" />
      <span className="font-semibold">{format(currentTime, "p")}</span>
    </Button>
  );
};

interface HeroWidgetsProps {
  tasks: HeroTask[];
}

export const HeroWidgets: React.FC<HeroWidgetsProps> = ({ tasks }) => {
  const [isClockWidgetOpen, setIsClockWidgetOpen] = useState(false);

  return (
    <div className="mt-12 flex w-full max-w-lg mx-auto items-center justify-between gap-4 md:gap-8 py-4 px-2"> {/* Increased mt, max-w, gap */}
      <CompactCalendar tasks={tasks} />
      <Popover open={isClockWidgetOpen} onOpenChange={setIsClockWidgetOpen}>
        <PopoverTrigger asChild>
          <DigitalClockDisplayTrigger />
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 rounded-xl shadow-xl border-2 border-[hsl(var(--welcome-color-3))] bg-card" align="end">
           <ClockWidget onClose={() => setIsClockWidgetOpen(false)} />
        </PopoverContent>
      </Popover>
    </div>
  );
};
