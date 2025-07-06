
'use server';
/**
 * @fileOverview A Genkit flow for helping medico users practice differential diagnosis through an interactive, iterative questioning process.
 *
 * - trainDifferentialDiagnosis - A function that handles the iterative diagnostic training.
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
  prompt: `You are an AI medical education tool designed to help students practice the process of differential diagnosis.

{{#if isNewCase}}
You are starting a new session.
Clinical Scenario: "{{{symptoms}}}"
---
1.  **Acknowledge the Scenario**: Start by acknowledging the clinical presentation.
2.  **Ask the First Question**: Your primary task is to prompt the student for their first step. Ask them: "What is the first and most important question you would ask this patient, or what is the first physical examination you would perform?"
3.  **Initial State**: The 'feedback' should be null. The 'isCompleted' flag must be false. The 'updatedCaseSummary' should contain the initial scenario. The 'prompt' for the student should be the question you are asking them.
{{else}}
You are continuing a session.
Case Summary so far: "{{{currentCaseSummary}}}"
Student's last response (their question or action): "{{{userResponse}}}"
---
1.  **Evaluate Student's Response**: Critically evaluate the student's question or action. Is it relevant? Is it well-timed? Is it specific enough?
2.  **Provide Constructive Feedback**: In the 'feedback' field, explain why the student's response was good, or how it could be improved. (e.g., "Good question, that helps rule out cardiac causes. However, asking about associated symptoms first might be more efficient.").
3.  **Simulate a Patient's Answer**: Provide a realistic patient answer to the student's question.
4.  **Update the Case Summary**: In 'updatedCaseSummary', append the new information (the student's question and the patient's answer) to the 'currentCaseSummary'.
5.  **Prompt for Next Step**: In the 'prompt' field, ask the student for their next question, action, or if they are ready to suggest some differential diagnoses. (e.g., "Excellent. What would you like to ask or check next?").
6.  **Check for Completion**: If the student provides a list of differential diagnoses, evaluate them, provide final feedback, set 'isCompleted' to true, and end the session.
{{/if}}

Format your entire output as JSON conforming to the MedicoDDTrainerOutputSchema.
`,
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
    try {
      const { output } = await differentialDiagnosisTrainerPrompt(input);

      if (!output || !output.prompt || !output.updatedCaseSummary) {
        console.error('MedicoDDTrainerPrompt did not return valid output for:', input);
        throw new Error('Failed to process the training step. The AI model did not return the expected output.');
      }
      // Firestore saving logic for user's training history could go here
      return output;
    } catch (err) {
      console.error(`[DifferentialDiagnosisTrainerAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
      throw new Error('An unexpected error occurred during the DDx training session. Please try again.');
    }
  }
);
