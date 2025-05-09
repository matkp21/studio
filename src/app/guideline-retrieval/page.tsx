"use client";

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { GuidelineQueryForm } from '@/components/guideline-retrieval/guideline-query-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Info } from 'lucide-react';
import type { GuidelineRetrievalOutput } from '@/ai/flows/guideline-retrieval';

export default function GuidelineRetrievalPage() {
  const [retrievalResult, setRetrievalResult] = useState<GuidelineRetrievalOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRetrievalComplete = (result: GuidelineRetrievalOutput | null, err?: string) => {
    setRetrievalResult(result);
    setError(err || null);
    setIsLoading(false);
  };

  return (
    <PageWrapper title="Clinical Guideline Retrieval">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Query Guidelines</CardTitle>
            <CardDescription>
              Enter a medical condition or treatment to search for relevant clinical guidelines from sources like WHO or local medical authorities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GuidelineQueryForm onRetrievalComplete={handleRetrievalComplete} setIsLoading={setIsLoading} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Retrieved Guidelines</CardTitle>
            <CardDescription>
              Relevant guidelines based on your query will be displayed here. Always consult official sources for definitive information.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Retrieving guidelines...</p>
              </div>
            )}
            {error && !isLoading && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {retrievalResult && !isLoading && !error && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Guidelines:</h3>
                <div className="bg-secondary p-4 rounded-md text-secondary-foreground whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {retrievalResult.guidelines}
                </div>
              </div>
            )}
            {!isLoading && !retrievalResult && !error && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Info className="h-12 w-12 mb-2" />
                <p>Guidelines will appear here once a query is submitted.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
