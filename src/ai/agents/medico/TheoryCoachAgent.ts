
// src/ai/agents/medico/StudyNotesAgent.ts
'use server';
/**
 * @fileOverview A Genkit flow for generating structured, exam-style study notes on medical topics.
 * This acts as the "StudyNotesGenerator" for medico users.
 *
 * - generateStudyNotes - A function that handles the answer generation process.
 * - StudyNotesGeneratorInput - The input type for the generateStudyNotes function.
 * - StudyNotesGeneratorOutput - The return type for the generateStudyNotes function.
 */

import { ai } from '@/ai/genkit';
import { StudyNotesGeneratorInputSchema, StudyNotesGeneratorOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type StudyNotesGeneratorInput = z.infer<typeof StudyNotesGeneratorInputSchema>;
export type StudyNotesGeneratorOutput = z.infer<typeof StudyNotesGeneratorOutputSchema>;

// Simple in-memory cache
const studyNotesCache = new Map<string, StudyNotesGeneratorOutput>();

export async function generateStudyNotes(input: StudyNotesGeneratorInput): Promise<StudyNotesGeneratorOutput> {
  const cacheKey = JSON.stringify(input);
  if (studyNotesCache.has(cacheKey)) {
    console.log(`[Cache HIT] Serving cached study notes for: ${input.topic}`);
    return studyNotesCache.get(cacheKey)!;
  }
  
  console.log(`[Cache MISS] Generating new study notes for: ${input.topic}`);
  const result = await studyNotesFlow(input);
  
  // Cache the successful result
  if (result) {
    studyNotesCache.set(cacheKey, result);
  }
  
  return result;
}

const studyNotesPrompt = ai.definePrompt({
  name: 'medicoStudyNotesPrompt',
  input: { schema: StudyNotesGeneratorInputSchema },
  output: { schema: StudyNotesGeneratorOutputSchema },
  prompt: `You are an AI medical expert creating a structured, exam-ready study note for an MBBS student.
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
- The entire response must be a single JSON object conforming to the StudyNotesGeneratorOutputSchema.
- The structured answer text goes into the 'notes' field.
- The Mermaid.js diagram code goes into the 'diagram' field.
`,
  config: {
    temperature: 0.3, // Factual for notes
  }
});

const studyNotesFlow = ai.defineFlow(
  {
    name: 'medicoStudyNotesFlow',
    inputSchema: StudyNotesGeneratorInputSchema,
    outputSchema: StudyNotesGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await studyNotesPrompt(input);
    if (!output || !output.notes) {
      console.error('StudyNotesPrompt did not return an output for topic:', input.topic);
      throw new Error('Failed to generate study notes. The AI model did not return the expected output. Please try a different topic or rephrase.');
    }
    // Firestore saving logic could go here in a real application, e.g.:
    // await saveStudyNotesToFirestore(input.topic, output);
    return output;
  }
);
