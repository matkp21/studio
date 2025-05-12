
/**
 * @fileOverview Defines Zod schemas for Professional Mode specific tools.
 */
import { z } from 'zod'; // Use z from zod directly for schema definitions

// Schema for Discharge Summary Generator
export const DischargeSummaryInputSchema = z.object({
  patientName: z.string().optional().describe("Patient's full name."),
  patientAge: z.string().optional().describe("Patient's age (e.g., '45 years', '6 months')."),
  admissionNumber: z.string().min(1, {message: "Admission/OPD number is required."}).describe("Unique patient admission or OPD number for context."),
  primaryDiagnosis: z.string().min(3, {message: "Primary diagnosis is required."}).describe("The main confirmed diagnosis for this hospital episode, e.g., 'Acute Myocardial Infarction', 'Community-Acquired Pneumonia'."),
  keySymptomsOrProcedure: z.string().optional().describe("Key presenting symptoms OR the primary procedure performed, e.g., 'Severe abdominal pain, fever', 'Laparoscopic Cholecystectomy'."),
  additionalContext: z.string().optional().describe("Any other brief notes or context the doctor wants to provide to guide the summary generation, e.g., 'Complicated by post-op infection', 'Patient has multiple comorbidities'.")
});
export type DischargeSummaryInput = z.infer<typeof DischargeSummaryInputSchema>;

export const DischargeSummaryOutputSchema = z.object({
  hospitalCourse: z.string().describe("A narrative summary of the patient's hospital stay, including reason for admission, key findings, treatments, response, and condition at discharge. Should be based on the provided clinical anchors."),
  dischargeMedications: z.array(z.string()).describe("A list of medications prescribed at discharge, including drug name, dose, route, frequency, and duration. Predict standard medications based on diagnosis/procedure."),
  followUpPlans: z.array(z.string()).describe("Instructions for follow-up appointments (GP, specialist), further tests, or monitoring required post-discharge."),
  patientEducation: z.array(z.string()).describe("Key educational points provided to the patient regarding their condition, medications, lifestyle modifications, or self-care."),
  redFlags: z.array(z.string()).describe("Critical 'red flag' symptoms the patient should watch for that would warrant seeking urgent medical attention."),
  notesForDoctor: z.string().optional().describe("Any specific notes, suggestions, or reminders from the AI for the reviewing doctor. This is for the AI to provide meta-comments to the clinician, e.g., 'Consider checking renal function before starting Drug X if not already done.'")
});
export type DischargeSummaryOutput = z.infer<typeof DischargeSummaryOutputSchema>;

// Add other Professional Mode tool schemas here as they are developed.
