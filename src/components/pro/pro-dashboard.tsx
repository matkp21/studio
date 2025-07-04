// src/components/pro/pro-dashboard.tsx
"use client";

import type { ReactNode } from 'react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { cn } from '@/lib/utils';
import {
  Brain, ClipboardCheck, Users, Mic, BarChart3, BriefcaseMedical,
  FileText, Pill, MessageSquareHeart, PhoneForwarded, Library, FilePlus, ArrowRight, Settings, Star, GripVertical, CheckSquare, ArrowRightLeft
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

// Import the actual components
import { DifferentialDiagnosisAssistant } from './differential-diagnosis-assistant';
import { DischargeSummaryGenerator } from './discharge-summary-generator';
import { TreatmentProtocolNavigator } from './treatment-protocol-navigator';
import { PharmacopeiaChecker } from './pharmacopeia-checker';
import { SmartDictation } from './smart-dictation';
import { ClinicalCalculatorSuite } from './clinical-calculator-suite';
import { PatientCommunicationDrafter } from './patient-communication-drafter';
import { OnCallHandoverAssistant } from './on-call-handover-assistant';
import { ResearchSummarizer } from './research-summarizer';
import { TriageAndReferral } from './triage-and-referral'; // Import the new component

type ActiveToolId =
  | 'diffDx'
  | 'protocols'
  | 'pharmacopeia'
  | 'dictation'
  | 'calculators'
  | 'patientComm'
  | 'onCallHandover'
  | 'research'
  | 'discharge'
  | 'smartTriage' // New tool ID for the coordinator
  | null;

interface ProTool {
  id: ActiveToolId;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ElementType;
}

const allProToolsList: ProTool[] = [
  { id: 'smartTriage', title: 'Smart Triage & Referral', description: 'AI coordinator analyzes symptoms and drafts a referral if needed.', icon: ArrowRightLeft, component: TriageAndReferral },
  { id: 'diffDx', title: 'Differential Diagnosis Assistant', description: 'AI-powered suggestions, investigations, and initial management steps.', icon: Brain, component: DifferentialDiagnosisAssistant },
  { id: 'discharge', title: 'Discharge Summary Generator', description: 'Ultra-streamlined, predictive discharge summary creation.', icon: FilePlus, component: DischargeSummaryGenerator },
  { id: 'protocols', title: 'Treatment Protocol Navigator', description: 'Access latest evidence-based treatment guidelines.', icon: ClipboardCheck, component: TreatmentProtocolNavigator },
  { id: 'pharmacopeia', title: 'Pharmacopeia & Interaction Checker', description: 'Comprehensive drug database and interaction analysis.', icon: Pill, component: PharmacopeiaChecker },
  { id: 'dictation', title: 'Smart Dictation & Note Assistant', description: 'Advanced voice-to-text with medical terminology and structuring.', icon: Mic, component: SmartDictation },
  { id: 'calculators', title: 'Intelligent Clinical Calculators', description: 'Suite of scores and criteria (GRACE, Wells\', etc.).', icon: BarChart3, component: ClinicalCalculatorSuite },
  { id: 'patientComm', title: 'Patient Communication Drafter', description: 'AI drafts for patient-friendly explanations and instructions.', icon: MessageSquareHeart, component: PatientCommunicationDrafter },
  { id: 'onCallHandover', title: 'On-Call Handover Assistant', description: 'Structured handovers with "if-then" scenarios and escalation.', icon: Users, component: OnCallHandoverAssistant },
  { id: 'research', title: 'Research & Literature Summarizer', description: 'AI summaries of key papers for clinical questions.', icon: Library, component: ResearchSummarizer },
];

// Simulate frequently used tools - in a real app, this would be dynamic
const frequentlyUsedToolIds: ActiveToolId[] = ['smartTriage', 'discharge', 'pharmacopeia', 'protocols'];

interface ToolCardProps {
  tool: ProTool;
  onLaunch: (toolId: ActiveToolId) => void;
  isFrequentlyUsed?: boolean;
  isEditMode?: boolean; // Pass edit mode state
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onLaunch, isFrequentlyUsed, isEditMode }) => {
  return (
    <DialogTrigger asChild>
      <motion.div
        whileHover={!isEditMode ? { y: -5, boxShadow: "0px 10px 20px hsla(var(--primary) / 0.2)" } : {}}
        transition={{ type: "spring", stiffness: 300 }}
        className={cn(
          "bg-card rounded-xl overflow-hidden shadow-md transition-all duration-300 h-full flex flex-col group relative border-2 border-transparent",
          !isEditMode && "hover:shadow-lg cursor-pointer tool-card-frequent firebase-gradient-border-hover animate-subtle-pulse-glow",
          isEditMode && "cursor-grab border-dashed border-muted-foreground/50"
        )}
        onClick={() => !isEditMode && onLaunch(tool.id)}
        role="button"
        tabIndex={isEditMode ? -1 : 0}
        onKeyDown={(e) => { if (!isEditMode && (e.key === 'Enter' || e.key === ' ') ) onLaunch(tool.id); }}
        aria-disabled={!!(isEditMode)}
        aria-label={`Launch ${tool.title}`}
      >
        {isEditMode && (
          <GripVertical className="absolute top-2 left-2 h-5 w-5 text-muted-foreground z-10" title="Drag to reorder" />
        )}
        {isFrequentlyUsed && !isEditMode && (
          <Star className="absolute top-2 right-2 h-5 w-5 text-yellow-400 fill-yellow-400 z-10" />
        )}
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center gap-3 mb-1.5">
            <div className={cn(
                "p-2 rounded-lg bg-primary/10 text-primary transition-colors duration-300",
                !isEditMode && "group-hover:bg-gradient-to-br group-hover:from-[hsl(var(--firebase-color-1-light-h),var(--firebase-color-1-light-s),calc(var(--firebase-color-1-light-l)_-_10%))/0.2] group-hover:to-[hsl(var(--firebase-color-3-light-h),var(--firebase-color-3-light-s),calc(var(--firebase-color-3-light-l)_-_10%))/0.2] group-hover:text-foreground"
            )}>
                <tool.icon className={cn(
                    "h-7 w-7 transition-transform duration-300",
                    !isEditMode && "group-hover:scale-110",
                    !isEditMode && "group-hover:text-purple-500"
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
           <div className="w-full text-right">
              <Button variant="link" size="sm" disabled={isEditMode} className={cn(
                  "text-primary group-hover:underline p-0 h-auto text-xs",
                   !isEditMode && "group-hover:text-foreground group-hover:hover:text-primary",
                   isEditMode && "text-muted-foreground cursor-default"
                  )}>
                 Open Tool <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
           </div>
        </CardContent>
      </motion.div>
    </DialogTrigger>
  );
};


export function ProModeDashboard() {
  const [activeDialog, setActiveDialog] = useState<ActiveToolId>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [displayedTools, setDisplayedTools] = useState<ProTool[]>(allProToolsList);

  const currentTool = allProToolsList.find(tool => tool.id === activeDialog);

  const frequentlyUsedTools = displayedTools.filter(tool => frequentlyUsedToolIds.includes(tool.id));
  const otherTools = displayedTools.filter(tool => !frequentlyUsedToolIds.includes(tool.id));

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1 firebase-gradient-text">Clinical Suite Dashboard</h1>
            <p className="text-md text-muted-foreground">
            Your personalized command center for advanced AI clinical tools.
            </p>
        </div>
        <Button variant="outline" onClick={() => setIsEditMode(!isEditMode)} size="sm" className="rounded-lg group">
          {isEditMode ? <CheckSquare className="mr-2 h-4 w-4"/> : <Settings className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-45"/>}
          {isEditMode ? 'Save Layout' : 'Customize'}
        </Button>
      </div>

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
                <Dialog open={activeDialog === tool.id} onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}>
                  <ToolCard
                    tool={tool}
                    onLaunch={setActiveDialog}
                    isFrequentlyUsed={frequentlyUsedToolIds.includes(tool.id)}
                    isEditMode={isEditMode}
                  />
                  {tool.component && activeDialog === tool.id && (
                    <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] flex flex-col p-0">
                      <DialogHeader className="p-6 pb-4 sticky top-0 bg-background border-b z-10">
                        <DialogTitle className="text-2xl flex items-center gap-2">
                          <tool.icon className="h-6 w-6 text-primary" /> {tool.title}
                        </DialogTitle>
                        <DialogDescription className="text-sm">{tool.description}</DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="flex-grow overflow-y-auto">
                        <div className="p-6 pt-2">
                          <tool.component />
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  )}
                </Dialog>
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
                  <Dialog key={`${tool.id}-freq`} open={activeDialog === tool.id} onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}>
                    <ToolCard tool={tool} onLaunch={setActiveDialog} isFrequentlyUsed isEditMode={isEditMode} />
                    {tool.component && activeDialog === tool.id && (
                        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] flex flex-col p-0">
                            <DialogHeader className="p-6 pb-4 sticky top-0 bg-background border-b z-10">
                            <DialogTitle className="text-2xl flex items-center gap-2">
                                <tool.icon className="h-6 w-6 text-primary" /> {tool.title}
                            </DialogTitle>
                            <DialogDescription className="text-sm">{tool.description}</DialogDescription>
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
            <h2 className="text-2xl font-semibold text-foreground mb-5">All Professional Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {otherTools.map((tool) => (
                <Dialog key={tool.id} open={activeDialog === tool.id} onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}>
                    <ToolCard tool={tool} onLaunch={setActiveDialog} isEditMode={isEditMode} />
                    {tool.component && activeDialog === tool.id && (
                         <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] flex flex-col p-0">
                            <DialogHeader className="p-6 pb-4 sticky top-0 bg-background border-b z-10">
                            <DialogTitle className="text-2xl flex items-center gap-2">
                                <tool.icon className="h-6 w-6 text-primary" /> {tool.title}
                            </DialogTitle>
                            <DialogDescription className="text-sm">{tool.description}</DialogDescription>
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
        </>
      )}
    </div>
  );
}
