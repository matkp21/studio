
/**
 * @fileOverview Defines Zod schemas for Medico Mode specific tools,
 * including Study Notes Generator and MCQ Generator.
 */
import { z } from 'zod';

// Schema for Study Notes Generator
export const MedicoStudyNotesInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).describe('The medical topic for which to generate study notes (e.g., "Diabetes Mellitus", "Thalassemia Major").'),
});
export type MedicoStudyNotesInput = z.infer<typeof MedicoStudyNotesInputSchema>;

export const MedicoStudyNotesOutputSchema = z.object({
  notes: z.string().describe('Concise, AI-generated study notes on the topic, formatted for clarity with headings and bullet points where appropriate.'),
  summaryPoints: z.array(z.string()).optional().describe('Key summary points (e.g., 3-5 points) for quick revision of the topic.'),
});
export type MedicoStudyNotesOutput = z.infer<typeof MedicoStudyNotesOutputSchema>;


// Schema for MCQ Generator
export const MedicoMCQGeneratorInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).describe('The medical topic for which to generate MCQs (e.g., "Cardiology", "Hypertension").'),
  count: z.number().int().min(1).max(10).default(5).describe('The number of MCQs to generate (1-10). Default is 5.'),
});
export type MedicoMCQGeneratorInput = z.infer<typeof MedicoMCQGeneratorInputSchema>;

export const MCQOptionSchema = z.object({
  text: z.string().describe('The text of the multiple-choice option.'),
  isCorrect: z.boolean().describe('Indicates if this option is the correct answer.'),
});

export const MCQSchema = z.object({
  question: z.string().describe('The MCQ question text.'),
  options: z.array(MCQOptionSchema).length(4, { message: "Each MCQ must have exactly 4 options."}).describe('Exactly four options for the MCQ, one of which must be correct.'),
  explanation: z.string().optional().describe('A brief explanation for why the correct answer is correct. This helps in learning.'),
});
export type SingleMCQ = z.infer<typeof MCQSchema>;


export const MedicoMCQGeneratorOutputSchema = z.object({
  mcqs: z.array(MCQSchema).describe('An array of generated MCQs, each with a question, options, and an explanation.'),
  topicGenerated: z.string().describe('The topic for which these MCQs were generated.'),
});
export type MedicoMCQGeneratorOutput = z.infer<typeof MedicoMCQGeneratorOutputSchema>;

// Schemas for other Medico tools (to be implemented)
// StudyTimetableCreator schemas would go here
// FlashcardGenerator schemas would go here
// ClinicalCaseSimulations schemas would go here
// InteractiveAnatomyVisualizer schemas would go here
// MnemonicsGenerator schemas would go here
