
'use server';
/**
 * @fileOverview A Genkit flow for summarizing uploaded text content into various formats.
 *
 * - summarizeNoteText - A function that handles the summarization process.
 * - MedicoNoteSummarizerInput - The input type.
 * - MedicoNoteSummarizerOutput - The output type.
 */

import { ai } from '@/ai/genkit';
import { MedicoNoteSummarizerInputSchema, MedicoNoteSummarizerOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoNoteSummarizerInput = z.infer<typeof MedicoNoteSummarizerInputSchema>;
export type MedicoNoteSummarizerOutput = z.infer<typeof MedicoNoteSummarizerOutputSchema>;

export async function summarizeNoteText(input: MedicoNoteSummarizerInput): Promise<MedicoNoteSummarizerOutput> {
  return noteSummarizerFlow(input);
}

const noteSummarizerPrompt = ai.definePrompt({
  name: 'medicoNoteSummarizerPrompt',
  input: { schema: MedicoNoteSummarizerInputSchema },
  output: { schema: MedicoNoteSummarizerOutputSchema },
  prompt: `You are an expert at summarizing medical notes for students.
Summarize the following text into the requested format: {{{format}}}.

The summary should be concise, accurate, and focus on the most high-yield information for a medical student.
If the requested format is a 'flowchart', generate the summary using Mermaid.js syntax.
If the requested format is a 'table', use Markdown table syntax.
If the requested format is 'bullet', use standard bullet points.

Text to summarize:
{{{text}}}
`,
  config: {
    temperature: 0.2, // Factual and structured
  }
});

const noteSummarizerFlow = ai.defineFlow(
  {
    name: 'medicoNoteSummarizerFlow',
    inputSchema: MedicoNoteSummarizerInputSchema,
    outputSchema: MedicoNoteSummarizerOutputSchema,
  },
  async (input) => {
    const { output } = await noteSummarizerPrompt(input);

    if (!output || !output.summary) {
      console.error('MedicoNoteSummarizerPrompt did not return a valid summary for the provided text.');
      throw new Error('Failed to generate summary. The AI model did not return the expected output.');
    }

    return output;
  }
);
