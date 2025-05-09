"use client";

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { SymptomForm } from '@/components/symptom-analyzer/symptom-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import type { SymptomAnalyzerOutput } from '@/ai/flows/symptom-analyzer';

export default function SymptomAnalyzerPage() {
  const [analysisResult, setAnalysisResult] = useState<SymptomAnalyzerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisComplete = (result: SymptomAnalyzerOutput | null, err?: string) => {
    setAnalysisResult(result);
    setError(err || null);
    setIsLoading(false);
  };

  return (
    <PageWrapper title="Symptom Analyzer">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Enter Symptoms</CardTitle>
            <CardDescription>Describe the symptoms you are experiencing. Our AI will provide potential insights.</CardDescription>
          </CardHeader>
          <CardContent>
            <SymptomForm onAnalysisComplete={handleAnalysisComplete} setIsLoading={setIsLoading} />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>Potential diagnoses based on the provided symptoms. This is not a substitute for professional medical advice.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Analyzing symptoms...</p>
              </div>
            )}
            {error && !isLoading && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {analysisResult && !isLoading && !error && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Potential Diagnoses:</h3>
                {analysisResult.diagnoses.length > 0 ? (
                  <ul className="list-disc list-inside bg-secondary p-4 rounded-md">
                    {analysisResult.diagnoses.map((diagnosis, index) => (
                      <li key={index} className="text-secondary-foreground">{diagnosis}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No specific diagnoses could be determined based on the input.</p>
                )}
              </div>
            )}
            {!isLoading && !analysisResult && !error && (
              <p className="text-muted-foreground text-center h-40 flex items-center justify-center">
                Results will appear here once symptoms are submitted.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
