// src/ai/schemas/medico-tools-schemas.ts

/**
 * @fileOverview Defines Zod schemas for Medico Mode specific tools,
 * including Study Notes Generator and MCQ Generator.
 */
import { z } from 'zod';

const subjects = ["Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology", "Microbiology", "Forensic Medicine", "Community Medicine", "Ophthalmology", "ENT", "General Medicine", "General Surgery", "Obstetrics & Gynaecology", "Pediatrics", "Other"] as const;
const systems = ["Cardiovascular", "Respiratory", "Gastrointestinal", "Neurological", "Musculoskeletal", "Endocrine", "Genitourinary", "Integumentary", "Hematological", "Immunological", "Other"] as const;


// Schema for StudyNotesGenerator
export const StudyNotesGeneratorInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).describe('The medical topic for which to generate study notes (e.g., "Diabetes Mellitus", "Thalassemia Major").'),
  answerLength: z.enum(['10-mark', '5-mark']).optional().describe('Desired length of the answer based on university exam marks.'),
  subject: z.enum(subjects).optional().describe('The main subject this topic falls under (e.g., "Surgery", "Medicine").'),
  system: z.enum(systems).optional().describe('The physiological system this topic relates to (e.g., "Cardiovascular", "Neurological").'),
});
export type StudyNotesGeneratorInput = z.infer<typeof StudyNotesGeneratorInputSchema>;

export const StudyNotesGeneratorOutputSchema = z.object({
  notes: z.string().describe('Concise, AI-generated study notes on the topic, formatted for clarity with headings and bullet points where appropriate.'),
  summaryPoints: z.array(z.string()).optional().describe('Key summary points (e.g., 3-5 points) for quick revision of the topic.'),
  diagram: z.string().optional().describe('A Mermaid.js syntax for a flowchart or diagram relevant to the topic.'),
});
export type StudyNotesGeneratorOutput = z.infer<typeof StudyNotesGeneratorOutputSchema>;


// Schema for MCQ Generator
export const MedicoMCQGeneratorInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).describe('The medical topic for which to generate MCQs (e.g., "Cardiology", "Hypertension").'),
  count: z.number().int().min(1).max(10).default(5).describe('The number of MCQs to generate (1-10). Default is 5.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium').describe('The difficulty level of the questions.'),
  examType: z.enum(['university', 'neet-pg', 'usmle']).default('university').describe('The style of exam to pattern the questions after.'),
  subject: z.enum(subjects).optional().describe('The main subject this topic falls under (e.g., "Surgery", "Medicine").'),
  system: z.enum(systems).optional().describe('The physiological system this topic relates to (e.g., "Cardiovascular", "Neurological").'),
});
export type MedicoMCQGeneratorInput = z.infer<typeof MedicoMCQGeneratorInputSchema>;

export const MCQOptionSchema = z.object({
  text: z.string().describe('The text of the multiple-choice option.'),
  isCorrect: z.boolean().describe('Indicates if this option is the correct answer.'),
});

export const MCQSchema = z.object({
  question: z.string().describe('The MCQ question text.'),
  options: z.array(MCQOptionSchema).length(4, { message: "Each MCQ must have exactly 4 options."}).describe('Exactly four options for the MCQ, one of which must be correct.'),
  explanation: z.string().optional().describe('A brief explanation for why the correct answer is correct. This helps in learning.'),
});
export type SingleMCQ = z.infer<typeof MCQSchema>;


export const MedicoMCQGeneratorOutputSchema = z.object({
  mcqs: z.array(MCQSchema).describe('An array of generated MCQs, each with a question, options, and an explanation.'),
  topicGenerated: z.string().describe('The topic for which these MCQs were generated.'),
});
export type MedicoMCQGeneratorOutput = z.infer<typeof MedicoMCQGeneratorOutputSchema>;

// Schema for Exam Paper Generator
export const MedicoExamPaperInputSchema = z.object({
  examType: z.string().min(3, { message: "Exam type must be at least 3 characters." }).describe('The name of the examination (e.g., "USMLE Step 1", "Final MBBS Prof").'),
  year: z.string().optional().describe('Optional focus year for pattern analysis (e.g., "2023").'),
  count: z.number().int().min(1).max(20).default(10).describe('The number of MCQs to generate (1-20). Default is 10.'),
});
export type MedicoExamPaperInput = z.infer<typeof MedicoExamPaperInputSchema>;

export const EssayQuestionSchema = z.object({
  question: z.string().describe('The essay question.'),
  answer_outline: z.string().describe('A brief outline of the key points for the answer.'),
});

export const MedicoExamPaperOutputSchema = z.object({
  mcqs: z.array(MCQSchema).optional().describe('An array of generated MCQs for the exam.'),
  essays: z.array(EssayQuestionSchema).optional().describe('An array of generated essay questions.'),
  topicGenerated: z.string().describe('The exam type for which this paper was generated.'),
});
export type MedicoExamPaperOutput = z.infer<typeof MedicoExamPaperOutputSchema>;


// Schema for Study Timetable Creator
export const MedicoStudyTimetableInputSchema = z.object({
  examName: z.string().min(3, { message: "Exam name must be at least 3 characters." }).describe('Name of the examination (e.g., "Final MBBS Prof").'),
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Exam date must be in YYYY-MM-DD format." }).describe('Date of the examination in YYYY-MM-DD format.'),
  subjects: z.array(z.string().min(1)).min(1, { message: "At least one subject is required." }).describe('List of subjects to study.'),
  studyHoursPerWeek: z.number().min(1).max(100).describe('Total number of study hours available per week.'),
});
export type MedicoStudyTimetableInput = z.infer<typeof MedicoStudyTimetableInputSchema>;

export const MedicoStudyTimetableOutputSchema = z.object({
  timetable: z.string().describe('A structured study timetable in Markdown format for display.'),
});
export type MedicoStudyTimetableOutput = z.infer<typeof MedicoStudyTimetableOutputSchema>;

// Schema for Flashcard Generator
export const MedicoFlashcardGeneratorInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }).describe('The medical topic for flashcards.'),
  count: z.number().int().min(1).max(20).default(10).describe('Number of flashcards to generate (1-20).'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium').describe('The difficulty level of the flashcards.'),
  examType: z.enum(['university', 'neet-pg', 'usmle']).default('university').describe('The style of exam to pattern the flashcards after.'),
});
export type MedicoFlashcardGeneratorInput = z.infer<typeof MedicoFlashcardGeneratorInputSchema>;

export const MedicoFlashcardSchema = z.object({
  front: z.string().describe('The front side of the flashcard (question/term).'),
  back: z.string().describe('The back side of the flashcard (answer/definition).'),
});
export type MedicoFlashcard = z.infer<typeof MedicoFlashcardSchema>;

export const MedicoFlashcardGeneratorOutputSchema = z.object({
  flashcards: z.array(MedicoFlashcardSchema).describe('An array of generated flashcards.'),
  topicGenerated: z.string().describe('The topic for which these flashcards were generated.'),
});
export type MedicoFlashcardGeneratorOutput = z.infer<typeof MedicoFlashcardGeneratorOutputSchema>;
