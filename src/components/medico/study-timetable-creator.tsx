// src/components/medico/study-timetable-creator.tsx
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, CalendarDays, Wand2 } from 'lucide-react';
import { createStudyTimetable, type MedicoStudyTimetableInput, type MedicoStudyTimetableOutput } from '@/ai/agents/medico/StudyTimetableCreatorAgent';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea

const formSchema = z.object({
  examName: z.string().min(3, { message: "Exam name must be at least 3 characters." }).max(100, { message: "Exam name too long."}),
  examDate: z.date({ required_error: "Exam date is required." }),
  subjects: z.string().min(1, { message: "At least one subject is required."}),
  studyHoursPerWeek: z.coerce.number().int().min(1, {message: "Minimum 1 hour."}).max(100, {message: "Maximum 100 hours."}).default(20),
  weakSubjects: z.string().optional(), // Now a string for free-text input
});

type TimetableFormValues = z.infer<typeof formSchema>;

export function StudyTimetableCreator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState<MedicoStudyTimetableOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<TimetableFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examName: "",
      examDate: undefined,
      subjects: "",
      studyHoursPerWeek: 20,
      weakSubjects: "",
    },
  });

  const onSubmit: SubmitHandler<TimetableFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedTimetable(null);
    setError(null);

    try {
      // Convert data to match the agent's expected input schema
      const formattedData: MedicoStudyTimetableInput = {
        examName: data.examName,
        examDate: data.examDate.toISOString().split('T')[0], 
        subjects: data.subjects.split(',').map(s => s.trim()).filter(Boolean),
        studyHoursPerWeek: data.studyHoursPerWeek,
        weakSubjects: data.weakSubjects || undefined,
      };
      const result = await createStudyTimetable(formattedData);
      setGeneratedTimetable(result);
      toast({
        title: "Timetable Generated!",
        description: `Study timetable for "${data.examName}" is ready.`,
      });
    } catch (err) {
      console.error("Timetable generation error:", err);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="examName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="examName-timetable" className="text-base">Exam Name</FormLabel>
                  <FormControl>
                    <Input
                      id="examName-timetable"
                      placeholder="e.g., Final MBBS Prof"
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
              name="examDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="examDate-timetable" className="text-base">Exam Date</FormLabel>
                  <FormControl>
                     <DatePicker 
                        date={field.value} 
                        setDate={(date) => field.onChange(date)} 
                        buttonId="examDate-timetable"
                        buttonClassName="w-full rounded-lg py-2.5 border-border/70 focus:border-primary"
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="subjects"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="subjects-timetable" className="text-base">Subjects (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    id="subjects-timetable"
                    placeholder="e.g., Surgery, Pediatrics, Medicine"
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
            name="weakSubjects"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="weakSubjects-timetable" className="text-base">Weaker Subjects / Areas to Focus On (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    id="weakSubjects-timetable"
                    placeholder="e.g., Struggling with Cardiology pharmacology, find ECG interpretation difficult, scored low on renal physiology quizzes."
                    className="rounded-lg text-base py-2.5 border-border/70 focus:border-primary min-h-[100px]"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>Provide context on your weak areas. The AI will use this to create a more focused plan.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studyHoursPerWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="studyHours-timetable" className="text-base">Study Hours Per Week</FormLabel>
                <FormControl>
                  <Input
                    id="studyHours-timetable"
                    type="number"
                    min="1"
                    max="100"
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
                <Wand2 className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-6" />
                Create Timetable
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

      {generatedTimetable && (
        <Card className="shadow-md rounded-xl mt-6 border-green-500/30 bg-gradient-to-br from-card via-card to-green-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-green-600" />
              Study Timetable: {form.getValues("examName")}
            </CardTitle>
            <CardDescription>Here's your personalized study plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] p-1 border bg-background rounded-lg">
              <div className="p-4 whitespace-pre-wrap text-sm prose prose-sm dark:prose-invert max-w-none">
                {generatedTimetable.timetable}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
