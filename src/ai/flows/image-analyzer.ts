'use server';
/**
 * @fileOverview AI-powered medical image annotation flow.
 *
 * - analyzeImage - A function that analyzes a medical image and provides annotations.
 * - AnalyzeImageInput - The input type for the analyzeImage function.
 * - AnalyzeImageOutput - The return type for the analyzeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A medical image (e.g., X-ray, CT scan) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.object({
  annotations: z
    .string()
    .describe('AI-powered annotations highlighting key areas of interest in the medical image.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: {schema: AnalyzeImageInputSchema},
  output: {schema: AnalyzeImageOutputSchema},
  prompt: `You are a medical imaging analysis AI.  You are provided with a
medical image, and your task is to generate annotations that highlight key areas of interest to assist medical professionals in their diagnosis.

Image: {{media url=imageDataUri}}

Provide detailed annotations for the given medical image. Focus on identifying and describing any abnormalities, key anatomical features, or other relevant details that could aid in diagnosis. Be as specific as possible in your descriptions.
`,
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
