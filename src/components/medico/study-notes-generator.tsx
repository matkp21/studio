
// src/components/medico/study-notes-generator.tsx
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, BookOpen, Wand2, FileText, Save, ArrowRight } from 'lucide-react';
import { generateStudyNotes } from '@/ai/agents/medico/StudyNotesAgent';
import { useToast } from '@/hooks/use-toast';
import { useAiAgent } from '@/hooks/use-ai-agent';
import { useProMode } from '@/contexts/pro-mode-context';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { trackProgress } from '@/ai/agents/medico/ProgressTrackerAgent';
import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';
import Link from 'next/link';

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).max(100, {message: "Topic too long."}),
  answerLength: z.enum(['10-mark', '5-mark']).default('10-mark'),
});

type StudyNotesFormValues = z.infer<typeof formSchema>;

interface StudyNotesGeneratorProps {
  initialTopic?: string | null;
}

const seedQuestions = [
  "Papillary carcinoma thyroid", "Varicose veins", "Inguinal hernia", "Carcinoma breast", "Nephrotic syndrome", "Rheumatic heart disease", "Pneumonia in children", "Cirrhosis of liver", "Malignant melanoma", "Dengue fever"
];

export function StudyNotesGenerator({ initialTopic }: StudyNotesGeneratorProps) {
  const { toast } = useToast();
  const { user } = useProMode();
  const { execute: runGenerateAnswer, data: generatedAnswer, isLoading, error, reset } = useAiAgent(generateStudyNotes, {
     onSuccess: async (data, input) => {
      toast({
          title: "Structured Notes Generated!",
          description: `Notes for "${input.topic}" are ready.`
      });
      
      try {
        await trackProgress({
            activityType: 'notes_review',
            topic: input.topic,
        });
        toast({
            title: "Progress Tracked!",
            description: "This activity has been added to your progress."
        });
      } catch (progressError) {
          console.warn("Could not track progress:", progressError);
      }
    }
  });

  const form = useForm<StudyNotesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: initialTopic || "",
      answerLength: '10-mark',
    },
  });

  useEffect(() => {
    if (initialTopic) {
        form.setValue('topic', initialTopic);
    }
  }, [initialTopic, form]);

  const handleReset = () => {
    form.reset({ topic: "", answerLength: "10-mark" });
    reset();
  }
  
  const handleSeedQuestionClick = (question: string) => {
    form.setValue('topic', question);
    form.handleSubmit(onSubmit)();
  }

  const onSubmit: SubmitHandler<StudyNotesFormValues> = async (data) => {
    await runGenerateAnswer(data);
  };
  
  const handleSaveToLibrary = async () => {
    if (!generatedAnswer || !user) {
        toast({ title: "Cannot Save", description: "No content to save or user not logged in.", variant: "destructive" });
        return;
    }
    try {
        await addDoc(collection(firestore, `users/${user.uid}/studyLibrary`), {
            type: 'notes',
            topic: form.getValues('topic'),
            userId: user.uid,
            notes: generatedAnswer.notes,
            summaryPoints: generatedAnswer.summaryPoints || [], // FIX: Ensure summaryPoints is not undefined
            diagram: generatedAnswer.diagram || null, // FIX: Ensure diagram is not undefined
            createdAt: serverTimestamp(),
        });
        toast({ title: "Saved to Library", description: "Your generated notes have been saved." });
    } catch (e) {
        console.error("Firestore save error:", e);
        toast({ title: "Save Failed", description: "Could not save notes to your library.", variant: "destructive" });
    }
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
                <FormLabel htmlFor="topic-notes" className="text-base">University Question / Topic</FormLabel>
                <FormControl>
                  <Input
                    id="topic-notes"
                    placeholder="e.g., Inguinal Hernia, Rheumatic Heart Disease"
                    className="rounded-lg text-base py-2.5 border-border/70 focus:border-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="answerLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Answer Length</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className="rounded-lg"><SelectValue/></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="10-mark">10-Mark Answer (~500 words)</SelectItem>
                    <SelectItem value="5-mark">5-Mark Answer (~250 words)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage/>
              </FormItem>
            )}
           />
          <div className="flex gap-2">
            <Button type="submit" className="w-full sm:w-auto rounded-lg py-3 text-base group" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                : <><Wand2 className="mr-2 h-4 w-4" /> Generate Notes</>}
            </Button>
             {generatedAnswer && ( <Button type="button" variant="outline" onClick={handleReset} className="rounded-lg">Clear</Button> )}
          </div>
        </form>
      </Form>
      
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Or, try a sample university question:</h3>
        <div className="flex flex-wrap gap-2">
          {seedQuestions.map(q => (
            <Button key={q} variant="outline" size="sm" onClick={() => handleSeedQuestionClick(q)} disabled={isLoading}>
              {q}
            </Button>
          ))}
        </div>
      </div>

      {error && <Alert variant="destructive" className="rounded-lg"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

      {generatedAnswer && (
        <Card className="shadow-md rounded-xl mt-6 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Updating...</span>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><FileText className="h-6 w-6 text-primary" />Structured Notes: {form.getValues("topic")}</CardTitle>
            <CardDescription>AI-generated structured notes for your exam preparation.</CardDescription>
          </CardHeader>
          <CardContent>
            {generatedAnswer.summaryPoints && generatedAnswer.summaryPoints.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-semibold text-lg text-primary mb-2">Key Summary Points</h3>
                    <ul className="space-y-1.5 list-disc list-inside bg-primary/10 p-4 rounded-lg text-primary-foreground">
                        {generatedAnswer.summaryPoints.map((point, index) => (
                            <li key={index} className="text-sm text-foreground">{point}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-1">
                    <h4 className="font-semibold mb-2">Notes Breakdown:</h4>
                    <ScrollArea className="h-[400px] p-1 border bg-background rounded-lg">
                        <div className="p-4">
                            <MarkdownRenderer content={generatedAnswer.notes} />
                        </div>
                    </ScrollArea>
                </div>
                 <div className="lg:col-span-1">
                    <h4 className="font-semibold mb-2">Diagram / Flowchart:</h4>
                     <ScrollArea className="h-[400px] p-1 border bg-background rounded-lg">
                        <div className="p-4 text-sm">
                           {generatedAnswer.diagram ? (
                                <>
                                <Alert className="mb-2"><AlertDescription>Copy this code into a Mermaid.js renderer to view the diagram.</AlertDescription></Alert>
                                <pre className="p-2 bg-muted rounded-md overflow-x-auto"><code>{generatedAnswer.diagram}</code></pre>
                                </>
                           ) : <p className="text-muted-foreground">No diagram was generated for this topic.</p>}
                        </div>
                    </ScrollArea>
                 </div>
            </div>
          </CardContent>
           <CardFooter className="p-4 border-t flex flex-col items-start gap-4">
              <Button onClick={handleSaveToLibrary} disabled={!user}>
                <Save className="mr-2 h-4 w-4"/> Save to Library
              </Button>
               {generatedAnswer.nextSteps && generatedAnswer.nextSteps.length > 0 && (
                <div className="w-full">
                    <h4 className="font-semibold text-md mb-2 text-primary">Recommended Next Steps:</h4>
                    <div className="flex flex-wrap gap-2">
                        {generatedAnswer.nextSteps.map((step, index) => (
                            <Button key={index} variant="outline" size="sm" asChild>
                                <Link href={`/medico?tool=${step.tool}&topic=${encodeURIComponent(step.topic)}`}>
                                    {step.reason} <ArrowRight className="ml-2 h-4 w-4"/>
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                )}
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
