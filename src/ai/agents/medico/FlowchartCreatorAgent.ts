
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
Given the topic: {{{topic}}}

Generate a structured JSON object representing the flowchart. This JSON should contain 'nodes' and 'edges' arrays compatible with the React Flow library.
- Use the custom node types: 'symptom', 'test', 'decision', 'treatment'.
- Each node must have a unique 'id', a valid 'type', a 'position' {x, y}, and 'data' {label}.
- Each edge must have a unique 'id', a 'source' node id, and a 'target' node id.
- Arrange the node positions logically in a top-down manner. Start with x=250, y=25 for the first node and increment y by ~125 for subsequent nodes. Use different x positions for branches.
- The 'topicGenerated' field should reflect the input topic.
- **Next Steps**: CRITICAL: You must suggest 1-2 logical next study steps. Format this as a JSON array for the 'nextSteps' field. Each object MUST have "tool", "topic", and "reason" keys. The 'tool' ID should be valid (e.g., 'mcq'). Example: [{ "tool": "mcq", "topic": "{{{topic}}}", "reason": "Test your knowledge on this flowchart" }].

Example of the required JSON output format for the topic "Basic Life Support":
{
  "topicGenerated": "Basic Life Support",
  "nodes": [
    { "id": "1", "type": "decision", "position": { "x": 250, "y": 25 }, "data": { "label": "Unresponsive?" } },
    { "id": "2", "type": "treatment", "position": { "x": 250, "y": 150 }, "data": { "label": "Call Help, Check Breathing" } },
    { "id": "3", "type": "decision", "position": { "x": 250, "y": 275 }, "data": { "label": "Breathing Normally?" } },
    { "id": "4", "type": "treatment", "position": { "x": 100, "y": 400 }, "data": { "label": "Start 30 Chest Compressions" } },
    { "id": "5", "type": "treatment", "position": { "x": 400, "y": 400 }, "data": { "label": "Place in Recovery Position" } }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "animated": true },
    { "id": "e2-3", "source": "2", "target": "3", "animated": true },
    { "id": "e3-4", "source": "3", "target": "4", "label": "No" },
    { "id": "e3-5", "source": "3", "target": "5", "label": "Yes" }
  ],
  "nextSteps": [
    { "tool": "mcq", "topic": "Basic Life Support", "reason": "Test your BLS knowledge" }
  ]
}

Now generate the complete JSON for the topic: {{{topic}}}.
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
        // Sanitize to prevent saving undefined node types, which causes rendering issues.
        output.nodes = output.nodes.map(node => ({
        ...node,
        type: node.type || 'symptom' // Default to a valid type if missing
        }));

        return output;
    } catch (err) {
        console.error(`[FlowchartCreatorAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
        throw new Error('An unexpected error occurred while generating the flowchart. Please try again.');
    }
  }
);
