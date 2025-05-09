"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RoundNote {
  id: string;
  date: Date;
  notes: string;
  patientName: string;
}

interface Reminder {
  id: string;
  text: string;
  dateTime: Date;
  patientName: string;
}

export function PatientTabs() {
  const [roundNotes, setRoundNotes] = useState<RoundNote[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  
  const [roundPatientName, setRoundPatientName] = useState('');
  const [roundNoteText, setRoundNoteText] = useState('');
  const [roundDate, setRoundDate] = useState<Date | undefined>(new Date());

  const [reminderPatientName, setReminderPatientName] = useState('');
  const [reminderText, setReminderText] = useState('');
  const [reminderDateTime, setReminderDateTime] = useState<Date | undefined>(new Date());
  
  // Effect to ensure client-side only execution for Date
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleAddRoundNote = () => {
    if (!roundPatientName || !roundNoteText || !roundDate || !isClient) return;
    const newNote: RoundNote = {
      id: Date.now().toString(),
      patientName: roundPatientName,
      date: roundDate,
      notes: roundNoteText,
    };
    setRoundNotes(prev => [newNote, ...prev]);
    setRoundPatientName('');
    setRoundNoteText('');
  };

  const handleAddReminder = () => {
    if (!reminderPatientName || !reminderText || !reminderDateTime || !isClient) return;
    const newReminder: Reminder = {
      id: Date.now().toString(),
      patientName: reminderPatientName,
      text: reminderText,
      dateTime: reminderDateTime,
    };
    setReminders(prev => [newReminder, ...prev].sort((a,b) => a.dateTime.getTime() - b.dateTime.getTime()));
    setReminderPatientName('');
    setReminderText('');
  };

  const deleteRoundNote = (id: string) => {
    setRoundNotes(prev => prev.filter(note => note.id !== id));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };


  if (!isClient) {
    return <div className="flex justify-center items-center min-h-[200px]"><p>Loading patient management tools...</p></div>;
  }

  return (
    <Tabs defaultValue="rounds" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="rounds">Rounds</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="reminders">Reminders</TabsTrigger>
      </TabsList>

      <TabsContent value="rounds">
        <Card>
          <CardHeader>
            <CardTitle>Patient Rounds</CardTitle>
            <CardDescription>Log notes from patient rounds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="round-patient-name">Patient Name</Label>
              <Input id="round-patient-name" placeholder="Enter patient name" value={roundPatientName} onChange={e => setRoundPatientName(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="round-date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !roundDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {roundDate ? format(roundDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={roundDate}
                    onSelect={setRoundDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="round-notes">Notes</Label>
              <Textarea id="round-notes" placeholder="Enter round notes..." value={roundNoteText} onChange={e => setRoundNoteText(e.target.value)} className="min-h-[100px]" />
            </div>
            <Button onClick={handleAddRoundNote} className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Add Round Note</Button>
            
            <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
              {roundNotes.length === 0 && <p className="text-muted-foreground text-center">No round notes yet.</p>}
              {roundNotes.map(note => (
                <Card key={note.id} className="bg-secondary">
                  <CardHeader className="flex flex-row justify-between items-start pb-2">
                    <div>
                      <CardTitle className="text-md text-secondary-foreground">{note.patientName}</CardTitle>
                      <CardDescription className="text-xs text-secondary-foreground/80">{format(note.date, "PPP")}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteRoundNote(note.id)} className="text-destructive-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-secondary-foreground whitespace-pre-wrap">{note.notes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="timeline">
        <Card>
          <CardHeader>
            <CardTitle>Patient Timeline</CardTitle>
            <CardDescription>View a chronological timeline of patient events and notes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center min-h-[200px] flex items-center justify-center">
              Patient timeline feature coming soon.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reminders">
        <Card>
          <CardHeader>
            <CardTitle>Set Reminders</CardTitle>
            <CardDescription>Create reminders for patient care tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reminder-patient-name">Patient Name</Label>
              <Input id="reminder-patient-name" placeholder="Enter patient name" value={reminderPatientName} onChange={e => setReminderPatientName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-datetime">Date & Time</Label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !reminderDateTime && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {reminderDateTime ? format(reminderDateTime, "PPP HH:mm") : <span>Pick date and time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={reminderDateTime}
                    onSelect={(date) => {
                        if(date && reminderDateTime) {
                            const newDate = new Date(date);
                            newDate.setHours(reminderDateTime.getHours());
                            newDate.setMinutes(reminderDateTime.getMinutes());
                            setReminderDateTime(newDate);
                        } else {
                             setReminderDateTime(date);
                        }
                    }}
                    initialFocus
                  />
                  <div className="p-2 border-t">
                    <Label htmlFor="reminder-time">Time</Label>
                    <Input type="time" id="reminder-time" 
                           value={reminderDateTime ? format(reminderDateTime, "HH:mm") : ""}
                           onChange={e => {
                               if (reminderDateTime) {
                                   const [hours, minutes] = e.target.value.split(':');
                                   const newDate = new Date(reminderDateTime);
                                   newDate.setHours(parseInt(hours, 10));
                                   newDate.setMinutes(parseInt(minutes, 10));
                                   setReminderDateTime(newDate);
                               }
                           }}/>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-text">Reminder Details</Label>
              <Textarea id="reminder-text" placeholder="e.g., Administer medication, Check vitals" value={reminderText} onChange={e => setReminderText(e.target.value)} />
            </div>
            <Button onClick={handleAddReminder} className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Add Reminder</Button>

            <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
              {reminders.length === 0 && <p className="text-muted-foreground text-center">No reminders set yet.</p>}
              {reminders.map(reminder => (
                <Card key={reminder.id} className="bg-accent">
                   <CardHeader className="flex flex-row justify-between items-start pb-2">
                    <div>
                      <CardTitle className="text-md text-accent-foreground">{reminder.patientName}</CardTitle>
                      <CardDescription className="text-xs text-accent-foreground/80">
                        <Clock className="inline-block h-3 w-3 mr-1" />
                        {format(reminder.dateTime, "PPP, HH:mm")}
                      </CardDescription>
                    </div>
                     <Button variant="ghost" size="icon" onClick={() => deleteReminder(reminder.id)} className="text-destructive-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-accent-foreground">{reminder.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
