// src/components/medico/pathomind-explainer.tsx
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
import { Loader2, BrainCircuit, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAiAgent } from '@/hooks/use-ai-agent';
import { explainPathophysiology, type PathoMindInput, type PathoMindOutput } from '@/ai/agents/medico/PathoMindAgent';

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }).max(150),
});
type PathoMindFormValues = z.infer<typeof formSchema>;

export function PathoMindExplainer() {
  const { toast } = useToast();
  const { execute: runExplanation, data: explanationData, isLoading, error, reset } = useAiAgent(explainPathophysiology, {
    onSuccess: (data, input) => {
      toast({
        title: "Explanation Ready!",
        description: `Pathophysiology for "${input.topic}" has been generated.`,
      });
    },
  });

  const form = useForm<PathoMindFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "" },
  });

  const onSubmit: SubmitHandler<PathoMindFormValues> = async (data) => {
    await runExplanation(data as PathoMindInput);
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
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="topic-pathomind" className="text-base">Disease or Topic</FormLabel>
                <FormControl>
                  <Input
                    id="topic-pathomind"
                    placeholder="e.g., Diabetes Mellitus Type 1, Asthma"
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
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Explaining...</>
              ) : (
                <><Wand2 className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" /> Explain Pathophysiology</>
              )}
            </Button>
            {explanationData && (
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

      {explanationData && !isLoading && (
        <Card className="shadow-md rounded-xl mt-6 border-blue-500/30 bg-gradient-to-br from-card via-card to-blue-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-blue-600" />
              Pathophysiology: {form.getValues("topic")}
            </CardTitle>
            <CardDescription>AI-generated explanation of the disease process.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-1">
                <h4 className="font-semibold mb-2">Explanation</h4>
                <ScrollArea className="h-[400px] p-1 border bg-background rounded-lg">
                  <div className="p-4 whitespace-pre-wrap text-sm prose prose-sm dark:prose-invert max-w-none">
                    {explanationData.explanation}
                  </div>
                </ScrollArea>
              </div>
              <div className="lg:col-span-1">
                <h4 className="font-semibold mb-2">Process Diagram</h4>
                <ScrollArea className="h-[400px] p-1 border bg-background rounded-lg">
                  <div className="p-4 text-sm">
                    {explanationData.diagram ? (
                      <>
                        <Alert className="mb-2"><AlertDescription>Copy this code into a Mermaid.js renderer to view the diagram.</AlertDescription></Alert>
                        <pre className="p-2 bg-muted rounded-md overflow-x-auto"><code>{explanationData.diagram}</code></pre>
                      </>
                    ) : <p className="text-muted-foreground">No diagram was generated for this topic.</p>}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
