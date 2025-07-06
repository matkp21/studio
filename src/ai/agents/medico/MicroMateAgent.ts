
'use server';
/**
 * @fileOverview The MicroMate agent, for providing information on microorganisms.
 *
 * - getMicrobeInfo - A function that handles the microbe information process.
 * - MicroMateInput - The input type for the agent.
 * - MicroMateOutput - The return type from the agent.
 */

import { ai } from '@/ai/genkit';
import { MicroMateInputSchema, MicroMateOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MicroMateInput = z.infer<typeof MicroMateInputSchema>;
export type MicroMateOutput = z.infer<typeof MicroMateOutputSchema>;

export async function getMicrobeInfo(input: MicroMateInput): Promise<MicroMateOutput> {
  return microMateFlow(input);
}

const microMatePrompt = ai.definePrompt({
  name: 'medicoMicroMatePrompt',
  input: { schema: MicroMateInputSchema },
  output: { schema: MicroMateOutputSchema },
  prompt: `You are MicroMate, an AI expert in microbiology for medical students.
Given the microorganism: {{{microorganism}}}

Provide a detailed summary covering:
1.  **Key Characteristics**: (e.g., Gram stain, shape, aerobic/anaerobic).
2.  **Virulence Factors**: Key mechanisms it uses to cause disease.
3.  **Diseases Caused**: Common diseases associated with this organism.
4.  **Lab Diagnosis**: Standard methods for identifying the organism in a lab.
5.  **Next Steps**: CRITICAL: You must suggest 1-2 logical next steps. Format this as a JSON array for the 'nextSteps' field. Each object MUST have "tool", "topic", and "reason" keys. The 'tool' ID should be valid (e.g., 'mcq', 'flashcards'). Example: [{ "tool": "mcq", "topic": "{{{microorganism}}}", "reason": "Generate MCQs for {{{microorganism}}}" }].

Format the output as JSON conforming to the MicroMateOutputSchema.
The fields 'characteristics', 'virulenceFactors', 'diseasesCaused', and 'labDiagnosis' should be detailed strings.
`,
  config: {
    temperature: 0.3, // Factual and detailed
  }
});

const microMateFlow = ai.defineFlow(
  {
    name: 'medicoMicroMateFlow',
    inputSchema: MicroMateInputSchema,
    outputSchema: MicroMateOutputSchema,
  },
  async (input) => {
    try {
        const { output } = await microMatePrompt(input);

        if (!output || !output.characteristics) {
        console.error('MicroMatePrompt did not return valid information for:', input.microorganism);
        throw new Error('Failed to get microbe information. The AI model did not return the expected output.');
        }
        
        return output;
    } catch (err) {
        console.error(`[MicroMateAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
        throw new Error('An unexpected error occurred while fetching microbe information. Please try again.');
    }
  }
);
