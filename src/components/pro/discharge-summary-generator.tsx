// src/components/pro/discharge-summary-generator.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FilePlus, Lightbulb, Loader2, Download, Share2, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

// This component is a placeholder and conceptual representation.
// Full implementation would involve robust AI, data integration, and NLP.

interface DischargeSummaryData {
  patientName: string;
  patientAge: string;
  admissionNumber: string;
  primaryDiagnosis: string; // Clinical Anchor
  keySymptomsOrProcedure?: string; // Clinical Anchor

  hospitalCourse: string;
  dischargeMedications: string[];
  followUpPlans: string[];
  patientEducation: string[];
  redFlags: string[];
  // Potentially many more fields
}

const initialSummaryState: DischargeSummaryData = {
    patientName: '',
    patientAge: '',
    admissionNumber: '',
    primaryDiagnosis: '',
    keySymptomsOrProcedure: '',
    hospitalCourse: 'Patient admitted on [Date] with [Symptoms/Reason]. Investigations revealed [...]. Management included [...]. Patient responded well/had complications [...]. Stable for discharge.',
    dischargeMedications: ['Medication 1: Dose, Route, Frequency, Duration (e.g., Paracetamol 500mg PO QID PRN for 3 days)'],
    followUpPlans: ['Follow up with GP in 1 week.', 'Outpatient clinic appointment on [Date] at [Time].'],
    patientEducation: ['Educated on medication compliance.', 'Advised on diet and activity levels.'],
    redFlags: ['Seek immediate medical attention if: fever >38.5°C, severe pain unrelieved by medication, shortness of breath.'],
};


