// src/config/interactive-models-config.ts
import type { InteractiveModel } from '@/types/interactive-models';
// Icons are no longer imported here directly for the config
// They will be mapped in the components that render them.

// Using modelviewer.dev astronaut as a placeholder for all models
const PLACEHOLDER_MODEL_SRC = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
const PLACEHOLDER_POSTER_SRC = "https://placehold.co/600x400.png"; // Generic placeholder

export const interactiveModelsList: InteractiveModel[] = [
  {
    id: 'human-skeleton',
    title: 'Human Skeleton Explorer',
    description: 'Explore the full human skeletal system with detailed annotations for major bones.',
    type: 'anatomy',
    iconName: "Bone", // Changed from icon: Bone
    modelSrc: PLACEHOLDER_MODEL_SRC,
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'skeleton anatomy',
    annotations: [
      { id: 'skull', name: 'Skull', title: 'Cranium (Skull)', description: 'Protects the brain and houses sensory organs. Composed of 22 bones.', cameraTarget: "0m 1.5m 0m", cameraOrbit: "0deg 75deg 105%" },
      { id: 'ribcage', name: 'Rib Cage', title: 'Thoracic Cage (Ribs & Sternum)', description: 'Protects vital organs like the heart and lungs. Consists of 12 pairs of ribs, sternum, and thoracic vertebrae.', cameraTarget: "0m 1.2m 0m", cameraOrbit: "0deg 75deg 105%" },
      { id: 'femur', name: 'Femur', title: 'Femur (Thigh Bone)', description: 'The longest and strongest bone in the human body, located in the thigh.', cameraTarget: "0m 0.5m 0m", cameraOrbit: "0deg 75deg 105%" },
      { id: 'pelvis', name: 'Pelvis', title: 'Pelvic Girdle', description: 'Connects the trunk to the legs and supports abdominal organs.', cameraTarget: "0m 0.8m 0m", cameraOrbit: "0deg 75deg 105%" },
    ],
  },
  {
    id: 'heart-anatomy',
    title: 'Heart Anatomy Explorer',
    description: 'Detailed view of the human heart, its chambers, valves, and major vessels.',
    type: 'anatomy',
    iconName: "Heart", // Changed from icon: Heart
    modelSrc: PLACEHOLDER_MODEL_SRC,
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'heart anatomy',
    annotations: [
      { id: 'la', name: 'Left Atrium', title: 'Left Atrium', description: 'Receives oxygenated blood from the lungs via the pulmonary veins.' },
      { id: 'lv', name: 'Left Ventricle', title: 'Left Ventricle', description: 'Pumps oxygenated blood to the rest of the body via the aorta.' },
      { id: 'aorta', name: 'Aorta', title: 'Aorta', description: 'The largest artery, carrying oxygenated blood from the left ventricle to the body.' },
    ],
  },
  {
    id: 'appendectomy-sim',
    title: 'Appendectomy Simulation',
    description: 'Step-by-step visual guide of an appendectomy procedure.',
    type: 'procedure',
    iconName: "Scissors", // Changed from icon: Scissors
    modelSrc: PLACEHOLDER_MODEL_SRC,
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'appendectomy surgery',
    procedureSteps: [
      { stepId: 'incision', title: 'Step 1: Incision', description: 'A McBurney incision is made in the right lower quadrant of the abdomen.', instrument: 'Scalpel, Forceps' },
      { stepId: 'exposure', title: 'Step 2: Exposure of Appendix', description: 'The layers of the abdominal wall are dissected to expose the cecum and appendix.', instrument: 'Retractors, Dissectors' },
      { stepId: 'ligation', title: 'Step 3: Ligation & Resection', description: 'The mesoappendix is ligated, and the base of the appendix is ligated and then resected.', instrument: 'Suture, Ligatures, Scalpel' },
      { stepId: 'closure', title: 'Step 4: Closure', description: 'The abdominal wall layers are closed meticulously.', instrument: 'Needle holder, Sutures' },
    ],
  },
  {
    id: 'liver-cirrhosis',
    title: 'Liver Cirrhosis Pathology',
    description: 'Compare a healthy liver with one affected by cirrhosis, noting key pathological changes.',
    type: 'pathology',
    iconName: "ShieldAlert", // Changed from icon: ShieldAlert
    modelSrc: PLACEHOLDER_MODEL_SRC,
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'liver cirrhosis',
    annotations: [
        { id: 'healthy-liver', name: 'Healthy Liver Tissue', title: 'Normal Liver Appearance', description: 'Smooth surface, uniform texture. Key functions include detoxification, protein synthesis, and bile production.' },
        { id: 'cirrhotic-liver', name: 'Cirrhotic Liver Tissue', title: 'Cirrhotic Liver Changes', description: 'Nodular surface, fibrosis, and altered architecture due to chronic liver damage. Leads to impaired liver function.' },
        { id: 'portal-hypertension', name: 'Portal Hypertension Sign', title: 'Signs of Portal Hypertension', description: 'Associated with cirrhosis, may manifest as ascites, varices. (Visualized conceptually on model)' },
    ],
  },
  // Example of how you might add a model that uses Orbit icon
  // {
  //   id: 'generic-model',
  //   title: 'Generic 3D Model',
  //   description: 'A generic model for testing the Orbit icon.',
  //   type: 'anatomy',
  //   iconName: "Orbit", // Using Orbit icon name
  //   modelSrc: PLACEHOLDER_MODEL_SRC,
  //   posterSrc: PLACEHOLDER_POSTER_SRC,
  //   dataAiHint: '3d model orbit',
  //   annotations: [
  //     { id: 'anno1', name: 'Annotation 1', title: 'Detail 1', description: 'Description for detail 1.' },
  //   ],
  // }
];
