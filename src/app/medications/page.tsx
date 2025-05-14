// src/app/medications/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { MedicationForm } from '@/components/medications/medication-form';
import { MedicationListItem } from '@/components/medications/medication-list-item';
import { DrugInteractionChecker } from '@/components/medications/drug-interaction-checker'; // New import
import type { Medication, MedicationLogEntry, MedicationRefillInfo, MedicationSchedule } from '@/types/medication';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PlusCircle, PillIcon, Info, Loader2, CalendarClock, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MedicationManagementAnimation } from '@/components/medications/medication-management-animation';
import { format, addHours, addDays, setHours, setMinutes, setSeconds, isFuture, parse, getDay, nextDay } from 'date-fns';
import { daysOfWeek } from '@/types/medication';
import { Card, CardHeader, CardTitle as CardTitleComponent, CardDescription as CardDescriptionComponent, CardContent } from '@/components/ui/card'; // Renamed for clarity


// Helper function to calculate upcoming conceptual doses
const getUpcomingDoses = (medication: Medication, count: number = 5): Date[] => {
  if (!medication.schedule) return [];

  const upcoming: Date[] = [];
  const now = new Date();
  let { type, times, intervalHours, daysOfWeek: scheduledDays, specificDate, customInstructions } = medication.schedule;

  if (type === "Specific date (one-time)") {
    if (specificDate && isFuture(new Date(specificDate))) {
      upcoming.push(new Date(specificDate));
    }
    return upcoming;
  }

  if (type === "As needed (PRN)" || type === "Other (custom)") {
    // Cannot predict for these types easily, could show custom instructions if available
    return [];
  }
  
  let startDate = now;
  // For "Every X hours", might want to base off prescription time or a fixed daily start
  if (type === "Every X hours" && medication.prescriptionDate) {
      const prescriptionTime = new Date(medication.prescriptionDate);
      // Start from the prescription time on the prescription date, or now if that's in the past
      let baseTime = setHours(setMinutes(setSeconds(new Date(medication.prescriptionDate), 0), prescriptionTime.getMinutes()), prescriptionTime.getHours());
      if (baseTime < now) {
          // find the first relevant slot from now
          while(baseTime < now) {
            baseTime = addHours(baseTime, intervalHours || 24);
          }
      }
      startDate = baseTime;
  }


  for (let i = 0; i < count * (type === "Every X hours" ? 1 : (scheduledDays?.length || 1) * (times?.length || 1) + 7); i++) { // Iterate more for safety
    if (upcoming.length >= count) break;

    let potentialDoseDate: Date | null = null;

    if (type === "Every X hours" && intervalHours) {
        potentialDoseDate = addHours(startDate, i * intervalHours);
    } else if (times && times.length > 0) {
        for (const timeStr of times) {
            const [hour, minute] = timeStr.split(':').map(Number);
            let candidateDate = setSeconds(setMinutes(setHours(addDays(now, Math.floor(i / times.length)), hour), minute), 0);
            
            if (type === "Specific days of week" && scheduledDays && scheduledDays.length > 0) {
                const dayIndex = getDay(candidateDate); // Sunday is 0, Monday is 1
                const dayMap = {"Sun":0, "Mon":1, "Tue":2, "Wed":3, "Thu":4, "Fri":5, "Sat":6};
                
                let iterationDay = candidateDate;
                for(let k=0; k<7; k++) { // Check next 7 days including today
                    const currentDayJsIndex = getDay(iterationDay);
                    if (scheduledDays.some(d => dayMap[d] === currentDayJsIndex)) {
                        let finalCandidate = setSeconds(setMinutes(setHours(new Date(iterationDay),hour),minute),0);
                        if (isFuture(finalCandidate) && !upcoming.find(d => d.getTime() === finalCandidate.getTime())) {
                           potentialDoseDate = finalCandidate;
                           break; // found a date for this time slot on a scheduled day
                        }
                    }
                    iterationDay = addDays(iterationDay, 1); // Move to next day
                }
                 if(potentialDoseDate) break; // break outer loop for times if one is found
            } else { // For "Once daily", "Twice daily" etc.
                 potentialDoseDate = candidateDate;
            }
             if (potentialDoseDate && isFuture(potentialDoseDate) && !upcoming.find(d => d.getTime() === potentialDoseDate.getTime())) {
                upcoming.push(potentialDoseDate);
                if (upcoming.length >= count) break;
            }
        }
    }
    if (type !== "Every X hours" && type !== "Specific days of week" && i > 7 && upcoming.length === 0) break; // Safety for daily types if no future found in a week
  }
  
  return upcoming.sort((a,b) => a.getTime() - b.getTime()).slice(0, count);
};


