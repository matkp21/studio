
'use server';
/**
 * @fileOverview A Genkit flow for generating structured, exam-style answers on medical topics.
 * This acts as the "TheoryCoach" for medico users.
 *
 * - generateTheoryAnswer - A function that handles the answer generation process.
 * - TheoryCoachInput - The input type for the generateTheoryAnswer function.
 * - TheoryCoachOutput - The return type for the generateTheoryAnswer function.
 */

import { ai } from '@/ai/genkit';
import { TheoryCoachInputSchema, TheoryCoachOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type TheoryCoachInput = z.infer<typeof TheoryCoachInputSchema>;
export type TheoryCoachOutput = z.infer<typeof TheoryCoachOutputSchema>;

// Simple in-memory cache
const theoryAnswerCache = new Map<string, TheoryCoachOutput>();

export async function generateTheoryAnswer(input: TheoryCoachInput): Promise<TheoryCoachOutput> {
  const cacheKey = JSON.stringify(input);
  if (theoryAnswerCache.has(cacheKey)) {
    console.log(`[Cache HIT] Serving cached theory answer for: ${input.topic}`);
    return theoryAnswerCache.get(cacheKey)!;
  }
  
  console.log(`[Cache MISS] Generating new theory answer for: ${input.topic}`);
  const result = await theoryCoachFlow(input);
  
  // Cache the successful result
  if (result) {
    theoryAnswerCache.set(cacheKey, result);
  }
  
  return result;
}

const theoryCoachPrompt = ai.definePrompt({
  name: 'medicoTheoryCoachPrompt',
  input: { schema: TheoryCoachInputSchema },
  output: { schema: TheoryCoachOutputSchema },
  prompt: `You are an AI medical expert, the "TheoryCoach," creating a structured, exam-ready answer for an MBBS student.
Given the medical topic/question: {{{topic}}}
Desired answer length: {{{answerLength}}}

Generate a comprehensive answer strictly following this 11-point format. Use Markdown for headings (e.g., '## 1. Definition').

1.  **Definition**: Provide a clear, concise definition.
2.  **Relevant Anatomy / Physiology**: Briefly mention if critical to understanding the topic.
3.  **Etiology / Risk Factors**: List the causes and risk factors.
4.  **Pathophysiology**: Explain the mechanism of the disease.
5.  **Clinical Features**: Detail the signs and symptoms.
6.  **Investigations**: List relevant investigations under subheadings:
    -   Blood tests
    -   Imaging
    -   Special tests
7.  **Management**: Detail the management under subheadings:
    -   Medical
    -   Surgical (if applicable)
8.  **Complications**: List potential complications.
9.  **Prognosis**: Briefly describe the likely outcome.
10. **Flowcharts / Tables / Diagrams**: Generate a relevant flowchart or table using Mermaid.js syntax. For example, a diagnostic pathway or a classification table. The diagram should be useful for visual learners.
11. **References**: Name 1-2 standard textbooks (e.g., Robbins, Ghai, Bailey & Love) where this topic is covered.

Constraints:
- For a '10-mark' answer, the total word count should be around 500 words.
- For a '5-mark' answer, it should be a more concise ~250 words.
- The entire response must be a single JSON object conforming to the TheoryCoachOutputSchema.
- The structured answer text goes into the 'notes' field.
- The Mermaid.js diagram code goes into the 'diagram' field.
`,
  config: {
    temperature: 0.3, // Factual for notes
  }
});

const theoryCoachFlow = ai.defineFlow(
  {
    name: 'medicoTheoryCoachFlow',
    inputSchema: TheoryCoachInputSchema,
    outputSchema: TheoryCoachOutputSchema,
  },
  async (input) => {
    const { output } = await theoryCoachPrompt(input);
    if (!output || !output.notes) {
      console.error('TheoryCoachPrompt did not return an output for topic:', input.topic);
      throw new Error('Failed to generate study notes. The AI model did not return the expected output. Please try a different topic or rephrase.');
    }
    // Firestore saving logic could go here in a real application, e.g.:
    // await saveTheoryAnswerToFirestore(input.topic, output);
    return output;
  }
);
