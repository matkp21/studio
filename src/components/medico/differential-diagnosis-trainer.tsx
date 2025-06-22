
// src/components/medico/differential-diagnosis-trainer.tsx
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Brain, Wand2, ListChecks } from 'lucide-react';
import { trainDifferentialDiagnosis, type MedicoDDTrainerInput, type MedicoDDTrainerOutput } from '@/ai/flows/medico/differential-diagnosis-trainer-flow';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  symptoms: z.string().min(10, { message: "Symptoms description must be at least 10 characters." }).max(1000, { message: "Description too long."}),
});

type DDTrainerFormValues = z.infer<typeof formSchema>;

export function DifferentialDiagnosisTrainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MedicoDDTrainerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<DDTrainerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  const onSubmit: SubmitHandler<DDTrainerFormValues> = async (data) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const result = await trainDifferentialDiagnosis(data as MedicoDDTrainerInput);
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete!",
        description: `Differential diagnoses generated for the provided symptoms.`,
      });
    } catch (err) {
      console.error("Differential diagnosis training error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
          <FormField
            control={form.control}
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
                <FormDescription>
                  Describe the clinical presentation for differential diagnosis practice.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full sm:w-auto rounded-lg py-3 text-base group" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Get Differential Diagnoses
              </>
            )}
          </Button>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && (
        <Card className="shadow-md rounded-xl mt-6 border-purple-500/30 bg-gradient-to-br from-card via-card to-purple-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              Differential Diagnosis Training
            </CardTitle>
            <CardDescription>Based on symptoms: "{form.getValues("symptoms").substring(0, 50)}{form.getValues("symptoms").length > 50 ? '...' : ''}"</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
                <h3 className="font-semibold text-md text-purple-700 dark:text-purple-400 flex items-center">
                    <ListChecks className="mr-2 h-5 w-5" />
                    Potential Diagnoses:
                </h3>
                {analysisResult.potentialDiagnoses.length > 0 ? (
                <ul className="list-disc list-inside bg-muted/50 p-4 rounded-lg space-y-1 text-sm text-secondary-foreground">
                    {analysisResult.potentialDiagnoses.map((diagnosis, index) => (
                    <li key={index}>{diagnosis}</li>
                    ))}
                </ul>
                ) : (
                <p className="text-muted-foreground text-sm">No specific diagnoses could be determined based on the input.</p>
                )}

                {analysisResult.explanation && (
                    <div className="mt-3">
                        <h4 className="font-semibold text-md text-purple-700 dark:text-purple-400">Explanation:</h4>
                        <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap text-secondary-foreground">
                            {analysisResult.explanation}
                        </p>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

