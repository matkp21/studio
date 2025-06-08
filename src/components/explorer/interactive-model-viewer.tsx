// src/components/explorer/interactive-model-viewer.tsx
"use client";

import type { InteractiveModel, AnnotationHotspot, ProcedureStep, ModelIconName } from '@/types/interactive-models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React, { useState, useEffect, Suspense } from 'react';
import { ChevronLeft, ChevronRight, Info, Orbit, PackageOpen, ZoomIn, ZoomOut, Bone, Heart, Scissors, ShieldAlert, Activity, Stethoscope } from 'lucide-react'; // Added Stethoscope
import Image from 'next/image';

// Dynamically import model-viewer to avoid SSR issues
const ModelViewer = React.lazy(() => import('./model-viewer-wrapper'));

interface InteractiveModelViewerProps {
  model: InteractiveModel;
  onAnnotationSelect?: (annotationId: string) => void;
}

const iconMap: Record<ModelIconName, React.ElementType> = {
  Bone,
  Heart,
  Scissors,
  ShieldAlert,
  Orbit,
  Activity,
  Stethoscope,
};

export function InteractiveModelViewer({ model, onAnnotationSelect }: InteractiveModelViewerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAnnotation, setSelectedAnnotation] = useState<AnnotationHotspot | null>(
    model.annotations && model.annotations.length > 0 ? model.annotations[0] : null
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentStepIndex(0); // Reset step index when model changes
    setSelectedAnnotation(model.annotations && model.annotations.length > 0 ? model.annotations[0] : null); // Reset annotation
  }, [model]);

  const handleNextStep = () => {
    if (model.procedureSteps && currentStepIndex < model.procedureSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const currentProcedureStep = model.procedureSteps?.[currentStepIndex];
  const IconComponent = iconMap[model.iconName] || Orbit; // Fallback to Orbit

  const handleSelectAnnotation = (annotation: AnnotationHotspot) => {
    setSelectedAnnotation(annotation);
    if (onAnnotationSelect) {
      onAnnotationSelect(annotation.id);
    }
    // Conceptually, you might also want to update the <model-viewer> here
    // to focus on the annotation's target if `model-viewer` supports it via props/methods.
    // For now, cameraOrbit and cameraTarget are passed directly.
  };
  
  const modelViewerElement = isClient ? (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-muted rounded-lg"><Orbit className="h-12 w-12 text-primary animate-spin" /></div>}>
        <ModelViewer
        src={model.glbPath}
        alt={model.title}
        poster={model.posterSrc}
        camera-controls // Use kebab-case for attributes
        auto-rotate={!currentProcedureStep && !selectedAnnotation}
        exposure="1"
        shadow-intensity="1"
        camera-target={currentProcedureStep?.modelViewerCameraTarget || selectedAnnotation?.cameraTarget}
        camera-orbit={currentProcedureStep?.modelViewerCameraOrbit || selectedAnnotation?.cameraOrbit}
        className="w-full h-full min-h-[300px] md:min-h-[400px] border-none rounded-lg"
        />
    </Suspense>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
        <Image src={model.posterSrc || "https://placehold.co/600x400.png"} alt={model.title + " placeholder"} data-ai-hint={model.dataAiHint || "3d model"} width={600} height={400} className="object-contain opacity-50" />
    </div>
  );


  return (
    <Card className="shadow-lg rounded-xl border-border/50 overflow-hidden w-full">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                 <IconComponent className="h-7 w-7" />
            </div>
            <div>
                <CardTitle className="text-2xl text-foreground">{model.title}</CardTitle>
                <CardDescription className="text-sm">{model.description}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 md:p-4 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[60vh]">
        <div className="md:col-span-2 bg-muted/20 rounded-lg overflow-hidden relative flex items-center justify-center aspect-video md:aspect-auto">
           {modelViewerElement}
           <div className="absolute bottom-2 right-2 flex gap-1.5 bg-background/70 p-1 rounded-md shadow">
                <Button variant="ghost" size="iconSm" title="Zoom In (Conceptual)" aria-label="Zoom In"><ZoomIn className="h-4 w-4"/></Button>
                <Button variant="ghost" size="iconSm" title="Zoom Out (Conceptual)" aria-label="Zoom Out"><ZoomOut className="h-4 w-4"/></Button>
                <Button variant="ghost" size="iconSm" title="Reset View (Conceptual)" aria-label="Reset View"><PackageOpen className="h-4 w-4"/></Button>
           </div>
        </div>

        <div className="md:col-span-1 p-4 md:p-0 h-full flex flex-col">
          {model.modelType === 'anatomy' || model.modelType === 'pathology' ? (
            <Card className="flex-grow flex flex-col border-primary/20 bg-primary/5 shadow-inner">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-lg text-primary">Annotations</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 flex-grow overflow-hidden">
                {model.annotations && model.annotations.length > 0 ? (
                  <ScrollArea className="h-full max-h-[45vh] md:max-h-none pr-2">
                    <ul className="space-y-2">
                      {model.annotations.map((anno) => (
                        <li key={anno.id}>
                          <Button
                            variant={selectedAnnotation?.id === anno.id ? 'secondary' : 'ghost'}
                            onClick={() => handleSelectAnnotation(anno)}
                            className="w-full justify-start text-left h-auto py-1.5 px-2 rounded-md"
                            aria-pressed={selectedAnnotation?.id === anno.id}
                          >
                            {anno.name}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground p-2">No annotations available for this model.</p>
                )}
              </CardContent>
              {selectedAnnotation && (
                <CardFooter className="p-3 border-t bg-background">
                    <div className="space-y-1">
                        <h4 className="font-semibold text-md text-foreground">{selectedAnnotation.title}</h4>
                        <p className="text-xs text-muted-foreground whitespace-pre-wrap">{selectedAnnotation.description}</p>
                    </div>
                </CardFooter>
              )}
            </Card>
          ) : model.modelType === 'procedure' && model.procedureSteps ? (
            <Card className="flex-grow flex flex-col border-primary/20 bg-primary/5 shadow-inner">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-lg text-primary">Procedure Steps</CardTitle>
                 {currentProcedureStep && <CardDescription className="text-xs">Step {currentStepIndex + 1} of {model.procedureSteps.length}: {currentProcedureStep.title}</CardDescription>}
              </CardHeader>
              <CardContent className="px-3 pb-3 flex-grow overflow-hidden">
                {currentProcedureStep ? (
                  <ScrollArea className="h-full max-h-[45vh] md:max-h-none pr-2">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentProcedureStep.description}</p>
                      {currentProcedureStep.instrument && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">Instrument:</span> {currentProcedureStep.instrument}
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground p-2">No steps defined for this procedure.</p>
                )}
              </CardContent>
              <CardFooter className="p-3 border-t flex justify-between bg-background">
                <Button onClick={handlePreviousStep} disabled={currentStepIndex === 0} variant="outline" size="sm" className="rounded-md">
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                </Button>
                <Button onClick={handleNextStep} disabled={!model.procedureSteps || currentStepIndex === model.procedureSteps.length - 1} variant="outline" size="sm" className="rounded-md">
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ) : (
             <div className="p-4 text-muted-foreground text-center flex-grow flex items-center justify-center">
                <Info className="h-8 w-8 mb-2 text-primary/60"/>
                Select a model type with defined content.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
