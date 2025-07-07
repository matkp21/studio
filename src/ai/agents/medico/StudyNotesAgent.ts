
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

export async function generateStudyNotes(input: StudyNotesGeneratorInput): Promise<StudyNotesGeneratorOutput> {
  const result = await studyNotesFlow(input);
  return result;
}

const studyNotesPrompt = ai.definePrompt({
  name: 'medicoStudyNotesPrompt',
  input: { schema: StudyNotesGeneratorInputSchema },
  output: { schema: StudyNotesGeneratorOutputSchema },
  prompt: `You are an AI medical expert creating a structured, exam-ready study note for an MBBS student.
Your primary task is to generate a comprehensive JSON output with four fields: 'notes', 'summaryPoints', 'diagram', and 'nextSteps'.
Your secondary, but MANDATORY task, is to generate the 'nextSteps' array. This field is critical for the app's functionality and must not be omitted.

Topic/Question: {{{topic}}}
Desired Answer Length: {{{answerLength}}}

Instructions:
1.  **'notes' field**: Generate comprehensive notes on the topic using Markdown. Strictly follow this 11-point format, using Markdown headings (e.g., '## 1. Definition'):
    1.  **Definition**: Provide a clear, concise definition.
    2.  **Relevant Anatomy / Physiology**: Briefly mention if critical to understanding the topic.
    3.  **Etiology / Risk Factors**: List the causes and risk factors.
    4.  **Pathophysiology**: Explain the mechanism of the disease.
    5.  **Clinical Features**: Detail the signs and symptoms.
    6.  **Investigations**: List relevant investigations under subheadings (Blood tests, Imaging, Special tests).
    7.  **Management**: Detail the management under subheadings (Medical, Surgical if applicable).
    8.  **Complications**: List potential complications.
    9.  **Prognosis**: Briefly describe the likely outcome.
    10. **Flowcharts / Tables / Diagrams**: Generate a relevant flowchart or table using Mermaid.js syntax. For example, a diagnostic pathway or a classification table. The diagram should be useful for visual learners. This Mermaid code goes into the 'diagram' field of the JSON output, NOT here in the notes.
    11. **References**: Name 1-2 standard textbooks (e.g., Robbins, Ghai, Bailey & Love) where this topic is covered.

2.  **'summaryPoints' field**: Create a separate array of 3-5 key, high-yield summary points for quick revision. Each point should be a string.

3.  **'diagram' field**: Place the Mermaid.js syntax generated in step 10 into this field as a single string. If no diagram is relevant, this can be null.

4.  **'nextSteps' field (MANDATORY)**: You must provide a JSON array for this field. Each object MUST have "tool", "topic", and "reason". The 'tool' ID should be valid (e.g., 'mcq', 'flashcards'). Example: [{ "tool": "mcq", "topic": "{{{topic}}}", "reason": "Test your knowledge" }, { "tool": "flashcards", "topic": "{{{topic}}}", "reason": "Create flashcards" }].

Constraint: For a '10-mark' answer, the 'notes' content should be around 500 words. For a '5-mark' answer, around 250 words.
Ensure the entire response is a single valid JSON object conforming to the StudyNotesGeneratorOutputSchema.
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
    try {
      const { output } = await studyNotesPrompt(input);
      if (!output || !output.notes) {
        console.error('StudyNotesPrompt did not return an output for topic:', input.topic);
        throw new Error('Failed to generate study notes. The AI model did not return the expected output. Please try a different topic or rephrase.');
      }
      return output;
    } catch (err) {
      console.error(`[StudyNotesAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
      throw new Error('An unexpected error occurred while generating study notes. Please try again.');
    }
  }
);
