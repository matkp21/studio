
// src/components/homepage/educational-support-mode.tsx
"use client";

import { useState } from 'react';
import { GuidelineQueryForm } from '@/components/guideline-retrieval/guideline-query-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Info, BookMarked, School, PencilRuler, Sparkles } from 'lucide-react'; 
import type { GuidelineRetrievalOutput } from '@/ai/flows/guideline-retrieval';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProMode } from '@/contexts/pro-mode-context';

export function EducationalSupportMode() {
  const [retrievalResult, setRetrievalResult] = useState<GuidelineRetrievalOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userRole } = useProMode();

  const handleRetrievalComplete = (result: GuidelineRetrievalOutput | null, err?: string) => {
    setRetrievalResult(result);
    setError(err || null);
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 fade-in">
      <Card className="shadow-lg border-border/50 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Query Guidelines</CardTitle>
          <CardDescription>
            Search for clinical guidelines or educational material on medical topics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GuidelineQueryForm onRetrievalComplete={handleRetrievalComplete} setIsLoading={setIsLoading} isLoading={isLoading} />
        </CardContent>
      </Card>

      <Card className="shadow-lg border-border/50 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Retrieved Information</CardTitle>
          <CardDescription>
            Relevant information based on your query. Always cross-reference with official sources.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex flex-col justify-center">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              <p className="text-sm">Retrieving information...</p>
            </div>
          )}
          {error && !isLoading && (
            <Alert variant="destructive" className="rounded-lg">
              <AlertTitle>Retrieval Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {retrievalResult && !isLoading && !error && (
            <div className="space-y-3 fade-in">
              <h3 className="font-semibold text-lg text-foreground flex items-center">
                <BookMarked className="mr-2 h-5 w-5 text-primary" />
                Guidelines & Information:
              </h3>
              <ScrollArea className="h-72">
                <div className="bg-secondary/50 p-4 rounded-lg text-secondary-foreground whitespace-pre-wrap">
                  {retrievalResult.guidelines}
                </div>
              </ScrollArea>
            </div>
          )}
           {userRole === 'medico' && (
            <Alert variant="default" className="my-4 border-sky-500/50 bg-sky-500/10 rounded-lg">
              <PencilRuler className="h-5 w-5 text-sky-600" />
              <AlertTitle className="text-sky-700 dark:text-sky-500 font-semibold">Medico Study Tools Available!</AlertTitle>
              <AlertDescription className="text-sky-600/80 dark:text-sky-500/80">
                Enhance your learning:
                <ul className="list-disc pl-5 mt-1 text-xs">
                  <li>Generate study notes: <code>/notes &lt;topic&gt;</code> in chat.</li>
                  <li>Practice with MCQs: <code>/mcq &lt;topic&gt; [num]</code> in chat.</li>
                  <li>More tools like Flashcards, Mnemonics, and Case Sims are planned!</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
          {!isLoading && !retrievalResult && !error && userRole !== 'medico' && ( // Hide if medico alert is shown
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Info className="h-12 w-12 mb-3 text-muted-foreground/70" />
              <p>Information will appear here once a query is submitted.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
