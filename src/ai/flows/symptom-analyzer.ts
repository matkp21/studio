// SymptomAnalyzer
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

const SymptomAnalyzerInputSchema = z.object({
  symptoms: z.string().describe('The symptoms the user is experiencing.'),
});
export type SymptomAnalyzerInput = z.infer<typeof SymptomAnalyzerInputSchema>;

const SymptomAnalyzerOutputSchema = z.object({
  diagnoses: z.array(z.string()).describe('A list of potential diagnoses based on the symptoms provided.'),
});
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
    return output!;
  }
);
