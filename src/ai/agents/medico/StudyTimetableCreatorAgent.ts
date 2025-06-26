
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
  prompt: `You are an AI assistant specializing in helping medical students plan their study schedules.
Given the following details:
Exam Name: {{{examName}}}
Exam Date: {{{examDate}}}
Subjects: {{#each subjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Study Hours Per Week: {{{studyHoursPerWeek}}}

Create a structured and realistic study timetable. Distribute study hours appropriately among subjects.
The output should be a clear, organized timetable. For example, a weekly breakdown in Markdown format.
Ensure the timetable helps the student cover all subjects effectively before the exam date.
Provide the timetable in the 'timetable' field of the output.
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

    if (!output || !output.timetable) {
      console.error('MedicoStudyTimetablePrompt did not return a valid timetable for:', input.examName);
      throw new Error('Failed to generate study timetable. The AI model did not return the expected output.');
    }
    // Firestore saving logic could go here
    return output;
  }
);
