// src/config/medico-tools-config.ts
import type { MedicoTool, ActiveToolId } from '@/types/medico-tools';
import {
  NotebookText, FileQuestion, CalendarClock, Layers, CaseUpper, Lightbulb, BookCopy,
  Users, Eye, Brain, TrendingUp, Calculator, Workflow, Award, Star, Settings, CheckSquare, GripVertical, FileText, Youtube, Mic, Swords, Trophy, Library, CalendarDays, BrainCircuit, FlaskConical, Microscope, TestTubeDiagonal, Network, Wand2 
} from 'lucide-react';

// Component Imports
import { StudyNotesGenerator } from '@/components/medico/study-notes-generator';
import { McqGenerator } from '@/components/medico/mcq-generator';
import { StudyTimetableCreator } from '@/components/medico/study-timetable-creator';
import { FlashcardGenerator } from '@/components/medico/flashcard-generator';
import { ClinicalCaseSimulator } from '@/components/medico/clinical-case-simulator';
import { AnatomyVisualizer } from '@/components/medico/anatomy-visualizer';
import { MnemonicsGenerator } from '@/components/medico/mnemonics-generator';
import { DifferentialDiagnosisTrainer } from '@/components/medico/differential-diagnosis-trainer';
import { VirtualPatientRounds } from '@/components/medico/virtual-patient-rounds';
import { HighYieldTopicPredictor } from '@/components/medico/high-yield-topic-predictor';
import { DrugDosageCalculator } from '@/components/medico/drug-dosage-calculator';
import { SolvedQuestionPapersViewer } from '@/components/medico/solved-question-papers-viewer';
import { FlowchartCreator } from '@/components/medico/flowchart-creator';
import { ProgressTracker } from '@/components/medico/progress-tracker';
import { NoteSummarizer } from '@/components/medico/note-summarizer'; 
import { SmartDictation } from '@/components/pro/smart-dictation';
import { GamifiedCaseChallenges } from '@/components/medico/gamified-case-challenges';
import { MockExamSuite } from '@/components/medico/mock-exam-suite';
import { PathoMindExplainer } from '@/components/medico/pathomind-explainer';
import { PharmaGenie } from '@/components/medico/pharma-genie';
import { MicroMate } from '@/components/medico/micro-mate';
import { DiagnoBot } from '@/components/medico/diagno-bot';
import { TheoryCoach } from '@/components/medico/theory-coach';


