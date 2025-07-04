'use server';
/**
 * @fileOverview A Genkit flow for summarizing uploaded text or image content into various formats.
 *
 * - summarizeNoteText - A function that handles the summarization process.
 * - MedicoNoteSummarizerInput - The input type.
 * - MedicoNoteSummarizerOutput - The output type.
 *
 * Note: The agent now incorporates functionality for generating diagrams and flowcharts,
 * specifically using Mermaid.js syntax for flowcharts when the 'flowchart' format is requested.
 */

import { ai } from '@/ai/genkit';
import { MedicoNoteSummarizerInputSchema, MedicoNoteSummarizerOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoNoteSummarizerInput = z.infer<typeof MedicoNoteSummarizerInputSchema> & { format: 'bullet' | 'table' | 'flowchart' | 'diagram' }; // Explicitly include format types
export type MedicoNoteSummarizerOutput = z.infer<typeof MedicoNoteSummarizerOutputSchema>;

export async function summarizeNoteText(input: MedicoNoteSummarizerInput): Promise<MedicoNoteSummarizerOutput> {
  return noteSummarizerFlow(input);
}

const noteSummarizerPrompt = ai.definePrompt({
  name: 'medicoNoteSummarizerPrompt',
  input: { schema: MedicoNoteSummarizerInputSchema },
  output: { schema: MedicoNoteSummarizerOutputSchema },
  prompt: `You are an expert at summarizing medical notes for students.
Summarize the provided content into the requested format: {{{format}}}.

The summary should be concise, accurate, and focus on the most high-yield information for a medical student.
- If the requested format is a 'flowchart', generate the summary using Mermaid.js syntax.
- If the requested format is a 'table', use Markdown table syntax.
- If the requested format is 'bullet' or 'diagram', use standard bullet points or a textual description suitable for generating a diagram.
- Suggest a logical next step, like creating flashcards from the summary.

{{#if text}}
Text to summarize:
{{{text}}}
{{/if}}
{{#if imageDataUri}}
Summarize the content from this image. This could be a picture of a textbook page, a diagram, or handwritten notes.
Image to summarize: {{media url=imageDataUri}}
{{/if}}

Format the output as JSON conforming to the MedicoNoteSummarizerOutputSchema.
The 'nextSteps' field should contain suggestions like: { "tool": "flashcards", "topic": "Summary of provided notes", "reason": "Create flashcards from this summary" }.
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
