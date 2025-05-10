
/**
 * @fileOverview Defines Zod schemas for Medico Mode specific tools.
 */
import { z } from 'zod';

// Schema for Study Notes Generator
export const MedicoStudyNotesInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).describe('The medical topic for which to generate study notes.'),
});
export type MedicoStudyNotesInput = z.infer<typeof MedicoStudyNotesInputSchema>;

export const MedicoStudyNotesOutputSchema = z.object({
  notes: z.string().describe('Concise, AI-generated study notes on the topic.'),
  summaryPoints: z.array(z.string()).optional().describe('Key summary points for quick revision.'),
});
export type MedicoStudyNotesOutput = z.infer<typeof MedicoStudyNotesOutputSchema>;


// Schema for MCQ Generator
export const MedicoMCQGeneratorInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).describe('The medical topic for which to generate MCQs.'),
  count: z.number().int().min(1).max(10).default(5).describe('The number of MCQs to generate (1-10).'),
});
export type MedicoMCQGeneratorInput = z.infer<typeof MedicoMCQGeneratorInputSchema>;

export const MCQOptionSchema = z.object({
  text: z.string().describe('The text of the option.'),
  isCorrect: z.boolean().describe('Whether this option is the correct answer.'),
});

export const MCQSchema = z.object({
  question: z.string().describe('The MCQ question text.'),
  options: z.array(MCQOptionSchema).length(4).describe('Exactly four options for the MCQ.'),
  explanation: z.string().optional().describe('An explanation for the correct answer.'),
});

export const MedicoMCQGeneratorOutputSchema = z.object({
  mcqs: z.array(MCQSchema).describe('An array of generated MCQs.'),
  topicGenerated: z.string().describe('The topic for which MCQs were generated.'),
});
export type MedicoMCQGeneratorOutput = z.infer<typeof MedicoMCQGeneratorOutputSchema>;
