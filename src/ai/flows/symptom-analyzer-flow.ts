'use server';
/**
 * @fileOverview An AI agent that analyzes symptoms and provides potential diagnoses,
 * along with suggestions for investigations and initial management.
 *
 * - analyzeSymptoms - A function that takes user-provided symptoms and returns a list of potential diagnoses and suggestions.
 * - SymptomAnalyzerInput - The input type for the analyzeSymptoms function.
 * - SymptomAnalyzerOutput - The return type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { SymptomAnalyzerInputSchema, SymptomAnalyzerOutputSchema } from '@/ai/schemas/symptom-analyzer-schemas';

export type SymptomAnalyzerInput = z.infer<typeof SymptomAnalyzerInputSchema>;
export type SymptomAnalyzerOutput = z.infer<typeof SymptomAnalyzerOutputSchema>;

export async function analyzeSymptoms(input: SymptomAnalyzerInput): Promise<SymptomAnalyzerOutput> {
  return symptomAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomAnalyzerPrompt',
  input: {schema: SymptomAnalyzerInputSchema},
  output: {schema: SymptomAnalyzerOutputSchema},
  prompt: `You are an AI medical expert. Based on the symptoms and patient context provided, generate:
1.  A list of potential differential diagnoses, ranked by probability if possible. Include brief supporting evidence or rationale for each.
2.  A prioritized list of suggested investigations for the top few likely diagnoses. Include brief rationale snippets for why each test is suggested.
3.  A list of suggested initial management steps or considerations for the most likely diagnoses. Mention if specific guidelines (e.g., WHO) should be consulted.

Symptoms: {{{symptoms}}}
{{#if patientContext}}
Patient Context:
  Age: {{{patientContext.age}}}
  Sex: {{{patientContext.sex}}}
  Relevant History: {{{patientContext.history}}}
{{/if}}

Output Format:
Ensure your output strictly adheres to the SymptomAnalyzerOutputSchema.
'diagnoses' should be an array of strings.
'suggestedInvestigations' should be an array of objects, each with 'name' and 'rationale'.
'suggestedManagement' should be an array of strings.

Example for suggestedInvestigations:
[
  { "name": "Chest X-ray (PA and Lateral)", "rationale": "To confirm lung consolidation if pneumonia suspected." },
  { "name": "Sputum for Gram Stain & Culture", "rationale": "To identify causative organism in suspected respiratory infection." }
]

Example for suggestedManagement:
[
  "Consider empirical antibiotics (e.g., Amoxicillin-Clavulanate or Doxycycline) based on local guidelines and patient allergies if bacterial pneumonia is highly suspected.",
  "Oxygen therapy if SpO2 < 92%.",
  "Advise patient to consult a healthcare professional for definitive diagnosis and treatment."
]

Always include a disclaimer that this information is for informational purposes only and not a substitute for professional medical advice.
`,
});

const symptomAnalyzerFlow = ai.defineFlow(
  {
    name: 'symptomAnalyzerFlow',
    inputSchema: SymptomAnalyzerInputSchema,
    outputSchema: SymptomAnalyzerOutputSchema,
  },
  async (input: SymptomAnalyzerInput) => {
    const {output} = await prompt(input);
    if (!output) {
      console.error("Symptom analyzer prompt did not return an output.");
      return { 
        diagnoses: ["Could not determine potential diagnoses at this time. Please consult a medical professional."],
        suggestedInvestigations: [],
        suggestedManagement: ["Advise consulting a medical professional."],
        disclaimer: "This information is for informational purposes only and not a substitute for professional medical advice."
      };
    }
     // Ensure disclaimer is always present
    const finalOutput = { ...output };
    if (!finalOutput.disclaimer) {
      finalOutput.disclaimer = "This information is for informational purposes only and not a substitute for professional medical advice. Always consult with a qualified healthcare provider for any health concerns or before making any decisions related to your health or treatment.";
    }
    if (!finalOutput.suggestedManagement?.some(m => m.toLowerCase().includes("consult a healthcare professional"))) {
        if (!finalOutput.suggestedManagement) finalOutput.suggestedManagement = [];
        finalOutput.suggestedManagement.push("It is crucial to consult a healthcare professional for an accurate diagnosis and appropriate treatment plan.");
    }


    return finalOutput;
  }
);

