
'use server';
/**
 * @fileOverview A Genkit flow for generating flashcards on medical topics for medico users.
 *
 * - generateFlashcards - A function that handles the flashcard generation process.
 * - MedicoFlashcardGeneratorInput - The input type.
 * - MedicoFlashcardGeneratorOutput - The output type.
 */

import { ai } from '@/ai/genkit';
import { MedicoFlashcardGeneratorInputSchema, MedicoFlashcardGeneratorOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoFlashcardGeneratorInput = z.infer<typeof MedicoFlashcardGeneratorInputSchema>;
export type MedicoFlashcardGeneratorOutput = z.infer<typeof MedicoFlashcardGeneratorOutputSchema>;
export type { MedicoFlashcard } from '@/ai/schemas/medico-tools-schemas';

export async function generateFlashcards(input: MedicoFlashcardGeneratorInput): Promise<MedicoFlashcardGeneratorOutput> {
  return flashcardGeneratorFlow(input);
}

const flashcardGeneratorPrompt = ai.definePrompt({
  name: 'medicoFlashcardGeneratorPrompt',
  input: { schema: MedicoFlashcardGeneratorInputSchema },
  output: { schema: MedicoFlashcardGeneratorOutputSchema },
  prompt: `You are an AI assistant skilled in creating educational flashcards for medical students.
Your primary task is to generate flashcards based on the provided topic. Your secondary, but MANDATORY task, is to suggest a logical next study step. Format this as a JSON array for the 'nextSteps' field. Each object in the array MUST have "tool", "topic", and "reason" keys. The 'tool' value must be a valid tool ID like 'mcq'. This field is critical for the app's functionality and must not be omitted.

Topic: {{{topic}}}
Difficulty: {{{difficulty}}}
Exam Style: {{{examType}}}
Number of flashcards to generate: {{{count}}}

For each flashcard, create a 'front' (question or term) and a 'back' (answer or definition).
The flashcards should be concise and focus on key, high-yield information relevant to the topic, difficulty, and exam style.

Format the output as JSON conforming to the MedicoFlashcardGeneratorOutput schema.
The output must include:
1. 'flashcards': An array of flashcard objects, each with 'front' and 'back' string properties.
2. 'topicGenerated': The topic for which these flashcards were generated.
3. 'nextSteps': The mandatory array of next step suggestions.
Example for 'nextSteps': [{ "tool": "mcq", "topic": "{{{topic}}}", "reason": "Test your knowledge on these flashcards" }]
`,
  config: {
    temperature: 0.4, // Factual and concise
  }
});

const flashcardGeneratorFlow = ai.defineFlow(
  {
    name: 'medicoFlashcardGeneratorFlow',
    inputSchema: MedicoFlashcardGeneratorInputSchema,
    outputSchema: MedicoFlashcardGeneratorOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await flashcardGeneratorPrompt(input);

      if (!output || !output.flashcards || output.flashcards.length === 0) {
        console.error('MedicoFlashcardGeneratorPrompt did not return valid flashcards for topic:', input.topic);
        throw new Error('Failed to generate flashcards. The AI model did not return the expected output or returned an empty set.');
      }
      // Firestore saving logic could go here
      return { ...output, topicGenerated: input.topic };
    } catch (err) {
      console.error(`[FlashcardGeneratorAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
      throw new Error('An unexpected error occurred while generating flashcards. Please try again.');
    }
  }
);
