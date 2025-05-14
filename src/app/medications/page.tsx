// src/app/medications/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { MedicationForm } from '@/components/medications/medication-form';
import { MedicationListItem, type SampleDrugInfo } from '@/components/medications/medication-list-item'; // Import SampleDrugInfo
import { DrugInteractionChecker } from '@/components/medications/drug-interaction-checker';
import type { Medication, MedicationLogEntry, MedicationRefillInfo, MedicationSchedule } from '@/types/medication';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PlusCircle, PillIcon, Info, Loader2, CalendarClock, AlertTriangle, BookOpen } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle as AlertTitleComponent } from '@/components/ui/alert';
import { MedicationManagementAnimation } from '@/components/medications/medication-management-animation';
import { format, addHours, addDays, setHours, setMinutes, setSeconds, isFuture, parse, getDay, nextDay } from 'date-fns';
import { daysOfWeek } from '@/types/medication';
import { Card, CardHeader, CardTitle as CardTitleComponent, CardDescription as CardDescriptionComponent, CardContent } from '@/components/ui/card';


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
    return [];
  }
  
  let startDate = now;
  if (type === "Every X hours" && medication.prescriptionDate) {
      const prescriptionTime = new Date(medication.prescriptionDate);
      let baseTime = setHours(setMinutes(setSeconds(new Date(medication.prescriptionDate), 0), prescriptionTime.getMinutes()), prescriptionTime.getHours());
      if (baseTime < now) {
          while(baseTime < now) {
            baseTime = addHours(baseTime, intervalHours || 24);
          }
      }
      startDate = baseTime;
  }

  for (let i = 0; i < count * (type === "Every X hours" ? 1 : (scheduledDays?.length || 1) * (times?.length || 1) + 7); i++) {
    if (upcoming.length >= count) break;

    let potentialDoseDate: Date | null = null;

    if (type === "Every X hours" && intervalHours) {
        potentialDoseDate = addHours(startDate, i * intervalHours);
    } else if (times && times.length > 0) {
        for (const timeStr of times) {
            const [hour, minute] = timeStr.split(':').map(Number);
            let candidateDate = setSeconds(setMinutes(setHours(addDays(now, Math.floor(i / times.length)), hour), minute), 0);
            
            if (type === "Specific days of week" && scheduledDays && scheduledDays.length > 0) {
                const dayMap = {"Sun":0, "Mon":1, "Tue":2, "Wed":3, "Thu":4, "Fri":5, "Sat":6};
                
                let iterationDay = candidateDate;
                for(let k=0; k<7; k++) {
                    const currentDayJsIndex = getDay(iterationDay);
                    if (scheduledDays.some(d => dayMap[d] === currentDayJsIndex)) {
                        let finalCandidate = setSeconds(setMinutes(setHours(new Date(iterationDay),hour),minute),0);
                        if (isFuture(finalCandidate) && !upcoming.find(d => d.getTime() === finalCandidate.getTime())) {
                           potentialDoseDate = finalCandidate;
                           break; 
                        }
                    }
                    iterationDay = addDays(iterationDay, 1); 
                }
                 if(potentialDoseDate) break; 
            } else { 
                 potentialDoseDate = candidateDate;
            }
             if (potentialDoseDate && isFuture(potentialDoseDate) && !upcoming.find(d => d.getTime() === potentialDoseDate.getTime())) {
                upcoming.push(potentialDoseDate);
                if (upcoming.length >= count) break;
            }
        }
    }
    if (type !== "Every X hours" && type !== "Specific days of week" && i > 7 && upcoming.length === 0) break;
  }
  
  return upcoming.sort((a,b) => a.getTime() - b.getTime()).slice(0, count);
};

