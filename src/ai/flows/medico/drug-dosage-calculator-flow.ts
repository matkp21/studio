
'use server';
/**
 * @fileOverview A Genkit flow for calculating drug dosages (educational purposes) for medico users.
 *
 * - calculateDrugDosage - A function that handles the dosage calculation.
 * - MedicoDrugDosageInput - The input type.
 * - MedicoDrugDosageOutput - The output type.
 */

import { ai } from '@/ai/genkit';
import { MedicoDrugDosageInputSchema, MedicoDrugDosageOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoDrugDosageInput = z.infer<typeof MedicoDrugDosageInputSchema>;
export type MedicoDrugDosageOutput = z.infer<typeof MedicoDrugDosageOutputSchema>;

export async function calculateDrugDosage(input: MedicoDrugDosageInput): Promise<MedicoDrugDosageOutput> {
  return drugDosageCalculatorFlow(input);
}

const drugDosageCalculatorPrompt = ai.definePrompt({
  name: 'medicoDrugDosageCalculatorPrompt',
  input: { schema: MedicoDrugDosageInputSchema },
  output: { schema: MedicoDrugDosageOutputSchema },
  prompt: `You are an AI tool designed for medical students to practice drug dosage calculations. THIS IS FOR EDUCATIONAL PURPOSES ONLY AND NOT FOR ACTUAL CLINICAL USE.

Calculate the drug dosage based on the following information:
Drug Name: {{{drugName}}}
Patient Weight (kg): {{{patientWeightKg}}}
{{#if patientAgeYears}}Patient Age (years): {{{patientAgeYears}}}{{/if}}
{{#if indication}}Indication: {{{indication}}}{{/if}}
{{#if concentrationAvailable}}Concentration Available: {{{concentrationAvailable}}}{{/if}}

Instructions:
1.  Use standard pediatric or adult dosing guidelines for the given drug and indication (if provided). Assume common concentrations if not specified by 'concentrationAvailable'.
2.  Clearly state the dose per kg or total dose as appropriate.
3.  If a liquid formulation is implied or stated by 'concentrationAvailable', calculate the volume to be administered.
4.  Provide a step-by-step 'calculationExplanation'.
5.  List any important 'warnings' or common considerations (e.g., max dose, renal adjustments, common side effects to mention).
6.  Emphasize that this is for educational practice and real clinical decisions require consulting official pharmacopoeias and senior clinicians.

Format the output as JSON conforming to the MedicoDrugDosageOutputSchema.
'calculatedDose' should be a string (e.g., "500 mg", "7.5 ml").
'calculationExplanation' must be provided.
'warnings' is an array of strings.
If critical information is missing to make a safe calculation (e.g. for a drug that strictly requires age or specific indication not provided), 'calculatedDose' can state "Insufficient information" and explanation should detail what's missing.

Example (Paracetamol for a child):
Input: drugName: "Paracetamol", patientWeightKg: 10, patientAgeYears: 1
Output:
{
  "calculatedDose": "150 mg (or 3 ml of 120mg/5ml suspension)",
  "calculationExplanation": "Standard pediatric dose for Paracetamol is 10-15 mg/kg/dose.\nUsing 15 mg/kg: 15 mg/kg * 10 kg = 150 mg.\nIf using a common suspension of 120mg/5ml: (150 mg / 120 mg) * 5 ml = 6.25 ml. (Typically rounded or specific product concentration used, for example if 250mg/5ml is available, then 150mg / 250mg * 5ml = 3ml)",
  "warnings": ["Maximum 4 doses per 24 hours.", "Check total daily dose of paracetamol from all sources.", "THIS IS FOR EDUCATIONAL PRACTICE. ALWAYS VERIFY WITH OFFICIAL SOURCES IN CLINICAL SETTINGS."]
}
`,
  config: {
    temperature: 0.2, // Very precise for calculations
  }
});

const drugDosageCalculatorFlow = ai.defineFlow(
  {
    name: 'medicoDrugDosageCalculatorFlow',
    inputSchema: MedicoDrugDosageInputSchema,
    outputSchema: MedicoDrugDosageOutputSchema,
  },
  async (input) => {
    // More complex validation or lookups could happen here in a real app
    // e.g., checking drug name against a database, fetching standard concentrations.
    const { output } = await drugDosageCalculatorPrompt(input);

    if (!output || !output.calculatedDose || !output.calculationExplanation) {
      console.error('MedicoDrugDosageCalculatorPrompt did not return a valid calculation for:', input.drugName);
      throw new Error('Failed to calculate drug dosage. The AI model did not return the expected output.');
    }
    
    // Ensure educational warning is always present
    if (!output.warnings) {
        output.warnings = [];
    }
    const educationalWarning = "THIS IS FOR EDUCATIONAL PRACTICE. ALWAYS VERIFY WITH OFFICIAL SOURCES AND SENIOR CLINICIANS IN ACTUAL CLINICAL SETTINGS.";
    if (!output.warnings.includes(educationalWarning)) {
        output.warnings.push(educationalWarning);
    }

    return output;
  }
);
