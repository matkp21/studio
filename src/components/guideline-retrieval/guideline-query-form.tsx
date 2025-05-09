"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { retrieveGuidelines, type GuidelineRetrievalInput, type GuidelineRetrievalOutput } from '@/ai/flows/guideline-retrieval';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  query: z.string().min(3, { message: "Query must be at least 3 characters long." }),
});

type GuidelineQueryFormValues = z.infer<typeof formSchema>;

interface GuidelineQueryFormProps {
  onRetrievalComplete: (result: GuidelineRetrievalOutput | null, error?: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export function GuidelineQueryForm({ onRetrievalComplete, setIsLoading }: GuidelineQueryFormProps) {
  const { toast } = useToast();
  const form = useForm<GuidelineQueryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const onSubmit: SubmitHandler<GuidelineQueryFormValues> = async (data) => {
    setIsLoading(true);
    onRetrievalComplete(null); 

    try {
      const result = await retrieveGuidelines(data as GuidelineRetrievalInput);
      onRetrievalComplete(result);
      toast({
        title: "Guideline Retrieval Complete",
        description: "Guidelines retrieved successfully.",
      });
    } catch (error) {
      console.error("Guideline retrieval error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during guideline retrieval.";
      onRetrievalComplete(null, errorMessage);
      toast({
        title: "Retrieval Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="guideline-query-input">Medical Condition or Treatment</FormLabel>
              <FormControl>
                <Input
                  id="guideline-query-input"
                  placeholder="e.g., 'treatment for type 2 diabetes', 'management of asthma'"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          Retrieve Guidelines
        </Button>
      </form>
    </Form>
  );
}
