// src/config/medico-tools-config.ts
import type { MedicoTool, ActiveToolId } from '@/types/medico-tools';
import {
  NotebookText, FileQuestion, CalendarClock, Layers, CaseUpper, Lightbulb, BookCopy,
  Users, Eye, Brain, TrendingUp, Calculator, Workflow, Award, Star, Settings, CheckSquare, GripVertical, FileText, Youtube, Mic
} from 'lucide-react';

// Component Imports
import { StudyNotesGenerator } from '@/components/medico/study-notes-generator';
import { McqGenerator } from '@/components/medico/mcq-generator';
import { StudyTimetableCreator } from '@/components/medico/study-timetable-creator';
import { FlashcardGenerator } from '@/components/medico/flashcard-generator';
import { SolvedQuestionPapersViewer } from '@/components/medico/solved-question-papers-viewer';
import { MnemonicsGenerator } from '@/components/medico/mnemonics-generator';
import { FlowchartCreator } from '@/components/medico/flowchart-creator';

// Define the full list of tools
export const allMedicoToolsList: MedicoTool[] = [
  { id: 'theorycoach-generator', title: 'Study Notes Generator', description: 'Generate and view concise notes for medical topics, with AI aiming for the summarization quality of models like MedLM.', icon: NotebookText, component: StudyNotesGenerator },
  { id: 'q-bank', title: 'Exam Paper Generator', description: "Generate mock exam papers simulating previous years, with MCQs and essay questions.", icon: BookCopy, component: SolvedQuestionPapersViewer },
  { id: 'mcq', title: 'MCQ Generator', description: 'Create multiple-choice questions for exam practice.', icon: FileQuestion, component: McqGenerator },
  { id: 'flashcards', title: 'Flashcard Generator', description: 'Create digital flashcards for quick revision.', icon: Layers, component: FlashcardGenerator },
  { id: 'timetable', title: 'Study Timetable Creator', description: 'Plan personalized study schedules.', icon: CalendarClock, component: StudyTimetableCreator },
  { id: 'mnemonics', title: 'Mnemonic Generator', description: 'Create memory aids with AI-generated visuals.', icon: Lightbulb, component: MnemonicsGenerator },
  { id: 'flowcharts', title: 'Flowchart Creator', description: 'Generate flowcharts for medical topics to aid revision.', icon: Workflow, component: FlowchartCreator },
  { id: 'cases', title: 'Clinical Case Simulations', description: 'Practice with interactive patient scenarios.', icon: CaseUpper, comingSoon: true },
  { id: 'anatomy', title: 'Interactive Anatomy Visualizer', description: 'Explore anatomical structures.', icon: Eye, comingSoon: true },
  { id: 'ddx', title: 'Differential Diagnosis Trainer', description: 'List diagnoses based on symptoms with feedback.', icon: Brain, comingSoon: true },
  { id: 'rounds', title: 'Virtual Patient Rounds', description: 'Simulate ward rounds with patient cases.', icon: Users, comingSoon: true },
  { id: 'topics', title: 'High-Yield Topic Predictor', description: 'Suggest priority topics for study based on exam trends or user performance.', icon: TrendingUp, comingSoon: true },
  { id: 'dosage', title: 'Drug Dosage Calculator', description: 'Practice calculating drug doses.', icon: Calculator, comingSoon: true },
  { id: 'progress', title: 'Progress Tracker', description: 'Track study progress with rewards (gamification).', icon: Award, comingSoon: true },
  { id: 'summarizer', title: 'Smart Note Summarizer', description: 'Upload notes (PDF/TXT) and get AI-powered summaries.', icon: FileText, comingSoon: true },
  { id: 'videos', title: 'Video Lecture Library', description: 'Search and find relevant medical video lectures.', icon: Youtube, comingSoon: true },
  { id: 'dictation', title: 'Smart Dictation', description: 'Use your voice to dictate notes, which AI can help structure.', icon: Mic, comingSoon: true },
];

export const frequentlyUsedMedicoToolIds: ActiveToolId[] = ['mcq', 'theorycoach-generator', 'flashcards', 'mnemonics'];
