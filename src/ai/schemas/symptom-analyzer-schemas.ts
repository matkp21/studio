/**
 * @fileOverview Defines Zod schemas for symptom analysis input and output.
 * These schemas are used by both the symptom analyzer flow and its corresponding tool.
 */
import { z } from 'zod';

export const SymptomAnalyzerInputSchema = z.object({
  symptoms: z.string().describe('The symptoms the user is experiencing.'),
});

export const SymptomAnalyzerOutputSchema = z.object({
  diagnoses: z.array(z.string()).describe('A list of potential diagnoses based on the symptoms provided.'),
});
