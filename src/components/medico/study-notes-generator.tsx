
// src/components/medico/study-notes-generator.tsx
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
import { Loader2, BookOpen, Wand2 } from 'lucide-react';
import { generateStudyNotes, type MedicoStudyNotesInput, type MedicoStudyNotesOutput } from '@/ai/agents/medico/StudyNotesAgent';
import { useToast } from '@/hooks/use-toast';
import { useAiAgent } from '@/hooks/use-ai-agent';
import { useProMode } from '@/contexts/pro-mode-context';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).max(100, {message: "Topic too long."}),
});

type StudyNotesFormValues = z.infer<typeof formSchema>;

export function StudyNotesGenerator() {
  const { toast } = useToast();
  const { user } = useProMode(); // Get the authenticated user
  const { execute: runGenerateNotes, data: generatedNotes, isLoading, error, reset } = useAiAgent(generateStudyNotes, {
     onSuccess: async (data, input) => {
      toast({
          title: "Study Notes Generated!",
          description: `Notes for "${input.topic}" are ready.`
      });
      if (user) {
        try {
          const libraryRef = collection(firestore, `users/${user.uid}/studyLibrary`);
          await addDoc(libraryRef, {
            type: 'notes',
            topic: input.topic,
            notes: data.notes,
            summaryPoints: data.summaryPoints,
            createdAt: serverTimestamp(),
          });
          toast({
            title: "Saved to Library",
            description: "Your generated notes have been saved.",
          });
        } catch (firestoreError) {
          console.error("Firestore save error:", firestoreError);
          toast({
            title: "Save Failed",
            description: "Could not save notes to your library.",
            variant: "destructive",
          });
        }
      }
    }
  });


  const form = useForm<StudyNotesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });
  
  // When form is reset, also reset the AI agent's state
  const handleReset = () => {
    form.reset();
    reset();
  }

  const onSubmit: SubmitHandler<StudyNotesFormValues> = async (data) => {
    await runGenerateNotes(data);
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
                    Generate Notes
                </>
                )}
            </Button>
             {generatedNotes && (
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

      {generatedNotes && !isLoading && (
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
