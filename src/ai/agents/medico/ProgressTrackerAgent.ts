
'use server';
/**
 * @fileOverview A Genkit flow for tracking study progress for medico users.
 * This is a conceptual agent that would typically interact with a database.
 *
 * - trackProgress - A function that handles progress tracking.
 * - MedicoProgressTrackerInput - The input type.
 * - MedicoProgressTrackerOutput - The output type.
 */

import { ai } from '@/ai/genkit';
import { MedicoProgressTrackerInputSchema, MedicoProgressTrackerOutputSchema } from '@/ai/schemas/medico-tools-schemas';
import type { z } from 'zod';

export type MedicoProgressTrackerInput = z.infer<typeof MedicoProgressTrackerInputSchema>;
export type MedicoProgressTrackerOutput = z.infer<typeof MedicoProgressTrackerOutputSchema>;

export async function trackProgress(input: MedicoProgressTrackerInput): Promise<MedicoProgressTrackerOutput> {
  // In a real application, this function would read from and write to a Firestore database
  // to get the user's current progress and update it.
  // For this conceptual agent, we'll simulate this interaction within the prompt.
  return progressTrackerFlow(input);
}

const progressTrackerPrompt = ai.definePrompt({
  name: 'medicoProgressTrackerPrompt',
  input: { schema: MedicoProgressTrackerInputSchema },
  output: { schema: MedicoProgressTrackerOutputSchema },
  prompt: `You are an AI assistant that provides gamified feedback for a medical student's study progress.
Your primary task is to generate an encouraging progress update message based on a completed activity. Your secondary, but MANDATORY task, is to suggest 1-2 logical next study steps. Format this as a JSON array for the 'nextSteps' field. This field is critical for the app's functionality and must not be omitted.

Activity Details:
Activity Type: {{{activityType}}}
Topic: {{{topic}}}
{{#if score}}Score: {{{score}}}%{{/if}}

Instructions:
1.  Based on this activity, provide an encouraging 'progressUpdateMessage'.
2.  If the score is high (e.g., > 85%), award a conceptual achievement in the 'newAchievements' array (e.g., "Cardiology Whiz", "Pharmacology Pro").
3.  Calculate a new conceptual progress percentage for the topic in 'updatedTopicProgress', assuming they started at a lower percentage.
4.  For 'nextSteps', if they did poorly on a quiz (score < 60), suggest they generate study notes. If they did well, suggest they try a different tool or topic.
Example for 'nextSteps': [{ "tool": "theorycoach-generator", "topic": "{{{topic}}}", "reason": "Review weak areas" }]

Format the entire output as JSON conforming to the MedicoProgressTrackerOutputSchema.

Example for a high score:
{
  "progressUpdateMessage": "Excellent work on the Cardiology MCQs! With a score of 90%, you're really mastering this topic. Keep up the great work!",
  "newAchievements": ["Cardiology Whiz"],
  "updatedTopicProgress": {
    "topic": "Cardiology",
    "newProgressPercentage": 75
  },
  "nextSteps": [{ "tool": "exams", "topic": "Cardiology", "reason": "Try a full mock exam" }]
}
Example for a regular review:
{
  "progressUpdateMessage": "Great job reviewing your notes on Pharmacology! Consistent review is key to retention.",
  "newAchievements": [],
  "updatedTopicProgress": {
    "topic": "Pharmacology",
    "newProgressPercentage": 55
  },
  "nextSteps": [{ "tool": "flashcards", "topic": "Pharmacology", "reason": "Create flashcards" }]
}
`,
  config: {
    temperature: 0.7, // More creative for gamified messages
  }
});

const progressTrackerFlow = ai.defineFlow(
  {
    name: 'medicoProgressTrackerFlow',
    inputSchema: MedicoProgressTrackerInputSchema,
    outputSchema: MedicoProgressTrackerOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await progressTrackerPrompt(input);

      if (!output || !output.progressUpdateMessage) {
        console.error('MedicoProgressTrackerPrompt did not return a valid progress update for:', input);
        throw new Error('Failed to track progress. The AI model did not return the expected output.');
      }
      // In a real app, you would now use this output to update Firestore.
      // e.g., db.collection('user_progress').doc(userId).update({ ... });
      return output;
    } catch (err) {
      console.error(`[ProgressTrackerAgent] Error: ${err instanceof Error ? err.message : String(err)}`);
      throw new Error('An unexpected error occurred while tracking progress. Please try again.');
    }
  }
);
