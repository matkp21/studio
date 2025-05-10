// src/components/homepage/image-processing-mode.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ImageUploader } from '@/components/image-analyzer/image-uploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ImageOff, ScanEye, Sparkles, BookOpen, TestTubeDiagonal } from 'lucide-react';
import type { AnalyzeImageOutput } from '@/ai/flows/image-analyzer';
import { useProMode } from '@/contexts/pro-mode-context';

export function ImageProcessingMode() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { isProMode, userRole } = useProMode();

  const handleAnalysisComplete = (result: AnalyzeImageOutput | null, imageUrl?: string, err?: string) => {
    setAnalysisResult(result);
    setUploadedImage(imageUrl || null);
    setError(err || null);
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 fade-in">
      <Card className="shadow-lg border-border/50 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Upload Image</CardTitle>
          <CardDescription>Upload a medical image (e.g., X-ray) for AI-powered annotation. For educational/research use.</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploader onAnalysisComplete={handleAnalysisComplete} setIsLoading={setIsLoading} />
        </CardContent>
      </Card>

      <Card className="shadow-lg border-border/50 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Analysis & Annotations</CardTitle>
          <CardDescription>AI-generated insights. Not a substitute for professional medical advice.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex flex-col justify-center">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              <p className="text-sm">Analyzing image...</p>
            </div>
          )}
          {error && !isLoading && (
            <Alert variant="destructive" className="rounded-lg">
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && (
            <div className="space-y-4 fade-in">
              {uploadedImage && (
                <div className="mb-4 border border-border/30 rounded-lg overflow-hidden aspect-video relative bg-muted/50">
                  <Image src={uploadedImage} alt="Uploaded medical scan" layout="fill" objectFit="contain" data-ai-hint="medical scan" />
                </div>
              )}
              {analysisResult && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground flex items-center">
                    <ScanEye className="mr-2 h-5 w-5 text-primary"/>
                    Annotations:
                  </h3>
                  <p className="text-sm bg-secondary/50 p-4 rounded-lg text-secondary-foreground whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {analysisResult.annotations}
                  </p>
                </div>
              )}
              {isProMode && userRole === 'pro' && analysisResult && (
                <Alert variant="default" className="mt-4 border-primary/50 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <AlertTitle className="text-primary font-semibold">Pro Mode Active</AlertTitle>
                  <AlertDescription className="text-primary/80">
                    Advanced clinical annotations, detailed JSON data, and further analytical tools would be available.
                  </AlertDescription>
                </Alert>
              )}
              {userRole === 'medico' && analysisResult && (
                <Alert variant="default" className="mt-4 border-sky-500/50 bg-sky-500/10 rounded-lg">
                  <TestTubeDiagonal className="h-5 w-5 text-sky-600" />
                  <AlertTitle className="text-sky-700 dark:text-sky-500 font-semibold">Medico Study Focus: Image Analysis</AlertTitle>
                  <AlertDescription className="text-sky-600/80 dark:text-sky-500/80">
                    Study image annotations to learn radiological signs and pathological changes. Correlate findings with clinical knowledge. Try the Interactive Anatomy Visualizer in chat: `/anatomy &lt;structure&gt;`
                  </AlertDescription>
                </Alert>
              )}
              {!uploadedImage && !analysisResult && (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <ImageOff className="h-12 w-12 mb-3 text-muted-foreground/70" />
                  <p>Upload an image to see analysis and annotations.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
