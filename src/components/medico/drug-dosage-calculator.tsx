
// src/components/medico/drug-dosage-calculator.tsx
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, CalculatorIcon, Wand2, Info } from 'lucide-react';
import { calculateDrugDosage, type MedicoDrugDosageInput, type MedicoDrugDosageOutput } from '@/ai/agents/medico/DrugDosageCalculatorAgent';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  drugName: z.string().min(2, { message: "Drug name is required." }).max(100, { message: "Drug name too long."}),
  patientWeightKg: z.coerce.number().positive({ message: "Patient weight must be a positive number." }),
  patientAgeYears: z.coerce.number().min(0).optional(),
  indication: z.string().optional(),
  concentrationAvailable: z.string().optional(),
});

type DosageFormValues = z.infer<typeof formSchema>;

export function DrugDosageCalculator() {
  const [isLoading, setIsLoading] = useState(false);
  const [calculationResult, setCalculationResult] = useState<MedicoDrugDosageOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<DosageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: "",
      patientWeightKg: undefined,
      patientAgeYears: undefined,
      indication: "",
      concentrationAvailable: "",
    },
  });

  const onSubmit: SubmitHandler<DosageFormValues> = async (data) => {
    setIsLoading(true);
    setCalculationResult(null);
    setError(null);

    try {
      const input: MedicoDrugDosageInput = {
        ...data,
        patientAgeYears: data.patientAgeYears === undefined || isNaN(data.patientAgeYears) ? undefined : data.patientAgeYears,
      };
      const result = await calculateDrugDosage(input);
      setCalculationResult(result);
      toast({
        title: "Calculation Complete!",
        description: `Dosage for "${data.drugName}" calculated.`,
      });
    } catch (err) {
      console.error("Drug dosage calculation error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        title: "Calculation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <Alert variant="default" className="border-orange-500/50 bg-orange-500/10">
        <Info className="h-5 w-5 text-orange-600" />
        <AlertTitle className="font-semibold text-orange-700 dark:text-orange-500">Educational Tool Only</AlertTitle>
        <AlertDescription className="text-orange-600/90 dark:text-orange-500/90 text-xs">
          This calculator is for educational and practice purposes. Always verify dosages with official pharmacopoeias and consult senior clinicians for actual clinical decisions.
        </AlertDescription>
      </Alert>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="drugName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="drugName-dosage" className="text-base">Drug Name</FormLabel>
                  <FormControl>
                    <Input id="drugName-dosage" placeholder="e.g., Paracetamol" {...field} className="rounded-lg text-base py-2.5 border-border/70 focus:border-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientWeightKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="patientWeightKg-dosage" className="text-base">Patient Weight (kg)</FormLabel>
                  <FormControl>
                    <Input id="patientWeightKg-dosage" type="number" step="0.1" placeholder="e.g., 10" {...field} className="rounded-lg text-base py-2.5 border-border/70 focus:border-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientAgeYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="patientAgeYears-dosage" className="text-base">Patient Age (years, optional)</FormLabel>
                  <FormControl>
                    <Input id="patientAgeYears-dosage" type="number" placeholder="e.g., 1" {...field} className="rounded-lg text-base py-2.5 border-border/70 focus:border-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="indication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="indication-dosage" className="text-base">Indication (optional)</FormLabel>
                  <FormControl>
                    <Input id="indication-dosage" placeholder="e.g., Fever, Pain" {...field} className="rounded-lg text-base py-2.5 border-border/70 focus:border-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="concentrationAvailable"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel htmlFor="concentrationAvailable-dosage" className="text-base">Concentration Available (optional)</FormLabel>
                  <FormControl>
                    <Input id="concentrationAvailable-dosage" placeholder="e.g., 120mg/5ml, 250mg tablet" {...field} className="rounded-lg text-base py-2.5 border-border/70 focus:border-primary" />
                  </FormControl>
                   <FormDescription className="text-xs">If liquid, specify like "120mg/5ml". For tablets, "250mg tablet".</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto rounded-lg py-3 text-base group" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Calculate Dosage
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

      {calculationResult && (
        <Card className="shadow-md rounded-xl mt-6 border-lime-500/30 bg-gradient-to-br from-card via-card to-lime-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CalculatorIcon className="h-6 w-6 text-lime-600" />
              Dosage Calculation for: {form.getValues("drugName")}
            </CardTitle>
            <CardDescription>Review the calculated dose, explanation, and warnings.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-auto max-h-[400px] p-1 border bg-background rounded-lg">
                <div className="p-4 space-y-3">
                    <div>
                        <h4 className="font-semibold text-md mb-1 text-lime-700 dark:text-lime-400">Calculated Dose:</h4>
                        <p className="text-lg font-bold text-foreground whitespace-pre-wrap">{calculationResult.calculatedDose}</p>
                    </div>
                    <div className="mt-3">
                        <h4 className="font-semibold text-md mb-1 text-lime-700 dark:text-lime-400">Explanation:</h4>
                        <p className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">{calculationResult.calculationExplanation}</p>
                    </div>
                    {calculationResult.warnings && calculationResult.warnings.length > 0 && (
                    <div className="mt-3">
                        <h4 className="font-semibold text-md mb-1 text-orange-600 dark:text-orange-400">Warnings & Considerations:</h4>
                        <ul className="list-disc list-inside ml-4 space-y-0.5 text-sm text-orange-700 dark:text-orange-500">
                        {calculationResult.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                        ))}
                        </ul>
                    </div>
                    )}
                </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
