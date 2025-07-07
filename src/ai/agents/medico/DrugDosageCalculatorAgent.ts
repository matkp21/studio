
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
Your primary task is to calculate a drug dosage based on the provided clinical context. Your secondary, but MANDATORY task, is to suggest 1-2 logical next study steps. Format this as a JSON array for the 'nextSteps' field. Each object in the array MUST have "tool", "topic", and "reason" keys. The 'tool' value must be a valid tool ID like 'flashcards'. This field is critical for the app's functionality and must not be omitted.

Calculate the drug dosage based on the following complete clinical context:
Drug Name: {{{drugName}}}
Patient Weight (kg): {{{patientWeightKg}}}
{{#if patientAgeYears}}Patient Age (years): {{{patientAgeYears}}}{{/if}}
{{#if renalFunction}}Patient Renal Function: {{{renalFunction}}}{{/if}}
{{#if indication}}Indication: {{{indication}}}{{/if}}
{{#if concentrationAvailable}}Concentration Available: {{{concentrationAvailable}}}{{/if}}

Instructions:
1.  **Cross-reference Pharmacopeia Data**: Using your knowledge of standard drug data (conceptually like OpenFDA or RxNorm), determine the standard dosing for the specified drug and indication.
2.  **Adjust for Context**: Adjust the dose based on all provided patient context. Pay special attention to weight (for pediatric or weight-based dosing), age, and renal function (e.g., dose reduction for impaired eGFR). The specified indication is also critical for determining the correct dosage regimen.
3.  **Calculate Final Dose**: Clearly state the final calculated dose per kg or total dose as appropriate. If a liquid formulation is implied or stated by 'concentrationAvailable', calculate the volume to be administered.
4.  **Show Your Work**: Provide a step-by-step 'calculationExplanation' that clearly shows how you arrived at the final dose, including any adjustments made for patient context.
5.  **Provide Clinical Warnings**: List important 'warnings' or common considerations. This MUST include any dose adjustments made due to renal function and other critical points like maximum dose, common side effects, etc.
6.  **Educational Disclaimer**: Emphasize that this is for educational practice and real clinical decisions require consulting official pharmacopoeias and senior clinicians.

Format the output as JSON conforming to the MedicoDrugDosageOutputSchema.
'calculatedDose' should be a string (e.g., "500 mg", "7.5 ml").
'calculationExplanation' must be provided.
'warnings' is an array of strings.
If critical information is missing to make a safe calculation, 'calculatedDose' can state "Insufficient information" and the explanation should detail what's missing.
Example for 'nextSteps': [{ "tool": "flashcards", "topic": "{{{drugName}}}", "reason": "Create flashcards for {{{drugName}}}" }]
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
    try {
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
    } catch (err) {
      console.error(`[DrugDosageCalculatorAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
      throw new Error('An unexpected error occurred during dosage calculation. Please try again.');
    }
  }
);
