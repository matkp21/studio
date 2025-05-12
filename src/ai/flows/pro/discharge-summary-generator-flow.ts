
'use server';
/**
 * @fileOverview AI-assisted discharge summary generation flow for professionals.
 *
 * - generateDischargeSummary - A function that takes patient details and clinical anchors
 *   to draft a comprehensive discharge summary.
 * - DischargeSummaryInput - The input type for the flow.
 * - DischargeSummaryOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DischargeSummaryInputSchema = z.object({
  patientName: z.string().optional().describe("Patient's full name."),
  patientAge: z.string().optional().describe("Patient's age (e.g., '45 years', '6 months')."),
  admissionNumber: z.string().min(1, {message: "Admission/OPD number is required."}).describe("Unique patient admission or OPD number for context."),
  primaryDiagnosis: z.string().min(3, {message: "Primary diagnosis is required."}).describe("The main confirmed diagnosis for this hospital episode, e.g., 'Acute Myocardial Infarction', 'Community-Acquired Pneumonia'."),
  keySymptomsOrProcedure: z.string().optional().describe("Key presenting symptoms OR the primary procedure performed, e.g., 'Severe abdominal pain, fever', 'Laparoscopic Cholecystectomy'."),
  additionalContext: z.string().optional().describe("Any other brief notes or context the doctor wants to provide to guide the summary generation, e.g., 'Complicated by post-op infection', 'Patient has multiple comorbidities'.")
});
export type DischargeSummaryInput = z.infer<typeof DischargeSummaryInputSchema>;

const DischargeSummaryOutputSchema = z.object({
  hospitalCourse: z.string().describe("A narrative summary of the patient's hospital stay, including reason for admission, key findings, treatments, response, and condition at discharge. Should be based on the provided clinical anchors."),
  dischargeMedications: z.array(z.string()).describe("A list of medications prescribed at discharge, including drug name, dose, route, frequency, and duration. Predict standard medications based on diagnosis/procedure."),
  followUpPlans: z.array(z.string()).describe("Instructions for follow-up appointments (GP, specialist), further tests, or monitoring required post-discharge."),
  patientEducation: z.array(z.string()).describe("Key educational points provided to the patient regarding their condition, medications, lifestyle modifications, or self-care."),
  redFlags: z.array(z.string()).describe("Critical 'red flag' symptoms the patient should watch for that would warrant seeking urgent medical attention."),
  notesForDoctor: z.string().optional().describe("Any specific notes, suggestions, or reminders from the AI for the reviewing doctor. This is for the AI to provide meta-comments to the clinician, e.g., 'Consider checking renal function before starting Drug X if not already done.'")
});
export type DischargeSummaryOutput = z.infer<typeof DischargeSummaryOutputSchema>;

export async function generateDischargeSummary(input: DischargeSummaryInput): Promise<DischargeSummaryOutput> {
  return dischargeSummaryFlow(input);
}

const dischargeSummaryPrompt = ai.definePrompt({
  name: 'dischargeSummaryPrompt',
  input: { schema: DischargeSummaryInputSchema },
  output: { schema: DischargeSummaryOutputSchema },
  prompt: `You are an expert medical AI assistant helping a doctor draft a discharge summary.
Patient Details:
- Name: {{{patientName}}} (if provided)
- Age: {{{patientAge}}} (if provided)
- Admission/OPD Number: {{{admissionNumber}}}

Clinical Anchors for this Episode:
- Primary Diagnosis: {{{primaryDiagnosis}}}
{{#if keySymptomsOrProcedure}}- Key Symptoms/Procedure: {{{keySymptomsOrProcedure}}}{{/if}}
{{#if additionalContext}}- Additional Context from Doctor: {{{additionalContext}}}{{/if}}

Based on the above information, please draft the following sections for the discharge summary.
This is a DRAFT and will be reviewed and finalized by the supervising doctor.
Use your medical knowledge to predict common and appropriate details based on the clinical anchors.

1.  **Hospital Course:** Provide a narrative summary. Include reason for admission, key findings (if inferable), treatments initiated (predict typical ones for the diagnosis/procedure), patient's response, and condition at discharge.
2.  **Discharge Medications:** List medications. For each, suggest drug name, dose, route, frequency, and duration. Predict standard post-operative/post-discharge medications relevant to the clinical anchors.
3.  **Follow-up Plans:** List instructions for follow-up appointments, further tests, or monitoring. Suggest typical follow-ups for the condition.
4.  **Patient Education:** List key educational points regarding their condition, medications, lifestyle, or self-care.
5.  **Red Flags:** List critical symptoms that would warrant seeking urgent medical attention.
6.  **Notes for Doctor (Optional):** If you have any specific considerations or reminders for the reviewing doctor based on the input, list them here. For example, if a common comorbidity associated with the primary diagnosis often requires specific follow-up, you could mention it if not explicitly covered. If no specific notes, this can be omitted or empty.

Ensure the output is in the specified JSON format.
`,
  config: {
    temperature: 0.4, // Balance creativity with factuality for medical drafting
  },
});

const dischargeSummaryFlow = ai.defineFlow(
  {
    name: 'dischargeSummaryFlow',
    inputSchema: DischargeSummaryInputSchema,
    outputSchema: DischargeSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await dischargeSummaryPrompt(input);
    if (!output) {
      console.error('DischargeSummaryPrompt did not return an output for input:', input);
      throw new Error('Failed to generate discharge summary draft. The AI model did not return the expected output.');
    }
    return output;
  }
);
