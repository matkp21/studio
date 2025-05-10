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
  context: z.string().optional().describe('Optional context, e.g., patient type (pediatric, adult), specific aspect (diagnosis, management), or desired guideline source (WHO, NICE).'),
});
export type GuidelineRetrievalInput = z.infer<typeof GuidelineRetrievalInputSchema>;

const GuidelineRetrievalOutputSchema = z.object({
  guidelines: z.string().describe('The relevant and latest clinical guidelines based on the query and context.'),
  source: z.string().optional().describe('The primary source of the retrieved guidelines, if identifiable (e.g., "WHO 2023", "NICE NGXX").'),
});
export type GuidelineRetrievalOutput = z.infer<typeof GuidelineRetrievalOutputSchema>;

export async function retrieveGuidelines(input: GuidelineRetrievalInput): Promise<GuidelineRetrievalOutput> {
  return guidelineRetrievalFlow(input);
}

const guidelineRetrievalPrompt = ai.definePrompt({
  name: 'guidelineRetrievalPrompt',
  input: {schema: GuidelineRetrievalInputSchema},
  output: {schema: GuidelineRetrievalOutputSchema},
  prompt: `You are a medical expert. Based on the following query, retrieve the most relevant and up-to-date clinical guidelines.
Prioritize guidelines from reputable sources like WHO, NICE, or other major national/international medical authorities.
If specific context is provided, use it to refine your search.

Query: {{{query}}}
{{#if context}}
Context: {{{context}}}
{{/if}}

Guidelines Summary:
[Provide a concise summary of the key guidelines. Strive to identify and mention the source and year of the guidelines if possible.]

Identified Source (if available): [e.g., WHO 2023, NICE NGXX]
`,
});

const guidelineRetrievalFlow = ai.defineFlow(
  {
    name: 'guidelineRetrievalFlow',
    inputSchema: GuidelineRetrievalInputSchema,
    outputSchema: GuidelineRetrievalOutputSchema,
  },
  async input => {
    const {output} = await guidelineRetrievalPrompt(input);
    // The prompt now asks the LLM to identify the source, which will be part of the 'output' object
    // if the LLM successfully extracts it according to the schema.
    return output!;
  }
);

