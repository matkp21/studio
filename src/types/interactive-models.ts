// src/types/interactive-models.ts
import type { LucideIcon } from 'lucide-react';

export interface AnnotationHotspot {
  id: string;
  name: string; // Name of the hotspot/area
  title: string; // Title for the side note
  description: string; // Detailed description
  cameraTarget?: string; // <model-viewer> camera-target string "Xm Ym Zm"
  cameraOrbit?: string; // <model-viewer> camera-orbit string "Xdeg Ydeg Z%"
  position?: string; // <model-viewer> hotspot position string "Xm Ym Zm"
  normal?: string; // <model-viewer> hotspot normal string "Xx Yx Zx"
}

export interface ProcedureStep {
  stepId: string;
  title: string;
  description: string;
  instrument?: string;
  modelViewerCameraOrbit?: string; // Specific camera view for this step
  modelViewerCameraTarget?: string;
  // Potentially add URL to a specific variant of the model showing this step, or animation name
}

export type InteractiveModelType = 'anatomy' | 'pathology' | 'procedure';

export interface InteractiveModel {
  id: string;
  title: string;
  description: string;
  type: InteractiveModelType;
  icon: LucideIcon;
  modelSrc: string; // URL to the .glb or .usdz model
  posterSrc?: string; // Optional placeholder image for <model-viewer>
  annotations?: AnnotationHotspot[]; // For anatomy/pathology models
  procedureSteps?: ProcedureStep[]; // For surgical procedures
  dataAiHint?: string; // For placeholder images
}
