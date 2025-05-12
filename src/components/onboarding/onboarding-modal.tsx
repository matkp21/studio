"use client";

import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { HeartPulse, ScanSearch, BookOpenText, User, Stethoscope, GraduationCap, CheckCircle, BriefcaseMedical, School, Bot, Palette, Telescope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProMode, type UserRole as ContextUserRole } from '@/contexts/pro-mode-context'; 
import { Logo } from '@/components/logo';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type OnboardingStep = 'welcome' | 'features' | 'role' | 'complete';
type SelectableUserRole = Exclude<ContextUserRole, null>;


interface StepContent {
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  content?: ReactNode;
  nextButtonText?: string;
  prevButtonText?: string;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedRole, setSelectedRole] = useState<SelectableUserRole | null>(null);
  const { selectUserRole } = useProMode(); 

  const handleNext = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('features');
        break;
      case 'features':
        setCurrentStep('role');
        break;
      case 'role':
        if (selectedRole) {
          selectUserRole(selectedRole); 
          setCurrentStep('complete');
        }
        break;
      case 'complete':
        onClose(); 
        break;
    }
  };

  const handlePrevious = () => {
    switch (currentStep) {
      case 'features':
        setCurrentStep('welcome');
        break;
      case 'role':
        setCurrentStep('features');
        break;
    }
  };

  const steps: Record<OnboardingStep, StepContent> = {
    welcome: {
      title: (
        <div className="flex items-center justify-center gap-2">
          Welcome to <Logo simple />!
        </div>
      ),
      icon: <HeartPulse className="h-12 w-12 text-primary mb-4 animate-pulse-medical" style={{animationDuration: '1.5s'}} />,
      description: "Your intelligent partner in healthcare. Let's quickly set up your experience.",
      nextButtonText: "Get Started",
    },
    features: {
      title: "Discover Key Features",
      description: "MediAssistant offers powerful tools tailored to your needs:",
      content: (
        <ul className="space-y-3 my-4 text-sm text-muted-foreground list-none p-0">
          <li className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg shadow-sm">
            <Bot className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <span className="font-semibold text-foreground">Advanced AI Chat:</span> Engage in intelligent conversations, get symptom insights, and access medico study tools directly via chat. Features voice input/output for hands-free use.
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg shadow-sm">
            <ScanSearch className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <span className="font-semibold text-foreground">Enhanced Image Analysis & AR:</span> Upload medical images for AI-powered annotations and explore them with interactive Augmented Reality features.
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg shadow-sm">
            <Palette className="h-6 w-6 text-primary flex-shrink-0 mt-1" /> {/* Icon for personalized dashboards */}
            <div>
             <span className="font-semibold text-foreground">Personalized Dashboards:</span> Tailor your workspace with customizable dashboards for Professionals (Clinical Suite) and Medical Students (Medico Study Hub).
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg shadow-sm">
            <Telescope className="h-6 w-6 text-primary flex-shrink-0 mt-1" /> {/* Icon for specialized tools */}
            <div>
             <span className="font-semibold text-foreground">Specialized Tool Suites:</span> Access a comprehensive set of tools for Medicos (notes, MCQs, case sims) and Professionals (DDx, discharge summaries, protocol navigation).
            </div>
          </li>
        </ul>
      ),
      nextButtonText: "Next: Personalize",
      prevButtonText: "Back",
    },
    role: {
      title: "Personalize Your Experience",
      icon: <User className="h-10 w-10 text-primary mb-3" />,
      description: "Tell us about yourself to tailor MediAssistant to your needs. This will customize your dashboard and feature suggestions.",
      content: (
        <RadioGroup
          value={selectedRole ?? undefined}
          onValueChange={(value: SelectableUserRole) => setSelectedRole(value)}
          className="my-4 space-y-3"
        >
          <Label
            htmlFor="role-pro"
            className={cn(
              "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50",
              selectedRole === 'pro' && "bg-primary/10 border-primary ring-2 ring-primary"
            )}
          >
            <RadioGroupItem value="pro" id="role-pro" />
            <BriefcaseMedical className="h-5 w-5 text-primary" />
            <span className="font-medium">Professional (Doctor/Clinician)</span>
          </Label>
          <Label
            htmlFor="role-medico"
            className={cn(
              "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50",
              selectedRole === 'medico' && "bg-primary/10 border-primary ring-2 ring-primary"
            )}
          >
            <RadioGroupItem value="medico" id="role-medico" />
            <School className="h-5 w-5 text-primary" /> 
            <span className="font-medium">Medical Student (Medico)</span>
          </Label>
           <Label
            htmlFor="role-diagnosis"
            className={cn(
              "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50",
              selectedRole === 'diagnosis' && "bg-primary/10 border-primary ring-2 ring-primary"
            )}
          >
            <RadioGroupItem value="diagnosis" id="role-diagnosis" />
            <Stethoscope className="h-5 w-5 text-primary" />
            <span className="font-medium">Patient / General Use</span>
          </Label>
        </RadioGroup>
      ),
      nextButtonText: "Confirm Role",
      prevButtonText: "Back",
    },
    complete: {
      title: "Setup Complete!",
      icon: <CheckCircle className="h-12 w-12 text-green-500 mb-4" />,
      description: (
        <>
          You&apos;re all set{selectedRole ? ` as a ${selectedRole === 'pro' ? 'Professional' : selectedRole === 'medico' ? 'Medical Student' : 'Patient/General User'}` : ''}. Enjoy using MediAssistant!
          <br />
          Your experience will be tailored based on your selection.
        </>
      ),
      nextButtonText: "Finish",
    },
  };

  const currentStepContent = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-xl shadow-2xl">
        <DialogHeader className="text-center items-center pt-6">
          {currentStepContent.icon}
          <DialogTitle className="text-2xl font-bold tracking-tight"> {/* Increased font weight and tracking */}
            {currentStepContent.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground px-4 text-sm"> {/* Ensure consistent text size */}
            {currentStepContent.description}
          </DialogDescription>
        </DialogHeader>
        
        {currentStepContent.content && (
          <div className="px-2 py-4 max-h-[60vh] overflow-y-auto">
            {currentStepContent.content}
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-between pt-4 pb-6 px-6">
          {currentStepContent.prevButtonText ? (
            <Button variant="outline" onClick={handlePrevious} className="rounded-lg">
              {currentStepContent.prevButtonText}
            </Button>
          ) : <div />} 
          <Button 
            onClick={handleNext} 
            disabled={currentStep === 'role' && !selectedRole}
            className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground" // Ensure primary button styling
          >
            {currentStepContent.nextButtonText || "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
