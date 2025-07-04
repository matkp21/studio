
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
Suggest a logical next step, like creating flashcards with the mnemonic.

Format the output as JSON conforming to the MedicoMnemonicsGeneratorOutputSchema.
The 'mnemonic' field should contain the mnemonic itself.
The 'explanation' field should detail its components.
The 'topicGenerated' field should reflect the input topic.
The 'imageUrl' field should be left empty as it will be generated in a subsequent step.
The 'nextSteps' field should contain suggestions like: { "tool": "flashcards", "topic": "{{{topic}}}", "reason": "Create a flashcard for this mnemonic" }.

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
    // Step 1: Generate the mnemonic text and explanation
    const { output: textOutput } = await mnemonicsGeneratorPrompt(input);

    if (!textOutput || !textOutput.mnemonic) {
      console.error('MedicoMnemonicsGeneratorPrompt did not return a valid mnemonic for topic:', input.topic);
      throw new Error('Failed to generate mnemonic. The AI model did not return the expected output.');
    }
    
    // Step 2: Generate an image based on the mnemonic
    const imagePrompt = `A simple, clear, educational, and visually appealing diagram or icon representing the medical mnemonic: "${textOutput.mnemonic}" for the topic "${input.topic}".`;
    
    try {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: imagePrompt,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });
        
        if (media && media.url) {
          textOutput.imageUrl = media.url;
        }

    } catch (imageError) {
        console.warn("Could not generate image for mnemonic:", imageError);
        // We can proceed without an image, so we don't throw an error here.
        textOutput.imageUrl = undefined;
    }

    return textOutput;
  }
);
