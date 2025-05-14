// src/components/medications/medication-list-item.tsx
"use client";

import type { Medication } from '@/types/medication';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, CalendarDays, Edit3, Trash2, Clock, AlertTriangle, Repeat } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MedicationListItemProps {
  medication: Medication;
  onEdit: (medication: Medication) => void;
  onDelete: (id: string) => void;
  onSetReminder: (medication: Medication) => void;
}

function formatSchedule(schedule?: Medication['schedule']): string {
  if (!schedule) return "Not specified";
  
  let scheduleString = schedule.type;
  
  if (schedule.times && schedule.times.length > 0 && (schedule.type === "Once daily" || schedule.type === "Twice daily" || schedule.type === "Three times daily" || schedule.type === "Four times daily" || schedule.type === "Specific days of week")) {
    scheduleString += ` at ${schedule.times.join(', ')}`;
  }
  if (schedule.intervalHours && schedule.type === "Every X hours") {
    scheduleString += ` (every ${schedule.intervalHours} hrs)`;
  }
  if (schedule.daysOfWeek && schedule.daysOfWeek.length > 0 && schedule.type === "Specific days of week") {
    scheduleString += ` on ${schedule.daysOfWeek.join(', ')}`;
  }
  if (schedule.specificDate && schedule.type === "Specific date (one-time)") {
    scheduleString += ` on ${format(new Date(schedule.specificDate), "PPP")}`;
  }
  if (schedule.customInstructions) {
    scheduleString += ` (${schedule.customInstructions})`;
  }
  return scheduleString;
}


export function MedicationListItem({ medication, onEdit, onDelete, onSetReminder }: MedicationListItemProps) {
  return (
    <Card className="shadow-md rounded-xl border-border/50 overflow-hidden bg-card/90 backdrop-blur-sm flex flex-col">
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
      <CardContent className="p-4 text-sm space-y-2 flex-grow">
        {medication.reason && <p><span className="font-semibold">Reason:</span> {medication.reason}</p>}
        <p><span className="font-semibold">Prescribed:</span> {format(new Date(medication.prescriptionDate), "PPP")} {medication.prescribingDoctor && `by ${medication.prescribingDoctor}`}</p>
        {medication.duration && <p><span className="font-semibold">Duration:</span> {medication.duration}</p>}
        
        {/* Schedule Display */}
        <div className="mt-2 pt-2 border-t border-dashed">
            <p className="font-semibold text-xs text-muted-foreground mb-1 flex items-center gap-1"><Repeat className="h-3.5 w-3.5"/>Schedule:</p>
            <Badge variant="secondary" className="text-xs font-normal whitespace-normal text-left py-1 h-auto leading-snug">
              {formatSchedule(medication.schedule)}
            </Badge>
        </div>

        {medication.instructions && <p className="mt-2 pt-2 border-t border-dashed"><span className="font-semibold">Instructions:</span> {medication.instructions}</p>}
        {medication.quantityPerPrescription && <p><span className="font-semibold">Quantity per Rx:</span> {medication.quantityPerPrescription}</p>}

      </CardContent>
      <CardFooter className="p-3 bg-muted/20 border-t flex justify-between items-center mt-auto">
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
