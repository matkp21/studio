
'use server';
/**
 * @fileOverview A Genkit flow for generating study notes on medical topics for medico users.
 *
 * - generateStudyNotes - A function that handles the study notes generation process.
 * - MedicoStudyNotesInput - The input type for the generateStudyNotes function.
 * - MedicoStudyNotesOutput - The return type for the generateStudyNotes function.
 */

import { ai } from '@/ai/genkit';
import { MedicoStudyNotesInputSchema, MedicoStudyNotesOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoStudyNotesInput = z.infer<typeof MedicoStudyNotesInputSchema>;
export type MedicoStudyNotesOutput = z.infer<typeof MedicoStudyNotesOutputSchema>;

export async function generateStudyNotes(input: MedicoStudyNotesInput): Promise<MedicoStudyNotesOutput> {
  return studyNotesFlow(input);
}

const studyNotesPrompt = ai.definePrompt({
  name: 'medicoStudyNotesPrompt',
  input: { schema: MedicoStudyNotesInputSchema },
  output: { schema: MedicoStudyNotesOutputSchema },
  prompt: `You are an AI assistant specializing in creating concise and informative study notes for medical students.
Given the topic: {{{topic}}}

Generate study notes that are:
1.  Accurate and up-to-date.
2.  Well-structured, using headings, bullet points, or numbered lists where appropriate.
3.  Focused on key concepts, definitions, mechanisms, and clinical relevance.
4.  Easy to understand and suitable for revision.
5.  Include 3-5 key summary points as an array of strings for quick recall.

Topic: {{{topic}}}

Format the output as JSON conforming to the MedicoStudyNotesOutput schema.
Ensure 'notes' is a single comprehensive string and 'summaryPoints' is an array of strings.
`,
  config: {
    temperature: 0.3, // More factual for notes
  }
});

const studyNotesFlow = ai.defineFlow(
  {
    name: 'medicoStudyNotesFlow',
    inputSchema: MedicoStudyNotesInputSchema,
    outputSchema: MedicoStudyNotesOutputSchema,
  },
  async (input) => {
    // In a real application, you might first check Firestore for existing notes on this topic.
    // For now, we'll directly generate them.
    const { output } = await studyNotesPrompt(input);
    if (!output) {
      throw new Error('Failed to generate study notes. The AI model did not return the expected output.');
    }
    // Firestore saving logic would go here, e.g.:
    // await saveStudyNotesToFirestore(input.topic, output);
    return output;
  }
);
