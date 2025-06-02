
"use client";

import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, CameraOff, Loader2, Info, ScanEye, Wand2, Brain, BookOpen, Search } from 'lucide-react'; // Added BookOpen, Search
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { analyzeImage, type AnalyzeImageInput, type AnalyzeImageOutput } from '@/ai/flows/image-analyzer';
import { getAnatomyDescription, type MedicoAnatomyVisualizerOutput } from '@/ai/flows/medico/anatomy-visualizer-flow'; // Import anatomy flow
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogTitleComponent, DialogDescription as DialogDescriptionComponent, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Renamed DialogTitle and DialogDescription
import { ScrollArea } from '@/components/ui/scroll-area';

interface Annotation {
  id: string;
  text: string;
  position: { x: number; y: number }; 
}

interface AnnotatedImage {
  id: string;
  name: string;
  imageUrl: string;
  dataAiHint?: string; // Make dataAiHint optional as custom uploads won't have it
  annotations: Annotation[];
}

const sampleAnnotatedImages: AnnotatedImage[] = [
  {
    id: 'xray-1',
    name: 'Chest X-Ray - Sample A',
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: "medical xray",
    annotations: [
      { id: 'anno-1a', text: 'Possible nodule (Sample)', position: { x: 0.3, y: 0.4 } },
      { id: 'anno-1b', text: 'Rib', position: { x: 0.6, y: 0.5 } }, // Made one specific for anatomy lookup
    ],
  },
  {
    id: 'ct-scan-1',
    name: 'CT Scan - Sample B',
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: "medical ct scan",
    annotations: [
      { id: 'anno-2a', text: 'Liver', position: { x: 0.5, y: 0.3 } }, // Specific for anatomy lookup
    ],
  },
];

