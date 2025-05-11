// src/components/medico/medico-dashboard.tsx
"use client";

import type { ReactNode } from 'react';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StudyNotesGenerator } from './study-notes-generator';
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
import { 
  NotebookText, FileQuestion, CalendarClock, Layers, CaseUpper, Lightbulb, BookCopy, 
  Users, Eye, Brain, TrendingUp, Calculator, Workflow, Award, ArrowRight, Star, Settings, CheckSquare, GripVertical
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type ActiveToolId = 
  | 'papers' 
  | 'notes' 
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
  | null;

interface MedicoTool {
  id: ActiveToolId;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ElementType; 
  comingSoon?: boolean;
}

const medicoToolsList: MedicoTool[] = [
  { id: 'papers', title: 'Previous Question Papers', description: 'Access and solve past MBBS question papers (essays, short notes, MCQs).', icon: BookCopy, component: SolvedQuestionPapersViewer, comingSoon: false },
  { id: 'notes', title: 'Study Notes Generator', description: 'Generate and view concise notes for medical topics.', icon: NotebookText, component: StudyNotesGenerator, comingSoon: false },
  { id: 'topics', title: 'High-Yield Topic Predictor', description: 'Suggest priority topics for study based on exam trends or user performance.', icon: TrendingUp, component: HighYieldTopicPredictor, comingSoon: false },
  { id: 'flowcharts', title: 'Flowchart Creator', description: 'Generate flowcharts for medical topics to aid revision.', icon: Workflow, component: FlowchartCreator, comingSoon: false },
  { id: 'flashcards', title: 'Flashcard Generator', description: 'Create digital flashcards for quick revision.', icon: Layers, component: FlashcardGenerator, comingSoon: false },
  { id: 'mnemonics', title: 'Mnemonics Generator', description: 'Create memory aids for complex topics.', icon: Lightbulb, component: MnemonicsGenerator, comingSoon: false },
  { id: 'timetable', title: 'Study Timetable Creator', description: 'Plan personalized study schedules.', icon: CalendarClock, component: StudyTimetableCreator, comingSoon: false },
  { id: 'mcq', title: 'MCQ Generator', description: 'Create multiple-choice questions for exam practice.', icon: FileQuestion, component: McqGenerator, comingSoon: false },
  { id: 'cases', title: 'Clinical Case Simulations', description: 'Practice with interactive patient scenarios.', icon: CaseUpper, component: ClinicalCaseSimulator, comingSoon: false },
  { id: 'ddx', title: 'Differential Diagnosis Trainer', description: 'List diagnoses based on symptoms with feedback.', icon: Brain, component: DifferentialDiagnosisTrainer, comingSoon: false },
  { id: 'anatomy', title: 'Interactive Anatomy Visualizer', description: 'Explore anatomical structures.', icon: Eye, component: AnatomyVisualizer, comingSoon: false },
  { id: 'rounds', title: 'Virtual Patient Rounds', description: 'Simulate ward rounds with patient cases.', icon: Users, component: VirtualPatientRounds, comingSoon: false },
  { id: 'dosage', title: 'Drug Dosage Calculator', description: 'Practice calculating drug doses.', icon: Calculator, component: DrugDosageCalculator, comingSoon: false },
  { id: 'progress', title: 'Progress Tracker', description: 'Track study progress with rewards (gamification).', icon: Award, component: ProgressTracker, comingSoon: false },
];

// Simulate frequently used tools - in a real app, this would be dynamic
const frequentlyUsedMedicoToolIds: ActiveToolId[] = ['notes', 'mcq', 'papers', 'flashcards'];


interface MedicoToolCardProps {
  tool: MedicoTool;
  onLaunch: (toolId: ActiveToolId) => void;
  isFrequentlyUsed?: boolean;
  isEditMode?: boolean;
}

const MedicoToolCard: React.FC<MedicoToolCardProps> = ({ tool, onLaunch, isFrequentlyUsed, isEditMode }) => {
  return (
    <DialogTrigger asChild>
      <motion.div
        whileHover={!isEditMode ? { y: -5, boxShadow: "0px 10px 20px hsla(var(--primary) / 0.2)" } : {}}
        transition={{ type: "spring", stiffness: 300 }}
        className={cn(
          "bg-card rounded-xl overflow-hidden shadow-md transition-all duration-300 h-full flex flex-col group relative border-2 border-transparent",
          !isEditMode && "hover:shadow-lg cursor-pointer",
          isFrequentlyUsed && !isEditMode && "tool-card-frequent firebase-gradient-border-hover", 
          tool.comingSoon && "opacity-60 hover:shadow-md cursor-not-allowed",
          isEditMode && "cursor-grab"
        )}
        onClick={() => !isEditMode && !tool.comingSoon && onLaunch(tool.id)}
        role="button"
        tabIndex={tool.comingSoon || isEditMode ? -1 : 0}
        onKeyDown={(e) => { if (!isEditMode && (e.key === 'Enter' || e.key === ' ') && !tool.comingSoon) onLaunch(tool.id); }}
        aria-disabled={!!(tool.comingSoon || isEditMode)}
        aria-label={`Launch ${tool.title}`}
      >
        {isEditMode && (
          <GripVertical className="absolute top-2 left-2 h-5 w-5 text-muted-foreground z-10" title="Drag to reorder (conceptual)" />
        )}
        {isFrequentlyUsed && !isEditMode && ( // Only show star if not in edit mode
          <Star className="absolute top-2 right-2 h-5 w-5 text-yellow-400 fill-yellow-400 z-10" />
        )}
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center gap-3 mb-1.5">
            <div className={cn(
                "p-2 rounded-lg bg-primary/10 text-primary transition-colors duration-300",
                isFrequentlyUsed ? "bg-gradient-to-br from-[hsl(var(--welcome-color-1)/0.2)] to-[hsl(var(--welcome-color-3)/0.2)] text-foreground" : (!isEditMode && "group-hover:bg-primary/20")
            )}>
                <tool.icon className={cn(
                    "h-7 w-7 transition-transform duration-300",
                    !isEditMode && "group-hover:scale-110",
                    isFrequentlyUsed ? "text-primary" : "text-primary" 
                )} />
            </div>
            <CardTitle className={cn(
                "text-lg leading-tight",
                isFrequentlyUsed && "text-foreground"
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
                     isFrequentlyUsed && "text-foreground hover:text-primary",
                     isEditMode && "text-muted-foreground cursor-default"
                    )}>
                   Open Tool <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
             </div>
          )}
        </CardContent>
      </motion.div>
    </DialogTrigger>
  );
};


