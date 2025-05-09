// src/components/symptom-analyzer/symptom-form.tsx
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { analyzeSymptoms, type SymptomAnalyzerInput, type SymptomAnalyzerOutput } from '@/ai/flows/symptom-analyzer';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

const formSchema = z.object({
  symptoms: z.string().min(10, { message: "Please describe symptoms in at least 10 characters." }),
});

type SymptomFormValues = z.infer<typeof formSchema>;

interface SymptomFormProps {
  onAnalysisComplete: (result: SymptomAnalyzerOutput | null, error?: string) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean; // Added isLoading prop
}

export function SymptomForm({ onAnalysisComplete, setIsLoading, isLoading }: SymptomFormProps) {
  const { toast } = useToast();
  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  const onSubmit: SubmitHandler<SymptomFormValues> = async (data) => {
    setIsLoading(true);
    onAnalysisComplete(null); 

    try {
      const result = await analyzeSymptoms(data as SymptomAnalyzerInput);
      onAnalysisComplete(result);
      toast({
        title: "Analysis Complete",
        description: "Symptom analysis successfully completed.",
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
            <FormItem className="input-focus-glow rounded-lg">
              <FormLabel htmlFor="symptoms-input" className="text-foreground/90">Symptoms Description</FormLabel>
              <FormControl>
                <Textarea
                  id="symptoms-input"
                  placeholder="e.g., persistent cough, fever for 3 days, headache..."
                  className="min-h-[120px] resize-none rounded-lg border-border/70 focus:border-primary"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide as much detail as possible for a more relevant analysis.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full rounded-lg py-3 text-base group" disabled={form.formState.isSubmitting || isLoading}>
          {isLoading ? 'Analyzing...' : 'Diagnose'}
          {!isLoading && <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
        </Button>
      </form>
    </Form>
  );
}

