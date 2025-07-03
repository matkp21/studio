
// src/components/medico/solved-question-papers-viewer.tsx
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookCopy, FileText, Wand2, Loader2, FileQuestion, Pilcrow } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateExamPaper } from '@/ai/agents/medico/ExamPaperAgent';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useAiAgent } from '@/hooks/use-ai-agent';
import { useProMode } from '@/contexts/pro-mode-context';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { trackProgress } from '@/ai/agents/medico/ProgressTrackerAgent';

const formSchema = z.object({
  examType: z.string().min(3, { message: "Exam type must be at least 3 characters long." }).max(100, { message: "Exam type too long." }),
  year: z.string().optional(),
  count: z.coerce.number().int().min(1, { message: "Minimum 1 MCQ." }).max(20, { message: "Maximum 20 MCQs." }).default(10),
});

type ExamPaperFormValues = z.infer<typeof formSchema>;

export function SolvedQuestionPapersViewer() {
  const { toast } = useToast();
  const { user } = useProMode();

  const { execute: runGenerateExam, data: generatedPaper, isLoading, error, reset } = useAiAgent(generateExamPaper, {
    onSuccess: async (data, input) => {
      toast({
        title: "Mock Paper Generated!",
        description: `Exam paper for "${input.examType}" is ready.`,
      });

      if (user) {
        try {
          await addDoc(collection(firestore, `users/${user.uid}/studyLibrary`), {
            type: 'examPaper',
            topic: data.topicGenerated,
            userId: user.uid,
            mcqs: data.mcqs || [],
            essays: data.essays || [],
            createdAt: serverTimestamp(),
          });
          toast({
            title: "Saved to Library",
            description: "Your generated exam paper has been saved.",
          });
        } catch (firestoreError) {
          console.error("Firestore save error:", firestoreError);
          toast({
            title: "Save Failed",
            description: "Could not save exam paper to your library.",
            variant: "destructive",
          });
        }
      }

      // Track Progress
      try {
        const progressResult = await trackProgress({
            activityType: 'mcq_session',
            topic: `Exam Paper: ${input.examType}`
        });
        toast({
            title: "Progress Tracked!",
            description: progressResult.progressUpdateMessage
        });
      } catch (progressError) {
          console.warn("Could not track progress for exam paper generation:", progressError);
      }
    }
  });

  const form = useForm<ExamPaperFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { examType: "", year: "", count: 10 },
  });

  const onSubmit: SubmitHandler<ExamPaperFormValues> = async (data) => {
    await runGenerateExam(data);
  };

  const handleReset = () => {
    form.reset();
    reset();
  }

  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-blue-500/50 bg-blue-500/10">
        <BookCopy className="h-5 w-5 text-blue-600" />
        <AlertTitle className="font-semibold text-blue-700 dark:text-blue-500">AI-Powered Exam Generator</AlertTitle>
        <AlertDescription className="text-blue-600/90 dark:text-blue-500/90 text-xs">
          This tool uses AI to generate mock exam papers based on the specified exam type and year. It's designed for practice and to understand potential exam patterns.
        </AlertDescription>
      </Alert>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="examType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="exam-type">Exam Type</FormLabel>
                  <FormControl><Input id="exam-type" placeholder="e.g., USMLE Step 1, Final MBBS" {...field} className="rounded-lg" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="exam-year">Focus Year (Optional)</FormLabel>
                  <FormControl><Input id="exam-year" placeholder="e.g., 2023" {...field} className="rounded-lg" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="w-full sm:w-auto rounded-lg py-3 text-base group" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Paper...</> : <><Wand2 className="mr-2 h-4 w-4" /> Generate Mock Paper</>}
            </Button>
            {generatedPaper && (
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

      {generatedPaper && !isLoading && (
        <Card className="shadow-md rounded-xl mt-6 border-indigo-500/30 bg-gradient-to-br from-card via-card to-indigo-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-600" /> Mock Exam: {generatedPaper.topicGenerated}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[50vh] p-1 border bg-background rounded-lg">
              <div className="p-4 space-y-6">
                {generatedPaper.mcqs && generatedPaper.mcqs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><FileQuestion className="h-5 w-5 text-primary"/>Multiple Choice Questions</h3>
                    <div className="space-y-4">
                       {generatedPaper.mcqs.map((mcq, index) => (
                          <Card key={index} className="p-3 bg-card/80 shadow-sm rounded-lg">
                            <p className="font-medium text-sm mb-1.5">Q{index + 1}: {mcq.question}</p>
                            <ul className="space-y-1 text-xs">
                              {mcq.options.map((opt, optIndex) => (
                                <li key={optIndex} className={cn("p-1.5 border rounded-md", opt.isCorrect ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-semibold" : "border-border hover:bg-muted/50")}>
                                  {String.fromCharCode(65 + optIndex)}. {opt.text}
                                </li>
                              ))}
                            </ul>
                            <Accordion type="single" collapsible className="w-full mt-2">
                               <AccordionItem value="explanation" className="border-b-0">
                                   <AccordionTrigger className="text-xs py-1 text-muted-foreground hover:no-underline">View Explanation</AccordionTrigger>
                                   <AccordionContent className="text-xs text-muted-foreground italic pt-1">
                                      {mcq.explanation || "No explanation provided."}
                                   </AccordionContent>
                               </AccordionItem>
                           </Accordion>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
                 {generatedPaper.essays && generatedPaper.essays.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Pilcrow className="h-5 w-5 text-primary"/>Essay Questions</h3>
                     <div className="space-y-4">
                       {generatedPaper.essays.map((essay, index) => (
                          <Card key={index} className="p-3 bg-card/80 shadow-sm rounded-lg">
                            <p className="font-medium text-sm mb-1.5">Q{index + 1}: {essay.question}</p>
                             <Accordion type="single" collapsible className="w-full mt-1">
                               <AccordionItem value="outline" className="border-b-0">
                                   <AccordionTrigger className="text-xs py-1 text-muted-foreground hover:no-underline">View Answer Outline</AccordionTrigger>
                                   <AccordionContent className="text-xs text-muted-foreground italic pt-1 whitespace-pre-wrap">
                                      {essay.answer_outline || "No outline provided."}
                                   </AccordionContent>
                               </AccordionItem>
                           </Accordion>
                          </Card>
                        ))}
                    </div>
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