export function MedicoDashboard() {
  const [activeDialog, setActiveDialog] = useState<ActiveToolId>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [displayedTools] = useState<MedicoTool[]>(medicoToolsList); // For future customization

  const currentTool = displayedTools.find(tool => tool.id === activeDialog);

  const frequentlyUsedTools = displayedTools.filter(tool => frequentlyUsedMedicoToolIds.includes(tool.id));
  const otherTools = displayedTools.filter(tool => !frequentlyUsedMedicoToolIds.includes(tool.id));

  return (
    <div className="container mx-auto py-8">
       <div className="flex justify-between items-center mb-8">
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

      {isEditMode && (
        <div className="p-4 mb-6 border border-dashed border-primary/50 rounded-lg bg-primary/5 text-center animate-pulse-medical" style={{"--medical-pulse-opacity-base": "1", "--medical-pulse-opacity-peak": "0.9", "--medical-pulse-scale-peak": "1.01"} as React.CSSProperties}>
            <p className="text-sm text-primary">
                Dashboard customization mode is active. (Drag-and-drop functionality is conceptual for future versions).
            </p>
        </div>
      )}

      {frequentlyUsedTools.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
            <Star className="mr-2 h-6 w-6 text-yellow-400 fill-yellow-400"/> Frequently Used
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {frequentlyUsedTools.map((tool) => (
              <Dialog key={`${tool.id}-freq`} open={activeDialog === tool.id} onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}>
                <MedicoToolCard tool={tool} onLaunch={setActiveDialog} isFrequentlyUsed isEditMode={isEditMode} />
                {!tool.comingSoon && tool.component && activeDialog === tool.id && (
                    <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] flex flex-col p-0">
                        <DialogHeader className="p-6 pb-0 sticky top-0 bg-background border-b z-10">
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            <tool.icon className="h-6 w-6 text-primary" /> {tool.title}
                        </DialogTitle>
                        <DialogDescription>{tool.description}</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="flex-grow overflow-y-auto">
                        <div className="p-6 pt-2">
                            <tool.component />
                        </div>
                        </ScrollArea>
                    </DialogContent>
                )}
              </Dialog>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-5">All Medico Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {otherTools.map((tool) => (
            <Dialog key={tool.id} open={activeDialog === tool.id} onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}>
                <MedicoToolCard tool={tool} onLaunch={setActiveDialog} isEditMode={isEditMode} />
                {!tool.comingSoon && tool.component && activeDialog === tool.id && (
                     <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] flex flex-col p-0">
                        <DialogHeader className="p-6 pb-0 sticky top-0 bg-background border-b z-10">
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            <tool.icon className="h-6 w-6 text-primary" /> {tool.title}
                        </DialogTitle>
                        <DialogDescription>{tool.description}</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="flex-grow overflow-y-auto">
                        <div className="p-6 pt-2">
                            <tool.component />
                        </div>
                        </ScrollArea>
                    </DialogContent>
                )}
            </Dialog>
          ))}
        </div>
      </section>
    </div>
  );
}
