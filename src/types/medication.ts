// src/types/medication.ts

export type MedicationFormType = "Tablet" | "Capsule" | "Liquid" | "Inhaler" | "Injection" | "Cream" | "Ointment" | "Drops" | "Patch" | "Other";
export type MedicationRouteType = "Oral" | "Topical" | "Inhaled" | "Subcutaneous" | "Intramuscular" | "Intravenous" | "Rectal" | "Vaginal" | "Otic" | "Nasal" | "Ophthalmic" | "Other";
export type MedicationFrequencyType = 
  | "Once daily" 
  | "Twice daily" 
  | "Three times daily" 
  | "Four times daily" 
  | "Every X hours" 
  | "As needed (PRN)" 
  | "Specific days" 
  | "Other";

export interface Medication {
  id: string;
  name: string;
  dosageStrength: string; // e.g., "500 mg", "10 units"
  form: MedicationFormType;
  route: MedicationRouteType;
  reason?: string; // Optional
  prescribingDoctor?: string; // Optional
  prescriptionDate: Date;
  duration?: string; // e.g., "7 days", "Ongoing"
  quantityPerPrescription?: number; // Optional
  instructions?: string; // Optional, e.g., "Take with food"
  
  // For scheduling (to be expanded in next steps)
  schedule?: {
    type: MedicationFrequencyType;
    times?: string[]; // e.g., ["08:00", "20:00"] if specific times
    intervalHours?: number; // if "Every X hours"
    daysOfWeek?: string[]; // if "Specific days", e.g., ["Mon", "Wed", "Fri"]
  };
  
  // For adherence tracking (to be expanded)
  log?: Array<{ date: Date; status: 'taken' | 'skipped' | 'snoozed' }>;

  // For refill reminders (to be expanded)
  refillInfo?: {
    lastRefillDate?: Date;
    quantityDispensed?: number;
    pharmacy?: string;
  };

  // For barcode scanning (to be expanded)
  barcode?: string;

  // For photo (to be expanded)
  photoUrl?: string;
}
