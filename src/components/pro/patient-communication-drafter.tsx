// src/components/pro/patient-communication-drafter.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquareHeart, Lightbulb, Edit3, ClipboardCopy, SendHorizonal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const communicationTypes = [
  { id: 'diagnosis_explanation', label: 'Diagnosis Explanation' },
  { id: 'treatment_plan', label: 'Treatment Plan Overview' },
  { id: 'medication_instructions', label: 'Medication Instructions' },
  { id: 'follow_up_details', label: 'Follow-up Appointment Details' },
  { id: 'lifestyle_advice', label: 'Lifestyle Advice' },
];

export function PatientCommunicationDrafter() {
  const [patientName, setPatientName] = useState('');
  const [communicationType, setCommunicationType] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [tone, setTone] = useState('empathetic_clear'); // empathetic_clear, formal_concise
  const [draftedCommunication, setDraftedCommunication] = useState<string | null>(null);

  const handleDraftCommunication = () => {
    if (!communicationType || !keyPoints) {
      alert("Please select communication type and provide key points.");
      return;
    }
    // Simulate AI drafting
    const patientNameToUse = patientName || "Patient";
    let draft = `Dear ${patientNameToUse},\n\nThis message is regarding your recent consultation.\n\n`;
    
    switch (communicationType) {
        case 'diagnosis_explanation':
            draft += `Based on our discussion and recent findings, your diagnosis is [AI to insert based on key points, e.g., ${keyPoints}]. This means [AI to elaborate in simple terms]. We will discuss this further.`;
            break;
        case 'treatment_plan':
            draft += `We have formulated a treatment plan for you which includes [AI to list based on key points, e.g., ${keyPoints}]. The goal of this plan is to [AI to elaborate].`;
            break;
        case 'medication_instructions':
            draft += `Please find instructions for your new medication, [Medication Name from ${keyPoints}]:\n- Dosage: [AI to detail]\n- Frequency: [AI to detail]\n- Important notes: [AI to detail, e.g., take with food, potential side effects like ${keyPoints}]`;
            break;
        default:
            draft += `Regarding ${communicationType.replace('_', ' ')}: ${keyPoints}. We advise you to [AI to suggest actions based on tone: ${tone}].`;
            break;
    }
    draft += "\n\nPlease do not hesitate to contact us if you have any questions.\n\nSincerely,\nYour Healthcare Team (via MediAssistant Pro)";
    setDraftedCommunication(draft);
  };

  const copyToClipboard = () => {
    if (draftedCommunication) {
      navigator.clipboard.writeText(draftedCommunication);
      alert("Communication draft copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-pink-500/50 bg-pink-500/10">
            <Lightbulb className="h-5 w-5 text-pink-600" />
            <AlertTitle className="font-semibold text-pink-700 dark:text-pink-500">Conceptual Tool</AlertTitle>
            <AlertDescription className="text-pink-600/90 dark:text-pink-500/90 text-xs">
            This interface is for the AI-Assisted Patient Communication Drafter. A full version would use NLP to generate more nuanced, patient-friendly text based on clinical data and selected tone.
            </AlertDescription>
      </Alert>

      <Card className="shadow-md rounded-xl border-rose-500/30 bg-gradient-to-br from-card via-card to-rose-500/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageSquareHeart className="h-6 w-6 text-rose-600" />
            AI-Assisted Patient Communication Drafter
          </CardTitle>
          <CardDescription>Generate patient-friendly explanations, instructions, or messages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patient-name-comm">Patient Name (Optional)</Label>
              <Input id="patient-name-comm" value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Enter patient's name" className="mt-1 rounded-lg"/>
            </div>
            <div>
              <Label htmlFor="comm-type">Type of Communication</Label>
              <Select value={communicationType} onValueChange={setCommunicationType}>
                <SelectTrigger id="comm-type" className="w-full mt-1 rounded-lg">
                    <SelectValue placeholder="Select communication type..." />
                </SelectTrigger>
                <SelectContent>
                    {communicationTypes.map(type => <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="key-points">Key Points / Information to Convey</Label>
            <Textarea id="key-points" value={keyPoints} onChange={e => setKeyPoints(e.target.value)} placeholder="e.g., Diagnosis is Type 2 Diabetes; Start Metformin 500mg BD; Follow up in 3 months." className="min-h-[100px] mt-1 rounded-lg"/>
          </div>
          <div>
            <Label htmlFor="comm-tone">Desired Tone</Label>
             <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="comm-tone" className="w-full mt-1 rounded-lg">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="empathetic_clear">Empathetic & Clear</SelectItem>
                    <SelectItem value="formal_concise">Formal & Concise</SelectItem>
                    <SelectItem value="reassuring_simple">Reassuring & Simple</SelectItem>
                </SelectContent>
              </Select>
          </div>
          <Button onClick={handleDraftCommunication} className="w-full sm:w-auto rounded-lg group">
            <Edit3 className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-[-5deg]" />
            Draft Communication
          </Button>
        </CardContent>
      </Card>

      {draftedCommunication && (
        <Card className="mt-6 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Drafted Communication</CardTitle>
            <CardDescription>Review and edit the AI-generated draft.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={draftedCommunication} readOnly className="min-h-[250px] bg-muted/30 rounded-md font-sans text-sm p-4"/>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 p-4 border-t">
            <Button variant="outline" onClick={copyToClipboard} className="rounded-lg">
                <ClipboardCopy className="mr-2 h-4 w-4"/> Copy Text
            </Button>
            <Button className="rounded-lg bg-rose-600 hover:bg-rose-500">
                <SendHorizonal className="mr-2 h-4 w-4"/> Send / Save (Conceptual)
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
