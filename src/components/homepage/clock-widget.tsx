// src/components/homepage/clock-widget.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlarmClockCheck, TimerIcon, BellRing, PlusCircle, Play, Pause, RotateCcw, Trash2 } from 'lucide-react';
import { format, addSeconds, differenceInSeconds } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Reminder {
  id: string;
  text: string;
  dateTime: Date;
}

interface ClockWidgetProps {
  onClose: () => void;
}

export function ClockWidget({ onClose }: ClockWidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  // Timer State
  const [timerInputHours, setTimerInputHours] = useState(0);
  const [timerInputMinutes, setTimerInputMinutes] = useState(5);
  const [timerInputSeconds, setTimerInputSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerIntervalId, setTimerIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Reminder State
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderDateTime, setNewReminderDateTime] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const startTimer = useCallback(() => {
    if (timeLeft <= 0) {
      const totalSeconds = timerInputHours * 3600 + timerInputMinutes * 60 + timerInputSeconds;
      if (totalSeconds <= 0) {
        toast({ title: "Invalid Duration", description: "Please set a timer duration.", variant: "destructive" });
        return;
      }
      setTimeLeft(totalSeconds);
    }
    setIsTimerRunning(true);
    if (timerIntervalId) clearInterval(timerIntervalId); // Clear existing interval
    const newIntervalId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(newIntervalId);
          setIsTimerRunning(false);
          toast({ title: "Timer Finished!", description: "Your timer has ended." });
          // Optional: Play a sound
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerIntervalId(newIntervalId);
  }, [timeLeft, timerInputHours, timerInputMinutes, timerInputSeconds, timerIntervalId, toast]);

  const pauseTimer = () => {
    setIsTimerRunning(false);
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      setTimerIntervalId(null);
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(timerInputHours * 3600 + timerInputMinutes * 60 + timerInputSeconds);
  };
  
  const clearTimerInputsAndReset = () => {
    pauseTimer();
    setTimerInputHours(0);
    setTimerInputMinutes(5); // Default back
    setTimerInputSeconds(0);
    setTimeLeft(0); // Reset timeLeft as well
  }

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleAddReminder = () => {
    if (!newReminderText.trim() || !newReminderDateTime) {
      toast({ title: "Reminder Incomplete", description: "Please enter reminder text and select a date/time.", variant: "destructive" });
      return;
    }
    const newReminder: Reminder = {
      id: Date.now().toString(),
      text: newReminderText,
      dateTime: newReminderDateTime,
    };
    setReminders(prev => [...prev, newReminder].sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()));
    setNewReminderText('');
    setNewReminderDateTime(new Date()); // Reset to now for next reminder
    toast({ title: "Reminder Set", description: `Reminder "${newReminder.text}" scheduled.` });
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    toast({ title: "Reminder Deleted" });
  };


  return (
    <Card className="border-none shadow-none">
      <Tabs defaultValue="clock" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 rounded-t-xl rounded-b-none">
          <TabsTrigger value="clock" className="text-xs h-full"><AlarmClockCheck className="mr-1 h-4 w-4" />Clock</TabsTrigger>
          <TabsTrigger value="timer" className="text-xs h-full"><TimerIcon className="mr-1 h-4 w-4" />Timer</TabsTrigger>
          <TabsTrigger value="reminders" className="text-xs h-full"><BellRing className="mr-1 h-4 w-4" />Reminders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clock" className="p-4 pt-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-primary tabular-nums">{format(currentTime, "HH:mm")}</p>
            <p className="text-sm text-muted-foreground">{format(currentTime, "ss 'sec'")}</p>
            <p className="text-lg text-foreground mt-1">{format(currentTime, "eeee, MMMM do")}</p>
          </div>
        </TabsContent>

        <TabsContent value="timer" className="p-4 space-y-4">
          <CardTitle className="text-lg text-center">Timer</CardTitle>
           <div className="text-center my-4">
            <p className="text-4xl font-bold text-primary tabular-nums">
              {formatTime(timeLeft > 0 ? timeLeft : (timerInputHours * 3600 + timerInputMinutes * 60 + timerInputSeconds))}
            </p>
          </div>
          <div className="flex gap-2 items-end">
            <div>
              <Label htmlFor="timer-hours" className="text-xs">H</Label>
              <Input id="timer-hours" type="number" min="0" max="23" value={timerInputHours} onChange={e => setTimerInputHours(parseInt(e.target.value) || 0)} className="h-8 text-sm rounded-md" disabled={isTimerRunning}/>
            </div>
            <div>
              <Label htmlFor="timer-minutes" className="text-xs">M</Label>
              <Input id="timer-minutes" type="number" min="0" max="59" value={timerInputMinutes} onChange={e => setTimerInputMinutes(parseInt(e.target.value) || 0)} className="h-8 text-sm rounded-md" disabled={isTimerRunning}/>
            </div>
            <div>
              <Label htmlFor="timer-seconds" className="text-xs">S</Label>
              <Input id="timer-seconds" type="number" min="0" max="59" value={timerInputSeconds} onChange={e => setTimerInputSeconds(parseInt(e.target.value) || 0)} className="h-8 text-sm rounded-md" disabled={isTimerRunning}/>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-3">
            {!isTimerRunning || timeLeft === 0 ? (
              <Button onClick={startTimer} size="sm" className="rounded-md bg-green-600 hover:bg-green-500 text-white">
                <Play className="mr-1 h-4 w-4"/> Start
              </Button>
            ) : (
              <Button onClick={pauseTimer} size="sm" className="rounded-md bg-amber-500 hover:bg-amber-600 text-white">
                <Pause className="mr-1 h-4 w-4"/> Pause
              </Button>
            )}
            <Button onClick={resetTimer} variant="outline" size="sm" className="rounded-md" disabled={timeLeft === 0 && !isTimerRunning}>
                <RotateCcw className="mr-1 h-4 w-4"/> Reset
            </Button>
          </div>
           <Button onClick={clearTimerInputsAndReset} variant="ghost" size="sm" className="w-full text-xs text-muted-foreground rounded-md mt-1" disabled={isTimerRunning}>
             Clear & Reset Duration
            </Button>
        </TabsContent>

        <TabsContent value="reminders" className="p-4 space-y-3">
          <CardTitle className="text-lg text-center">Reminders</CardTitle>
          <div className="space-y-2">
            <div>
              <Label htmlFor="reminder-text" className="text-xs">Reminder Note</Label>
              <Input id="reminder-text" value={newReminderText} onChange={e => setNewReminderText(e.target.value)} placeholder="e.g., Call patient Smith" className="h-8 text-sm rounded-md" />
            </div>
            <div>
              <Label htmlFor="reminder-datetime" className="text-xs">Date & Time</Label>
              <DatePicker date={newReminderDateTime} setDate={setNewReminderDateTime} buttonId="reminder-datetime" buttonClassName="h-8 text-sm rounded-md w-full" />
            </div>
            <div className="pt-1">
                 <Input type="time" className="h-8 text-sm rounded-md w-full"
                    value={newReminderDateTime ? format(newReminderDateTime, "HH:mm") : ""}
                    onChange={(e) => {
                        const newDate = newReminderDateTime ? new Date(newReminderDateTime) : new Date();
                        const [hours, minutes] = e.target.value.split(':');
                        newDate.setHours(parseInt(hours, 10));
                        newDate.setMinutes(parseInt(minutes, 10));
                        setNewReminderDateTime(newDate);
                    }}
                 />
            </div>
            <Button onClick={handleAddReminder} size="sm" className="w-full rounded-md">
              <PlusCircle className="mr-1 h-4 w-4"/> Add Reminder
            </Button>
          </div>
          <ScrollArea className="h-32 border rounded-md p-2 bg-muted/30">
            {reminders.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No reminders set.</p>}
            <ul className="space-y-1.5">
              {reminders.map(reminder => (
                <li key={reminder.id} className="text-xs p-1.5 bg-background rounded-md shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">{reminder.text}</p>
                    <p className="text-muted-foreground">{format(reminder.dateTime, "MMM d, yyyy 'at' HH:mm")}</p>
                  </div>
                  <Button variant="ghost" size="iconSm" onClick={() => deleteReminder(reminder.id)} className="text-destructive h-6 w-6 rounded-full">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
