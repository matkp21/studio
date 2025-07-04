
// src/components/medico/medico-dashboard.tsx
"use client";

import type { ReactNode } from 'react';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { cn } from '@/lib/utils';
import {
  NotebookText, FileQuestion, CalendarClock, Layers, CaseUpper, Lightbulb, BookCopy,
  Users, Eye, Brain, TrendingUp, Calculator, Workflow, Award, ArrowRight, Star, Settings, CheckSquare, GripVertical, FileText, Youtube, Mic, Swords, Trophy, Library, CalendarDays, BrainCircuit
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import Link from 'next/link';

// Component Imports
import { TheoryCoach } from './theory-coach';
import { McqGenerator } from './mcq-generator';
import { StudyTimetableCreator } from './study-timetable-creator';
import { FlashcardGenerator } from './flashcard-generator';
import { ClinicalCaseSimulator } from './clinical-case-simulator';
import { AnatomyVisualizer } from './anatomy-visualizer';
import { MnemonicsGenerator } from './mnemonics-generator';
import { DifferentialDiagnosisTrainer } from './differential-diagnosis-trainer';
import { VirtualPatientRounds } from './virtual-patient-rounds';
import { HighYieldTopicPredictor } from './high-yield-topic-predictor';
import { DrugDosageCalculator } from './drug-dosage-calculator';
import { SolvedQuestionPapersViewer } from './solved-question-papers-viewer';
import { FlowchartCreator } from './flowchart-creator';
import { ProgressTracker } from './progress-tracker';
import { NoteSummarizer } from './note-summarizer'; 
import { SmartDictation } from '@/components/pro/smart-dictation';
import { GamifiedCaseChallenges } from './gamified-case-challenges';
import { MockExamSuite } from './mock-exam-suite';
import { HeroWidgets, type HeroTask } from '@/components/homepage/hero-widgets';
import { PathoMindExplainer } from './pathomind-explainer';

type ActiveToolId =
  | 'q-bank'
  | 'theorycoach-generator'
  | 'topics'
  | 'flowcharts'
  | 'flashcards'
  | 'mnemonics'
  | 'timetable'
  | 'mcq'
  | 'cases'
  | 'ddx'
  | 'anatomy'
  | 'rounds'
  | 'dosage'
  | 'progress'
  | 'summarizer' 
  | 'videos'
  | 'dictation'
  | 'challenges'
  | 'exams'
  | 'library'
  | 'pathomind'
  | null;

interface MedicoTool {
  id: ActiveToolId;
  title: string;
  description: string;
  icon: React.ElementType;
  component?: React.ElementType; 
  href?: string; 
  comingSoon?: boolean;
}

// Define the full list of tools
const allMedicoToolsList: MedicoTool[] = [
  { id: 'pathomind', title: 'PathoMind', description: 'Explain any disease pathophysiology with diagrams.', icon: BrainCircuit, component: PathoMindExplainer },
  { id: 'exams', title: 'Mock Exam Suite', description: 'Take full-length mock exams, get detailed analytics, and compete on leaderboards.', icon: Trophy, component: MockExamSuite, comingSoon: false },
  { id: 'challenges', title: 'Gamified Case Challenges', description: 'Solve timed clinical scenarios and compete on leaderboards.', icon: Swords, component: GamifiedCaseChallenges, comingSoon: false },
  { id: 'q-bank', title: 'Theory Q-Bank', description: 'AI-generated, structured answers for past university questions.', icon: BookCopy, component: SolvedQuestionPapersViewer },
  { id: 'theorycoach-generator', title: 'TheoryCoach (AI Answer Generator)', description: 'Generate and view concise notes for medical topics, with AI aiming for the summarization quality of models like MedLM.', icon: NotebookText, component: TheoryCoach },
  { id: 'summarizer', title: 'Smart Note Summarizer', description: 'Upload notes (PDF/TXT/JPEG) and get AI-powered summaries in various formats.', icon: FileText, component: NoteSummarizer },
  { id: 'videos', title: 'Video Lecture Library', description: 'Search and find relevant medical video lectures from YouTube.', icon: Youtube, href: '/medico/videos' },
  { id: 'library', title: 'Knowledge Hub', description: 'Access your personal collection of saved notes, MCQs, and community-contributed study materials.', icon: Library, href: '/medico/library' },
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
  { id: 'rounds', title: 'Virtual Patient Rounds', description: 'Simulate ward rounds with patient cases.', icon: Users, component: VirtualPatientRounds, comingSoon: true },
  { id: 'dosage', title: 'Drug Dosage Calculator', description: 'Practice calculating drug doses.', icon: Calculator, component: DrugDosageCalculator },
  { id: 'progress', title: 'Progress Tracker', description: 'Track study progress with rewards (gamification).', icon: Award, component: ProgressTracker, comingSoon: false },
];

const frequentlyUsedMedicoToolIds: ActiveToolId[] = ['pathomind', 'exams', 'challenges', 'q-bank', 'mcq', 'theorycoach-generator', 'library'];

interface MedicoToolCardProps {
  tool: MedicoTool;
  onLaunch: (toolId: ActiveToolId) => void;
  isFrequentlyUsed?: boolean;
  isEditMode?: boolean;
}

const MedicoToolCard: React.FC<MedicoToolCardProps> = ({ tool, onLaunch, isFrequentlyUsed, isEditMode }) => {
  const cardContent = (
    <motion.div
      whileHover={!isEditMode ? { y: -5, boxShadow: "0px 10px 20px hsla(var(--primary) / 0.1)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={cn(
        "bg-card rounded-xl overflow-hidden shadow-md transition-all duration-300 h-full flex flex-col group relative border-2 border-transparent",
        !isEditMode && "hover:shadow-xl cursor-pointer tool-card-frequent firebase-gradient-border-hover animate-subtle-pulse-glow",
        tool.comingSoon && "opacity-60 hover:shadow-md cursor-not-allowed",
        isEditMode && "cursor-grab border-dashed border-muted-foreground/50"
      )}
      role="button"
      tabIndex={tool.comingSoon || isEditMode ? -1 : 0}
      onKeyDown={(e) => { if (!isEditMode && (e.key === 'Enter' || e.key === ' ') && !tool.comingSoon) onLaunch(tool.id); }}
      aria-disabled={!!(tool.comingSoon || isEditMode)}
      aria-label={`Launch ${tool.title}`}
    >
      {isEditMode && (
        <GripVertical className="absolute top-2 right-2 h-5 w-5 text-muted-foreground z-10" title="Drag to reorder" />
      )}
      {isFrequentlyUsed && !isEditMode && (
        <Star className="absolute top-2 right-2 h-5 w-5 text-yellow-400 fill-yellow-400 z-10" />
      )}
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center gap-3 mb-1.5">
          <div className={cn(
              "p-2 rounded-lg bg-primary/10 text-primary transition-colors duration-300",
              !isEditMode && "group-hover:bg-primary/20"
          )}>
              <tool.icon className={cn(
                  "h-7 w-7 transition-transform duration-300",
                  !isEditMode && "group-hover:scale-110 text-primary"
              )} />
          </div>
          <CardTitle className={cn(
              "text-lg leading-tight text-foreground",
               !isEditMode && "group-hover:text-primary"
          )}>{tool.title}</CardTitle>
        </div>
        <CardDescription className="text-xs leading-relaxed line-clamp-2 min-h-[2.5em]">{tool.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 px-4 pb-3 flex-grow flex items-end">
        {tool.comingSoon ? (
          <div className="text-center text-xs text-amber-700 dark:text-amber-500 font-semibold p-1.5 bg-amber-500/10 rounded-md w-full">
            Coming Soon!
          </div>
        ) : (
           <div className="w-full text-right">
              <Button variant="link" size="sm" disabled={isEditMode} className={cn(
                  "text-primary group-hover:underline p-0 h-auto text-xs",
                   isEditMode && "text-muted-foreground cursor-default"
                  )}>
                 Open Tool <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
           </div>
        )}
      </CardContent>
    </motion.div>
  );

  if (tool.href && !isEditMode) {
    return (
      <Link href={tool.href} className="no-underline">
        {cardContent}
      </Link>
    );
  }

  // Use DialogTrigger for tools that open a dialog
  return (
    <DialogTrigger asChild onClick={() => !tool.href && !tool.comingSoon && onLaunch(tool.id)}>
      {cardContent}
    </DialogTrigger>
  );
};

// Wrapper component to handle suspense boundary for useSearchParams
export function MedicoDashboard() {
    const [activeDialog, setActiveDialog] = useState<ActiveToolId>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [displayedTools, setDisplayedTools] = useState<MedicoTool[]>(allMedicoToolsList);
    const [initialTopic, setInitialTopic] = useState<string | null>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const toolToOpen = searchParams.get('tool') as ActiveToolId;
        const topic = searchParams.get('topic');
        if (toolToOpen && allMedicoToolsList.some(t => t.id === toolToOpen)) {
            setInitialTopic(topic);
            setActiveDialog(toolToOpen);
        }
    }, [searchParams]);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setActiveDialog(null);
            setInitialTopic(null);
        }
    };
    
    const currentTool = displayedTools.find(tool => tool.id === activeDialog);
    const frequentlyUsedTools = displayedTools.filter(tool => frequentlyUsedMedicoToolIds.includes(tool.id));
    const otherTools = displayedTools.filter(tool => !frequentlyUsedMedicoToolIds.includes(tool.id));
    
    const medicoTasks: HeroTask[] = [
      { id: 'med-1', date: new Date(), title: 'Anatomy Lecture', description: '10:00 AM - Skeletal System' },
      { id: 'med-2', date: new Date(), title: 'Study Group: Cardiology', description: '4:00 PM - Discuss ECGs' },
      { id: 'med-3', date: new Date(new Date().setDate(new Date().getDate() + 1)), title: 'Quiz Due: Pharmacology', description: 'Covers autonomic drugs' },
    ];


     return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1 firebase-gradient-text">Medico Study Hub</h1>
                    <p className="text-md text-muted-foreground">
                    Your AI-powered command center for acing medical studies.
                    </p>
                </div>
                <Button variant="outline" onClick={() => setIsEditMode(!isEditMode)} size="sm" className="rounded-lg group">
                {isEditMode ? <CheckSquare className="mr-2 h-4 w-4"/> : <Settings className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-45"/>}
                {isEditMode ? 'Save Layout' : 'Customize'}
                </Button>
            </div>
            
             <Card className="shadow-lg rounded-xl mb-10">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CalendarDays className="h-6 w-6 text-primary"/>
                    Schedule Overview
                  </CardTitle>
                  <CardDescription>
                    Your upcoming tasks, events, and a quick-access clock.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <HeroWidgets tasks={medicoTasks} />
                </CardContent>
              </Card>

            <Dialog open={activeDialog !== null} onOpenChange={handleOpenChange}>
                {isEditMode ? (
                <>
                    <div className="p-4 mb-6 border border-dashed border-primary/50 rounded-lg bg-primary/5 text-center">
                        <p className="text-sm text-primary">
                            Customize Dashboard: Drag and drop the tool cards below to reorder your dashboard.
                        </p>
                    </div>
                    <Reorder.Group
                    as="div"
                    values={displayedTools}
                    onReorder={setDisplayedTools}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                    >
                    {displayedTools.map((tool) => (
                        <Reorder.Item key={tool.id} value={tool} layout>
                        <MedicoToolCard 
                            tool={tool} 
                            onLaunch={setActiveDialog} 
                            isFrequentlyUsed={frequentlyUsedMedicoToolIds.includes(tool.id)} 
                            isEditMode={isEditMode} 
                        />
                        </Reorder.Item>
                    ))}
                    </Reorder.Group>
                </>
                ) : (
                <>
                    {frequentlyUsedTools.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                        <Star className="mr-2 h-6 w-6 text-yellow-400 fill-yellow-400"/> Frequently Used
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {frequentlyUsedTools.map((tool) => (
                            <MedicoToolCard key={`${tool.id}-freq`} tool={tool} onLaunch={setActiveDialog} isFrequentlyUsed isEditMode={isEditMode} />
                        ))}
                        </div>
                    </section>
                    )}

                    <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-5">All Medico Tools</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {otherTools.map((tool) => (
                            <MedicoToolCard key={tool.id} tool={tool} onLaunch={setActiveDialog} isEditMode={isEditMode} />
                        ))}
                    </div>
                    </section>
                </>
                )}
                
                {currentTool && !currentTool.href && !currentTool.comingSoon && currentTool.component && (
                    <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] flex flex-col p-0">
                        <DialogHeader className="p-6 pb-4 sticky top-0 bg-background border-b z-10">
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            <currentTool.icon className="h-6 w-6 text-primary" /> {currentTool.title}
                        </DialogTitle>
                        <DialogDescription>{currentTool.description}</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="flex-grow overflow-y-auto">
                        <div className="p-6 pt-2">
                            {React.createElement(currentTool.component, { initialTopic })}
                        </div>
                        </ScrollArea>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
};
