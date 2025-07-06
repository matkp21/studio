
'use server';
/**
 * @fileOverview A Genkit flow for generating mnemonics for medical topics for medico users.
 *
 * - generateMnemonic - A function that handles mnemonic generation.
 * - MedicoMnemonicsGeneratorInput - The input type.
 * - MedicoMnemonicsGeneratorOutput - The output type.
 */

import { ai } from '@/ai/genkit';
import { MedicoMnemonicsGeneratorInputSchema, MedicoMnemonicsGeneratorOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoMnemonicsGeneratorInput = z.infer<typeof MedicoMnemonicsGeneratorInputSchema>;
export type MedicoMnemonicsGeneratorOutput = z.infer<typeof MedicoMnemonicsGeneratorOutputSchema>;

export async function generateMnemonic(input: MedicoMnemonicsGeneratorInput): Promise<MedicoMnemonicsGeneratorOutput> {
  return mnemonicsGeneratorFlow(input);
}

const mnemonicsGeneratorPrompt = ai.definePrompt({
  name: 'medicoMnemonicsGeneratorPrompt',
  input: { schema: MedicoMnemonicsGeneratorInputSchema },
  output: { schema: MedicoMnemonicsGeneratorOutputSchema },
  prompt: `You are an AI expert in creating catchy and effective mnemonics for medical students.
Given the topic or list: {{{topic}}}

Generate a creative and easy-to-remember mnemonic.
Also, provide a brief explanation of what each part of the mnemonic stands for.
CRITICAL: You must suggest 1-2 logical next steps. Format this as a JSON array for the 'nextSteps' field. Each object MUST have "tool", "topic", and "reason" keys. The 'tool' ID should be valid (e.g., 'flashcards'). Example: [{ "tool": "flashcards", "topic": "{{{topic}}}", "reason": "Create a flashcard for this mnemonic" }].

Format the output as JSON conforming to the MedicoMnemonicsGeneratorOutputSchema.
The 'mnemonic' field should contain the mnemonic itself.
The 'explanation' field should detail its components.
The 'topicGenerated' field should reflect the input topic.
The 'imageUrl' field can be omitted or set to null as image generation is currently disabled.

Example for topic "Cranial Nerves (Order)":
Mnemonic: "Oh Oh Oh To Touch And Feel Very Good Velvet, Ah Heaven"
Explanation:
  Oh: Olfactory (I)
  Oh: Optic (II)
  ...
`,
  config: {
    temperature: 0.7, // Creative for mnemonics
  }
});

const mnemonicsGeneratorFlow = ai.defineFlow(
  {
    name: 'medicoMnemonicsGeneratorFlow',
    inputSchema: MedicoMnemonicsGeneratorInputSchema,
    outputSchema: MedicoMnemonicsGeneratorOutputSchema,
  },
  async (input) => {
    try {
      // Step 1: Generate the mnemonic text and explanation
      const { output } = await mnemonicsGeneratorPrompt(input);

      if (!output || !output.mnemonic) {
        console.error('MedicoMnemonicsGeneratorPrompt did not return a valid mnemonic for topic:', input.topic);
        throw new Error('Failed to generate mnemonic. The AI model did not return the expected output.');
      }
      
      // Step 2: Image generation is disabled. Ensure the field is not present.
      output.imageUrl = undefined;
      
      return output;
    } catch (err) {
      console.error(`[MnemonicsGeneratorAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
      throw new Error('An unexpected error occurred while generating the mnemonic. Please try again.');
    }
  }
);
