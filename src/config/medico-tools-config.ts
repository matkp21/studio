
// src/config/medico-tools-config.ts
import type { MedicoTool } from '@/types/medico-tools';
import {
  NotebookText, FileQuestion, CalendarClock, Layers, CaseUpper, Lightbulb, BookCopy,
  Users, Eye, Brain, TrendingUp, Calculator, Workflow, Award, Star, Settings, CheckSquare, GripVertical, FileText, Youtube, Mic, FlaskConical, Microscope, TestTubeDiagonal, Swords, Library, Trophy, BookMarked
} from 'lucide-react';
import React from 'react';

// Lazy load components for better performance
const StudyNotesGenerator = React.lazy(() => import('@/components/medico/study-notes-generator').then(m => ({ default: m.StudyNotesGenerator })));
const McqGenerator = React.lazy(() => import('@/components/medico/mcq-generator').then(m => ({ default: m.McqGenerator })));
const StudyTimetableCreator = React.lazy(() => import('@/components/medico/study-timetable-creator').then(m => ({ default: m.StudyTimetableCreator })));
const FlashcardGenerator = React.lazy(() => import('@/components/medico/flashcard-generator').then(m => ({ default: m.FlashcardGenerator })));
const MnemonicsGenerator = React.lazy(() => import('@/components/medico/mnemonics-generator').then(m => ({ default: m.MnemonicsGenerator })));
const FlowchartCreator = React.lazy(() => import('@/components/medico/flowchart-creator').then(m => ({ default: m.FlowchartCreator })));
const ClinicalCaseSimulator = React.lazy(() => import('@/components/medico/clinical-case-simulator').then(m => ({ default: m.ClinicalCaseSimulator })));
const DifferentialDiagnosisTrainer = React.lazy(() => import('@/components/medico/differential-diagnosis-trainer').then(m => ({ default: m.DifferentialDiagnosisTrainer })));
const PathoMindExplainer = React.lazy(() => import('@/components/medico/pathomind-explainer').then(m => ({ default: m.PathoMindExplainer })));
const PharmaGenie = React.lazy(() => import('@/components/medico/pharma-genie').then(m => ({ default: m.PharmaGenie })));
const MicroMate = React.lazy(() => import('@/components/medico/micro-mate').then(m => ({ default: m.MicroMate })));
const DiagnoBot = React.lazy(() => import('@/components/medico/diagno-bot').then(m => ({ default: m.DiagnoBot })));
const HighYieldTopicPredictor = React.lazy(() => import('@/components/medico/high-yield-topic-predictor').then(m => ({ default: m.HighYieldTopicPredictor })));
const AnatomyVisualizer = React.lazy(() => import('@/components/medico/anatomy-visualizer').then(m => ({ default: m.AnatomyVisualizer })));
const DrugDosageCalculator = React.lazy(() => import('@/components/medico/drug-dosage-calculator').then(m => ({ default: m.DrugDosageCalculator })));
const NoteSummarizer = React.lazy(() => import('@/components/medico/note-summarizer').then(m => ({ default: m.NoteSummarizer })));
const VirtualPatientRounds = React.lazy(() => import('@/components/medico/virtual-patient-rounds').then(m => ({ default: m.VirtualPatientRounds })));
const ProgressTracker = React.lazy(() => import('@/components/medico/progress-tracker').then(m => ({ default: m.ProgressTracker })));
const SmartDictation = React.lazy(() => import('@/components/medico/smart-dictation').then(m => ({ default: m.SmartDictation })));
const GamifiedCaseChallenges = React.lazy(() => import('@/components/medico/gamified-case-challenges').then(m => ({ default: m.GamifiedCaseChallenges })));
const MockExamSuite = React.lazy(() => import('@/components/medico/mock-exam-suite').then(m => ({ default: m.MockExamSuite })));

