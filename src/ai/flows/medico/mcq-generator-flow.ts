
'use server';
/**
 * @fileOverview A Genkit flow for generating Multiple Choice Questions (MCQs) on medical topics for medico users.
 *
 * - generateMCQs - A function that handles the MCQ generation process.
 * - MedicoMCQGeneratorInput - The input type for the generateMCQs function.
 * - MedicoMCQGeneratorOutput - The return type for the generateMCQs function.
 */

import { ai } from '@/ai/genkit';
import { MedicoMCQGeneratorInputSchema, MedicoMCQGeneratorOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoMCQGeneratorInput = z.infer<typeof MedicoMCQGeneratorInputSchema>;
export type MedicoMCQGeneratorOutput = z.infer<typeof MedicoMCQGeneratorOutputSchema>;

export async function generateMCQs(input: MedicoMCQGeneratorInput): Promise<MedicoMCQGeneratorOutput> {
  return mcqGeneratorFlow(input);
}

const mcqGeneratorPrompt = ai.definePrompt({
  name: 'medicoMCQGeneratorPrompt',
  input: { schema: MedicoMCQGeneratorInputSchema },
  output: { schema: MedicoMCQGeneratorOutputSchema },
  prompt: `You are an AI expert in medical education, tasked with creating Multiple Choice Questions (MCQs) for medical students.
Given the topic: {{{topic}}}
Number of MCQs to generate: {{{count}}}

For each MCQ:
1.  Create a clear and unambiguous question based on the topic.
2.  Provide exactly four distinct options (A, B, C, D).
3.  Ensure one option is clearly the correct answer.
4.  The other three options should be plausible distractors.
5.  Provide a brief explanation for why the correct answer is correct.

Topic: {{{topic}}}
Number of MCQs: {{{count}}}

Format the output as JSON conforming to the MedicoMCQGeneratorOutput schema.
Each MCQ object should have 'question', 'options' (an array of 4 option objects, each with 'text' and 'isCorrect' boolean), and an optional 'explanation'.
The root output should include the 'mcqs' array and 'topicGenerated'.
`,
  config: {
    temperature: 0.5, // A bit of creativity for plausible distractors
  }
});

const mcqGeneratorFlow = ai.defineFlow(
  {
    name: 'medicoMCQGeneratorFlow',
    inputSchema: MedicoMCQGeneratorInputSchema,
    outputSchema: MedicoMCQGeneratorOutputSchema,
  },
  async (input) => {
    // In a real application, you might first check Firestore for existing MCQs on this topic.
    // For now, we'll directly generate them.
    const { output } = await mcqGeneratorPrompt(input);
     if (!output) {
      throw new Error('Failed to generate MCQs. The AI model did not return the expected output.');
    }
    // Firestore saving logic would go here, e.g.:
    // await saveMCQsToFirestore(input.topic, output.mcqs);
    return {...output, topicGenerated: input.topic };
  }
);
