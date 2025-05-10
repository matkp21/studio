
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
import { CalendarIcon, Clock, PlusCircle, Trash2, ListFilter, Activity, BellPlus } from "lucide-react";
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

  const deleteRoundNote = (id: string, patientName: string) => {
    setRoundNotes(prev => prev.filter(note => note.id !== id));
  };

  const deleteReminder = (id: string, patientName: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };


  if (!isClient) {
    return <div className="flex justify-center items-center min-h-[200px]"><p>Loading patient management tools...</p></div>;
  }

  const tabTriggerClassName = cn(
    "flex-1 justify-center px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
    // Inactive state (default)
    "text-foreground/70 hover:bg-background/50 hover:text-foreground",
    // Active state override
    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:hover:bg-primary/90"
  );

  return (
    <Tabs defaultValue="rounds" className="w-full">
      <TabsList className="flex space-x-1 bg-muted p-1 rounded-xl shadow-md mb-6">
        <TabsTrigger value="rounds" className={tabTriggerClassName}>
          <Activity className="mr-2 h-5 w-5" />
          Rounds
        </TabsTrigger>
        <TabsTrigger value="timeline" className={tabTriggerClassName}>
          <ListFilter className="mr-2 h-5 w-5" />
          Timeline
        </TabsTrigger>
        <TabsTrigger value="reminders" className={tabTriggerClassName}>
          <BellPlus className="mr-2 h-5 w-5" />
          Reminders
        </TabsTrigger>
      </TabsList>

      <TabsContent value="rounds">
        <Card className="shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Patient Rounds</CardTitle>
            <CardDescription>Log notes from patient rounds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="round-patient-name">Patient Name</Label>
                <Input id="round-patient-name" placeholder="Enter patient name" value={roundPatientName} onChange={e => setRoundPatientName(e.target.value)} className="rounded-lg"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="round-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="round-date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-lg",
                        !roundDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {roundDate ? format(roundDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl">
                    <Calendar
                      mode="single"
                      selected={roundDate}
                      onSelect={setRoundDate}
                      initialFocus
                      aria-label="Select round date"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="round-notes">Notes</Label>
              <Textarea id="round-notes" placeholder="Enter round notes..." value={roundNoteText} onChange={e => setRoundNoteText(e.target.value)} className="min-h-[100px] rounded-lg" />
            </div>
            <Button onClick={handleAddRoundNote} className="w-full rounded-lg py-3 text-base group" aria-label="Add new round note">
              <PlusCircle className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" /> Add Round Note
            </Button>
            
            <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto p-1">
              {roundNotes.length === 0 && <p className="text-muted-foreground text-center py-10">No round notes yet. Add one above!</p>}
              {roundNotes.map(note => (
                <Card key={note.id} className="bg-card/80 backdrop-blur-sm shadow-sm rounded-lg">
                  <CardHeader className="flex flex-row justify-between items-start pb-2 pt-4 px-4">
                    <div>
                      <CardTitle className="text-md font-semibold text-foreground">{note.patientName}</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">{format(note.date, "PPP, EEEE")}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteRoundNote(note.id, note.patientName)} className="text-destructive hover:bg-destructive/10 rounded-full" aria-label={`Delete round note for ${note.patientName} on ${format(note.date, "PPP")}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{note.notes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="timeline">
        <Card className="shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Patient Timeline</CardTitle>
            <CardDescription>View a chronological timeline of patient events and notes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-center min-h-[200px] flex flex-col items-center justify-center bg-muted/50 rounded-lg p-8">
              <ListFilter className="h-16 w-16 mb-4 text-primary/70" />
              <p className="text-lg font-semibold">Patient Timeline Feature Coming Soon!</p>
              <p className="text-sm">This section is under active development. Stay tuned for updates.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reminders">
        <Card className="shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Set Reminders</CardTitle>
            <CardDescription>Create reminders for patient care tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="reminder-patient-name">Patient Name</Label>
                    <Input id="reminder-patient-name" placeholder="Enter patient name" value={reminderPatientName} onChange={e => setReminderPatientName(e.target.value)} className="rounded-lg" />
                </div>
                <div className="space-y-2">
                <Label htmlFor="reminder-datetime-trigger">Date & Time</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="reminder-datetime-trigger"
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal rounded-lg",
                        !reminderDateTime && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {reminderDateTime ? format(reminderDateTime, "PPP HH:mm") : <span>Pick date and time</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-xl">
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
                        aria-label="Select reminder date"
                    />
                    <div className="p-2 border-t border-border/50">
                        <Label htmlFor="reminder-time" className="text-sm">Time</Label>
                        <Input type="time" id="reminder-time" className="rounded-md mt-1"
                            value={reminderDateTime ? format(reminderDateTime, "HH:mm") : ""}
                            onChange={e => {
                                if (reminderDateTime) {
                                    const [hours, minutes] = e.target.value.split(':');
                                    const newDate = new Date(reminderDateTime);
                                    newDate.setHours(parseInt(hours, 10));
                                    newDate.setMinutes(parseInt(minutes, 10));
                                    setReminderDateTime(newDate);
                                } else {
                                  // Handle case where reminderDateTime is not set yet
                                  const newDate = new Date();
                                  const [hours, minutes] = e.target.value.split(':');
                                  newDate.setHours(parseInt(hours, 10));
                                  newDate.setMinutes(parseInt(minutes, 10));
                                  newDate.setSeconds(0);
                                  newDate.setMilliseconds(0);
                                  setReminderDateTime(newDate);
                                }
                            }}
                            aria-label="Select reminder time"
                            />
                    </div>
                    </PopoverContent>
                </Popover>
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-text">Reminder Details</Label>
              <Textarea id="reminder-text" placeholder="e.g., Administer medication, Check vitals" value={reminderText} onChange={e => setReminderText(e.target.value)} className="rounded-lg" />
            </div>
            <Button onClick={handleAddReminder} className="w-full rounded-lg py-3 text-base group" aria-label="Add new reminder">
                <BellPlus className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:animate-pulse" /> Add Reminder
            </Button>

            <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto p-1">
              {reminders.length === 0 && <p className="text-muted-foreground text-center py-10">No reminders set yet. Add one above!</p>}
              {reminders.map(reminder => (
                <Card key={reminder.id} className="bg-accent/80 backdrop-blur-sm shadow-sm rounded-lg">
                   <CardHeader className="flex flex-row justify-between items-start pb-2 pt-4 px-4">
                    <div>
                      <CardTitle className="text-md font-semibold text-accent-foreground">{reminder.patientName}</CardTitle>
                      <CardDescription className="text-xs text-accent-foreground/80">
                        <Clock className="inline-block h-3 w-3 mr-1" />
                        {format(reminder.dateTime, "PPP, HH:mm ('"+format(reminder.dateTime, "EEEE")+")")}
                      </CardDescription>
                    </div>
                     <Button variant="ghost" size="icon" onClick={() => deleteReminder(reminder.id, reminder.patientName)} className="text-destructive-foreground hover:bg-destructive/20 rounded-full" aria-label={`Delete reminder for ${reminder.patientName} scheduled for ${format(reminder.dateTime, "PPP HH:mm")}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
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
