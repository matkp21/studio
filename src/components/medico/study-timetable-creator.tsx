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
import { Loader2, CalendarDays, Wand2, Lightbulb } from 'lucide-react';
import { createStudyTimetable, type MedicoStudyTimetableInput, type MedicoStudyTimetableOutput } from '@/ai/agents/medico/StudyTimetableCreatorAgent';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';

const formSchema = z.object({
  examName: z.string().min(3, { message: "Exam name must be at least 3 characters." }).max(100, { message: "Exam name too long."}),
  examDate: z.date({ required_error: "Exam date is required." }),
  subjects: z.string().min(1, { message: "At least one subject is required."}),
  studyHoursPerWeek: z.coerce.number().int().min(1, {message: "Minimum 1 hour."}).max(100, {message: "Maximum 100 hours."}).default(20),
  performanceContext: z.string().optional(), // New field
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
      performanceContext: "", // New field default
    },
  });

  const onSubmit: SubmitHandler<TimetableFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedTimetable(null);
    setError(null);

    try {
      const formattedData: MedicoStudyTimetableInput = {
        examName: data.examName,
        examDate: data.examDate.toISOString().split('T')[0], 
        subjects: data.subjects.split(',').map(s => s.trim()).filter(Boolean),
        studyHoursPerWeek: data.studyHoursPerWeek,
        performanceContext: data.performanceContext || undefined, // Pass new field
      };
      const result = await createStudyTimetable(formattedData);
      setGeneratedTimetable(result);
      toast({
        title: "Personalized Timetable Generated!",
        description: `Your smart study plan for "${data.examName}" is ready.`,
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
       <Alert variant="default" className="border-purple-500/50 bg-purple-500/10">
        <Lightbulb className="h-5 w-5 text-purple-600" />
        <AlertTitle className="font-semibold text-purple-700 dark:text-purple-500">Smart Planner</AlertTitle>
        <AlertDescription className="text-purple-600/90 dark:text-purple-500/90 text-xs">
          Provide your exam details and context about your performance. The AI will generate a prioritized schedule focusing on your weaker areas.
        </AlertDescription>
      </Alert>
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
                <FormLabel htmlFor="subjects-timetable" className="text-base">Subjects to Cover (comma-separated)</FormLabel>
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
            name="performanceContext"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="performanceContext-timetable" className="text-base">Performance Context / Weaker Areas (Optional)</FormLabel>
                 <FormControl>
                    <Textarea
                        id="performanceContext-timetable"
                        placeholder="e.g., 'Struggling with ECG interpretation and side effects of antiarrhythmics. Scored low on renal physiology quizzes.'"
                        className="min-h-[100px] rounded-lg text-base py-2.5 border-border/70 focus:border-primary"
                        {...field}
                    />
                </FormControl>
                <FormDescription className="text-xs">Provide details on topics you find difficult to get a more tailored plan.</FormDescription>
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
                Generate Personalized Plan
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
              Your Personalized Study Plan: {form.getValues("examName")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {generatedTimetable.performanceAnalysis && (
                 <Alert variant="default" className="border-purple-500/50 bg-purple-500/10">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                    <AlertTitle className="font-semibold text-purple-700 dark:text-purple-500">AI Planning Rationale</AlertTitle>
                    <AlertDescription className="text-purple-600/90 dark:text-purple-500/90 text-xs">
                    {generatedTimetable.performanceAnalysis}
                    </AlertDescription>
                 </Alert>
            )}
            <ScrollArea className="h-[400px] p-1 border bg-background rounded-lg">
              <div className="p-4">
                <MarkdownRenderer content={generatedTimetable.timetable} />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
