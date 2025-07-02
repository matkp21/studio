
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
export type { DiagnosisItem, InvestigationItem } from '@/ai/schemas/symptom-analyzer-schemas';

// Simple in-memory cache
const symptomAnalysisCache = new Map<string, SymptomAnalyzerOutput>();

export async function analyzeSymptoms(input: SymptomAnalyzerInput): Promise<SymptomAnalyzerOutput> {
  // Normalize input for better cache hits (e.g., lowercase, trim)
  const normalizedInput = {
    ...input,
    symptoms: input.symptoms.trim().toLowerCase(),
    patientContext: input.patientContext ? {
      ...input.patientContext,
      history: input.patientContext.history?.trim().toLowerCase()
    } : undefined
  };
  const cacheKey = JSON.stringify(normalizedInput);

  if (symptomAnalysisCache.has(cacheKey)) {
    console.log(`[Cache HIT] Serving cached symptom analysis.`);
    return symptomAnalysisCache.get(cacheKey)!;
  }

  console.log(`[Cache MISS] Performing new symptom analysis.`);
  const result = await symptomAnalyzerFlow(input); // Use original input for the flow

  if (result) {
    symptomAnalysisCache.set(cacheKey, result);
  }

  return result;
}

const prompt = ai.definePrompt({
  name: 'symptomAnalyzerPrompt',
  input: {schema: SymptomAnalyzerInputSchema},
  output: {schema: SymptomAnalyzerOutputSchema},
  prompt: `You are an AI medical expert. Based on the symptoms and patient context provided, generate:
1.  A list of potential differential diagnoses. For each diagnosis, include:
    - 'name': The name of the condition.
    - 'confidence': Your qualitative confidence level (High, Medium, Low, or Possible).
    - 'rationale': Brief supporting evidence or reasoning, and mention any red flag symptoms associated with urgent/serious differentials.
2.  A prioritized list of suggested investigations for the top few likely diagnoses. For each investigation, include:
    - 'name': The name of the investigation (e.g., "Chest X-ray (PA and Lateral)").
    - 'rationale': A brief rationale for why this test is suggested (e.g., "To confirm lung consolidation if pneumonia suspected.").
3.  A list of suggested initial management steps or considerations for the most likely diagnoses. Mention if specific guidelines (e.g., WHO, NICE) should be consulted.

Symptoms: {{{symptoms}}}
{{#if patientContext}}
Patient Context:
  Age: {{{patientContext.age}}}
  Sex: {{{patientContext.sex}}}
  Relevant History: {{{patientContext.history}}}
{{/if}}

Output Format:
Ensure your output strictly adheres to the SymptomAnalyzerOutputSchema JSON structure.
'diagnoses' should be an array of objects, each with 'name', optional 'confidence', and optional 'rationale'.
'suggestedInvestigations' should be an array of objects, each with 'name' and optional 'rationale'.
'suggestedManagement' should be an array of strings.

Example for a single diagnosis object in the 'diagnoses' array:
{
  "name": "Community-Acquired Pneumonia",
  "confidence": "High",
  "rationale": "Supported by cough, fever, and reported crackles. Red flags: severe dyspnea, SpO2 <90%."
}
Example for diagnoses array:
[
  { "name": "Community-Acquired Pneumonia", "confidence": "High", "rationale": "Supported by cough, fever, and reported crackles. Red flags: severe dyspnea, SpO2 <90%." },
  { "name": "Acute Bronchitis", "confidence": "Medium", "rationale": "Cough present, but fever might be low grade or absent. Usually viral." },
  { "name": "Pulmonary Embolism", "confidence": "Low", "rationale": "Consider if sudden onset dyspnea, pleuritic chest pain, or risk factors present. Red flags: Unilateral leg swelling, hemoptysis." }
]

Example for a single investigation object in 'suggestedInvestigations':
{
  "name": "Chest X-ray (PA and Lateral)",
  "rationale": "To confirm lung consolidation if pneumonia suspected."
}
Example for suggestedInvestigations array:
[
  { "name": "Chest X-ray (PA and Lateral)", "rationale": "To confirm lung consolidation if pneumonia suspected." },
  { "name": "Sputum for Gram Stain & Culture", "rationale": "To identify causative organism in suspected respiratory infection." }
]

Example for suggestedManagement:
[
  "Consider empirical antibiotics (e.g., Amoxicillin-Clavulanate or Doxycycline) based on local guidelines and patient allergies if bacterial pneumonia is highly suspected.",
  "Oxygen therapy if SpO2 < 92%."
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
    
    const defaultDisclaimer = "This information is for informational purposes only and not a substitute for professional medical advice. Always consult with a qualified healthcare provider for any health concerns or before making any decisions related to your health or treatment.";
    const consultProfessionalMessage = "It is crucial to consult a healthcare professional for an accurate diagnosis and appropriate treatment plan.";

    if (!output) {
      console.error("Symptom analyzer prompt did not return an output.");
      return { 
        diagnoses: [{ name: "Could not determine potential diagnoses at this time. Please consult a medical professional.", confidence: "Unknown", rationale: "AI model did not return expected output." }],
        suggestedInvestigations: [],
        suggestedManagement: [consultProfessionalMessage],
        disclaimer: defaultDisclaimer
      };
    }
    
    const finalOutput = { ...output };

    // Ensure disclaimer is always present
    if (!finalOutput.disclaimer) {
      finalOutput.disclaimer = defaultDisclaimer;
    }

    // Ensure "consult a professional" is in management suggestions
    if (!finalOutput.suggestedManagement) {
        finalOutput.suggestedManagement = [];
    }
    if (!finalOutput.suggestedManagement.some(m => m.toLowerCase().includes("consult a healthcare professional") || m.toLowerCase().includes("consult a medical professional"))) {
        finalOutput.suggestedManagement.push(consultProfessionalMessage);
    }

    return finalOutput;
  }
);
