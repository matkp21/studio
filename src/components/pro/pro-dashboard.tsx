// src/components/pro/pro-dashboard.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { 
  Brain, ClipboardCheck, Stethoscope, Mic, BarChart3, Users, Briefcase, 
  FileText, Pill, MessageSquareHeart, PhoneForwarded, Library, FilePlus, ArrowRight, Lightbulb
} from 'lucide-react';

// Import the actual component
import { DifferentialDiagnosisAssistant } from './differential-diagnosis-assistant'; 
import { DischargeSummaryGenerator } from './discharge-summary-generator';
import { TreatmentProtocolNavigator } from './treatment-protocol-navigator';
import { RoundsTool } from './rounds-tool';


// Placeholder components for Pro tools that are still "coming soon"
const PlaceholderTool = ({ title }: { title: string }) => (
  <div className="p-4 text-center text-muted-foreground">
    <Lightbulb className="mx-auto h-12 w-12 mb-4 text-primary/50" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm">This tool is under development. Full functionality coming soon.</p>
  </div>
);

const PharmacopeiaChecker = () => <PlaceholderTool title="Pharmacopeia & Drug Interaction Checker" />;
const SmartDictation = () => <PlaceholderTool title="Smart Dictation & Note Assistant" />;
const ClinicalCalculatorSuite = () => <PlaceholderTool title="Intelligent Clinical Calculator Suite" />;
const ReferralStreamliner = () => <PlaceholderTool title="Referral & Consultation Streamliner" />;
const PersonalizedDashboard = () => <PlaceholderTool title="Personalized Clinical Dashboard (View)" />; // This is the overall page
const PatientCommunicationDrafter = () => <PlaceholderTool title="AI-Assisted Patient Communication Drafter" />;
const OnCallHandoverAssistant = () => <PlaceholderTool title="Intelligent On-Call Handover Assistant" />;
const ResearchSummarizer = () => <PlaceholderTool title="AI-Powered Research & Literature Summarizer" />;


type ActiveToolId = 
  | 'diffDx'
  | 'protocols'
  | 'pharmacopeia'
  | 'dictation'
  | 'calculators'
  | 'referral'
  | 'rounds'
  | 'patientComm'
  | 'onCallHandover'
  | 'research'
  | 'discharge'
  | null;

interface ProTool {
  id: ActiveToolId;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ElementType; 
  comingSoon?: boolean;
}

const proToolsList: ProTool[] = [
  { id: 'diffDx', title: 'Differential Diagnosis Assistant', description: 'AI-powered suggestions, investigations, and initial management steps.', icon: Brain, component: DifferentialDiagnosisAssistant, comingSoon: false },
  { id: 'discharge', title: 'Discharge Summary Generator', description: 'Ultra-streamlined, predictive discharge summary creation.', icon: FilePlus, component: DischargeSummaryGenerator, comingSoon: false }, 
  { id: 'protocols', title: 'Treatment Protocol Navigator', description: 'Access latest evidence-based treatment guidelines.', icon: ClipboardCheck, component: TreatmentProtocolNavigator, comingSoon: false }, 
  { id: 'rounds', title: 'Rounds Tool 2.0', description: 'Shared task lists, real-time updates, and handover summaries.', icon: Users, component: RoundsTool, comingSoon: false },
  { id: 'pharmacopeia', title: 'Pharmacopeia & Interaction Checker', description: 'Comprehensive drug database and interaction analysis.', icon: Pill, component: PharmacopeiaChecker, comingSoon: true },
  { id: 'dictation', title: 'Smart Dictation & Note Assistant', description: 'Advanced voice-to-text with medical terminology and structuring.', icon: Mic, component: SmartDictation, comingSoon: true },
  { id: 'calculators', title: 'Intelligent Clinical Calculators', description: 'Suite of scores and criteria (GRACE, Wells\', etc.).', icon: BarChart3, component: ClinicalCalculatorSuite, comingSoon: true },
  { id: 'referral', title: 'Referral & Consultation Streamliner', description: 'Templates and quick summary generation for referrals.', icon: PhoneForwarded, component: ReferralStreamliner, comingSoon: true },
  { id: 'patientComm', title: 'Patient Communication Drafter', description: 'AI drafts for patient-friendly explanations and instructions.', icon: MessageSquareHeart, component: PatientCommunicationDrafter, comingSoon: true },
  { id: 'onCallHandover', title: 'On-Call Handover Assistant', description: 'Structured handovers with "if-then" scenarios and escalation.', icon: Users, component: OnCallHandoverAssistant, comingSoon: true }, 
  { id: 'research', title: 'Research & Literature Summarizer', description: 'AI summaries of key papers for clinical questions.', icon: Library, component: ResearchSummarizer, comingSoon: true },
];


export function ProDashboard() {
  const [activeDialog, setActiveDialog] = useState<ActiveToolId>(null);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3 welcome-text-fg-animated">Professional Clinical Suite</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Advanced AI tools designed to augment clinical decision-making, streamline workflows, and enhance patient care.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {proToolsList.map((tool) => (
          <Dialog key={tool.id} open={activeDialog === tool.id} onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}>
            <DialogTrigger asChild>
              <Card 
                className={cn(
                  "shadow-lg rounded-xl overflow-hidden hover:shadow-purple-500/20 transition-shadow duration-300 cursor-pointer h-full flex flex-col group",
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
                    <tool.icon className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed line-clamp-3">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex-grow flex items-end">
                  {tool.comingSoon ? (
                    <div className="text-center text-sm text-amber-600 dark:text-amber-400 font-semibold p-2 bg-amber-500/10 rounded-md w-full">
                      Coming Soon!
                    </div>
                  ) : (
                     <Button variant="outline" className="w-full rounded-lg border-purple-500/50 text-purple-600 hover:bg-purple-500/10 hover:text-purple-600 group/button">
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
                    <tool.icon className="h-6 w-6 text-purple-600" /> {tool.title}
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