export default function ARViewerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState(true);
  const [selectedAnnotatedImage, setSelectedAnnotatedImage] = useState<AnnotatedImage | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImageDataUri, setUploadedImageDataUri] = useState<string | null>(null);
  const [arAnnotations, setArAnnotations] = useState<Annotation[]>([]);
  const { toast } = useToast();
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // State for Anatomy Detail Dialog
  const [showAnatomyDetailDialog, setShowAnatomyDetailDialog] = useState(false);
  const [selectedAnnotationTextForDetail, setSelectedAnnotationTextForDetail] = useState<string | null>(null);
  const [anatomyDetailLoading, setAnatomyDetailLoading] = useState(false);
  const [anatomyDetailData, setAnatomyDetailData] = useState<MedicoAnatomyVisualizerOutput | null>(null);
  const [anatomyDetailError, setAnatomyDetailError] = useState<string | null>(null);


  useEffect(() => {
    const getCameraPermission = async () => {
      setIsLoadingCamera(true);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Camera API Not Supported',
          description: 'Your browser does not support camera access. Please use a modern browser.',
        });
        setHasCameraPermission(false);
        setIsLoadingCamera(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use the AR viewer.',
        });
      } finally {
        setIsLoadingCamera(false);
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleImageUploadAndAnalysis = async (file: File, imageDataUri: string) => {
    setIsAnalyzingImage(true);
    setAnalysisError(null);
    const tempId = `custom-${Date.now()}`;
    const initialAnnotatedImage: AnnotatedImage = {
      id: tempId,
      name: file.name,
      imageUrl: imageDataUri,
      annotations: [{id: 'loading-anno', text: 'AI Analysis in progress...', position: {x:0.5, y:0.5}}],
    };
    setSelectedAnnotatedImage(initialAnnotatedImage);
    setArAnnotations(initialAnnotatedImage.annotations);

    try {
      const analysisInput: AnalyzeImageInput = { imageDataUri };
      const aiResult: AnalyzeImageOutput = await analyzeImage(analysisInput);
      
      const aiDrivenAnnotations: Annotation[] = aiResult.annotations.map((anno, index) => ({
        id: `ai-anno-${tempId}-${index}`,
        text: anno.text,
        position: anno.position,
      }));

      const finalAnnotatedImage: AnnotatedImage = {
        ...initialAnnotatedImage,
        annotations: aiDrivenAnnotations.length > 0 ? aiDrivenAnnotations : [{id: 'no-ai-anno', text: 'AI analysis complete. No specific points highlighted or format error.', position: {x:0.5, y:0.5}}],
      };
      
      setSelectedAnnotatedImage(finalAnnotatedImage);
      setArAnnotations(finalAnnotatedImage.annotations);
      toast({
        title: "AI Analysis Complete",
        description: `Found ${aiDrivenAnnotations.length} annotation point(s).`,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error during AI analysis.";
      setAnalysisError(errorMsg);
      toast({
        title: "AI Analysis Failed",
        description: errorMsg,
        variant: "destructive",
      });
       const errorAnnotation: Annotation = { id: 'error-anno', text: `AI Analysis Error: ${errorMsg.substring(0,50)}...`, position: {x:0.5, y:0.5}};
       setSelectedAnnotatedImage(prev => prev ? {...prev, annotations: [errorAnnotation]} : { id: tempId, name: file.name, imageUrl: imageDataUri, annotations: [errorAnnotation]});
       setArAnnotations([errorAnnotation]);
    } finally {
      setIsAnalyzingImage(false);
    }
  };


  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a valid image file.",
          variant: "destructive",
        });
        return;
      }
      setUploadedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setUploadedImageDataUri(dataUri);
        setAnalysisError(null);
        handleImageUploadAndAnalysis(file, dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSampleImage = (image: AnnotatedImage) => {
    setSelectedAnnotatedImage(image);
    setUploadedImageFile(null);
    setUploadedImageDataUri(image.imageUrl);
    setArAnnotations(image.annotations);
    setAnalysisError(null);
    setIsAnalyzingImage(false);
  };

  const handleViewAnatomyDetail = async (annotationText: string) => {
    setSelectedAnnotationTextForDetail(annotationText);
    setAnatomyDetailLoading(true);
    setAnatomyDetailData(null);
    setAnatomyDetailError(null);
    setShowAnatomyDetailDialog(true);

    try {
      const result = await getAnatomyDescription({ anatomicalStructure: annotationText });
      setAnatomyDetailData(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch anatomy details.";
      setAnatomyDetailError(errorMsg);
      toast({
        title: "Anatomy Lookup Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setAnatomyDetailLoading(false);
    }
  };

  return (
    <PageWrapper title="Augmented Reality Viewer" className="flex flex-col h-[calc(100vh-var(--header-height,8rem))]">
      <div className="grid md:grid-cols-3 gap-4 flex-1 min-h-0">
        <Card className="shadow-md md:col-span-1 h-full flex flex-col">
          <CardHeader>
            <CardTitle>AR Controls & Info</CardTitle>
            <CardDescription>
              Upload images for AI annotations or select samples. Click "Learn More" on an annotation for anatomical details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow overflow-y-auto">
            <div>
              <Label htmlFor="image-upload" className="mb-2 block">Upload Medical Image</Label>
              <Input id="image-upload" type="file" accept="image/*" onChange={handleImageFileChange} className="mb-2" />
              {uploadedImageDataUri && selectedAnnotatedImage?.id.startsWith('custom-') && (
                <div className="mt-2 p-2 border rounded-md">
                  <p className="font-semibold text-sm">Uploaded:</p>
                  <Image src={uploadedImageDataUri} alt="Uploaded preview" width={100} height={100} className="rounded-md object-contain" data-ai-hint={selectedAnnotatedImage?.dataAiHint || "medical scan"} />
                </div>
              )}
            </div>
            <div className="space-y-2">
                <Label>Select Sample Image</Label>
                {sampleAnnotatedImages.map(img => (
                    <Button key={img.id} variant={selectedAnnotatedImage?.id === img.id ? "default" : "outline"} className="w-full justify-start" onClick={() => selectSampleImage(img)}>
                        {img.name}
                    </Button>
                ))}
            </div>

            {analysisError && (
                 <Alert variant="destructive" className="mt-3">
                    <Brain className="h-5 w-5" />
                    <AlertTitle>AI Analysis Issue</AlertTitle>
                    <AlertDescription className="text-xs">{analysisError}</AlertDescription>
                 </Alert>
            )}

            {selectedAnnotatedImage && (
              <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <ScanEye className="mr-2 h-5 w-5 text-primary"/> Annotations for {selectedAnnotatedImage.name}
                </h3>
                {isAnalyzingImage && selectedAnnotatedImage.id.startsWith('custom-') && (
                    <div className="flex items-center text-sm text-muted-foreground py-2">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> AI analyzing image...
                    </div>
                )}
                {!isAnalyzingImage && selectedAnnotatedImage.annotations.length > 0 ? (
                    <ScrollArea className="max-h-32 pr-2">
                    <ul className="space-y-1.5 text-sm">
                    {selectedAnnotatedImage.annotations.map(anno => (
                        <li key={anno.id} className="flex justify-between items-center p-1.5 bg-background/70 rounded-md border border-border/30">
                            <div>
                                <p className="font-medium">{anno.text}</p>
                                <p className="text-xs text-muted-foreground">(Pos: x:{anno.position.x.toFixed(2)}, y:{anno.position.y.toFixed(2)})</p>
                            </div>
                            <Button variant="link" size="xs" onClick={() => handleViewAnatomyDetail(anno.text)} className="text-primary p-0 h-auto text-xs">
                                <Search className="mr-1 h-3 w-3"/>Learn More
                            </Button>
                        </li>
                    ))}
                    </ul>
                    </ScrollArea>
                ) : !isAnalyzingImage && (
                    <p className="text-sm text-muted-foreground">No annotations to display for this image.</p>
                )}
                 <Alert variant="default" className="mt-3 border-accent/50 bg-accent/10 rounded-lg">
                    <Wand2 className="h-5 w-5 text-accent" />
                    <AlertTitle className="text-accent font-semibold">Interactive AR & Study</AlertTitle>
                    <AlertDescription className="text-accent/80 text-xs">
                      Future: Annotations could appear interactively on the live camera. Use "Learn More" to get anatomical details.
                    </AlertDescription>
                  </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md md:col-span-2 h-full flex flex-col relative overflow-hidden">
          <CardHeader>
            <CardTitle>Live AR View</CardTitle>
            <CardDescription>Camera feed with overlaid annotations. Click an annotation to learn more.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center bg-muted/30 relative">
            {isLoadingCamera && (
              <div className="flex flex-col items-center text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p>Initializing camera...</p>
              </div>
            )}
            {hasCameraPermission === false && !isLoadingCamera && (
              <Alert variant="destructive" className="w-full max-w-md">
                <CameraOff className="h-5 w-5" />
                <AlertTitle>Camera Access Denied</AlertTitle>
                <AlertDescription>
                  MediAssistant needs camera access to display the AR view. 
                  Please enable camera permissions in your browser settings and refresh the page.
                </AlertDescription>
              </Alert>
            )}
            
            <video 
                ref={videoRef} 
                className={cn(
                    "absolute inset-0 w-full h-full object-cover rounded-b-xl",
                    hasCameraPermission === true && !isLoadingCamera ? "block" : "hidden"
                )} 
                autoPlay 
                muted 
                playsInline 
            />

             {!isLoadingCamera && hasCameraPermission === null && ( 
                 <Alert variant="destructive" className="w-full max-w-md">
                    <Info className="h-5 w-5"/>
                    <AlertTitle>Camera Status Unknown</AlertTitle>
                    <AlertDescription>Could not determine camera status. Please try refreshing.</AlertDescription>
                 </Alert>
             )}
             
            {hasCameraPermission && !isLoadingCamera && arAnnotations.length > 0 && (
              <div className="absolute inset-0"> {/* Removed pointer-events-none to make dots clickable */}
                {arAnnotations.map(anno => (
                  <button // Changed div to button for accessibility and click handling
                    key={anno.id}
                    className="absolute bg-primary/70 hover:bg-primary/90 text-primary-foreground text-xs p-1 rounded-full shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    style={{
                      left: `${anno.position.x * 100}%`,
                      top: `${anno.position.y * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '16px', height: '16px', // Made dots slightly larger for easier clicking
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title={`Learn more about: ${anno.text}`}
                    onClick={() => handleViewAnatomyDetail(anno.text)}
                    aria-label={`Learn more about ${anno.text}`}
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> {/* Inner dot for visual */}
                  </button>
                ))}
              </div>
            )}
            {selectedAnnotatedImage && hasCameraPermission && (
                <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-md text-xs pointer-events-none">
                    Displaying annotations for: {selectedAnnotatedImage.name}
                     {isAnalyzingImage && selectedAnnotatedImage.id.startsWith('custom-') && " (AI Analyzing...)"}
                </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Anatomy Detail Dialog */}
      <Dialog open={showAnatomyDetailDialog} onOpenChange={setShowAnatomyDetailDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitleComponent className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Anatomy Details: {selectedAnnotationTextForDetail}
            </DialogTitleComponent>
            <DialogDescriptionComponent>
              Detailed information about the selected anatomical structure or finding.
            </DialogDescriptionComponent>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] mt-4 pr-2">
            {anatomyDetailLoading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Fetching details...</p>
              </div>
            )}
            {anatomyDetailError && !anatomyDetailLoading && (
              <Alert variant="destructive">
                <AlertTitle>Error Fetching Details</AlertTitle>
                <AlertDescription>{anatomyDetailError}</AlertDescription>
              </Alert>
            )}
            {anatomyDetailData && !anatomyDetailLoading && !anatomyDetailError && (
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Description:</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">{anatomyDetailData.description}</p>
                </div>
                {anatomyDetailData.relatedStructures && anatomyDetailData.relatedStructures.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Related Structures:</h4>
                    <ul className="list-disc list-inside ml-4 text-muted-foreground">
                      {anatomyDetailData.relatedStructures.map((structure, index) => (
                        <li key={index}>{structure}</li>
                      ))}
                    </ul>
                  </div>
                )}
                 {!anatomyDetailData.description && (!anatomyDetailData.relatedStructures || anatomyDetailData.relatedStructures.length === 0) && (
                    <p className="text-muted-foreground text-center py-6">No detailed information available in our database for "{selectedAnnotationTextForDetail}".</p>
                 )}
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-md">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}

    