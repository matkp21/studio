
// src/components/medico/differential-diagnosis-trainer.tsx
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Brain, Send, FilePlus, RotateCcw } from 'lucide-react';
import { trainDifferentialDiagnosis, type MedicoDDTrainerInput, type MedicoDDTrainerOutput } from '@/ai/agents/medico/DifferentialDiagnosisTrainerAgent';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { trackProgress } from '@/ai/agents/medico/ProgressTrackerAgent';

const newCaseFormSchema = z.object({
  symptoms: z.string().min(10, { message: "Symptoms description must be at least 10 characters." }).max(1000, { message: "Description too long."}),
});
type NewCaseFormValues = z.infer<typeof newCaseFormSchema>;

const responseFormSchema = z.object({
  userResponse: z.string().min(1, { message: "Response cannot be empty." }).max(1000, { message: "Response too long."}),
});
type ResponseFormValues = z.infer<typeof responseFormSchema>;

export function DifferentialDiagnosisTrainer() {
  const [caseData, setCaseData] = useState<MedicoDDTrainerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const newCaseForm = useForm<NewCaseFormValues>({
    resolver: zodResolver(newCaseFormSchema),
    defaultValues: { symptoms: "" },
  });

  const responseForm = useForm<ResponseFormValues>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: { userResponse: "" },
  });

  const handleNewCaseSubmit: SubmitHandler<NewCaseFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setCaseData(null);
    try {
      const input: MedicoDDTrainerInput = { isNewCase: true, symptoms: data.symptoms };
      const result = await trainDifferentialDiagnosis(input);
      setCaseData(result);
      toast({ title: "New DDx Session Started", description: `Training session for "${data.symptoms.substring(0,30)}..." has begun.` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to start new session.";
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponseSubmit: SubmitHandler<ResponseFormValues> = async (data) => {
    if (!caseData?.updatedCaseSummary) return;
    setIsLoading(true);
    setError(null);
    try {
      const input: MedicoDDTrainerInput = { 
        isNewCase: false, 
        userResponse: data.userResponse, 
        currentCaseSummary: caseData.updatedCaseSummary 
      };
      const result = await trainDifferentialDiagnosis(input);
      setCaseData(result);
      responseForm.reset(); // Clear response input
      toast({ title: "Response Submitted", description: "DDx training updated." });

      if (result.isCompleted) {
        try {
            // The topic is the initial symptoms string.
            const topic = result.updatedCaseSummary.split('\n')[0]; // A bit hacky, but should work.
            const progressResult = await trackProgress({
                activityType: 'case_sim_completed', // Treat it like a case
                topic: topic || 'DDx Session'
            });
            toast({
                title: "Session Completed & Progress Tracked!",
                description: progressResult.progressUpdateMessage
            });
        } catch (progressError) {
            console.warn("Could not track progress for DDx trainer:", progressError);
        }
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit response.";
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetSimulation = () => {
    setCaseData(null);
    setError(null);
    setIsLoading(false);
    newCaseForm.reset();
    responseForm.reset();
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!caseData && (
        <Card className="shadow-md rounded-xl border-purple-500/30 bg-gradient-to-br from-card via-card to-purple-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><FilePlus className="h-6 w-6 text-purple-600"/> Start New DDx Training</CardTitle>
            <CardDescription>Enter a clinical scenario to begin an interactive diagnostic session.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...newCaseForm}>
              <form onSubmit={newCaseForm.handleSubmit(handleNewCaseSubmit)} className="space-y-4">
                <FormField
                  control={newCaseForm.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="symptoms-ddx" className="text-base">Symptoms / Clinical Scenario</FormLabel>
                       <FormControl>
                        <Textarea
                            id="symptoms-ddx"
                            placeholder="e.g., 45-year-old male presents with chest pain, dyspnea, and diaphoresis..."
                            className="min-h-[120px] rounded-lg text-base py-2.5 border-border/70 focus:border-primary"
                            {...field}
                        />
                       </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full sm:w-auto rounded-lg py-3 text-base group" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Start Training
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {caseData && (
        <Card className="shadow-md rounded-xl border-indigo-500/30 bg-gradient-to-br from-card via-card to-indigo-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-indigo-600"/> Differential Diagnosis Training
                </div>
                <Button variant="outline" size="sm" onClick={resetSimulation} className="text-xs rounded-md">
                    <RotateCcw className="mr-1.5 h-3 w-3"/> New Session
                </Button>
            </CardTitle>
            <CardDescription>Interactive diagnostic reasoning session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div>
                <h3 className="font-semibold text-base mb-1 text-foreground">Case Summary:</h3>
                <ScrollArea className="max-h-40">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap pr-4">{caseData.updatedCaseSummary}</p>
                </ScrollArea>
              </div>
              {caseData.feedback && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <h4 className="font-semibold text-sm text-green-700 dark:text-green-400">Feedback:</h4>
                  <p className="text-xs text-green-600/90 dark:text-green-400/90 whitespace-pre-wrap">{caseData.feedback}</p>
                </div>
              )}
               <div>
                <h3 className="font-semibold text-base mb-1 text-indigo-600 dark:text-indigo-400">Tutor's Prompt:</h3>
                <p className="text-sm font-medium text-foreground whitespace-pre-wrap">{caseData.prompt}</p>
              </div>
            </div>

            {caseData.isCompleted ? (
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="font-semibold text-base mb-1 text-blue-700 dark:text-blue-400">Session Completed!</h3>
                <p className="text-sm text-blue-600/90 dark:text-blue-400/90">This training session is complete. Great job!</p>
                <Button onClick={resetSimulation} className="mt-4 rounded-lg" variant="default">
                  Start Another Session
                </Button>
              </div>
            ) : (
              <Form {...responseForm}>
                <form onSubmit={responseForm.handleSubmit(handleResponseSubmit)} className="space-y-3">
                  <FormField
                    control={responseForm.control}
                    name="userResponse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="ddx-response" className="text-base">Your Question or Action:</FormLabel>
                        <FormControl>
                          <Textarea id="ddx-response" placeholder="e.g., Ask about radiation of pain, Check for calf swelling..." {...field} className="min-h-[100px] rounded-lg text-base py-2.5 border-border/70 focus:border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full sm:w-auto rounded-lg py-3 text-base group" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Submit Response
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
