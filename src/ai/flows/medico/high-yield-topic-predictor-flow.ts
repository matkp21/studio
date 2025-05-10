
'use server';
/**
 * @fileOverview A Genkit flow for predicting high-yield medical topics for medico users.
 *
 * - predictHighYieldTopics - A function that predicts topics based on exam type.
 * - MedicoTopicPredictorInput - The input type.
 * - MedicoTopicPredictorOutput - The output type.
 */

import { ai } from '@/ai/genkit';
import { MedicoTopicPredictorInputSchema, MedicoTopicPredictorOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoTopicPredictorInput = z.infer<typeof MedicoTopicPredictorInputSchema>;
export type MedicoTopicPredictorOutput = z.infer<typeof MedicoTopicPredictorOutputSchema>;

export async function predictHighYieldTopics(input: MedicoTopicPredictorInput): Promise<MedicoTopicPredictorOutput> {
  return highYieldTopicPredictorFlow(input);
}

const highYieldTopicPredictorPrompt = ai.definePrompt({
  name: 'medicoTopicPredictorPrompt',
  input: { schema: MedicoTopicPredictorInputSchema },
  output: { schema: MedicoTopicPredictorOutputSchema },
  prompt: `You are an AI expert in medical exam preparation and curriculum analysis.
Given the exam type: "{{{examType}}}"
{{#if subject}}And specific subject: "{{{subject}}}"{{/if}}

Predict a list of 5-10 high-yield topics that are most likely to be important for this exam.
If a subject is specified, focus topics within that subject. Otherwise, provide general high-yield topics for the exam.
Provide a brief rationale for your predictions (e.g., based on past exam trends, curriculum weightage, clinical importance).

Format the output as JSON conforming to the MedicoTopicPredictorOutputSchema.
'predictedTopics' should be an array of strings.
'rationale' should be a brief explanation.
`,
  config: {
    temperature: 0.4, // More analytical and based on patterns
  }
});

const highYieldTopicPredictorFlow = ai.defineFlow(
  {
    name: 'medicoHighYieldTopicPredictorFlow',
    inputSchema: MedicoTopicPredictorInputSchema,
    outputSchema: MedicoTopicPredictorOutputSchema,
  },
  async (input) => {
    // In a real application, this might involve querying a database of past papers,
    // analyzing syllabus documents, or using more sophisticated prediction models.
    // For now, we rely on the LLM's general knowledge.
    const { output } = await highYieldTopicPredictorPrompt(input);

    if (!output || !output.predictedTopics || output.predictedTopics.length === 0) {
      console.error('MedicoTopicPredictorPrompt did not return valid topics for:', input.examType);
      throw new Error('Failed to predict high-yield topics. The AI model did not return the expected output or an empty set.');
    }
    
    // Firestore saving logic (e.g., for logging predictions) could go here
    return output;
  }
);