// Sample drug info database for API simulation
const sampleApiDrugInfo: Record<string, SampleDrugInfo> = {
  "aspirin": {
    description: "Aspirin is a nonsteroidal anti-inflammatory drug (NSAID). It was the first of this class of drugs to be discovered. It is used to reduce pain, fever, and inflammation.",
    commonUses: ["Pain relief (headaches, muscle aches, arthritis)", "Fever reduction", "Prevention of blood clots (low dose)"],
    generalAdvice: ["Take with food or milk to reduce stomach upset.", "Do not give to children or teenagers with flu-like symptoms (risk of Reye's syndrome).", "Consult your doctor if you have bleeding disorders or are taking anticoagulants."],
  },
  "metformin": {
    description: "Metformin is an oral medication used to treat type 2 diabetes. It helps control blood sugar levels by reducing glucose production by the liver and improving insulin sensitivity.",
    commonUses: ["Type 2 diabetes mellitus"],
    generalAdvice: ["Take with meals to reduce gastrointestinal side effects.", "Monitor kidney function regularly.", "Be aware of symptoms of lactic acidosis (rare but serious)."],
  },
  "amoxicillin": {
    description: "Amoxicillin is an antibiotic in the penicillin group of drugs. It fights bacteria in your body.",
    commonUses: ["Bacterial infections (e.g., ear infections, pneumonia, bronchitis, urinary tract infections, skin infections)."],
    generalAdvice: ["Take the full course of medication as prescribed, even if you feel better.", "Inform your doctor of any allergies to penicillin or other antibiotics.", "May decrease the effectiveness of oral contraceptives."],
  }
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

  const [showDrugInfoDialog, setShowDrugInfoDialog] = useState(false);
  const [selectedMedicationForInfo, setSelectedMedicationForInfo] = useState<Medication | null>(null);
  const [drugInfoLoading, setDrugInfoLoading] = useState(false);
  const [fetchedDrugInfo, setFetchedDrugInfo] = useState<SampleDrugInfo | null>(null);

  const upcomingDoses = useMemo(() => {
    if (selectedMedicationForReminders) {
      return getUpcomingDoses(selectedMedicationForReminders);
    }
    return [];
  }, [selectedMedicationForReminders]);

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
          log: updatedMeds[existingIndex].log || [], 
          refillInfo: medication.refillInfo || updatedMeds[existingIndex].refillInfo, 
          photoUrl: medication.photoUrl,
          personalNotes: medication.personalNotes,
        };
        return updatedMeds;
      } else {
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
            log: [...(med.log || []), newLogEntry], 
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

  const handleViewDrugInfo = (medication: Medication) => {
    setSelectedMedicationForInfo(medication);
    setDrugInfoLoading(true);
    setFetchedDrugInfo(null);
    setShowDrugInfoDialog(true);

    // Simulate API call
    setTimeout(() => {
      const drugKey = medication.name.toLowerCase().split(" ")[0]; // Simple key for demo
      const info = sampleApiDrugInfo[drugKey] || null;
      setFetchedDrugInfo(info);
      setDrugInfoLoading(false);
    }, 1500);
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
        <AlertTitleComponent className="font-semibold text-amber-700 dark:text-amber-500">Important Note</AlertTitleComponent>
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
        <ScrollArea className="h-[calc(100vh-var(--header-height,4rem)-280px)] pr-3 -mr-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medications.map(med => (
              <MedicationListItem
                key={med.id}
                medication={med}
                onEdit={handleEditMedication}
                onDelete={handleDeleteMedication}
                onLogDose={handleLogDose}
                onViewReminders={handleViewReminders}
                onViewDrugInfo={handleViewDrugInfo} // Pass new handler
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

      {/* Dialog for Viewing Drug Information */}
      <Dialog open={showDrugInfoDialog} onOpenChange={setShowDrugInfoDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Drug Information: {selectedMedicationForInfo?.name}
            </DialogTitle>
            <DialogDescription>
              General information about the medication. This is for illustrative purposes only.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] mt-4 pr-2">
            {drugInfoLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Fetching information...</p>
              </div>
            ) : fetchedDrugInfo ? (
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground">Description:</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{fetchedDrugInfo.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Common Uses:</h4>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground">
                    {fetchedDrugInfo.commonUses.map((use, i) => <li key={i}>{use}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">General Advice:</h4>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground">
                     {fetchedDrugInfo.generalAdvice.map((advice, i) => <li key={i}>{advice}</li>)}
                  </ul>
                </div>
                 <Alert variant="default" className="mt-4 border-amber-500/50 bg-amber-500/10">
                    <Info className="h-5 w-5 text-amber-600" />
                    <AlertTitleComponent className="font-semibold text-amber-700 dark:text-amber-500">Disclaimer</AlertTitleComponent>
                    <AlertDescription className="text-amber-600/90 dark:text-amber-500/90 text-xs">
                        The information provided is for general knowledge and illustrative purposes only, based on a sample database. It does not substitute professional medical advice. Always consult your doctor or pharmacist for any health concerns or before making decisions about your treatment.
                    </AlertDescription>
                </Alert>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-10">
                No detailed information found in our sample database for "{selectedMedicationForInfo?.name}".
              </p>
            )}
          </ScrollArea>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-md">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>


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
