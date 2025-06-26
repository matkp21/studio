
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
Format the output as JSON conforming to the MedicoMnemonicsGeneratorOutputSchema.
The 'mnemonic' field should contain the mnemonic itself.
The 'explanation' field should detail its components.
The 'topicGenerated' field should reflect the input topic.

Example for topic "Cranial Nerves (Order)":
Mnemonic: "Oh Oh Oh To Touch And Feel Very Good Velvet, Ah Heaven"
Explanation:
  Oh: Olfactory (I)
  Oh: Optic (II)
  Oh: Oculomotor (III)
  To: Trochlear (IV)
  Touch: Trigeminal (V)
  And: Abducens (VI)
  Feel: Facial (VII)
  Very: Vestibulocochlear (VIII)
  Good: Glossopharyngeal (IX)
  Velvet: Vagus (X)
  Ah: Accessory (XI)
  Heaven: Hypoglossal (XII)
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
    const { output } = await mnemonicsGeneratorPrompt(input);

    if (!output || !output.mnemonic) {
      console.error('MedicoMnemonicsGeneratorPrompt did not return a valid mnemonic for topic:', input.topic);
      throw new Error('Failed to generate mnemonic. The AI model did not return the expected output.');
    }
    // Firestore saving logic could go here
    return { ...output, topicGenerated: input.topic };
  }
);
