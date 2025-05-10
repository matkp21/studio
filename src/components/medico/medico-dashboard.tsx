
// src/components/medico/medico-dashboard.tsx
"use client";

import { useState } from 'react';
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
import { VirtualPatientRounds } from './virtual-patient-rounds'; // Added import
import { 
  NotebookText, FileQuestion, CalendarClock, Layers, CaseUpper, Lightbulb, BookCopy, 
  Users, Eye, Brain, TrendingUp, Calculator, FlaskConical, Workflow 
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { cn } from '@/lib/utils';

type ActiveToolId = 
  | 'notes' 
  | 'mcq'
  | 'timetable'
  | 'flashcards'
  | 'cases'
  | 'anatomy'
  | 'mnemonics'
  | 'ddx'
  | 'rounds'
  | 'topics'
  | 'dosage'
  | 'papers' 
  | 'flowcharts'
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
  { id: 'notes', title: 'Study Notes Generator', description: 'Generate concise notes on medical topics.', icon: NotebookText, component: StudyNotesGenerator },
  { id: 'mcq', title: 'MCQ Generator', description: 'Create multiple-choice questions for practice.', icon: FileQuestion, component: McqGenerator },
  { id: 'timetable', title: 'Study Timetable Creator', description: 'Help students plan study schedules.', icon: CalendarClock, component: StudyTimetableCreator },
  { id: 'flashcards', title: 'Flashcard Generator', description: 'Provide digital flashcards for quick revision.', icon: Layers, component: FlashcardGenerator },
  { id: 'cases', title: 'Clinical Case Simulations', description: 'Offer interactive patient scenarios.', icon: CaseUpper, component: ClinicalCaseSimulator },
  { id: 'anatomy', title: 'Interactive Anatomy Visualizer', description: 'Describe anatomical structures.', icon: Eye, component: AnatomyVisualizer },
  { id: 'mnemonics', title: 'Mnemonics Generator', description: 'Create memory aids for complex topics.', icon: Lightbulb, component: MnemonicsGenerator },
  { id: 'ddx', title: 'Differential Diagnosis Trainer', description: 'Practice listing diagnoses based on symptoms.', icon: Brain, component: DifferentialDiagnosisTrainer },
  { id: 'rounds', title: 'Virtual Patient Rounds', description: 'Simulate ward rounds with patient cases.', icon: Users, component: VirtualPatientRounds }, // Changed comingSoon to false and added component
  { id: 'topics', title: 'High-Yield Topic Predictor', description: 'Suggest priority topics for study.', icon: TrendingUp, comingSoon: true },
  { id: 'dosage', title: 'Drug Dosage Calculator', description: 'Practice calculating drug doses.', icon: Calculator, comingSoon: true },
  { id: 'papers', title: 'Solved Question Papers', description: 'Access past exam papers with solutions.', icon: BookCopy, comingSoon: true },
  { id: 'flowcharts', title: 'Flowchart Creator', description: 'Create diagnostic or treatment flowcharts.', icon: Workflow, comingSoon: true },
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
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex-grow flex flex-col justify-between">
                  {tool.comingSoon ? (
                    <div className="text-center text-sm text-amber-600 dark:text-amber-400 font-semibold p-4 bg-amber-500/10 rounded-md mt-auto">
                      Coming Soon!
                    </div>
                  ) : (
                     <Button variant="outline" className="w-full mt-auto rounded-lg border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                       Launch Tool
                     </Button>
                  )}
                </CardContent>
              </Card>
            </DialogTrigger>
            {!tool.comingSoon && tool.component && (
              <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col p-0">
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
                    This tool is under development. Basic interaction might be available via chat commands soon.
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

