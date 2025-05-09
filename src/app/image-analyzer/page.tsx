"use client";

import { useState } from 'react';
import Image from 'next/image';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { ImageUploader } from '@/components/image-analyzer/image-uploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ImageOff } from 'lucide-react';
import type { AnalyzeImageOutput } from '@/ai/flows/image-analyzer';

export default function ImageAnalyzerPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleAnalysisComplete = (result: AnalyzeImageOutput | null, imageUrl?: string, err?: string) => {
    setAnalysisResult(result);
    setUploadedImage(imageUrl || null);
    setError(err || null);
    setIsLoading(false);
  };

  return (
    <PageWrapper title="Medical Image Analyzer">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Upload a medical image (e.g., X-ray, CT scan) for AI-powered annotation.</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader onAnalysisComplete={handleAnalysisComplete} setIsLoading={setIsLoading} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Analysis & Annotations</CardTitle>
            <CardDescription>AI-generated annotations will appear here. This is not a substitute for professional medical advice.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Analyzing image...</p>
              </div>
            )}
            {error && !isLoading && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!isLoading && !error && (
              <>
                {uploadedImage && (
                  <div className="mb-4 border rounded-md overflow-hidden aspect-video relative bg-muted">
                    <Image src={uploadedImage} alt="Uploaded medical scan" layout="fill" objectFit="contain" data-ai-hint="medical scan" />
                  </div>
                )}
                {analysisResult && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Annotations:</h3>
                    <p className="text-sm bg-secondary p-4 rounded-md text-secondary-foreground whitespace-pre-wrap">
                      {analysisResult.annotations}
                    </p>
                  </div>
                )}
                {!uploadedImage && !analysisResult && (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ImageOff className="h-12 w-12 mb-2" />
                    <p>Upload an image to see analysis and annotations.</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
