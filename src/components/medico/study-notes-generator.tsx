
// src/components/medico/study-notes-generator.tsx
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
import { Loader2, BookOpen, Wand2 } from 'lucide-react';
import { generateStudyNotes, type MedicoStudyNotesInput, type MedicoStudyNotesOutput } from '@/ai/flows/medico/study-notes-flow';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).max(100, {message: "Topic too long."}),
});

type StudyNotesFormValues = z.infer<typeof formSchema>;

export function StudyNotesGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<MedicoStudyNotesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<StudyNotesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  const onSubmit: SubmitHandler<StudyNotesFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedNotes(null);
    setError(null);

    try {
      const result = await generateStudyNotes(data as MedicoStudyNotesInput);
      setGeneratedNotes(result);
      toast({
        title: "Study Notes Generated!",
        description: `Notes for "${data.topic}" are ready.`,
      });
    } catch (err) {
      console.error("Study notes generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        title: "Generation Failed",
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
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="topic-notes" className="text-base">Medical Topic</FormLabel>
                <FormControl>
                  <Input
                    id="topic-notes"
                    placeholder="e.g., Diabetes Mellitus, Thalassemia Major"
                    className="rounded-lg text-base py-2.5 border-border/70 focus:border-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full sm:w-auto rounded-lg py-3 text-base group" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Generate Notes
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

      {generatedNotes && (
        <Card className="shadow-md rounded-xl mt-6 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Study Notes: {form.getValues("topic")}
            </CardTitle>
            <CardDescription>AI-generated notes for your revision.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] p-1 border bg-background rounded-lg">
                <div className="p-4 whitespace-pre-wrap text-sm prose prose-sm dark:prose-invert max-w-none">
                    {generatedNotes.notes}
                </div>
            </ScrollArea>
            {generatedNotes.summaryPoints && generatedNotes.summaryPoints.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-md mb-2 text-primary">Key Summary Points:</h4>
                <ul className="list-disc list-inside ml-4 space-y-1 text-sm bg-secondary/50 p-3 rounded-md">
                  {generatedNotes.summaryPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


    