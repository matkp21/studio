'use server';
/**
 * @fileOverview An AI agent that analyzes symptoms and provides potential diagnoses.
 *
 * - analyzeSymptoms - A function that takes user-provided symptoms and returns a list of potential diagnoses.
 * - SymptomAnalyzerInput - The input type for the analyzeSymptoms function.
 * - SymptomAnalyzerOutput - The return type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { SymptomAnalyzerInputSchema, SymptomAnalyzerOutputSchema } from '@/ai/schemas/symptom-analyzer-schemas';

export type SymptomAnalyzerInput = z.infer<typeof SymptomAnalyzerInputSchema>;
export type SymptomAnalyzerOutput = z.infer<typeof SymptomAnalyzerOutputSchema>;

export async function analyzeSymptoms(input: SymptomAnalyzerInput): Promise<SymptomAnalyzerOutput> {
  return symptomAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomAnalyzerPrompt',
  input: {schema: SymptomAnalyzerInputSchema},
  output: {schema: SymptomAnalyzerOutputSchema},
  prompt: `You are a medical expert. Based on the symptoms provided, generate a list of potential diagnoses.

Symptoms: {{{symptoms}}}

Potential Diagnoses:`,
});

const symptomAnalyzerFlow = ai.defineFlow(
  {
    name: 'symptomAnalyzerFlow',
    inputSchema: SymptomAnalyzerInputSchema,
    outputSchema: SymptomAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      // Handle cases where the LLM might not produce structured output
      // or if an error occurs within the prompt execution.
      console.error("Symptom analyzer prompt did not return an output.");
      return { diagnoses: ["Could not determine potential diagnoses at this time. Please try again or consult a medical professional."] };
    }
    return output;
  }
);
