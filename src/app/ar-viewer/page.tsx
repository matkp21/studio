"use client";

import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, CameraOff, Loader2, Info, ScanEye, Wand2 } from 'lucide-react'; // Added Wand2 for interactivity hint
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface Annotation {
  id: string;
  text: string;
  position: { x: number; y: number }; // Normalized coordinates (0-1) relative to image/video
  // For interactive AR: could include properties for 3D positioning, scale, interaction triggers
}

interface AnnotatedImage {
  id: string;
  name: string;
  imageUrl: string; // For static image display
  annotations: Annotation[];
}

// Sample data - in a real app, this might come from an API or user uploads
const sampleAnnotatedImages: AnnotatedImage[] = [
  {
    id: 'xray-1',
    name: 'Chest X-Ray - Sample A',
    imageUrl: 'https://picsum.photos/seed/xray1/800/600', 
    annotations: [
      { id: 'anno-1a', text: 'Possible nodule', position: { x: 0.3, y: 0.4 } },
      { id: 'anno-1b', text: 'Area of interest', position: { x: 0.6, y: 0.5 } },
    ],
  },
  {
    id: 'ct-scan-1',
    name: 'CT Scan - Sample B',
    imageUrl: 'https://picsum.photos/seed/ctscan1/800/600',
    annotations: [
      { id: 'anno-2a', text: 'Anomaly detected', position: { x: 0.5, y: 0.3 } },
    ],
  },
];

export default function ARViewerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState(true);
  const [selectedAnnotatedImage, setSelectedAnnotatedImage] = useState<AnnotatedImage | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  
  // State for AR annotations rendered over video (for demonstration of concept)
  const [arAnnotations, setArAnnotations] = useState<Annotation[]>([]);

  const { toast } = useToast();

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
        const imageUrl = reader.result as string;
        setUploadedImagePreview(imageUrl);
        // Simulate loading annotations for the uploaded image or using AI
        // For demo, provide some default annotations if it's an uploaded image.
        // In a real app, these might come from an AI image analysis flow.
        const newSelectedImage: AnnotatedImage = {
            id: `custom-${Date.now()}`,
            name: file.name,
            imageUrl: imageUrl,
            annotations: [{id: 'custom-anno-1', text: 'Custom point 1', position: {x:0.25, y:0.25}}, {id: 'custom-anno-2', text: 'Custom point 2', position: {x:0.75, y:0.75}}], 
        };
        setSelectedAnnotatedImage(newSelectedImage);
        // Update AR annotations if an image is selected
        setArAnnotations(newSelectedImage.annotations); 
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSampleImage = (image: AnnotatedImage) => {
    setSelectedAnnotatedImage(image);
    setUploadedImageFile(null);
    setUploadedImagePreview(image.imageUrl); // Show sample image as preview
    setArAnnotations(image.annotations); // Load annotations for AR view
  };

  // TODO: Implement real-time AR object detection and annotation placement
  // This would involve:
  // 1. Capturing frames from the video stream (videoRef.current).
  // 2. Sending frames to an ML model (e.g., TensorFlow.js, or a backend API) for object/feature detection.
  // 3. Receiving coordinates or bounding boxes of detected features.
  // 4. Mapping these coordinates to the video display.
  // 5. Dynamically updating `arAnnotations` state with new annotations based on detection.
  // This is a complex task beyond simple UI updates.

  return (
    <PageWrapper title="Augmented Reality Viewer" className="flex flex-col h-[calc(100vh-var(--header-height,8rem))]"> {/* Adjust height based on header */}
      <div className="grid md:grid-cols-3 gap-4 flex-1 min-h-0"> {/* Ensure grid children can shrink */}
        <Card className="shadow-md md:col-span-1 h-full flex flex-col">
          <CardHeader>
            <CardTitle>AR Controls & Info</CardTitle>
            <CardDescription>Load images and view annotations in AR.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow overflow-y-auto">
            <div>
              <Label htmlFor="image-upload" className="mb-2 block">Upload Medical Image</Label>
              <Input id="image-upload" type="file" accept="image/*" onChange={handleImageFileChange} className="mb-2" />
              {uploadedImagePreview && selectedAnnotatedImage?.id.startsWith('custom-') && ( // Only show uploaded preview if it's a custom upload
                <div className="mt-2 p-2 border rounded-md">
                  <p className="font-semibold text-sm">Uploaded:</p>
                  <Image src={uploadedImagePreview} alt="Uploaded preview" width={100} height={100} className="rounded-md object-contain" data-ai-hint="medical scan" />
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

            {selectedAnnotatedImage && (
              <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <ScanEye className="mr-2 h-5 w-5 text-primary"/> Annotations for {selectedAnnotatedImage.name}
                </h3>
                {selectedAnnotatedImage.annotations.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-sm">
                    {selectedAnnotatedImage.annotations.map(anno => (
                        <li key={anno.id}>{anno.text} (Demo Pos: x:{anno.position.x.toFixed(2)}, y:{anno.position.y.toFixed(2)})</li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No annotations for this image.</p>
                )}
                 <Alert variant="default" className="mt-3 border-accent/50 bg-accent/10 rounded-lg">
                    <Wand2 className="h-5 w-5 text-accent" />
                    <AlertTitle className="text-accent font-semibold">Interactive AR</AlertTitle>
                    <AlertDescription className="text-accent/80 text-xs">
                      Future: Annotations could appear interactively on the live camera feed based on real-time analysis and where you focus.
                    </AlertDescription>
                  </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md md:col-span-2 h-full flex flex-col relative overflow-hidden">
          <CardHeader>
            <CardTitle>Live AR View</CardTitle>
            <CardDescription>Camera feed with overlaid annotations (conceptual).</CardDescription>
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
            
            {/* Video Element - always render to attach ref, hide if no permission */}
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
             
            {/* AR Overlays: Render annotations on top of the video feed */}
            {hasCameraPermission && !isLoadingCamera && arAnnotations.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {arAnnotations.map(anno => (
                  <div
                    key={anno.id}
                    className="absolute bg-primary/70 text-primary-foreground text-xs p-1 rounded shadow-lg pointer-events-auto"
                    style={{
                      left: `${anno.position.x * 100}%`,
                      top: `${anno.position.y * 100}%`,
                      transform: 'translate(-50%, -50%)', // Center the annotation point
                    }}
                    title={anno.text}
                  >
                    {/* Simple dot or icon for annotation point */}
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    {/* Optionally display text, but can get crowded. Tooltip is better for text. */}
                  </div>
                ))}
              </div>
            )}
            {selectedAnnotatedImage && hasCameraPermission && (
                <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-md text-xs pointer-events-none">
                    Displaying annotations for: {selectedAnnotatedImage.name}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