export default function MedicationManagementPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);

  const [showRemindersDialog, setShowRemindersDialog] = useState(false);
  const [selectedMedicationForReminders, setSelectedMedicationForReminders] = useState<Medication | null>(null);

  const upcomingDoses = useMemo(() => {
    if (selectedMedicationForReminders) {
      return getUpcomingDoses(selectedMedicationForReminders);
    }
    return [];
  }, [selectedMedicationForReminders]);

  // Load medications from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const storedMeds = localStorage.getItem('medications');
    if (storedMeds) {
      try {
        const parsedMeds = JSON.parse(storedMeds) as Medication[];
        const medsWithDates = parsedMeds.map(med => ({
          ...med,
          prescriptionDate: new Date(med.prescriptionDate),
          schedule: med.schedule ? {
            ...med.schedule,
            specificDate: med.schedule.specificDate ? new Date(med.schedule.specificDate) : undefined,
          } : undefined,
          log: med.log?.map(l => ({
            ...l,
            date: new Date(l.date)
          } as MedicationLogEntry)) || [],
          refillInfo: med.refillInfo ? {
            ...med.refillInfo,
            lastRefillDate: med.refillInfo.lastRefillDate ? new Date(med.refillInfo.lastRefillDate) : undefined,
          } as MedicationRefillInfo : undefined,
          photoUrl: med.photoUrl || "",
          personalNotes: med.personalNotes || "",
        }));
        setMedications(medsWithDates);
      } catch (e) {
        console.error("Failed to parse medications from localStorage", e);
        localStorage.removeItem('medications');
      }
    }
  }, []);

  // Save medications to localStorage whenever they change
  useEffect(() => {
    if (isClient && (medications.length > 0 || localStorage.getItem('medications'))) {
      localStorage.setItem('medications', JSON.stringify(medications));
    }
  }, [medications, isClient]);

  const handleAddOrUpdateMedication = (medication: Medication) => {
    setMedications(prevMeds => {
      const existingIndex = prevMeds.findIndex(m => m.id === medication.id);
      if (existingIndex > -1) {
        const updatedMeds = [...prevMeds];
        updatedMeds[existingIndex] = {
          ...medication,
          log: updatedMeds[existingIndex].log || [], // Preserve existing log
          refillInfo: medication.refillInfo || updatedMeds[existingIndex].refillInfo, // Preserve existing refill info
          photoUrl: medication.photoUrl,
          personalNotes: medication.personalNotes,
        };
        return updatedMeds;
      } else {
        // Ensure log is initialized for new medications
        return [{ ...medication, log: medication.log || [], photoUrl: medication.photoUrl, personalNotes: medication.personalNotes }, ...prevMeds];
      }
    });
    setShowFormModal(false);
    setEditingMedication(null);
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setShowFormModal(true);
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(prevMeds => prevMeds.filter(m => m.id !== id));
    toast({ title: "Medication Removed", description: "The medication has been deleted from your list." });
  };

  const handleLogDose = (medicationId: string, status: MedicationLogEntry['status']) => {
    setMedications(prevMeds =>
      prevMeds.map(med => {
        if (med.id === medicationId) {
          const newLogEntry: MedicationLogEntry = { date: new Date(), status };
          return {
            ...med,
            log: [...(med.log || []), newLogEntry], // Ensure log array exists
          };
        }
        return med;
      })
    );
    toast({ title: `Dose Logged`, description: `Marked as ${status} for today.` });
  };

  const openAddMedicationModal = () => {
    setEditingMedication(null);
    setShowFormModal(true);
  }

  const handleViewReminders = (medication: Medication) => {
    setSelectedMedicationForReminders(medication);
    setShowRemindersDialog(true);
  };

  if (!isClient) {
    return (
      <PageWrapper title="Loading Medications..." className="flex-1 flex flex-col h-full p-0 sm:p-0">
        <div className="flex-1 flex flex-col h-full items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </PageWrapper>
    );
  }

  if (showAnimation) {
    return <MedicationManagementAnimation onAnimationComplete={() => setShowAnimation(false)} />;
  }

  return (
    <PageWrapper title="Medication Management" className="pb-16">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">Log and manage your prescribed medications, schedules, and adherence.</p>
        <Button onClick={openAddMedicationModal} className="rounded-lg group">
          <PlusCircle className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-90" /> Add Medication
        </Button>
      </div>

      <Alert variant="default" className="mb-6 border-amber-500/50 bg-amber-500/10">
        <Info className="h-5 w-5 text-amber-600" />
        <AlertTitle className="font-semibold text-amber-700 dark:text-amber-500">Important Note</AlertTitle>
        <AlertDescription className="text-amber-600/90 dark:text-amber-500/90 text-xs">
          This tool is for personal medication tracking and adherence support. It is not a substitute for professional medical advice. Always consult your doctor or pharmacist regarding your medications.
        </AlertDescription>
      </Alert>

      {medications.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-xl shadow-inner">
          <PillIcon className="mx-auto h-16 w-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">No medications logged yet.</p>
          <p className="text-sm">Click "Add Medication" to get started.</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-var(--header-height,4rem)-280px)] pr-3 -mr-3"> {/* Adjusted height */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medications.map(med => (
              <MedicationListItem
                key={med.id}
                medication={med}
                onEdit={handleEditMedication}
                onDelete={handleDeleteMedication}
                onLogDose={handleLogDose}
                onViewReminders={handleViewReminders}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      <Dialog open={showFormModal} onOpenChange={(open) => {
        setShowFormModal(open);
        if (!open) setEditingMedication(null);
      }}>
        <DialogContent className="sm:max-w-2xl p-0">
          {/* Header is inside MedicationForm */}
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <MedicationForm
                onAddMedication={handleAddOrUpdateMedication}
                existingMedication={editingMedication}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog for Viewing Conceptual Reminders */}
      <Dialog open={showRemindersDialog} onOpenChange={setShowRemindersDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              Upcoming Doses for {selectedMedicationForReminders?.name}
            </DialogTitle>
            <DialogDescription>
              This shows conceptual upcoming scheduled times. Actual reminders need to be set up with your device.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-60 mt-4">
            {upcomingDoses.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {upcomingDoses.map((doseDate, index) => (
                  <li key={index} className="p-2 bg-muted/50 rounded-md border">
                    {format(doseDate, "PPPp")} ({format(doseDate, "EEEE")})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming scheduled doses calculable for this medication, or schedule type not yet supported for conceptual view.
                 (e.g. "As Needed" or complex "Other" schedules).
              </p>
            )}
          </ScrollArea>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-md">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drug Interaction Checker Section */}
      <div className="mt-12">
        <Card className="shadow-lg rounded-xl border-border/50">
            <CardHeader>
                <CardTitleComponent className="text-xl flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Drug Interaction Checker (Basic)
                </CardTitleComponent>
                <CardDescriptionComponent>
                    Check for potential interactions between two drugs. This tool provides basic information and is not a substitute for professional advice.
                </CardDescriptionComponent>
            </CardHeader>
            <CardContent>
                <DrugInteractionChecker />
            </CardContent>
        </Card>
      </div>

    </PageWrapper>
  );
}