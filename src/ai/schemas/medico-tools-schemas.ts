// src/ai/schemas/medico-tools-schemas.ts

/**
 * @fileOverview Defines Zod schemas for Medico Mode specific tools,
 * including Study Notes Generator and MCQ Generator.
 */
import { z } from 'zod';

// Shared schema for recommended next steps
export const NextStepSuggestionSchema = z.object({
  tool: z.string().describe("The ID of the tool to recommend, e.g., 'mcq' or 'flashcards'."),
  topic: z.string().describe("The topic to pre-fill in the recommended tool."),
  reason: z.string().describe("A brief reason for the suggestion, e.g., 'Test your knowledge'."),
});
export type NextStepSuggestion = z.infer<typeof NextStepSuggestionSchema>;


// Schema for StudyNotesGenerator
export const StudyNotesGeneratorInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).describe('The medical topic for which to generate study notes (e.g., "Diabetes Mellitus", "Thalassemia Major").'),
  answerLength: z.enum(['10-mark', '5-mark']).optional().describe('Desired length of the answer based on university exam marks.'),
});
export type StudyNotesGeneratorInput = z.infer<typeof StudyNotesGeneratorInputSchema>;

export const StudyNotesGeneratorOutputSchema = z.object({
  notes: z.string().describe('Concise, AI-generated study notes on the topic, formatted for clarity with headings and bullet points where appropriate.'),
  summaryPoints: z.array(z.string()).optional().describe('Key summary points (e.g., 3-5 points) for quick revision of the topic.'),
  diagram: z.string().optional().describe('A Mermaid.js syntax for a flowchart or diagram relevant to the topic.'),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type StudyNotesGeneratorOutput = z.infer<typeof StudyNotesGeneratorOutputSchema>;


// Schema for MCQ Generator
export const MedicoMCQGeneratorInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).describe('The medical topic for which to generate MCQs (e.g., "Cardiology", "Hypertension").'),
  count: z.number().int().min(1).max(10).default(5).describe('The number of MCQs to generate (1-10). Default is 5.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium').describe('The difficulty level of the questions.'),
  examType: z.enum(['university', 'neet-pg', 'usmle']).default('university').describe('The style of exam to pattern the questions after.'),
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
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
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
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type MedicoExamPaperOutput = z.infer<typeof MedicoExamPaperOutputSchema>;


// Schema for Study Timetable Creator
export const MedicoStudyTimetableInputSchema = z.object({
  examName: z.string().min(3, { message: "Exam name must be at least 3 characters." }).describe('Name of the examination (e.g., "Final MBBS Prof").'),
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Exam date must be in YYYY-MM-DD format." }).describe('Date of the examination in YYYY-MM-DD format.'),
  subjects: z.array(z.string().min(1)).min(1, { message: "At least one subject is required." }).describe('List of subjects to study.'),
  studyHoursPerWeek: z.number().min(1).max(100).describe('Total number of study hours available per week.'),
  performanceContext: z.string().optional().describe('Detailed description of weak areas or performance notes to help prioritize the schedule.'),
});
export type MedicoStudyTimetableInput = z.infer<typeof MedicoStudyTimetableInputSchema>;

export const MedicoStudyTimetableOutputSchema = z.object({
  timetable: z.string().describe('A structured study timetable in Markdown format for display.'),
  performanceAnalysis: z.string().optional().describe("A summary of the AI's analysis of the user's weak areas, which was used to generate the timetable."),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
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
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type MedicoFlashcardGeneratorOutput = z.infer<typeof MedicoFlashcardGeneratorOutputSchema>;

// Schema for Clinical Case Simulations
export const MedicoClinicalCaseInputSchema = z.object({
  caseId: z.string().optional().describe('ID of an ongoing case, or leave empty to start a new one.'),
  userResponse: z.string().optional().describe('User response to the current case prompt.'),
  topic: z.string().optional().describe('Topic for a new case if caseId is not provided (e.g., "Severe Acute Malnutrition").'),
});
export type MedicoClinicalCaseInput = z.infer<typeof MedicoClinicalCaseInputSchema>;

export const MedicoClinicalCaseOutputSchema = z.object({
  caseId: z.string().describe('ID of the current case simulation.'),
  topic: z.string().optional().describe('The topic of the clinical case.'),
  prompt: z.string().describe('The next prompt or question in the case simulation for the user.'),
  feedback: z.string().optional().describe('Feedback on the user s previous response.'),
  isCompleted: z.boolean().default(false).describe('Indicates if the case simulation has ended.'),
  summary: z.string().optional().describe('Summary of the case if completed.'),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type MedicoClinicalCaseOutput = z.infer<typeof MedicoClinicalCaseOutputSchema>;

// Schema for Interactive Anatomy Visualizer
export const MedicoAnatomyVisualizerInputSchema = z.object({
  anatomicalStructure: z.string().min(3, { message: "Structure name must be at least 3 characters." }).describe('The anatomical structure to visualize/describe (e.g., "Liver", "Femur").'),
});
export type MedicoAnatomyVisualizerInput = z.infer<typeof MedicoAnatomyVisualizerInputSchema>;

export const MedicoAnatomyVisualizerOutputSchema = z.object({
  description: z.string().describe('Detailed description of the anatomical structure, including its function, location, and key features.'),
  imageUrl: z.string().optional().describe('A URL to a relevant image of the anatomical structure.'),
  relatedStructures: z.array(z.string()).optional().describe('List of related anatomical structures.'),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type MedicoAnatomyVisualizerOutput = z.infer<typeof MedicoAnatomyVisualizerOutputSchema>;

// Schema for Mnemonics Generator
export const MedicoMnemonicsGeneratorInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }).describe('The medical topic or list for which to generate a mnemonic (e.g., "Cranial Nerves", "Causes of Pancreatitis").'),
});
export type MedicoMnemonicsGeneratorInput = z.infer<typeof MedicoMnemonicsGeneratorInputSchema>;

export const MedicoMnemonicsGeneratorOutputSchema = z.object({
  mnemonic: z.string().describe('The generated mnemonic.'),
  explanation: z.string().optional().describe('Explanation of how the mnemonic works or what it represents.'),
  topicGenerated: z.string().describe('The topic for which the mnemonic was generated.'),
  imageUrl: z.string().optional().describe('URL to an AI-generated visual to aid memory.'),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type MedicoMnemonicsGeneratorOutput = z.infer<typeof MedicoMnemonicsGeneratorOutputSchema>;

// Schema for Differential Diagnosis Trainer (Now Interactive)
export const MedicoDDTrainerInputSchema = z.object({
  isNewCase: z.boolean().describe("True if starting a new training session, false if continuing."),
  symptoms: z.string().optional().describe('A clinical scenario or list of symptoms presented to the student to start a new case.'),
  userResponse: z.string().optional().describe("The student's question or action in response to the tutor's prompt."),
  currentCaseSummary: z.string().optional().describe("The story so far, to provide context for the AI tutor."),
});
export type MedicoDDTrainerInput = z.infer<typeof MedicoDDTrainerInputSchema>;

export const MedicoDDTrainerOutputSchema = z.object({
  prompt: z.string().describe("The AI tutor's next question or prompt for the student."),
  feedback: z.string().optional().describe('Feedback on the student s previous response.'),
  isCompleted: z.boolean().default(false).describe('Indicates if the training session has ended.'),
  updatedCaseSummary: z.string().describe("The new summary of the case including the latest interaction."),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type MedicoDDTrainerOutput = z.infer<typeof MedicoDDTrainerOutputSchema>;


// Schema for Virtual Patient Rounds
export const MedicoVirtualRoundsInputSchema = z.object({
  caseId: z.string().optional().describe('ID of an ongoing virtual round/patient, or empty to start a new one.'),
  patientFocus: z.string().optional().describe('Specific patient type or condition for new round (e.g., "Pediatric Asthma Exacerbation").'),
  userAction: z.string().optional().describe('Student s action/query during the round (e.g., "Check vitals", "Ask about medication history").'),
});
export type MedicoVirtualRoundsInput = z.infer<typeof MedicoVirtualRoundsInputSchema>;

export const MedicoVirtualRoundsOutputSchema = z.object({
  caseId: z.string().describe('ID of the current virtual patient case.'),
  patientSummary: z.string().describe('Current summary of the patient s status and history.'),
  currentObservation: z.string().describe('Result of the user s last action or current observation prompt.'),
  nextPrompt: z.string().describe('Guidance or question for the student s next step in the round.'),
  isCompleted: z.boolean().default(false).describe('Indicates if this patient encounter in the round is completed.'),
  topic: z.string().optional().describe('The topic/focus of the round.'),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type MedicoVirtualRoundsOutput = z.infer<typeof MedicoVirtualRoundsOutputSchema>;

// Schema for High-Yield Topic Predictor
export const MedicoTopicPredictorInputSchema = z.object({
  examType: z.string().min(3, { message: "Exam type must be specified." }).describe('Type of exam (e.g., "MBBS Final Year", "USMLE Step 1", "NEET-PG").'),
  subject: z.string().optional().describe('Specific subject to focus on (e.g., "Surgery", "Pediatrics").'),
});
export type MedicoTopicPredictorInput = z.infer<typeof MedicoTopicPredictorInputSchema>;

export const MedicoTopicPredictorOutputSchema = z.object({
  predictedTopics: z.array(z.string()).describe('List of predicted high-yield topics for the specified exam/subject.'),
  rationale: z.string().optional().describe('Brief rationale behind the predictions (e.g., based on past trends, syllabus weightage).'),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type MedicoTopicPredictorOutput = z.infer<typeof MedicoTopicPredictorOutputSchema>;

// Schema for Drug Dosage Calculator
export const MedicoDrugDosageInputSchema = z.object({
  drugName: z.string().min(2, { message: "Drug name is required." }).describe('Name of the drug.'),
  patientWeightKg: z.number().positive({ message: "Patient weight must be a positive number." }).describe('Patient s weight in kilograms.'),
  patientAgeYears: z.number().min(0).optional().describe('Patient s age in years (optional).'),
  renalFunction: z.string().optional().describe('Patient\'s renal function status (e.g., "Normal", "eGFR 45ml/min", "Impaired").'),
  indication: z.string().optional().describe('Medical indication for the drug (optional).'),
  concentrationAvailable: z.string().optional().describe('Concentration of the drug available, if non-standard (e.g., "250mg/5ml").'),
});
export type MedicoDrugDosageInput = z.infer<typeof MedicoDrugDosageInputSchema>;

export const MedicoDrugDosageOutputSchema = z.object({
  calculatedDose: z.string().describe('The calculated dose (e.g., "500 mg", "7.5 ml").'),
  calculationExplanation: z.string().describe('Step-by-step explanation of how the dose was calculated.'),
  warnings: z.array(z.string()).optional().describe('Any relevant warnings or considerations (e.g., "Adjust for renal impairment", "Max dose 2g/day").'),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type MedicoDrugDosageOutput = z.infer<typeof MedicoDrugDosageOutputSchema>;


// Schema for Flowchart Creator
export const MedicoFlowchartCreatorInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }).describe('The medical topic or process to create a flowchart for (e.g., "Management of Acute Asthma", "Glycolysis Pathway").'),
});
export type MedicoFlowchartCreatorInput = z.infer<typeof MedicoFlowchartCreatorInputSchema>;

const ReactFlowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['symptom', 'test', 'decision', 'treatment']),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.object({ label: z.string() }),
});
const ReactFlowEdgeSchema = z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    label: z.string().optional(),
    animated: z.boolean().optional(),
});
export const MedicoFlowchartCreatorOutputSchema = z.object({
  nodes: z.array(ReactFlowNodeSchema).describe("An array of nodes for React Flow."),
  edges: z.array(ReactFlowEdgeSchema).describe("An array of edges for React Flow."),
  topicGenerated: z.string().describe('The topic for which the flowchart was generated.'),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type MedicoFlowchartCreatorOutput = z.infer<typeof MedicoFlowchartCreatorOutputSchema>;


// Schema for Progress Tracker
export const MedicoProgressTrackerInputSchema = z.object({
  activityType: z.enum(['mcq_session', 'notes_review', 'case_sim_completed']).describe("The type of activity completed by the user."),
  topic: z.string().describe("The topic of the completed activity."),
  score: z.number().optional().describe("The user's score (e.g., percentage on an MCQ test)."),
  // In a real app, this would also include userId from context
});
export type MedicoProgressTrackerInput = z.infer<typeof MedicoProgressTrackerInputSchema>;

export const MedicoProgressTrackerOutputSchema = z.object({
  progressUpdateMessage: z.string().describe("A message summarizing the progress and any rewards."),
  newAchievements: z.array(z.string()).optional().describe("A list of any new achievements or badges unlocked."),
  updatedTopicProgress: z.object({
    topic: z.string(),
    newProgressPercentage: z.number(),
  }).optional().describe("The updated progress percentage for the specific topic."),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type MedicoProgressTrackerOutput = z.infer<typeof MedicoProgressTrackerOutputSchema>;


// Schema for Note Summarizer (NEW)
export const MedicoNoteSummarizerInputSchema = z.object({
  text: z.string().optional().describe('The text content from a document (PDF/TXT) to be summarized.'),
  imageDataUri: z.string().optional().describe("An image (e.g., JPEG of a note) as a data URI."),
  format: z.enum(['bullet', 'flowchart', 'table']).default('bullet').describe('The desired format for the summary.'),
}).refine(data => !!data.text || !!data.imageDataUri, {
    message: "Either text or an image must be provided for summarization.",
});
export type MedicoNoteSummarizerInput = z.infer<typeof MedicoNoteSummarizerInputSchema>;

export const MedicoNoteSummarizerOutputSchema = z.object({
  summary: z.string().describe('The AI-generated summary in the specified format.'),
  format: z.enum(['bullet', 'flowchart', 'table']).describe('The format of the returned summary.'),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type MedicoNoteSummarizerOutput = z.infer<typeof MedicoNoteSummarizerOutputSchema>;


// Schema for PathoMind
export const PathoMindInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }).describe('The medical topic or disease to explain.'),
});
export type PathoMindInput = z.infer<typeof PathoMindInputSchema>;

export const PathoMindOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the pathophysiology.'),
  diagram: z.string().optional().describe('A Mermaid.js syntax diagram illustrating the pathophysiological process.'),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type PathoMindOutput = z.infer<typeof PathoMindOutputSchema>;


// Schema for PharmaGenie
export const PharmaGenieInputSchema = z.object({
  drugName: z.string().min(3, { message: "Drug name must be at least 3 characters." }).describe('The drug to explain.'),
});
export type PharmaGenieInput = z.infer<typeof PharmaGenieInputSchema>;

export const PharmaGenieOutputSchema = z.object({
  drugClass: z.string().describe('The pharmacological class of the drug.'),
  mechanismOfAction: z.string().describe('A detailed explanation of the drug\'s mechanism of action.'),
  indications: z.array(z.string()).describe('A list of key medical uses for the drug.'),
  sideEffects: z.array(z.string()).describe('A list of common or important side effects.'),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type PharmaGenieOutput = z.infer<typeof PharmaGenieOutputSchema>;

// Schema for MicroMate
export const MicroMateInputSchema = z.object({
  microorganism: z.string().min(3, { message: "Microorganism name must be at least 3 characters." }).describe('The microorganism to explain.'),
});
export type MicroMateInput = z.infer<typeof MicroMateInputSchema>;

export const MicroMateOutputSchema = z.object({
  characteristics: z.string().describe('Key characteristics of the microorganism (e.g., Gram stain, shape).'),
  virulenceFactors: z.string().describe('Key virulence factors.'),
  diseasesCaused: z.string().describe('Common diseases associated with the organism.'),
  labDiagnosis: z.string().describe('Standard methods for lab diagnosis.'),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type MicroMateOutput = z.infer<typeof MicroMateOutputSchema>;

// Schema for DiagnoBot
export const DiagnoBotInputSchema = z.object({
  labResults: z.string().min(10, { message: "Please provide some lab results." }).describe('A text description of lab results (e.g., "CBC: Hb 10.5, WBC 15000, Plt 450k").'),
});
export type DiagnoBotInput = z.infer<typeof DiagnoBotInputSchema>;

export const DiagnoBotOutputSchema = z.object({
  interpretation: z.string().describe('A structured interpretation of the lab results provided.'),
  likelyDifferentials: z.array(z.string()).describe('A list of likely differential diagnoses suggested by the lab results.'),
  nextSteps: z.array(NextStepSuggestionSchema).optional().describe("A list of recommended next steps or tools to use."),
});
export type DiagnoBotOutput = z.infer<typeof DiagnoBotOutputSchema>;
