
// src/ai/agents/medico/ExamPaperAgent.ts
'use server';
/**
 * @fileOverview A Genkit flow for generating mock exam papers on medical topics for medico users.
 * This flow acts as the 'ExamPaperAgent'.
 *
 * - generateExamPaper - A function that handles the mock exam paper generation process.
 * - MedicoExamPaperInput - The input type for the generateExamPaper function.
 * - MedicoExamPaperOutput - The return type for the generateExamPaper function.
 */

import { ai } from '@/ai/genkit';
import { MedicoExamPaperInputSchema, MedicoExamPaperOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoExamPaperInput = z.infer<typeof MedicoExamPaperInputSchema>;
export type MedicoExamPaperOutput = z.infer<typeof MedicoExamPaperOutputSchema>;

export async function generateExamPaper(input: MedicoExamPaperInput): Promise<MedicoExamPaperOutput> {
  return examPaperFlow(input);
}

const examPaperPrompt = ai.definePrompt({
  name: 'medicoExamPaperPrompt',
  input: { schema: MedicoExamPaperInputSchema },
  output: { schema: MedicoExamPaperOutputSchema },
  prompt: `You are an expert medical examiner, tasked with creating a mock exam paper for a medical student.
Your primary task is to generate the exam paper content. Your secondary, but MANDATORY task, is to suggest 1-2 logical next study steps. Format this as a JSON array for the 'nextSteps' field. Each object in the array MUST have "tool", "topic", and "reason" keys. The 'tool' value must be a valid tool ID like 'theorycoach-generator'. This field is critical for the app's functionality and must not be omitted.

Exam Type: {{{examType}}}
{{#if year}}Focus Year (for pattern analysis): {{{year}}}{{/if}}
Number of MCQs to generate: {{{count}}}

Instructions:
1.  Based on the exam type (and year if provided), generate a realistic mock paper.
2.  Create a clear and unambiguous set of Multiple Choice Questions (MCQs). For each MCQ:
    - Provide exactly four distinct options. One option must have 'isCorrect' set to true.
    - The other three options should be plausible distractors with 'isCorrect' set to false.
    - Provide a brief explanation for the correct answer.
3.  Generate 2-3 essay-style questions that are typical for this kind of exam. For each essay, provide a brief outline of the expected answer.

Format the output as JSON conforming to the MedicoExamPaperOutputSchema.
The root output must be an object containing 'mcqs', 'essays', 'topicGenerated', and a 'nextSteps' array.
Each object in the 'mcqs' array must conform to the MCQSchema, including the 'isCorrect' boolean for each option.
Each object in the 'essays' array must have 'question' and 'answer_outline' strings.
Example for 'nextSteps': [{ "tool": "theorycoach-generator", "topic": "{{{examType}}}", "reason": "Review weak areas from this exam" }]
`,
  config: {
    temperature: 0.6, // More creative for varied questions
  }
});

const examPaperFlow = ai.defineFlow(
  {
    name: 'medicoExamPaperFlow',
    inputSchema: MedicoExamPaperInputSchema,
    outputSchema: MedicoExamPaperOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await examPaperPrompt(input);
      if (!output || (!output.mcqs?.length && !output.essays?.length)) {
        console.error('MedicoExamPaperPrompt did not return valid content for exam:', input.examType);
        throw new Error('Failed to generate exam paper. The AI model did not return the expected output. Please try a different exam type or adjust the parameters.');
      }
      return {...output, topicGenerated: input.examType };
    } catch (err) {
      console.error(`[ExamPaperAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
      throw new Error('An unexpected error occurred while generating the exam paper. Please try again.');
    }
  }
);
