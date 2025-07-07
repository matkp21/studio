
// src/ai/agents/medico/MCQGeneratorAgent.ts
'use server';
/**
 * @fileOverview A Genkit flow for generating Multiple Choice Questions (MCQs) on medical topics for medico users.
 * This flow takes a topic and a desired number of MCQs, then returns structured MCQs
 * with options, correct answers, and explanations.
 *
 * - generateMCQs - A function that handles the MCQ generation process.
 * - MedicoMCQGeneratorInput - The input type for the generateMCQs function.
 * - MedicoMCQGeneratorOutput - The return type for the generateMCQs function.
 */

import { ai } from '@/ai/genkit';
import { MedicoMCQGeneratorInputSchema, MedicoMCQGeneratorOutputSchema, MCQOptionSchema, MCQSchema as SingleMCQSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoMCQGeneratorInput = z.infer<typeof MedicoMCQGeneratorInputSchema>;
export type MedicoMCQGeneratorOutput = z.infer<typeof MedicoMCQGeneratorOutputSchema>;
export type MCQSchema = z.infer<typeof SingleMCQSchema>; // For easier usage in chat component

export async function generateMCQs(input: MedicoMCQGeneratorInput): Promise<MedicoMCQGeneratorOutput> {
  const result = await mcqGeneratorFlow(input);
  return result;
}

const mcqGeneratorPrompt = ai.definePrompt({
  name: 'medicoMCQGeneratorPrompt',
  input: { schema: MedicoMCQGeneratorInputSchema },
  output: { schema: MedicoMCQGeneratorOutputSchema },
  prompt: `You are an AI expert in medical education, tasked with creating Multiple Choice Questions (MCQs) for medical students preparing for exams.
Your primary task is to generate a quiz. Your secondary, but MANDATORY task, is to suggest 1-2 logical next study steps. Format this as a JSON array for the 'nextSteps' field. Each object in the array MUST have "tool", "topic", and "reason" keys. The 'tool' value must be a valid tool ID like 'theorycoach-generator'. This field is critical for the app's functionality and must not be omitted.

Generate a quiz based on the following criteria:
Topic: {{{topic}}}
Difficulty: {{{difficulty}}}
Exam Style: {{{examType}}}
Number of MCQs to generate: {{{count}}}

For each MCQ:
1.  Create a clear and unambiguous question based on the medical topic, tailored to the specified difficulty and exam style.
2.  Provide exactly four distinct options (A, B, C, D).
3.  Ensure one option is clearly the correct answer.
4.  The other three options should be plausible distractors, relevant to the topic but incorrect.
5.  Provide a brief explanation for why the correct answer is correct and, if relevant, why common distractors are incorrect.

Format the output as JSON conforming to the MedicoMCQGeneratorOutput schema.
The root output must be an object containing an 'mcqs' array, a 'topicGenerated' string, and a 'nextSteps' array.
Each object within the 'mcqs' array must conform to the MCQSchema.

Example of a single MCQ object in the 'mcqs' array:
{
  "question": "Which of the following is the most common cause of community-acquired pneumonia in adults?",
  "options": [
    { "text": "Haemophilus influenzae", "isCorrect": false },
    { "text": "Streptococcus pneumoniae", "isCorrect": true },
    { "text": "Mycoplasma pneumoniae", "isCorrect": false },
    { "text": "Klebsiella pneumoniae", "isCorrect": false }
  ],
  "explanation": "Streptococcus pneumoniae is the most common bacterial cause of community-acquired pneumonia (CAP) in adults, responsible for a significant percentage of cases."
}
Example for 'nextSteps': [{ "tool": "theorycoach-generator", "topic": "{{{topic}}}", "reason": "Review notes for weak areas" }]
Ensure the final output is a valid JSON object.
`,
  config: {
    temperature: 0.5, // A bit of creativity for plausible distractors but still medically sound
  }
});

const mcqGeneratorFlow = ai.defineFlow(
  {
    name: 'medicoMCQGeneratorFlow',
    inputSchema: MedicoMCQGeneratorInputSchema,
    outputSchema: MedicoMCQGeneratorOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await mcqGeneratorPrompt(input);
      if (!output || !output.mcqs || output.mcqs.length === 0) {
        console.error('MedicoMCQGeneratorPrompt did not return valid MCQs for topic:', input.topic);
        throw new Error('Failed to generate MCQs. The AI model did not return the expected output or returned an empty set. Please try a different topic or adjust the count.');
      }
      return {...output, topicGenerated: input.topic };
    } catch (err) {
      console.error(`[MCQGeneratorAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
      throw new Error('An unexpected error occurred while generating MCQs. Please try again.');
    }
  }
);
