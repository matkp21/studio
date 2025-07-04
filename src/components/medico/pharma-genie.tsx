"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FlaskConical, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAiAgent } from '@/hooks/use-ai-agent';
import { getDrugInfo, type PharmaGenieInput, type PharmaGenieOutput } from '@/ai/agents/medico/PharmaGenieAgent';

const formSchema = z.object({
  drugName: z.string().min(3, { message: "Drug name must be at least 3 characters." }),
});
type PharmaGenieFormValues = z.infer<typeof formSchema>;

export function PharmaGenie() {
  const { toast } = useToast();
  const { execute: runGetDrugInfo, data: drugData, isLoading, error, reset } = useAiAgent(getDrugInfo, {
    onSuccess: (data, input) => {
      toast({
        title: "Drug Info Ready!",
        description: `Information for "${input.drugName}" has been generated.`,
      });
    },
  });

  const form = useForm<PharmaGenieFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { drugName: "" },
  });

  const onSubmit: SubmitHandler<PharmaGenieFormValues> = async (data) => {
    await runGetDrugInfo(data as PharmaGenieInput);
  };

  const handleReset = () => {
    form.reset();
    reset();
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
          <FormField
            control={form.control}
            name="drugName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="drugName" className="text-base">Drug Name</FormLabel>
                <FormControl>
                  <Input
                    id="drugName"
                    placeholder="e.g., Aspirin, Metformin"
                    className="rounded-lg text-base py-2.5 border-border/70 focus:border-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit" className="w-full sm:w-auto rounded-lg py-3 text-base group" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Wand2 className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" /> Get Drug Info</>
              )}
            </Button>
            {drugData && (
              <Button type="button" variant="outline" onClick={handleReset} className="rounded-lg">
                Clear
              </Button>
            )}
          </div>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {drugData && !isLoading && (
        <Card className="shadow-md rounded-xl mt-6 border-rose-500/30 bg-gradient-to-br from-card via-card to-rose-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-rose-600" />
              Pharmacology Profile: {form.getValues("drugName")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] p-1 border bg-background rounded-lg">
                <div className="p-4 space-y-4">
                    <div>
                        <h4 className="font-semibold text-md mb-1 text-rose-700 dark:text-rose-400">Drug Class:</h4>
                        <p className="text-sm">{drugData.drugClass}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-md mb-1 text-rose-700 dark:text-rose-400">Mechanism of Action:</h4>
                        <p className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">{drugData.mechanismOfAction}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-md mb-1 text-rose-700 dark:text-rose-400">Key Indications:</h4>
                         <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                            {drugData.indications.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-md mb-1 text-rose-700 dark:text-rose-400">Common Side Effects:</h4>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                            {drugData.sideEffects.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
