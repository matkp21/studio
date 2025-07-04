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
  prompt: `You are an expert AI academic advisor for medical students.

**Student's Goal:**
- Exam Name: {{{examName}}}
- Exam Date: {{{examDate}}}
- Available Study Hours Per Week: {{{studyHoursPerWeek}}}
- Subjects to Cover: {{#each subjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

{{#if performanceContext}}
**Student's Performance Context / Weak Areas:**
{{{performanceContext}}}
{{/if}}

**Your Task:**
1.  **Analyze & Prioritize**: Use the student's provided performance context to create a structured, realistic, and personalized study timetable. Allocate more time, more frequent revision sessions, and targeted practice for the weak areas identified in the context. If no context is provided, create a balanced schedule.

2.  **Structure**: The output for the 'timetable' field should be a clear, organized timetable, ideally in a week-by-week Markdown format. It should be detailed and actionable.

3.  **Confirm Understanding**: In the 'performanceAnalysis' field of your response, provide a brief summary of the weak points from the user's context that you prioritized in the schedule. This confirms you understood the request. For example: "The schedule prioritizes clinical application in Neurology and complex pharmacology based on the provided context."

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
