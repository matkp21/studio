
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
Given the topic: {{{topic}}}
Difficulty: {{{difficulty}}}
Exam Style: {{{examType}}}
Number of flashcards to generate: {{{count}}}

For each flashcard, create a 'front' (question or term) and a 'back' (answer or definition).
The flashcards should be concise and focus on key, high-yield information relevant to the topic, difficulty, and exam style.
After generating the flashcards, suggest a logical next step, like generating MCQs to test knowledge from the flashcards.

Format the output as JSON conforming to the MedicoFlashcardGeneratorOutput schema, with an array of flashcard objects, a topicGenerated string, and an optional nextSteps array.
Each flashcard object must have 'front' and 'back' string properties.
The 'nextSteps' field should contain suggestions like: { "tool": "mcq", "topic": "{{{topic}}}", "reason": "Test your knowledge on these flashcards" }.
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
    const { output } = await flashcardGeneratorPrompt(input);

    if (!output || !output.flashcards || output.flashcards.length === 0) {
      console.error('MedicoFlashcardGeneratorPrompt did not return valid flashcards for topic:', input.topic);
      throw new Error('Failed to generate flashcards. The AI model did not return the expected output or returned an empty set.');
    }
    // Firestore saving logic could go here
    return { ...output, topicGenerated: input.topic };
  }
);
