
'use server';
/**
 * @fileOverview The PharmaGenie agent, for providing drug information.
 *
 * - getDrugInfo - A function that handles the drug information process.
 * - PharmaGenieInput - The input type for the agent.
 * - PharmaGenieOutput - The return type from the agent.
 */

import { ai } from '@/ai/genkit';
import { PharmaGenieInputSchema, PharmaGenieOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type PharmaGenieInput = z.infer<typeof PharmaGenieInputSchema>;
export type PharmaGenieOutput = z.infer<typeof PharmaGenieOutputSchema>;

export async function getDrugInfo(input: PharmaGenieInput): Promise<PharmaGenieOutput> {
  return pharmaGenieFlow(input);
}

const pharmaGeniePrompt = ai.definePrompt({
  name: 'medicoPharmaGeniePrompt',
  input: { schema: PharmaGenieInputSchema },
  output: { schema: PharmaGenieOutputSchema },
  prompt: `You are PharmaGenie, an AI expert in pharmacology for medical students.
Your primary task is to provide a detailed summary of the drug: {{{drugName}}}

You MUST also provide a 'nextSteps' field. This field is critical for the app's functionality and must not be omitted.
Format it as a JSON array of objects. Each object MUST have "title", "description", "toolId", "prefilledTopic", and "cta" keys.
The 'toolId' value must be a valid tool ID from the Medico Hub.

Provide a detailed summary covering:
1.  **Drug Class**: The pharmacological class of the drug.
2.  **Mechanism of Action**: How the drug works at a physiological and molecular level.
3.  **Key Indications**: The primary medical uses for the drug.
4.  **Common Side Effects**: Important and common adverse effects.

Format the output as JSON conforming to the PharmaGenieOutputSchema.
- 'drugClass' and 'mechanismOfAction' should be detailed strings.
- 'indications' and 'sideEffects' should be arrays of strings.

Example for 'nextSteps':
[
  {
    "title": "Create Flashcards",
    "description": "Generate flashcards for the mechanism of action and key side effects of {{{drugName}}}.",
    "toolId": "flashcards",
    "prefilledTopic": "{{{drugName}}} pharmacology",
    "cta": "Create Flashcards"
  },
  {
    "title": "Practice Dosage",
    "description": "Use the dosage calculator to practice calculating a common dose for {{{drugName}}}.",
    "toolId": "dosage",
    "prefilledTopic": "{{{drugName}}}",
    "cta": "Practice Dosage Calculation"
  }
]
`,
  config: {
    temperature: 0.3, // Factual and structured
  }
});

const pharmaGenieFlow = ai.defineFlow(
  {
    name: 'medicoPharmaGenieFlow',
    inputSchema: PharmaGenieInputSchema,
    outputSchema: PharmaGenieOutputSchema,
  },
  async (input) => {
    try {
        const { output } = await pharmaGeniePrompt(input);

        if (!output || !output.drugClass) {
        console.error('PharmaGeniePrompt did not return valid information for:', input.drugName);
        throw new Error('Failed to get drug information. The AI model did not return the expected output.');
        }
        
        return output;
    } catch (err) {
        console.error(`[PharmaGenieAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
        throw new Error('An unexpected error occurred while fetching drug information. Please try again.');
    }
  }
);
