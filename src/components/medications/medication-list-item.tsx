// src/components/medications/medication-list-item.tsx
"use client";

import type { Medication } from '@/types/medication';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, CalendarDays, Edit3, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface MedicationListItemProps {
  medication: Medication;
  onEdit: (medication: Medication) => void; // To be implemented
  onDelete: (id: string) => void; // To be implemented
  onSetReminder: (medication: Medication) => void; // To be implemented
}

export function MedicationListItem({ medication, onEdit, onDelete, onSetReminder }: MedicationListItemProps) {
  return (
    <Card className="shadow-md rounded-xl border-border/50 overflow-hidden bg-card/90 backdrop-blur-sm">
      <CardHeader className="p-4 border-b bg-muted/30">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <Pill className="h-5 w-5" />
                    {medication.name}
                </CardTitle>
                <CardDescription className="text-xs">
                    {medication.dosageStrength} - {medication.form} ({medication.route})
                </CardDescription>
            </div>
            <div className="flex items-center gap-1">
                 <Button variant="ghost" size="iconSm" onClick={() => onEdit(medication)} aria-label={`Edit ${medication.name}`} className="text-muted-foreground hover:text-primary">
                    <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="iconSm" onClick={() => onDelete(medication.id)} aria-label={`Delete ${medication.name}`} className="text-destructive/70 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 text-sm space-y-2">
        {medication.reason && <p><span className="font-semibold">Reason:</span> {medication.reason}</p>}
        <p><span className="font-semibold">Prescribed:</span> {format(new Date(medication.prescriptionDate), "PPP")} {medication.prescribingDoctor && `by ${medication.prescribingDoctor}`}</p>
        {medication.duration && <p><span className="font-semibold">Duration:</span> {medication.duration}</p>}
        {medication.instructions && <p><span className="font-semibold">Instructions:</span> {medication.instructions}</p>}
        {medication.quantityPerPrescription && <p><span className="font-semibold">Quantity per Rx:</span> {medication.quantityPerPrescription}</p>}

        {/* Placeholder for schedule display - to be enhanced later */}
        {medication.schedule && (
            <div className="mt-2 pt-2 border-t border-dashed">
                <p className="font-semibold text-xs text-muted-foreground">Schedule:</p>
                <Badge variant="outline" className="text-xs">{medication.schedule.type}</Badge>
                {/* More detailed schedule display here */}
            </div>
        )}
      </CardContent>
      <CardFooter className="p-3 bg-muted/20 border-t flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => onSetReminder(medication)} className="text-xs rounded-md">
          <Clock className="mr-1.5 h-3.5 w-3.5" /> Set/View Reminders
        </Button>
        <Button variant="link" size="sm" onClick={() => alert("Interaction check feature coming soon!")} className="text-xs text-amber-600 dark:text-amber-500 hover:text-amber-700 p-0 h-auto">
          <AlertTriangle className="mr-1 h-3.5 w-3.5" /> Check Interactions
        </Button>
      </CardFooter>
    </Card>
  );
}
