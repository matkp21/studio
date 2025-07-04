
'use server';
/**
 * @fileOverview The DiagnoBot agent, for interpreting clinical data.
 *
 * - interpretLabs - A function that handles lab interpretation.
 * - DiagnoBotInput - The input type for the agent.
 * - DiagnoBotOutput - The return type from the agent.
 */

import { ai } from '@/ai/genkit';
import { DiagnoBotInputSchema, DiagnoBotOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type DiagnoBotInput = z.infer<typeof DiagnoBotInputSchema>;
export type DiagnoBotOutput = z.infer<typeof DiagnoBotOutputSchema>;

export async function interpretLabs(input: DiagnoBotInput): Promise<DiagnoBotOutput> {
  return diagnoBotFlow(input);
}

const diagnoBotPrompt = ai.definePrompt({
  name: 'medicoDiagnoBotPrompt',
  input: { schema: DiagnoBotInputSchema },
  output: { schema: DiagnoBotOutputSchema },
  prompt: `You are DiagnoBot, an AI expert in interpreting clinical laboratory data for medical students.
Given the following lab results:
"{{{labResults}}}"

Provide a structured interpretation covering:
1.  **Abnormal Values**: Clearly list which values are high, low, or abnormal.
2.  **Potential Implications**: Explain what these abnormalities could suggest (e.g., "Elevated WBC may indicate infection or inflammation").
3.  **Likely Differentials**: List a few possible differential diagnoses suggested by the lab results.
4.  **Next Steps**: Suggest what clinical correlations or next steps might be considered, such as explaining the pathophysiology of a likely differential.

Format the output as JSON conforming to the DiagnoBotOutputSchema.
- The 'interpretation' field should be a detailed, well-structured text in Markdown.
- The 'likelyDifferentials' field should be an array of possible conditions suggested by the labs.
- 'nextSteps' should contain suggestions like: { "tool": "pathomind", "topic": "[One of the likely differentials]", "reason": "Explain pathophysiology" }.
`,
  config: {
    temperature: 0.3, // Factual for data interpretation
  }
});

const diagnoBotFlow = ai.defineFlow(
  {
    name: 'medicoDiagnoBotFlow',
    inputSchema: DiagnoBotInputSchema,
    outputSchema: DiagnoBotOutputSchema,
  },
  async (input) => {
    const { output } = await diagnoBotPrompt(input);

    if (!output || !output.interpretation) {
      console.error('DiagnoBotPrompt did not return a valid interpretation for:', input.labResults);
      throw new Error('Failed to interpret lab results. The AI model did not return the expected output.');
    }
    
    return output;
  }
);