// Define the full list of tools
export const allMedicoToolsList: MedicoTool[] = [
  { id: 'progress', title: 'Progress Tracker', description: 'Track study progress with rewards (gamification).', icon: Award, component: ProgressTracker, comingSoon: false },
  { id: 'pathomind', title: 'PathoMind', description: 'Explain any disease pathophysiology with diagrams.', icon: BrainCircuit, component: PathoMindExplainer },
  { id: 'next-tool', title: 'AI-Recommended Next Tool', description: 'Let AI suggest the best tool for your current study goal, based on your recent activity and progress.', icon: Wand2, comingSoon: true },
  { id: 'next-module', title: 'AI-Recommended Module', description: 'Based on your performance, AI can recommend the next topic or module for you to focus on.', icon: Wand2, comingSoon: true },
  { id: 'exams', title: 'Mock Exam Suite', description: 'Take full-length mock exams, get detailed analytics, and compete on leaderboards.', icon: Trophy, component: MockExamSuite, comingSoon: false },
  { id: 'challenges', title: 'Gamified Case Challenges', description: 'Solve timed clinical scenarios and compete on leaderboards.', icon: Swords, component: GamifiedCaseChallenges, comingSoon: false },
  { id: 'q-bank', title: 'Exam Paper Generator', description: "Generate mock exam papers simulating previous years, with MCQs and essay questions.", icon: BookCopy, component: SolvedQuestionPapersViewer },
  { id: 'theorycoach', title: 'Theory Coach', description: 'Get detailed explanations of complex medical theories, including analogies and key points.', icon: Lightbulb, component: TheoryCoach },
  { id: 'theorycoach-generator', title: 'Study Notes Generator', description: 'Generate and view concise notes for medical topics, with AI aiming for the summarization quality of models like MedLM.', icon: NotebookText, component: StudyNotesGenerator },
  { id: 'summarizer', title: 'Smart Note Summarizer', description: 'Upload notes (PDF/TXT/JPEG) and get AI-powered summaries in various formats.', icon: FileText, component: NoteSummarizer },
  { id: 'videos', title: 'Video Lecture Library', description: 'Search and find relevant medical video lectures from YouTube.', icon: Youtube, href: '/medico/videos' },
  { id: 'library', title: 'Knowledge Hub', description: 'Access your personal collection of saved notes, MCQs, and community-contributed study materials.', icon: Library, href: '/medico/library' },
  { id: 'topicExplorer', title: 'Topic Explorer', description: 'Browse curriculum topics by subject and system.', icon: Network, href: '/medico/topics' },
  { id: 'dictation', title: 'Smart Dictation', description: 'Use your voice to dictate notes, which AI can help structure.', icon: Mic, component: SmartDictation },
  { id: 'topics', title: 'High-Yield Topic Predictor', description: 'Suggest priority topics for study based on exam trends or user performance.', icon: TrendingUp, component: HighYieldTopicPredictor },
  { id: 'flowcharts', title: 'Flowchart Creator', description: 'Generate flowcharts for medical topics to aid revision.', icon: Workflow, component: FlowchartCreator },
  { id: 'flashcards', title: 'Flashcard Generator', description: 'Create digital flashcards for quick revision.', icon: Layers, component: FlashcardGenerator },
  { id: 'mnemonics', title: 'Mnemonic Generator', description: 'Create memory aids with AI-generated visuals.', icon: Lightbulb, component: MnemonicsGenerator },
  { id: 'timetable', title: 'Study Timetable Creator', description: 'Plan personalized study schedules.', icon: CalendarClock, component: StudyTimetableCreator },
  { id: 'mcq', title: 'MCQ Generator', description: 'Create multiple-choice questions for exam practice.', icon: FileQuestion, component: McqGenerator },
  { id: 'cases', title: 'Clinical Case Simulations', description: 'Practice with interactive patient scenarios.', icon: CaseUpper, component: ClinicalCaseSimulator },
  { id: 'ddx', title: 'Differential Diagnosis Trainer', description: 'List diagnoses based on symptoms with feedback.', icon: Brain, component: DifferentialDiagnosisTrainer },
  { id: 'anatomy', title: 'Interactive Anatomy Visualizer', description: 'Explore anatomical structures.', icon: Eye, component: AnatomyVisualizer },
  { id: 'pharmagenie', title: 'PharmaGenie', description: 'Drug classification, mechanisms, and side effects.', icon: FlaskConical, component: PharmaGenie },
  { id: 'micromate', title: 'MicroMate', description: 'Bugs, virulence factors, lab diagnosis.', icon: Microscope, component: MicroMate },
  { id: 'diagnobot', title: 'DiagnoBot', description: 'Interpret labs, ECGs, X-rays, etc.', icon: TestTubeDiagonal, component: DiagnoBot },
  { id: 'rounds', title: 'Virtual Patient Rounds', description: 'Simulate ward rounds with patient cases.', icon: Users, component: VirtualPatientRounds, comingSoon: false },
  { id: 'dosage', title: 'Drug Dosage Calculator', description: 'Practice calculating drug doses.', icon: Calculator, component: DrugDosageCalculator },
];

export const frequentlyUsedMedicoToolIds: ActiveToolId[] = [
  'pathomind', 
  'next-tool',
  'next-module',
  'exams', 
  'challenges', 
  'q-bank', 
  'mcq', 
  'theorycoach', 
  'library', 
  'topicExplorer'
];
