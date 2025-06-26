'use server';
/**
 * @fileOverview A Genkit flow for generating medical flowcharts for medico users.
 *
 * - createFlowchart - A function that handles flowchart generation.
 * - MedicoFlowchartCreatorInput - The input type.
 * - MedicoFlowchartCreatorOutput - The output type.
 */

import { ai } from '@/ai/genkit';
import { MedicoFlowchartCreatorInputSchema, MedicoFlowchartCreatorOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoFlowchartCreatorInput = z.infer<typeof MedicoFlowchartCreatorInputSchema>;
export type MedicoFlowchartCreatorOutput = z.infer<typeof MedicoFlowchartCreatorOutputSchema>;

export async function createFlowchart(input: MedicoFlowchartCreatorInput): Promise<MedicoFlowchartCreatorOutput> {
  return flowchartCreatorFlow(input);
}

const flowchartCreatorPrompt = ai.definePrompt({
  name: 'medicoFlowchartCreatorPrompt',
  input: { schema: MedicoFlowchartCreatorInputSchema },
  output: { schema: MedicoFlowchartCreatorOutputSchema },
  prompt: `You are an AI assistant that creates educational flowcharts for medical students.
Given the topic: {{{topic}}}

Generate a flowchart that outlines the key steps, decision points, or pathways related to the topic.
The output MUST be a valid flowchart using Mermaid Markdown syntax.

Example for topic "Basic Life Support":
"graph TD
    A[Unresponsive?] -->|Yes| B{Call for Help & Check Breathing};
    B -->|Not Breathing Normally| C[Start Chest Compressions: 30];
    C --> D[Give 2 Rescue Breaths];
    D --> C;
    B -->|Breathing Normally| E[Place in Recovery Position];"

Format the output as JSON conforming to the MedicoFlowchartCreatorOutputSchema.
The 'flowchartData' field should contain the Mermaid syntax as a single string.
The 'topicGenerated' field should reflect the input topic.
`,
  config: {
    temperature: 0.3, // For structured, factual output
  }
});

const flowchartCreatorFlow = ai.defineFlow(
  {
    name: 'medicoFlowchartCreatorFlow',
    inputSchema: MedicoFlowchartCreatorInputSchema,
    outputSchema: MedicoFlowchartCreatorOutputSchema,
  },
  async (input) => {
    const { output } = await flowchartCreatorPrompt(input);

    if (!output || !output.flowchartData) {
      console.error('MedicoFlowchartCreatorPrompt did not return valid flowchart data for topic:', input.topic);
      throw new Error('Failed to generate flowchart. The AI model did not return the expected output.');
    }
    // Firestore saving logic could go here
    return { ...output, topicGenerated: input.topic };
  }
);
