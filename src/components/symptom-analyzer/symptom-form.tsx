"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { analyzeSymptoms, type SymptomAnalyzerInput, type SymptomAnalyzerOutput } from '@/ai/flows/symptom-analyzer';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  symptoms: z.string().min(10, { message: "Please describe your symptoms in at least 10 characters." }),
});

type SymptomFormValues = z.infer<typeof formSchema>;

interface SymptomFormProps {
  onAnalysisComplete: (result: SymptomAnalyzerOutput | null, error?: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export function SymptomForm({ onAnalysisComplete, setIsLoading }: SymptomFormProps) {
  const { toast } = useToast();
  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  const onSubmit: SubmitHandler<SymptomFormValues> = async (data) => {
    setIsLoading(true);
    onAnalysisComplete(null); // Clear previous results

    try {
      const result = await analyzeSymptoms(data as SymptomAnalyzerInput);
      onAnalysisComplete(result);
      toast({
        title: "Analysis Complete",
        description: "Symptom analysis has been successfully completed.",
      });
    } catch (error) {
      console.error("Symptom analysis error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during analysis.";
      onAnalysisComplete(null, errorMessage);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="symptoms-input">Symptoms Description</FormLabel>
              <FormControl>
                <Textarea
                  id="symptoms-input"
                  placeholder="e.g., persistent cough, fever for 3 days, headache..."
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          Analyze Symptoms
        </Button>
      </form>
    </Form>
  );
}
