'use server';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Microscope, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAiAgent } from '@/hooks/use-ai-agent';
import { getMicrobeInfo, type MicroMateInput, type MicroMateOutput } from '@/ai/agents/medico/MicroMateAgent';

const formSchema = z.object({
  microorganism: z.string().min(3, { message: "Microorganism name must be at least 3 characters." }),
});
type MicroMateFormValues = z.infer<typeof formSchema>;

export function MicroMate() {
  const { toast } = useToast();
  const { execute: runGetMicrobeInfo, data: microbeData, isLoading, error, reset } = useAiAgent(getMicrobeInfo, {
    onSuccess: (data, input) => {
      toast({
        title: "Microbe Info Ready!",
        description: `Information for "${input.microorganism}" has been generated.`,
      });
    },
  });

  const form = useForm<MicroMateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { microorganism: "" },
  });

  const onSubmit: SubmitHandler<MicroMateFormValues> = async (data) => {
    await runGetMicrobeInfo(data as MicroMateInput);
  };

  const handleReset = () => {
    form.reset();
    reset();
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
          <FormField
            control={form.control}
            name="microorganism"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="microorganism" className="text-base">Microorganism Name</FormLabel>
                <FormControl>
                  <Input
                    id="microorganism"
                    placeholder="e.g., Staphylococcus aureus, Escherichia coli"
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
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Wand2 className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" /> Get Info</>
              )}
            </Button>
            {microbeData && (
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

      {microbeData && !isLoading && (
        <Card className="shadow-md rounded-xl mt-6 border-lime-500/30 bg-gradient-to-br from-card via-card to-lime-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Microscope className="h-6 w-6 text-lime-600" />
              Microbe Profile: {form.getValues("microorganism")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] p-1 border bg-background rounded-lg">
                <div className="p-4 space-y-4">
                    <div>
                        <h4 className="font-semibold text-md mb-1 text-lime-700 dark:text-lime-400">Key Characteristics:</h4>
                        <p className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">{microbeData.characteristics}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-md mb-1 text-lime-700 dark:text-lime-400">Virulence Factors:</h4>
                        <p className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">{microbeData.virulenceFactors}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-md mb-1 text-lime-700 dark:text-lime-400">Diseases Caused:</h4>
                        <p className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">{microbeData.diseasesCaused}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-md mb-1 text-lime-700 dark:text-lime-400">Lab Diagnosis:</h4>
                        <p className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">{microbeData.labDiagnosis}</p>
                    </div>
                </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
