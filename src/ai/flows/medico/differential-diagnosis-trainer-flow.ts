
'use server';
/**
 * @fileOverview A Genkit flow for helping medico users practice differential diagnosis.
 *
 * - trainDifferentialDiagnosis - A function that provides potential diagnoses for given symptoms.
 * - MedicoDDTrainerInput - The input type.
 * - MedicoDDTrainerOutput - The output type.
 */

import { ai } from '@/ai/genkit';
import { MedicoDDTrainerInputSchema, MedicoDDTrainerOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoDDTrainerInput = z.infer<typeof MedicoDDTrainerInputSchema>;
export type MedicoDDTrainerOutput = z.infer<typeof MedicoDDTrainerOutputSchema>;

export async function trainDifferentialDiagnosis(input: MedicoDDTrainerInput): Promise<MedicoDDTrainerOutput> {
  return differentialDiagnosisTrainerFlow(input);
}

const differentialDiagnosisTrainerPrompt = ai.definePrompt({
  name: 'medicoDDTrainerPrompt',
  input: { schema: MedicoDDTrainerInputSchema },
  output: { schema: MedicoDDTrainerOutputSchema },
  prompt: `You are an AI medical education tool designed to help students practice differential diagnosis.
Given the following symptoms or clinical scenario:
"{{{symptoms}}}"

Based on these symptoms, provide a list of potential differential diagnoses.
Also, include a brief explanation or key distinguishing features for why these diagnoses are considered.
This is for educational purposes.

Format the output as JSON conforming to the MedicoDDTrainerOutputSchema.
'potentialDiagnoses' should be an array of strings.
'explanation' should be a string summarizing the rationale.
`,
// Future enhancement: Add studentAttempt and feedback for interactive training.
// {{#if studentAttempt}}
// Student's attempt at differential diagnoses:
// {{#each studentAttempt}} - {{{this}}}{{/each}}
// Evaluate the student's attempt. Provide constructive feedback, highlighting correct diagnoses, missed diagnoses, or less likely ones, with brief reasons.
// 'feedback' field should contain this evaluation.
// {{else}}
// No student attempt provided. Just list potential diagnoses and explanation.
// {{/if}}

  config: {
    temperature: 0.5, // Balanced for accuracy and educational breadth
  }
});

const differentialDiagnosisTrainerFlow = ai.defineFlow(
  {
    name: 'medicoDifferentialDiagnosisTrainerFlow',
    inputSchema: MedicoDDTrainerInputSchema,
    outputSchema: MedicoDDTrainerOutputSchema,
  },
  async (input) => {
    const { output } = await differentialDiagnosisTrainerPrompt(input);

    if (!output || !output.potentialDiagnoses || output.potentialDiagnoses.length === 0) {
      console.error('MedicoDDTrainerPrompt did not return valid diagnoses for symptoms:', input.symptoms);
      throw new Error('Failed to generate differential diagnoses. The AI model did not return the expected output or an empty set.');
    }
    // Firestore saving logic could go here for tracking practice sessions
    return output;
  }
);
