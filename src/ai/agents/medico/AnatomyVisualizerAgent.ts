
'use server';
/**
 * @fileOverview A Genkit flow for providing descriptions of anatomical structures for medico users.
 *
 * - getAnatomyDescription - A function that handles the anatomy description process.
 * - MedicoAnatomyVisualizerInput - The input type.
 * - MedicoAnatomyVisualizerOutput - The output type.
 */

import { ai } from '@/ai/genkit';
import { MedicoAnatomyVisualizerInputSchema, MedicoAnatomyVisualizerOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoAnatomyVisualizerInput = z.infer<typeof MedicoAnatomyVisualizerInputSchema>;
export type MedicoAnatomyVisualizerOutput = z.infer<typeof MedicoAnatomyVisualizerOutputSchema>;

export async function getAnatomyDescription(input: MedicoAnatomyVisualizerInput): Promise<MedicoAnatomyVisualizerOutput> {
  return anatomyVisualizerFlow(input);
}

// Placeholder for image generation - in a real app, this might call another flow or service.
// For now, we'll focus on textual description.
// const generateAnatomyImage = ai.defineTool(...);

const anatomyVisualizerPrompt = ai.definePrompt({
  name: 'medicoAnatomyVisualizerPrompt',
  input: { schema: MedicoAnatomyVisualizerInputSchema },
  output: { schema: MedicoAnatomyVisualizerOutputSchema },
  // tools: [generateAnatomyImage], // If image generation tool was defined
  prompt: `You are an AI medical educator specializing in anatomy. Your primary task is to provide a detailed description of the anatomical structure: {{{anatomicalStructure}}}
Your secondary, but MANDATORY task, is to suggest 1-2 logical next study steps. Format this as a JSON array for the 'nextSteps' field. Each object in the array MUST have "tool", "topic", and "reason" keys. The 'tool' value must be a valid tool ID like 'theorycoach-generator' or 'mcq'. This field is critical for the app's functionality and must not be omitted.

Provide a detailed description covering:
1.  **Location**: Where is the structure found in the body?
2.  **Key Features/Parts**: What are its main components?
3.  **Primary Functions**: What does it do?
4.  **Important Clinical Correlations**: Why is it important in medicine (common diseases, injuries, procedures)?
5.  **Related Structures**: List a few anatomically or functionally related structures.

Format the entire output as JSON conforming to the MedicoAnatomyVisualizerOutputSchema.
'imageUrl' can be omitted or set to null if image generation is not used/available.
Example for 'nextSteps': [{ "tool": "theorycoach-generator", "topic": "Anatomy of the {{{anatomicalStructure}}}", "reason": "Generate study notes" }]
`,
  config: {
    temperature: 0.3, // Factual and detailed
  }
});

const anatomyVisualizerFlow = ai.defineFlow(
  {
    name: 'medicoAnatomyVisualizerFlow',
    inputSchema: MedicoAnatomyVisualizerInputSchema,
    outputSchema: MedicoAnatomyVisualizerOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await anatomyVisualizerPrompt(input);

      if (!output || !output.description) {
        console.error('MedicoAnatomyVisualizerPrompt did not return a valid description for:', input.anatomicalStructure);
        throw new Error('Failed to get anatomy description. The AI model did not return the expected output.');
      }

      // If an image generation tool were used:
      // if (output.requiresImage) {
      //   const imageResult = await generateAnatomyImage({ structure: input.anatomicalStructure });
      //   output.imageUrl = imageResult.url;
      // }
      
      // Firestore saving logic could go here
      return output;
    } catch (err) {
      console.error(`[AnatomyVisualizerAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
      throw new Error('An unexpected error occurred while fetching the anatomy description. Please try again.');
    }
  }
);
