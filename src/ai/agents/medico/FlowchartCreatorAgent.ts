'use server';
/**
 * @fileOverview A Genkit flow for generating medical flowcharts for medico users.
 * This version generates a structured JSON object compatible with React Flow.
 *
 * - createFlowchart - A function that handles flowchart generation.
 * - MedicoFlowchartCreatorInput - The input type.
 * - MedicoFlowchartCreatorOutput - The output type (React Flow nodes and edges).
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
Your primary task is to generate a structured JSON object representing a flowchart AND a list of relevant next study steps for the topic: {{{topic}}}.

The JSON object you generate MUST have 'nodes', 'edges', 'topicGenerated', and a 'nextSteps' field.

Instructions for the flowchart:
- Generate 'nodes' and 'edges' arrays compatible with the React Flow library.
- Use the custom node types: 'symptom', 'test', 'decision', 'treatment'. Each of these must be a string and is a required field for each node.
- Each node must have a unique 'id' (string), a valid 'type' (string), a 'position' {x, y}, and 'data' {label}.
- Each edge must have a unique 'id' (string), a 'source' node id, and a 'target' node id.
- Arrange the node positions logically in a top-down manner. Start with x=250, y=25 for the first node and increment y by ~125 for subsequent nodes. Use different x positions for branches.
- The 'topicGenerated' field should reflect the input topic.

Format the 'nextSteps' field as a JSON array of objects. Each object MUST have "title", "description", "toolId", "prefilledTopic", and "cta" keys.

CRITICAL: The 'nextSteps' field is mandatory and must not be omitted. Generate at least two relevant suggestions.
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
    try {
      const { output } = await flowchartCreatorPrompt(input);

      if (!output || !output.nodes || output.nodes.length === 0 || !output.edges) {
        console.error('MedicoFlowchartCreatorPrompt did not return valid flowchart data for topic:', input.topic);
        throw new Error('Failed to generate flowchart. The AI model did not return a valid flowchart structure. Please try a different topic.');
      }
      
      return output;
    } catch (err) {
      console.error(`[FlowchartCreatorAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
      throw new Error('An unexpected error occurred while generating the flowchart. Please try again.');
    }
  }
);
