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
import { CalendarIcon, ClockIcon, Dot } from "lucide-react";

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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const tasksForSelectedDate = tasks.filter(task => selectedDate && isSameDay(task.date, selectedDate));

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-auto min-w-[160px] justify-start text-left font-normal text-sm rounded-lg shadow-sm hover:bg-accent/50 transition-colors h-12"
          aria-label="Open calendar"
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          <span>{format(currentDate, "E, MMM d")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-border/70" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          initialFocus
          modifiers={{
            // Highlight days with tasks
            taskDay: tasks.map(task => task.date),
          }}
          modifiersStyles={{
            taskDay: { position: 'relative' }
          }}
          components={{
            DayContent: (props) => {
              const isTaskDay = tasks.some(task => isSameDay(task.date, props.date));
              return (
                <div className="relative flex items-center justify-center h-full w-full">
                  {props.date.getDate()}
                  {isTaskDay && <Dot className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-4 w-4 text-primary fill-primary" />}
                </div>
              );
            }
          }}
        />
        {selectedDate && tasksForSelectedDate.length > 0 && (
          <div className="p-4 border-t border-border/50">
            <h4 className="text-sm font-semibold mb-2">Tasks for {format(selectedDate, "PPP")}:</h4>
            <ScrollArea className="h-[100px]">
              <ul className="space-y-1.5 text-xs">
                {tasksForSelectedDate.map(task => (
                  <li key={task.id} className="p-1.5 bg-secondary/50 rounded-md">
                    <p className="font-medium text-secondary-foreground">{task.title}</p>
                    <p className="text-muted-foreground">{task.description}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
        {selectedDate && tasksForSelectedDate.length === 0 && (
            <div className="p-4 border-t border-border/50 text-center">
                 <p className="text-xs text-muted-foreground">No tasks for {format(selectedDate, "PPP")}.</p>
            </div>
        )}
         <div className="p-2 border-t border-border/50 text-center">
             <Button variant="link" size="sm" className="text-xs text-primary">View Full Schedule (Conceptual)</Button>
         </div>
      </PopoverContent>
    </Popover>
  );
};

const DigitalClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="flex items-center justify-center h-12 px-4 py-2 text-sm font-medium bg-card border border-border/50 rounded-lg shadow-sm min-w-[120px]">
      <ClockIcon className="mr-2 h-4 w-4 text-primary" />
      <span className="text-foreground">{format(currentTime, "p")}</span>
    </div>
  );
};

interface HeroWidgetsProps {
  tasks: HeroTask[];
}

export const HeroWidgets: React.FC<HeroWidgetsProps> = ({ tasks }) => {
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 py-4 px-2">
      <CompactCalendar tasks={tasks} />
      <DigitalClock />
    </div>
  );
};
