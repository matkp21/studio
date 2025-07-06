
'use server';
/**
 * @fileOverview The PathoMind agent, responsible for explaining disease pathophysiology.
 *
 * - explainPathophysiology - A function that handles the explanation process.
 * - PathoMindInput - The input type for the agent.
 * - PathoMindOutput - The return type from the agent.
 */

import { ai } from '@/ai/genkit';
import { PathoMindInputSchema, PathoMindOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type PathoMindInput = z.infer<typeof PathoMindInputSchema>;
export type PathoMindOutput = z.infer<typeof PathoMindOutputSchema>;

export async function explainPathophysiology(input: PathoMindInput): Promise<PathoMindOutput> {
  return pathoMindFlow(input);
}

const pathoMindPrompt = ai.definePrompt({
  name: 'medicoPathoMindPrompt',
  input: { schema: PathoMindInputSchema },
  output: { schema: PathoMindOutputSchema },
  prompt: `You are PathoMind, an AI expert in pathology and physiology.
Given the medical topic: {{{topic}}}

Provide a clear, step-by-step explanation of the pathophysiology.
Structure the explanation logically, from initial triggers to clinical manifestations.
Additionally, generate a simple Mermaid.js flowchart (graph TD) that visually summarizes the key steps of the pathophysiological process.
Finally, suggest a next step to generate study notes for a deeper dive.

Format the output as JSON conforming to the PathoMindOutputSchema.
- The 'explanation' field should be a detailed, well-structured text.
- The 'diagram' field should contain only the Mermaid.js syntax for the flowchart.
- The 'nextSteps' field should contain a suggestion like: { "tool": "theorycoach-generator", "topic": "{{{topic}}}", "reason": "Generate comprehensive notes" }.

Example for 'Myocardial Infarction':
Explanation: "Coronary artery plaque rupture leads to thrombus formation..."
Diagram: "graph TD; A[Plaque Rupture] --> B[Thrombus Formation]; B --> C[Occlusion of Artery]; C --> D[Myocardial Ischemia]; D --> E[Cell Death / Infarction];"
`,
  config: {
    temperature: 0.4, // Factual and structured
  }
});

const pathoMindFlow = ai.defineFlow(
  {
    name: 'medicoPathoMindFlow',
    inputSchema: PathoMindInputSchema,
    outputSchema: PathoMindOutputSchema,
  },
  async (input) => {
    try {
        const { output } = await pathoMindPrompt(input);

        if (!output || !output.explanation) {
        console.error('PathoMindPrompt did not return a valid explanation for:', input.topic);
        throw new Error('Failed to explain pathophysiology. The AI model did not return the expected output.');
        }
        
        return output;
    } catch (err) {
        console.error(`[PathoMindAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
        throw new Error('An unexpected error occurred while explaining pathophysiology. Please try again.');
    }
  }
);
