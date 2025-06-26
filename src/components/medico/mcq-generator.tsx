
// src/components/medico/mcq-generator.tsx
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
import { Loader2, HelpCircle, Wand2 } from 'lucide-react';
import { generateMCQs, type MedicoMCQGeneratorInput, type MedicoMCQGeneratorOutput, type MCQSchema } from '@/ai/agents/medico/MCQGeneratorAgent';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).max(100, {message: "Topic too long."}),
  count: z.coerce.number().int().min(1, {message: "Minimum 1 MCQ."}).max(10, {message: "Maximum 10 MCQs."}).default(5),
});

type McqFormValues = z.infer<typeof formSchema>;

export function McqGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMcqs, setGeneratedMcqs] = useState<MedicoMCQGeneratorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<McqFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      count: 5,
    },
  });

  const onSubmit: SubmitHandler<McqFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedMcqs(null);
    setError(null);

    try {
      const result = await generateMCQs(data as MedicoMCQGeneratorInput);
      setGeneratedMcqs(result);
      toast({
        title: "MCQs Generated!",
        description: `${result.mcqs.length} MCQs for "${data.topic}" are ready.`,
      });
    } catch (err) {
      console.error("MCQ generation error:", err);
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel htmlFor="topic-mcq" className="text-base">Medical Topic</FormLabel>
                  <FormControl>
                    <Input
                      id="topic-mcq"
                      placeholder="e.g., Cardiology, Hypertension"
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
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="count-mcq" className="text-base">Number of MCQs</FormLabel>
                  <FormControl>
                    <Input
                      id="count-mcq"
                      type="number"
                      min="1"
                      max="10"
                      className="rounded-lg text-base py-2.5 border-border/70 focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto rounded-lg py-3 text-base group" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                Generate MCQs
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

      {generatedMcqs && (
        <Card className="shadow-md rounded-xl mt-6 border-accent/30 bg-gradient-to-br from-card via-card to-accent/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-accent" />
              MCQs: {generatedMcqs.topicGenerated}
            </CardTitle>
            <CardDescription>Test your knowledge with these AI-generated questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] p-1 border bg-background rounded-lg">
              <div className="space-y-4 p-4">
                {generatedMcqs.mcqs.map((mcq, index) => (
                  <Card key={index} className="p-4 bg-card/80 shadow-sm rounded-lg">
                    <p className="font-semibold mb-2 text-foreground">Q{index + 1}: {mcq.question}</p>
                    <ul className="space-y-1.5 text-sm">
                      {mcq.options.map((opt, optIndex) => (
                        <li 
                          key={optIndex} 
                          className={cn(
                            "p-2 border rounded-md transition-colors",
                            opt.isCorrect ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-medium" : "border-border hover:bg-muted/50"
                          )}
                        >
                          {String.fromCharCode(65 + optIndex)}. {opt.text}
                        </li>
                      ))}
                    </ul>
                    {mcq.explanation && (
                      <p className="text-xs mt-3 text-muted-foreground italic border-t pt-2">
                        <span className="font-semibold">Explanation:</span> {mcq.explanation}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
