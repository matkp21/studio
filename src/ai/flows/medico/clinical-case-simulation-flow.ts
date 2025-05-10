
'use server';
/**
 * @fileOverview A Genkit flow for running interactive clinical case simulations for medico users.
 *
 * - simulateClinicalCase - A function that handles the case simulation steps.
 * - MedicoClinicalCaseInput - The input type.
 * - MedicoClinicalCaseOutput - The output type.
 */

import { ai } from '@/ai/genkit';
import { MedicoClinicalCaseInputSchema, MedicoClinicalCaseOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoClinicalCaseInput = z.infer<typeof MedicoClinicalCaseInputSchema>;
export type MedicoClinicalCaseOutput = z.infer<typeof MedicoClinicalCaseOutputSchema>;

export async function simulateClinicalCase(input: MedicoClinicalCaseInput): Promise<MedicoClinicalCaseOutput> {
  // This would typically involve retrieving case state from Firestore if input.caseId is present
  return clinicalCaseFlow(input);
}

const clinicalCasePrompt = ai.definePrompt({
  name: 'medicoClinicalCasePrompt',
  input: { schema: MedicoClinicalCaseInputSchema },
  output: { schema: MedicoClinicalCaseOutputSchema },
  prompt: `You are an AI tutor managing a clinical case simulation for a medical student.

{{#if caseId}}
Current Case ID: {{{caseId}}}
Student's last response: {{{userResponse}}}
---
Review the student's response based on the case history (not provided in this simplified prompt, assume you have it).
Provide feedback on the response.
Present the next step/question in the simulation.
Update 'isCompleted' and 'summary' if the case has concluded.
{{else}}
New Case Request.
Topic: {{{topic}}}
---
Start a new clinical case simulation based on the topic: {{{topic}}}.
Provide an initial patient presentation and the first question for the student.
Set 'isCompleted' to false. Assign a new unique 'caseId' (e.g., "case-" + random_number).
Example for a new case on "Severe Acute Malnutrition":
  Case ID: "case-12345"
  Prompt: "A 2-year-old child is brought to the clinic by their mother with complaints of progressive weight loss, lethargy, and frequent loose stools for the past month. On examination, the child appears emaciated with visible rib outlines and loose skin folds. What are your initial assessment priorities?"
  Feedback: null
  Is Completed: false
  Summary: null
{{/if}}

Format the output as JSON conforming to the MedicoClinicalCaseOutputSchema.
Ensure 'caseId', 'prompt', and 'isCompleted' are always provided.
'feedback' and 'summary' can be null if not applicable.
`,
  config: {
    temperature: 0.6, // For varied case progression
  }
});

const clinicalCaseFlow = ai.defineFlow(
  {
    name: 'medicoClinicalCaseFlow',
    inputSchema: MedicoClinicalCaseInputSchema,
    outputSchema: MedicoClinicalCaseOutputSchema,
  },
  async (input) => {
    // Complex logic for managing case state, retrieving case data, evaluating responses, etc.
    // would go here. For now, this is a simplified version.
    // If input.caseId is null/undefined, we need to generate a new caseId.
    const effectiveInput = {
      ...input,
      caseId: input.caseId || `case-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };

    const { output } = await clinicalCasePrompt(effectiveInput);

    if (!output || !output.prompt || !output.caseId) {
      console.error('MedicoClinicalCasePrompt did not return a valid case step for input:', input);
      throw new Error('Failed to process clinical case simulation. The AI model did not return the expected output.');
    }

    // In a real app, save/update case state in Firestore using output.caseId
    // await db.collection('clinical_cases').doc(output.caseId).set(output, { merge: true });

    return output;
  }
);
