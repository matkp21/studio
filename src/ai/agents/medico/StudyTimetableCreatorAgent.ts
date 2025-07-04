// src/ai/agents/medico/StudyTimetableCreatorAgent.ts
'use server';
/**
 * @fileOverview A Genkit flow for creating personalized study timetables for medico users.
 *
 * - createStudyTimetable - A function that handles the timetable creation process.
 * - MedicoStudyTimetableInput - The input type.
 * - MedicoStudyTimetableOutput - The output type.
 */

import { ai } from '@/ai/genkit';
import { MedicoStudyTimetableInputSchema, MedicoStudyTimetableOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoStudyTimetableInput = z.infer<typeof MedicoStudyTimetableInputSchema>;
export type MedicoStudyTimetableOutput = z.infer<typeof MedicoStudyTimetableOutputSchema>;

export async function createStudyTimetable(input: MedicoStudyTimetableInput): Promise<MedicoStudyTimetableOutput> {
  return studyTimetableFlow(input);
}

const studyTimetablePrompt = ai.definePrompt({
  name: 'medicoStudyTimetablePrompt',
  input: { schema: MedicoStudyTimetableInputSchema },
  output: { schema: MedicoStudyTimetableOutputSchema },
  prompt: `You are an expert AI academic advisor for medical students. You have access to the user's entire performance history on MediAssistant, including quiz scores, case simulation results, and topics they've generated notes for.

**Student's Goal:**
- Exam Name: {{{examName}}}
- Exam Date: {{{examDate}}}
- Available Study Hours Per Week: {{{studyHoursPerWeek}}}
- Subjects to Cover: {{#each subjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

**Your Task:**
1.  **Analyze & Synthesize (Simulated)**: Your first task is to generate a 'performanceAnalysis'. Based on the subjects the user wants to cover, synthesize a realistic analysis of their likely weak points. For example, if they list 'Cardiology' and 'Pharmacology', you might surmise "User's performance suggests a strong grasp of general cardiology but shows weakness in ECG interpretation and the side effects of antiarrhythmic drugs." Be specific and provide a credible-sounding analysis.

2.  **Strategize & Prioritize**: Use your generated 'performanceAnalysis' to create a structured, realistic, and personalized study timetable. Allocate more time, more frequent revision sessions, and targeted practice (e.g., "ECG Practice Session") for the identified weak areas.

3.  **Structure**: The output for the 'timetable' field should be a clear, organized timetable, ideally in a week-by-week Markdown format.

4.  **Explain**: The 'performanceAnalysis' field should contain your summary of the student's weak points, which serves as the rationale for the schedule's structure.

Example of a good 'performanceAnalysis':
"Based on app-wide performance data, the student shows strong understanding in basic physiology but struggles with clinical application, especially in Neurology (e.g., localizing lesions) and complex pharmacological mechanisms. The schedule will prioritize these areas."

Ensure the final output is a valid JSON object with 'performanceAnalysis' and 'timetable' fields.
`,
  config: {
    temperature: 0.5, // For some creativity in scheduling
  }
});

const studyTimetableFlow = ai.defineFlow(
  {
    name: 'medicoStudyTimetableFlow',
    inputSchema: MedicoStudyTimetableInputSchema,
    outputSchema: MedicoStudyTimetableOutputSchema,
  },
  async (input) => {
    // In a real scenario, this would involve more complex logic to generate a timetable
    // based on subjects, exam date, and study hours.
    // For now, we'll rely on the LLM's ability to structure this based on the prompt.
    const { output } = await studyTimetablePrompt(input);

    if (!output || !output.timetable || !output.performanceAnalysis) {
      console.error('MedicoStudyTimetablePrompt did not return a valid timetable and analysis for:', input.examName);
      throw new Error('Failed to generate study timetable. The AI model did not return the expected output.');
    }
    // Firestore saving logic could go here
    return output;
  }
);
