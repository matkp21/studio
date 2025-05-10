// src/components/medico/medico-dashboard.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StudyNotesGenerator } from './study-notes-generator';
import { McqGenerator } from './mcq-generator';
import { NotebookText, FileQuestion, CalendarClock, Layers, CaseUpper, Lightbulb, BookCopy } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog'; // Added DialogDescription
import { cn } from '@/lib/utils';

type ActiveTool = 'notes' | 'mcq' | null;

const medicoTools = [
  { id: 'notes', title: 'Study Notes Generator', description: 'Generate concise notes on medical topics.', icon: NotebookText, component: StudyNotesGenerator },
  { id: 'mcq', title: 'MCQ Generator', description: 'Create multiple-choice questions for practice.', icon: FileQuestion, component: McqGenerator },
  { id: 'papers', title: 'Solved Question Papers', description: 'Access past exam papers with solutions.', icon: BookCopy, comingSoon: true },
  { id: 'timetable', title: 'Study Timetable Creator', description: 'Plan your study schedule effectively.', icon: CalendarClock, comingSoon: true },
  { id: 'flashcards', title: 'Flashcard Generator', description: 'Create digital flashcards for revision.', icon: Layers, comingSoon: true },
  { id: 'cases', title: 'Clinical Case Simulations', description: 'Practice with interactive patient scenarios.', icon: CaseUpper, comingSoon: true },
  { id: 'mnemonics', title: 'Exam Tips & Mnemonics', description: 'Get memory aids and study strategies.', icon: Lightbulb, comingSoon: true },
];

export function MedicoDashboard() {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3 welcome-text-fg-animated">Medico Study Hub</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your dedicated space for AI-powered medical study tools. Enhance your learning and ace your exams!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicoTools.map((tool) => (
          <Dialog key={tool.id} open={activeDialog === tool.id} onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}>
            <DialogTrigger asChild>
              <Card 
                className={cn(
                  "shadow-lg rounded-xl overflow-hidden hover:shadow-primary/20 transition-shadow duration-300 cursor-pointer h-full flex flex-col",
                  tool.comingSoon && "opacity-60 hover:shadow-md"
                )}
                onClick={() => !tool.comingSoon && setActiveDialog(tool.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') !tool.comingSoon && setActiveDialog(tool.id)}}
              >
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <tool.icon className="h-8 w-8 text-primary" />
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
                <DialogHeader className="p-6 pb-0">
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
    </div>
  );
}
