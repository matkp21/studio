/**
 * @fileOverview Defines Zod schemas for symptom analysis input and output.
 * These schemas are used by both the symptom analyzer flow and its corresponding tool.
 */
import { z } from 'zod';

export const PatientContextSchema = z.object({
  age: z.number().int().positive().optional().describe('Patient age in years.'),
  sex: z.enum(['male', 'female', 'other']).optional().describe('Patient biological sex.'),
  history: z.string().optional().describe('Brief relevant medical history or context.'),
}).optional();

export const SymptomAnalyzerInputSchema = z.object({
  symptoms: z.string().min(10, { message: "Symptoms description must be at least 10 characters." }).describe('The symptoms the user is experiencing.'),
  patientContext: PatientContextSchema,
});

export const InvestigationSchema = z.object({
  name: z.string().describe('Name of the suggested investigation (e.g., "Chest X-ray", "CBC").'),
  rationale: z.string().optional().describe('Brief reason why this investigation is suggested.'),
});

export const SymptomAnalyzerOutputSchema = z.object({
  diagnoses: z.array(z.string()).describe('A list of potential differential diagnoses based on the symptoms provided.'),
  suggestedInvestigations: z.array(InvestigationSchema).optional().describe('A list of suggested investigations for the top likely diagnoses.'),
  suggestedManagement: z.array(z.string()).optional().describe('A list of suggested initial management steps or considerations.'),
  disclaimer: z.string().optional().describe('A standard disclaimer advising consultation with a medical professional.'),
});

