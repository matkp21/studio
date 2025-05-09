"use client";

import { useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { analyzeImage, type AnalyzeImageInput, type AnalyzeImageOutput } from '@/ai/flows/image-analyzer';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploaderProps {
  onAnalysisComplete: (result: AnalyzeImageOutput | null, imageUrl?: string, error?: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export function ImageUploader({ onAnalysisComplete, setIsLoading }: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Basic validation for image types
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a valid image file (e.g., JPG, PNG, DICOM-as-image).",
          variant: "destructive",
        });
        clearSelection();
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById('image-upload-input') as HTMLInputElement;
    if (fileInput) fileInput.value = ""; // Reset file input
    onAnalysisComplete(null, undefined); // Clear previous results in parent
  };

  const handleSubmit = async () => {
    if (!selectedFile || !previewUrl) {
      toast({
        title: "No Image Selected",
        description: "Please select an image file to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    onAnalysisComplete(null, previewUrl); // Show preview while loading

    try {
      const imageDataUri = previewUrl; // Already in data URI format
      const input: AnalyzeImageInput = { imageDataUri };
      const result = await analyzeImage(input);
      onAnalysisComplete(result, imageDataUri);
      toast({
        title: "Image Analysis Complete",
        description: "Annotations generated successfully.",
      });
    } catch (error) {
      console.error("Image analysis error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during image analysis.";
      onAnalysisComplete(null, previewUrl, errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="image-upload-input" className="mb-2 block">Upload Medical Image</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="image-upload-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
        </div>
      </div>

      {previewUrl && (
        <div className="space-y-4">
          <div className="relative aspect-video w-full max-w-md mx-auto border rounded-md overflow-hidden bg-muted">
            <Image src={previewUrl} alt="Selected image preview" layout="fill" objectFit="contain" data-ai-hint="medical xray" />
          </div>
          <div className="flex justify-center gap-2">
            <Button onClick={clearSelection} variant="outline" size="sm">
              <X className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
        </div>
      )}

      {!previewUrl && (
         <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg text-muted-foreground min-h-[200px]">
            <UploadCloud className="w-12 h-12 mb-2" />
            <p className="text-sm">Drag & drop an image or click to browse.</p>
            <p className="text-xs">Supports JPG, PNG, etc.</p>
        </div>
      )}

      <Button onClick={handleSubmit} disabled={!selectedFile} className="w-full">
        Analyze Image
      </Button>
    </div>
  );
}
