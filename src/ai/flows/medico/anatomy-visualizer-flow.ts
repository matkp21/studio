
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
  prompt: `You are an AI medical educator specializing in anatomy.
Given the anatomical structure: {{{anatomicalStructure}}}

Provide a detailed description covering:
1.  Location
2.  Key features/parts
3.  Primary functions
4.  Important clinical correlations or relevance.
5.  Optionally, list a few related structures.

Format the output as JSON conforming to the MedicoAnatomyVisualizerOutputSchema.
The 'description' field should be comprehensive.
'imageUrl' can be omitted or set to null if image generation is not used/available.
'relatedStructures' should be an array of strings.
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
  }
);
