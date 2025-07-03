
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
  prompt: `You are an expert AI academic advisor for medical students. Your task is to create a personalized, effective study timetable.

**Student's Goal:**
- Exam Name: {{{examName}}}
- Exam Date: {{{examDate}}}
- Available Study Hours Per Week: {{{studyHoursPerWeek}}}
- Subjects to Cover: {{#each subjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{#if weakSubjects}}
- **Prioritize These Subjects**: {{#each weakSubjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

**Your Task:**
1.  **Analyze**: Review all the details provided.
2.  **Strategize**: Create a structured, realistic, and personalized study timetable.
3.  **Prioritize**: If 'weak subjects' are listed, allocate more time and potentially more frequent revision sessions for them.
4.  **Structure**: The output should be a clear, organized timetable, ideally in a week-by-week Markdown format. Include a mix of first-reads, revisions, and practice question sessions.
5.  **Explain**: Briefly explain the rationale behind the schedule, especially how it addresses the weak subjects.

Example of a good structure:
"### Week 1-2: Foundation & High-Yield Topics
**Focus:** Build a strong base in all subjects, with extra time for Pathology.
- **Monday:** 3h Medicine (Cardiology), 2h Pathology (Cell Injury)
- **Tuesday:** 3h Surgery (Wound Healing), 2h Pathology (Inflammation)
...
**Rationale:** We are starting with high-yield topics and dedicating an extra session to Pathology each week to build confidence."

Ensure the final output in the 'timetable' field is the complete, well-formatted Markdown schedule.
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