export function DischargeSummaryGenerator() {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [clinicalAnchorDiagnosis, setClinicalAnchorDiagnosis] = useState('');
  const [clinicalAnchorSymptoms, setClinicalAnchorSymptoms] = useState('');

  const [generatedSummary, setGeneratedSummary] = useState<DischargeSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    if (!admissionNumber.trim() || !clinicalAnchorDiagnosis.trim()) {
      toast({ 
        title: "Input Required", 
        description: "Please enter Admission Number and Primary Diagnosis (Clinical Anchor).", 
        variant: "destructive" 
      });
      return;
    }
    setIsLoading(true);
    setGeneratedSummary(null); // Clear previous summary

    // Simulate AI data aggregation and predictive drafting
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

    // For demo, we'll use a pre-filled template and customize it slightly
    // In a real app, this would be a complex AI process.
    const draftSummary: DischargeSummaryData = {
      ...initialSummaryState,
      patientName: patientName || "John Doe", // Use entered or default
      patientAge: patientAge || "45",
      admissionNumber: admissionNumber,
      primaryDiagnosis: clinicalAnchorDiagnosis,
      keySymptomsOrProcedure: clinicalAnchorSymptoms,
      // AI would populate these more intelligently based on 'clinicalAnchorDiagnosis' & patient data
      hospitalCourse: `Patient ${patientName || 'N/A'}, ${patientAge || 'N/A'} y/o, admitted via ER with ${clinicalAnchorSymptoms || 'presenting complaints related to ' + clinicalAnchorDiagnosis}. Investigations confirmed ${clinicalAnchorDiagnosis}. Treatment initiated included [Specific Treatments for ${clinicalAnchorDiagnosis}]. Patient's condition improved. Stable for discharge.`,
      dischargeMedications: [
        `Prescription for ${clinicalAnchorDiagnosis}-specific medication (e.g., Antibiotic X 500mg BID x 7 days)`,
        "Paracetamol 1g PO QDS PRN for pain/fever."
      ],
      followUpPlans: [
        `Follow-up with primary care physician in 1 week to review progress regarding ${clinicalAnchorDiagnosis}.`,
        "Specialist appointment for [Related Specialty] on [Future Date]."
      ],
      redFlags: [
        `Return to hospital immediately if experiencing worsening of ${clinicalAnchorDiagnosis} symptoms, high fever, or severe pain.`
      ]
    };

    setGeneratedSummary(draftSummary);
    setIsLoading(false);
    toast({ title: "Draft Summary Generated", description: "Review and refine the AI-generated discharge summary." });
  };
  
  const handleSummaryChange = (field: keyof DischargeSummaryData, value: string | string[]) => {
    if (generatedSummary) {
        setGeneratedSummary(prev => prev ? {...prev, [field]: value} : null);
    }
  };


  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-blue-500/50 bg-blue-500/10">
        <Lightbulb className="h-5 w-5 text-blue-600" />
        <AlertTitle className="font-semibold text-blue-700 dark:text-blue-500">AI-Assisted Discharge Summary</AlertTitle>
        <AlertDescription className="text-blue-600/90 dark:text-blue-500/90 text-xs">
          Enter patient identifiers and key clinical anchors. The AI will aggregate data and draft a comprehensive summary.
          Review and refine the draft before finalizing. This tool aims to streamline documentation.
        </AlertDescription>
      </Alert>

      <Card className="shadow-md rounded-xl border-sky-500/30 bg-gradient-to-br from-card via-card to-sky-500/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FilePlus className="h-6 w-6 text-sky-600" />
            Generate Discharge Summary
          </CardTitle>
          <CardDescription>Provide minimal identifiers and clinical anchors to initiate AI drafting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="admission-number">Admission/OPD Number (Required)</Label>
                    <Input id="admission-number" value={admissionNumber} onChange={e => setAdmissionNumber(e.target.value)} placeholder="e.g., MRN12345" className="mt-1 rounded-lg"/>
                </div>
                 <div>
                    <Label htmlFor="primary-diagnosis">Primary Diagnosis (Clinical Anchor - Required)</Label>
                    <Input id="primary-diagnosis" value={clinicalAnchorDiagnosis} onChange={e => setClinicalAnchorDiagnosis(e.target.value)} placeholder="e.g., Acute Myocardial Infarction" className="mt-1 rounded-lg"/>
                </div>
                 <div>
                    <Label htmlFor="patient-name-ds">Patient Name (Optional)</Label>
                    <Input id="patient-name-ds" value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="e.g., John Doe" className="mt-1 rounded-lg"/>
                </div>
                 <div>
                    <Label htmlFor="patient-age-ds">Patient Age (Optional)</Label>
                    <Input id="patient-age-ds" value={patientAge} onChange={e => setPatientAge(e.target.value)} placeholder="e.g., 45" className="mt-1 rounded-lg"/>
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="key-symptoms">Key Symptoms / Procedure (Optional Clinical Anchor)</Label>
                    <Input id="key-symptoms" value={clinicalAnchorSymptoms} onChange={e => setClinicalAnchorSymptoms(e.target.value)} placeholder="e.g., Severe abdominal pain, Laparoscopic Cholecystectomy" className="mt-1 rounded-lg"/>
                </div>
            </div>
          <Button onClick={handleGenerateSummary} disabled={isLoading} className="w-full sm:w-auto rounded-lg py-3 text-base group">
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Edit3 className="mr-2 h-5 w-5" />}
            Generate Draft Summary
          </Button>
        </CardContent>
      </Card>

      {generatedSummary && (
        <Card className="mt-6 shadow-lg rounded-xl border-green-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-green-700 dark:text-green-400">Draft Discharge Summary for: {generatedSummary.patientName || generatedSummary.admissionNumber}</CardTitle>
            <CardDescription>Review, edit, and complete the sections below. AI suggestions are provided.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] p-1 border bg-background rounded-lg">
                <div className="p-4 space-y-6">
                    {Object.entries(generatedSummary).map(([key, value]) => {
                        if (key === 'admissionNumber' || key === 'primaryDiagnosis' || key === 'keySymptomsOrProcedure' || key === 'patientName' || key === 'patientAge') return null; // Already captured or part of header
                        
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                        return (
                            <div key={key}>
                                <Label htmlFor={`summary-${key}`} className="text-md font-semibold text-foreground/90">{label}</Label>
                                {Array.isArray(value) ? (
                                    value.map((item, index) => (
                                        <Textarea
                                            key={`${key}-${index}`}
                                            id={`summary-${key}-${index}`}
                                            value={item}
                                            onChange={(e) => {
                                                const newArray = [...value];
                                                newArray[index] = e.target.value;
                                                handleSummaryChange(key as keyof DischargeSummaryData, newArray);
                                            }}
                                            className="mt-1 rounded-md min-h-[60px] border-border/70 focus:border-primary"
                                            placeholder={`Edit ${label} item ${index + 1}`}
                                        />
                                    ))
                                ) : (
                                    <Textarea
                                        id={`summary-${key}`}
                                        value={value as string}
                                        onChange={(e) => handleSummaryChange(key as keyof DischargeSummaryData, e.target.value)}
                                        className="mt-1 rounded-md min-h-[100px] border-border/70 focus:border-primary"
                                        placeholder={`Edit ${label}`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 p-4 border-t">
            <Button variant="outline" className="rounded-lg">
                <Share2 className="mr-2 h-4 w-4"/> Share / Export
            </Button>
            <Button className="rounded-lg bg-green-600 hover:bg-green-500">
                <Download className="mr-2 h-4 w-4"/> Finalize & Save
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}