// Define the full list of tools
export const allMedicoToolsList: MedicoTool[] = [
  { id: 'theorycoach-generator', title: 'Study Notes Generator', description: 'Generate and view concise notes for medical topics, with AI aiming for the summarization quality of models like MedLM.', icon: NotebookText, component: StudyNotesGenerator, isFrequentlyUsed: true },
  { id: 'mock-pyqs', title: 'Mock Exam Paper', description: "Generate mock exam papers simulating previous years, with MCQs and essay questions.", icon: BookCopy, href: '/medico/mock-pyqs', isFrequentlyUsed: true },
  { id: 'cbme', title: 'CBME Competency Browser', description: 'Search and browse through NMC-aligned competencies.', icon: BookMarked, href: '/medico/cbme' },
  { id: 'mcq', title: 'MCQ Generator', description: 'Create multiple-choice questions for exam practice.', icon: FileQuestion, component: McqGenerator, isFrequentlyUsed: true },
  { id: 'flashcards', title: 'Flashcard Generator', description: 'Create digital flashcards for quick revision.', icon: Layers, component: FlashcardGenerator, isFrequentlyUsed: true },
  { id: 'mnemonics', title: 'Mnemonic Generator', description: 'Create memory aids with AI-generated visuals.', icon: Lightbulb, component: MnemonicsGenerator, isFrequentlyUsed: true },
  { id: 'pathomind', title: 'PathoMind', description: 'Explain any disease pathophysiology with diagrams.', icon: Brain, component: PathoMindExplainer, isFrequentlyUsed: true },
  { id: 'pharmagenie', title: 'PharmaGenie', description: 'Drug classification, mechanisms, side effects.', icon: FlaskConical, component: PharmaGenie },
  { id: 'micromate', title: 'MicroMate', description: 'Bugs, virulence factors, lab diagnosis.', icon: Microscope, component: MicroMate },
  { id: 'diagnobot', title: 'DiagnoBot', description: 'Interpret labs, ECGs, X-rays, ABG, etc.', icon: TestTubeDiagonal, component: DiagnoBot },
  { id: 'challenges', title: 'Gamified Case Challenges', description: 'Solve timed diagnostic challenges and compete on leaderboards.', icon: Swords, component: GamifiedCaseChallenges },
  { id: 'exams', title: 'Mock Exam Suite', description: 'Take full-length mock exams with MCQs and essays.', icon: Trophy, component: MockExamSuite },
  { id: 'cases', title: 'Clinical Case Simulations', description: 'Practice with interactive patient scenarios.', icon: CaseUpper, component: ClinicalCaseSimulator },
  { id: 'ddx', title: 'Differential Diagnosis Trainer', description: 'List diagnoses based on symptoms with feedback.', icon: Brain, component: DifferentialDiagnosisTrainer },
  { id: 'anatomy', title: 'Interactive Anatomy Visualizer', description: 'Explore anatomical structures.', icon: Eye, component: AnatomyVisualizer },
  { id: 'dosage', title: 'Drug Dosage Calculator', description: 'Practice calculating drug doses.', icon: Calculator, component: DrugDosageCalculator },
  { id: 'flowcharts', title: 'Flowchart Creator', description: 'Generate flowcharts for medical topics to aid revision.', icon: Workflow, component: FlowchartCreator },
  { id: 'dictation', title: 'Smart Dictation', description: 'Use your voice to dictate notes, which AI can help structure.', icon: Mic, component: SmartDictation },
  { id: 'summarizer', title: 'Smart Note Summarizer', description: 'Upload notes (PDF/TXT) and get AI-powered summaries.', icon: FileText, component: NoteSummarizer },
  { id: 'timetable', title: 'Study Timetable Creator', description: 'Plan personalized study schedules.', icon: CalendarClock, component: StudyTimetableCreator },
  { id: 'topics', title: 'High-Yield Topic Predictor', description: 'Suggest priority topics for study based on exam trends or user performance.', icon: TrendingUp, component: HighYieldTopicPredictor },
  { id: 'rounds', title: 'Virtual Patient Rounds', description: 'Simulate ward rounds with patient cases.', icon: Users, component: VirtualPatientRounds },
  { id: 'progress', title: 'Progress Tracker', description: 'Track study progress with rewards (gamification).', icon: Award, component: ProgressTracker },
  { id: 'videos', title: 'Video Lecture Library', description: 'Search and find relevant medical video lectures.', icon: Youtube, href: '/medico/videos' },
  { id: 'library', title: 'Knowledge Hub', description: 'Your personal library of notes, MCQs, and community content.', icon: Library, href: '/medico/library' },
];

export const frequentlyUsedMedicoToolIds: ActiveToolId[] = ['mcq', 'theorycoach-generator', 'flashcards', 'mnemonics', 'pathomind', 'mock-pyqs'];
