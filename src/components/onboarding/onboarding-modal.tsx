
"use client";

import { useState, type ReactNode } from 'react';
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
import { HeartPulse, ScanSearch, BookOpenText, User, Stethoscope, GraduationCap, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type OnboardingStep = 'welcome' | 'features' | 'role' | 'complete';
type UserRole = 'doctor' | 'student' | 'other';

interface StepContent {
  title: string;
  description: ReactNode;
  icon?: ReactNode;
  content?: ReactNode;
  nextButtonText?: string;
  prevButtonText?: string;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

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
          // Here you would typically save the role preference
          console.log("Selected role:", selectedRole);
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
      // Cannot go back from welcome or complete
    }
  };

  const steps: Record<OnboardingStep, StepContent> = {
    welcome: {
      title: "Welcome to MediAssistant!",
      icon: <HeartPulse className="h-12 w-12 text-primary mb-4" />,
      description: "Your intelligent partner in healthcare. Let's quickly set up your experience.",
      nextButtonText: "Get Started",
    },
    features: {
      title: "Discover Key Features",
      description: "MediAssistant offers powerful tools to support your medical journey:",
      content: (
        <ul className="space-y-4 my-4 text-sm text-muted-foreground list-none p-0">
          <li className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
            <Stethoscope className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <span className="font-semibold text-foreground">Symptom Analyzer:</span> Get AI-powered insights from symptom descriptions.
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
            <ScanSearch className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <span className="font-semibold text-foreground">Image Analyzer:</span> Upload and analyze medical images like X-rays and CT scans.
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
            <BookOpenText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
             <span className="font-semibold text-foreground">Educational Support:</span> Access clinical guidelines and medical knowledge.
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
      description: "Tell us about yourself to tailor MediAssistant to your needs.",
      content: (
        <RadioGroup
          value={selectedRole ?? undefined}
          onValueChange={(value: UserRole) => setSelectedRole(value)}
          className="my-4 space-y-3"
        >
          <Label
            htmlFor="role-doctor"
            className={cn(
              "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50",
              selectedRole === 'doctor' && "bg-primary/10 border-primary ring-2 ring-primary"
            )}
          >
            <RadioGroupItem value="doctor" id="role-doctor" />
            <Stethoscope className="h-5 w-5 text-primary" />
            <span className="font-medium">I am a Doctor / Clinician</span>
          </Label>
          <Label
            htmlFor="role-student"
            className={cn(
              "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50",
              selectedRole === 'student' && "bg-primary/10 border-primary ring-2 ring-primary"
            )}
          >
            <RadioGroupItem value="student" id="role-student" />
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-medium">I am a Medical Student</span>
          </Label>
           <Label
            htmlFor="role-other"
            className={cn(
              "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50",
              selectedRole === 'other' && "bg-primary/10 border-primary ring-2 ring-primary"
            )}
          >
            <RadioGroupItem value="other" id="role-other" />
            <User className="h-5 w-5 text-primary" />
            <span className="font-medium">Other / General Interest</span>
          </Label>
        </RadioGroup>
      ),
      nextButtonText: "Confirm Role",
      prevButtonText: "Back",
    },
    complete: {
      title: "Setup Complete!",
      icon: <CheckCircle className="h-12 w-12 text-green-500 mb-4" />,
      description: `You're all set${selectedRole ? ` as a ${selectedRole}` : ''}. Enjoy using MediAssistant!`,
      nextButtonText: "Finish",
    },
  };

  const currentStepContent = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-xl shadow-2xl">
        <DialogHeader className="text-center items-center">
          {currentStepContent.icon}
          <DialogTitle className="text-2xl font-bold">{currentStepContent.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground px-4">
            {currentStepContent.description}
          </DialogDescription>
        </DialogHeader>
        
        {currentStepContent.content && (
          <div className="px-2 py-4 max-h-[60vh] overflow-y-auto">
            {currentStepContent.content}
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-between pt-4">
          {currentStepContent.prevButtonText ? (
            <Button variant="outline" onClick={handlePrevious} className="rounded-lg">
              {currentStepContent.prevButtonText}
            </Button>
          ) : <div />}
          <Button 
            onClick={handleNext} 
            disabled={currentStep === 'role' && !selectedRole}
            className="rounded-lg"
          >
            {currentStepContent.nextButtonText || "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
