// src/components/homepage/symptom-analysis-mode.tsx
"use client";

import { useState } from 'react';
import { SymptomForm } from '@/components/symptom-analyzer/symptom-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ListChecks, Sparkles, BookOpen } from 'lucide-react'; // Added BookOpen for medico mode
import type { SymptomAnalyzerOutput } from '@/ai/flows/symptom-analyzer-flow';
import { useProMode } from '@/contexts/pro-mode-context'; 

export function SymptomAnalysisMode() {
  const [analysisResult, setAnalysisResult] = useState<SymptomAnalyzerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isProMode, userRole } = useProMode(); 

  const handleAnalysisComplete = (result: SymptomAnalyzerOutput | null, err?: string) => {
    setAnalysisResult(result);
    setError(err || null);
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 fade-in">
      <Card className="shadow-lg border-border/50 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Enter Symptoms</CardTitle>
          <CardDescription>Describe the symptoms. Our AI will provide potential insights. Not for self-diagnosis.</CardDescription>
        </CardHeader>
        <CardContent>
          <SymptomForm onAnalysisComplete={handleAnalysisComplete} setIsLoading={setIsLoading} isLoading={isLoading} />
        </CardContent>
      </Card>

      <Card className="shadow-lg border-border/50 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Analysis Results</CardTitle>
          <CardDescription>Potential diagnoses based on symptoms. Always consult a medical professional.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[250px] flex flex-col justify-center">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              <p className="text-sm">Analyzing symptoms...</p>
            </div>
          )}
          {error && !isLoading && (
            <Alert variant="destructive" className="rounded-lg">
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {analysisResult && !isLoading && !error && (
            <div className="space-y-3 fade-in">
              <h3 className="font-semibold text-lg text-foreground flex items-center">
                <ListChecks className="mr-2 h-5 w-5 text-primary" />
                Potential Considerations:
              </h3>
              {analysisResult.diagnoses.length > 0 ? (
                <ul className="list-disc list-inside bg-secondary/50 p-4 rounded-lg space-y-1">
                  {analysisResult.diagnoses.map((diagnosis, index) => (
                    <li key={index} className="text-secondary-foreground">{diagnosis}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No specific considerations could be determined based on the input.</p>
              )}
              {isProMode && userRole === 'pro' && (
                <Alert variant="default" className="mt-4 border-primary/50 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <AlertTitle className="text-primary font-semibold">Pro Mode Active</AlertTitle>
                  <AlertDescription className="text-primary/80">
                    Detailed JSON output and advanced analysis would be available for clinicians.
                  </AlertDescription>
                </Alert>
              )}
              {userRole === 'medico' && (
                 <Alert variant="default" className="mt-4 border-sky-500/50 bg-sky-500/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-sky-600" />
                  <AlertTitle className="text-sky-700 dark:text-sky-500 font-semibold">Medico Study Mode</AlertTitle>
                  <AlertDescription className="text-sky-600/80 dark:text-sky-500/80">
                    Access learning-focused analysis, differential diagnosis examples, and case study insights.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          {!isLoading && !analysisResult && !error && (
            <p className="text-muted-foreground text-center">
              Results will appear here once symptoms are submitted.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}