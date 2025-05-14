// src/app/medications/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { MedicationForm } from '@/components/medications/medication-form';
import { MedicationListItem } from '@/components/medications/medication-list-item';
import type { Medication } from '@/types/medication';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PlusCircle, PillIcon, Info } from 'lucide-react';
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


export default function MedicationManagementPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const { toast } = useToast();

  // Load medications from localStorage on mount
  useEffect(() => {
    const storedMeds = localStorage.getItem('medications');
    if (storedMeds) {
      try {
        const parsedMeds = JSON.parse(storedMeds) as Medication[];
        // Ensure dates are correctly parsed back into Date objects
        const medsWithDates = parsedMeds.map(med => ({
          ...med,
          prescriptionDate: new Date(med.prescriptionDate),
          log: med.log?.map(l => ({ ...l, date: new Date(l.date) })),
          refillInfo: med.refillInfo ? {
            ...med.refillInfo,
            lastRefillDate: med.refillInfo.lastRefillDate ? new Date(med.refillInfo.lastRefillDate) : undefined,
          } : undefined,
        }));
        setMedications(medsWithDates);
      } catch (e) {
        console.error("Failed to parse medications from localStorage", e);
        localStorage.removeItem('medications'); // Clear corrupted data
      }
    }
  }, []);

  // Save medications to localStorage whenever they change
  useEffect(() => {
    if (medications.length > 0 || localStorage.getItem('medications')) { // Only save if there's something to save or clear
        localStorage.setItem('medications', JSON.stringify(medications));
    }
  }, [medications]);

  const handleAddOrUpdateMedication = (medication: Medication) => {
    setMedications(prevMeds => {
      const existingIndex = prevMeds.findIndex(m => m.id === medication.id);
      if (existingIndex > -1) {
        // Update existing
        const updatedMeds = [...prevMeds];
        updatedMeds[existingIndex] = medication;
        return updatedMeds;
      } else {
        // Add new
        return [medication, ...prevMeds];
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

  const handleSetReminder = (medication: Medication) => {
    // Placeholder for reminder setting UI/logic
    toast({ title: "Set Reminder", description: `Reminder functionality for ${medication.name} will be implemented here.` });
  };
  
  const openAddMedicationModal = () => {
    setEditingMedication(null);
    setShowFormModal(true);
  }

  return (
    <PageWrapper title="Medication Management" className="pb-16">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">Log and manage your prescribed medications.</p>
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
                onSetReminder={handleSetReminder}
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
           <DialogHeader className="p-6 pb-0">
             {/* Title is now inside MedicationForm */}
          </DialogHeader>
            <ScrollArea className="max-h-[80vh]">
              <div className="p-6 pt-0">
                <MedicationForm
                    onAddMedication={handleAddOrUpdateMedication}
                    existingMedication={editingMedication}
                />
              </div>
            </ScrollArea>
        </DialogContent>
      </Dialog>

    </PageWrapper>
  );
}
