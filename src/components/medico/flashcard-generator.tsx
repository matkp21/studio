
// src/components/medico/flashcard-generator.tsx
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Layers, Wand2, ArrowLeftRight, CheckCircle, XCircle } from 'lucide-react';
import { generateFlashcards, type MedicoFlashcardGeneratorInput, type MedicoFlashcardGeneratorOutput, type MedicoFlashcard } from '@/ai/flows/medico/flashcard-generator-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).max(100, { message: "Topic too long." }),
  count: z.coerce.number().int().min(1, { message: "Minimum 1 flashcard." }).max(20, { message: "Maximum 20 flashcards." }).default(10),
});

type FlashcardFormValues = z.infer<typeof formSchema>;

interface FlashcardDisplay extends MedicoFlashcard {
  id: string;
  isFlipped: boolean;
  status?: 'new' | 'learning' | 'mastered';
}

export function FlashcardGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<FlashcardDisplay[] | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      count: 10,
    },
  });

  const onSubmit: SubmitHandler<FlashcardFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedFlashcards(null);
    setCurrentTopic(data.topic);
    setError(null);

    try {
      const result: MedicoFlashcardGeneratorOutput = await generateFlashcards(data as MedicoFlashcardGeneratorInput);
      const displayFlashcards = result.flashcards.map((fc, index) => ({
        ...fc,
        id: `${data.topic}-${index}-${Date.now()}`,
        isFlipped: false,
        status: 'new' as 'new',
      }));
      setGeneratedFlashcards(displayFlashcards);
      toast({
        title: "Flashcards Generated!",
        description: `${result.flashcards.length} flashcards for "${data.topic}" are ready.`,
      });
    } catch (err) {
      console.error("Flashcard generation error:", err);
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

  const flipCard = (id: string) => {
    setGeneratedFlashcards(prev =>
      prev?.map(card =>
        card.id === id ? { ...card, isFlipped: !card.isFlipped } : card
      ) || null
    );
  };
  
  const markCardStatus = (id: string, status: 'learning' | 'mastered') => {
     setGeneratedFlashcards(prev =>
      prev?.map(card =>
        card.id === id ? { ...card, status: status, isFlipped: false } : card // auto-flip back
      ) || null
    );
  }


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
                  <FormLabel htmlFor="topic-flashcard" className="text-base">Medical Topic</FormLabel>
                  <FormControl>
                    <Input
                      id="topic-flashcard"
                      placeholder="e.g., Antibiotics, Cranial Nerves"
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
                  <FormLabel htmlFor="count-flashcard" className="text-base">Number of Cards</FormLabel>
                  <FormControl>
                    <Input
                      id="count-flashcard"
                      type="number"
                      min="1"
                      max="20"
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
                Generate Flashcards
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

      {generatedFlashcards && currentTopic && (
        <Card className="shadow-md rounded-xl mt-6 border-blue-500/30 bg-gradient-to-br from-card via-card to-blue-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Layers className="h-6 w-6 text-blue-600" />
              Flashcards: {currentTopic}
            </CardTitle>
            <CardDescription>Click a card to flip it. Mark your progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] p-1 border bg-background rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {generatedFlashcards.map((card) => (
                  <Card 
                    key={card.id} 
                    className={cn(
                        "min-h-[200px] flex flex-col justify-between cursor-pointer shadow-md rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105",
                        card.status === 'mastered' && 'border-green-500 bg-green-500/10',
                        card.status === 'learning' && 'border-yellow-500 bg-yellow-500/10',
                        card.isFlipped && 'bg-secondary'
                    )}
                  >
                    <CardContent 
                        className="flex-grow flex items-center justify-center p-4 text-center"
                        onClick={() => flipCard(card.id)}
                    >
                      <p className="text-sm md:text-base text-foreground">
                        {card.isFlipped ? card.back : card.front}
                      </p>
                    </CardContent>
                    <CardFooter className="p-2 border-t bg-muted/50 flex justify-between items-center">
                        <Button variant="ghost" size="sm" onClick={() => flipCard(card.id)} className="text-xs hover:bg-primary/10">
                            <ArrowLeftRight className="mr-1 h-3 w-3" /> Flip
                        </Button>
                        <div className="space-x-1">
                             <Button variant={card.status === 'learning' ? "default" : "outline"} size="iconSm" onClick={() => markCardStatus(card.id, 'learning')} className="text-xs border-yellow-500 text-yellow-600 hover:bg-yellow-500/20 h-7 w-7">
                                <XCircle className="h-4 w-4" />
                            </Button>
                            <Button variant={card.status === 'mastered' ? "default" : "outline"} size="iconSm" onClick={() => markCardStatus(card.id, 'mastered')} className="text-xs border-green-500 text-green-600 hover:bg-green-500/20 h-7 w-7">
                                <CheckCircle className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
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

