
// src/components/medico/mnemonics-generator.tsx
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
import { Loader2, Lightbulb, Wand2 } from 'lucide-react';
import { generateMnemonic, type MedicoMnemonicsGeneratorInput, type MedicoMnemonicsGeneratorOutput } from '@/ai/agents/medico/MnemonicsGeneratorAgent';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }).max(150, { message: "Topic too long."}),
});

type MnemonicFormValues = z.infer<typeof formSchema>;

export function MnemonicsGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMnemonic, setGeneratedMnemonic] = useState<MedicoMnemonicsGeneratorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<MnemonicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  const onSubmit: SubmitHandler<MnemonicFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedMnemonic(null);
    setError(null);

    try {
      const result = await generateMnemonic(data as MedicoMnemonicsGeneratorInput);
      setGeneratedMnemonic(result);
      toast({
        title: "Mnemonic Generated!",
        description: `Mnemonic for "${result.topicGenerated}" is ready.`,
      });
    } catch (err) {
      console.error("Mnemonic generation error:", err);
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
                <FormLabel htmlFor="topic-mnemonic" className="text-base">Topic or List for Mnemonic</FormLabel>
                <FormControl>
                  <Input
                    id="topic-mnemonic"
                    placeholder="e.g., Cranial Nerves, Causes of Pancreatitis"
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
                Generate Mnemonic
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

      {generatedMnemonic && (
        <Card className="shadow-md rounded-xl mt-6 border-yellow-500/30 bg-gradient-to-br from-card via-card to-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
              Mnemonic for: {generatedMnemonic.topicGenerated}
            </CardTitle>
            <CardDescription>Here's a memory aid for your topic.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-auto max-h-[400px] p-1 border bg-background rounded-lg">
                <div className="p-4 space-y-3">
                    <div>
                        <h4 className="font-semibold text-md mb-1 text-yellow-700 dark:text-yellow-400">Mnemonic:</h4>
                        <p className="text-lg font-bold text-foreground whitespace-pre-wrap">{generatedMnemonic.mnemonic}</p>
                    </div>
                    {generatedMnemonic.explanation && (
                    <div className="mt-3">
                        <h4 className="font-semibold text-md mb-1 text-yellow-700 dark:text-yellow-400">Explanation:</h4>
                        <p className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">{generatedMnemonic.explanation}</p>
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
