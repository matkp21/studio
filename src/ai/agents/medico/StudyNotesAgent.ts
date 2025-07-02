
'use server';
/**
 * @fileOverview A Genkit flow for generating study notes on medical topics for medico users.
 * This flow takes a medical topic as input and returns structured study notes
 * along with key summary points for quick revision.
 *
 * - generateStudyNotes - A function that handles the study notes generation process.
 * - MedicoStudyNotesInput - The input type for the generateStudyNotes function.
 * - MedicoStudyNotesOutput - The return type for the generateStudyNotes function.
 */

import { ai } from '@/ai/genkit';
import { MedicoStudyNotesInputSchema, MedicoStudyNotesOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoStudyNotesInput = z.infer<typeof MedicoStudyNotesInputSchema>;
export type MedicoStudyNotesOutput = z.infer<typeof MedicoStudyNotesOutputSchema>;

// Simple in-memory cache
const studyNotesCache = new Map<string, MedicoStudyNotesOutput>();

export async function generateStudyNotes(input: MedicoStudyNotesInput): Promise<MedicoStudyNotesOutput> {
  const cacheKey = JSON.stringify(input);
  if (studyNotesCache.has(cacheKey)) {
    console.log(`[Cache HIT] Serving cached study notes for: ${input.topic}`);
    return studyNotesCache.get(cacheKey)!;
  }
  
  console.log(`[Cache MISS] Generating new study notes for: ${input.topic}`);
  const result = await studyNotesFlow(input);
  
  // Cache the successful result
  if (result) {
    studyNotesCache.set(cacheKey, result);
  }
  
  return result;
}

const studyNotesPrompt = ai.definePrompt({
  name: 'medicoStudyNotesPrompt',
  input: { schema: MedicoStudyNotesInputSchema },
  output: { schema: MedicoStudyNotesOutputSchema },
  prompt: `You are an AI assistant specializing in creating concise and informative study notes for medical students.
Given the medical topic: {{{topic}}}

Generate study notes that are:
1.  Accurate and up-to-date, based on standard medical textbooks and guidelines.
2.  Well-structured: Use headings for main sections, and bullet points or numbered lists for details like etiology, clinical features, diagnosis, and management.
3.  Focused on key concepts, definitions, mechanisms, and clinical relevance.
4.  Easy to understand and suitable for revision for MBBS exams.
5.  Include 3-5 key summary points as an array of strings for quick recall. For example, if the topic is 'Thalassemia Major', summary points might cover its definition, key genetic defect, hallmark clinical features, main diagnostic tests, and primary management strategy.

Topic: {{{topic}}}

Format the output as JSON conforming to the MedicoStudyNotesOutput schema.
Ensure 'notes' is a single comprehensive string containing the structured notes (with newlines for formatting like \n for line breaks and \n\n for paragraphs).
Ensure 'summaryPoints' is an array of strings, each string being a concise summary point.
Example output for 'notes' on "Type 1 Diabetes Mellitus":
"## Type 1 Diabetes Mellitus\n\n**Definition:**\nType 1 Diabetes Mellitus (T1DM) is an autoimmune disease characterized by the destruction of insulin-producing beta cells in the pancreas, leading to absolute insulin deficiency.\n\n**Etiology:**\n- Autoimmune destruction of beta cells (most common)\n- Genetic predisposition (HLA-DR3, HLA-DR4)\n- Environmental triggers (e.g., viral infections, dietary factors)\n\n**Clinical Features:**\n- Polyuria (excessive urination)\n- Polydipsia (excessive thirst)\n- Polyphagia (excessive hunger)\n- Weight loss\n- Fatigue\n- Diabetic Ketoacidosis (DKA) in severe cases\n\n**Diagnosis:**\n- Random plasma glucose >= 200 mg/dL with symptoms\n- Fasting plasma glucose >= 126 mg/dL\n- HbA1c >= 6.5%\n- Presence of autoantibodies (e.g., GAD65, ICA)\n\n**Management:**\n- Lifelong insulin therapy (subcutaneous injections or insulin pump)\n- Blood glucose monitoring\n- Diet and exercise management\n- Education and psychosocial support"

Example output for 'summaryPoints' on "Type 1 Diabetes Mellitus":
["Autoimmune destruction of pancreatic beta cells leading to absolute insulin deficiency.", "Key symptoms include polyuria, polydipsia, polyphagia, and weight loss.", "Diagnosis involves blood glucose tests (random, fasting, HbA1c) and autoantibody detection.", "Management primarily involves lifelong insulin therapy and lifestyle adjustments.", "Acute complication includes Diabetic Ketoacidosis (DKA)."]

`,
  config: {
    temperature: 0.3, // More factual for notes
  }
});

const studyNotesFlow = ai.defineFlow(
  {
    name: 'medicoStudyNotesFlow',
    inputSchema: MedicoStudyNotesInputSchema,
    outputSchema: MedicoStudyNotesOutputSchema,
  },
  async (input) => {
    const { output } = await studyNotesPrompt(input);
    if (!output) {
      console.error('MedicoStudyNotesPrompt did not return an output for topic:', input.topic);
      throw new Error('Failed to generate study notes. The AI model did not return the expected output. Please try a different topic or rephrase.');
    }
    // Firestore saving logic could go here in a real application, e.g.:
    // await saveStudyNotesToFirestore(input.topic, output);
    return output;
  }
);
