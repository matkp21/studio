
// src/components/medico/flowchart-creator.tsx
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
import { Loader2, Workflow, Wand2, Lightbulb } from 'lucide-react';
import { createFlowchart } from '@/ai/agents/medico/FlowchartCreatorAgent';
import { useToast } from '@/hooks/use-toast';
import { useAiAgent } from '@/hooks/use-ai-agent';
import { useProMode } from '@/contexts/pro-mode-context';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { trackProgress } from '@/ai/agents/medico/ProgressTrackerAgent';

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }).max(150, { message: "Topic too long."}),
});

type FlowchartFormValues = z.infer<typeof formSchema>;

export function FlowchartCreator() {
  const { toast } = useToast();
  const { user } = useProMode();

  const { execute: runCreateFlowchart, data: generatedFlowchart, isLoading, error, reset } = useAiAgent(createFlowchart, {
    onSuccess: async (data, input) => {
      toast({
        title: "Flowchart Generated!",
        description: `Mermaid syntax for "${data.topicGenerated}" is ready.`,
      });

      if (user) {
        try {
          await addDoc(collection(firestore, `users/${user.uid}/studyLibrary`), {
            type: 'flowchart',
            topic: data.topicGenerated,
            userId: user.uid,
            flowchartData: data.flowchartData,
            createdAt: serverTimestamp(),
          });
          toast({
            title: "Saved to Library",
            description: "Your generated flowchart has been saved.",
          });
        } catch (firestoreError) {
          console.error("Firestore save error:", firestoreError);
          toast({
            title: "Save Failed",
            description: "Could not save flowchart to your library.",
            variant: "destructive",
          });
        }
      }

      // Track Progress
      try {
        const progressResult = await trackProgress({
            activityType: 'notes_review',
            topic: `Flowchart: ${input.topic}`
        });
        toast({
            title: "Progress Tracked!",
            description: progressResult.progressUpdateMessage
        });
      } catch (progressError) {
          console.warn("Could not track progress for flowchart generation:", progressError);
      }
    }
  });

  const form = useForm<FlowchartFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "" },
  });

  const onSubmit: SubmitHandler<FlowchartFormValues> = async (data) => {
    await runCreateFlowchart(data);
  };
  
  const handleReset = () => {
    form.reset();
    reset();
  }

  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-purple-500/50 bg-purple-500/10">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            <AlertTitle className="font-semibold text-purple-700 dark:text-purple-500">Mermaid Syntax Output</AlertTitle>
            <AlertDescription className="text-purple-600/90 dark:text-purple-500/90 text-xs">
            This tool generates flowcharts in Mermaid Markdown syntax. You can copy this code and use it in any Mermaid-compatible viewer or editor to render the visual flowchart.
            </AlertDescription>
      </Alert>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="topic-flowchart" className="text-base">Topic for Flowchart</FormLabel>
                <FormControl>
                  <Input
                    id="topic-flowchart"
                    placeholder="e.g., Management of Acute Asthma, Glycolysis Pathway"
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
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  Generate Flowchart
                </>
              )}
            </Button>
            {generatedFlowchart && (
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

      {generatedFlowchart && !isLoading && (
        <Card className="shadow-md rounded-xl mt-6 border-teal-500/30 bg-gradient-to-br from-card via-card to-teal-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Workflow className="h-6 w-6 text-teal-600" />
              Flowchart for: {generatedFlowchart.topicGenerated}
            </CardTitle>
            <CardDescription>Copy the Mermaid code below to render your flowchart.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-auto max-h-[400px] p-1 border bg-background rounded-lg">
                <pre className="p-4 whitespace-pre-wrap text-sm">
                  <code>
                    {generatedFlowchart.flowchartData}
                  </code>
                </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
