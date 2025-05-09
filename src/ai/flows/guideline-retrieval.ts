'use server';

/**
 * @fileOverview This file defines a Genkit flow for retrieving clinical guidelines based on user queries.
 *
 * It includes:
 * - guidelineRetrievalFlow: The main flow for retrieving guidelines.
 * - retrieveGuidelines: An async function that calls the flow.
 * - GuidelineRetrievalInput: The input type for the retrieveGuidelines function.
 * - GuidelineRetrievalOutput: The return type for the retrieveGuidelines function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GuidelineRetrievalInputSchema = z.object({
  query: z.string().describe('The medical condition or treatment to query guidelines for.'),
});
export type GuidelineRetrievalInput = z.infer<typeof GuidelineRetrievalInputSchema>;

const GuidelineRetrievalOutputSchema = z.object({
  guidelines: z.string().describe('The relevant clinical guidelines based on the query.'),
});
export type GuidelineRetrievalOutput = z.infer<typeof GuidelineRetrievalOutputSchema>;

export async function retrieveGuidelines(input: GuidelineRetrievalInput): Promise<GuidelineRetrievalOutput> {
  return guidelineRetrievalFlow(input);
}

const guidelineRetrievalPrompt = ai.definePrompt({
  name: 'guidelineRetrievalPrompt',
  input: {schema: GuidelineRetrievalInputSchema},
  output: {schema: GuidelineRetrievalOutputSchema},
  prompt: `You are a medical expert. Based on the following query, retrieve the relevant clinical guidelines from reputable sources like WHO or local medical authorities.\n\nQuery: {{{query}}}\n\nGuidelines:`,
});

const guidelineRetrievalFlow = ai.defineFlow(
  {
    name: 'guidelineRetrievalFlow',
    inputSchema: GuidelineRetrievalInputSchema,
    outputSchema: GuidelineRetrievalOutputSchema,
  },
  async input => {
    const {output} = await guidelineRetrievalPrompt(input);
    return output!;
  }
);
