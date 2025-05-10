// src/components/medico/medico-dashboard.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { 
  NotebookText, FileQuestion, CalendarClock, Layers, CaseUpper, Lightbulb, BookCopy, 
  Users, Eye, Brain, TrendingUp, Calculator, FlaskConical, Workflow, Award, ArrowRight 
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { cn } from '@/lib/utils';

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
  component?: React.ElementType; 
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
  { id: 'progress', title: 'Progress Tracker', description: 'Track study progress with rewards (gamification).', icon: Award, component: undefined, comingSoon: true },
];


export function MedicoDashboard() {
  const [activeDialog, setActiveDialog] = useState<ActiveToolId>(null);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3 welcome-text-fg-animated">Medico Study Hub</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your dedicated space for AI-powered medical study tools. Enhance your learning and ace your exams!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {medicoToolsList.map((tool) => (
          <Dialog key={tool.id} open={activeDialog === tool.id} onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}>
            <DialogTrigger asChild>
              <Card 
                className={cn(
                  "shadow-lg rounded-xl overflow-hidden hover:shadow-primary/20 transition-shadow duration-300 cursor-pointer h-full flex flex-col group",
                  tool.comingSoon && "opacity-70 hover:shadow-md cursor-not-allowed"
                )}
                onClick={() => !tool.comingSoon && setActiveDialog(tool.id)}
                role="button"
                tabIndex={tool.comingSoon ? -1 : 0}
                onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !tool.comingSoon) setActiveDialog(tool.id)}}
                aria-disabled={tool.comingSoon}
                aria-label={`Launch ${tool.title}`}
              >
                <CardHeader className="bg-muted/30 pb-4 group-hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <tool.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed line-clamp-3">{tool.description}</CardHeader>
                </CardContent>
                <CardContent className="pt-4 flex-grow flex items-end">
                  {tool.comingSoon ? (
                    <div className="text-center text-sm text-amber-600 dark:text-amber-400 font-semibold p-2 bg-amber-500/10 rounded-md w-full">
                      Coming Soon!
                    </div>
                  ) : (
                     <Button variant="outline" className="w-full rounded-lg border-primary/50 text-primary hover:bg-primary/10 hover:text-primary group/button">
                       Launch Tool
                       <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-1" />
                     </Button>
                  )}
                </CardContent>
              </Card>
            </DialogTrigger>
            {!tool.comingSoon && tool.component && (
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
            {!tool.comingSoon && !tool.component && ( 
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                     <tool.icon className="h-6 w-6 text-primary" /> {tool.title}
                  </DialogTitle>
                  <DialogDescription>
                    This tool is under development. Check back soon for updates!
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-muted-foreground">Full UI for {tool.title} will be available here.</p>
                </div>
              </DialogContent>
            )}
          </Dialog>
        ))}
      </div>
    </div>
  );
}

