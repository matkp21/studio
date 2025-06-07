// src/config/interactive-models-config.ts
import type { InteractiveModel } from '@/types/interactive-models';

// Using modelviewer.dev astronaut as a placeholder for all models
const PLACEHOLDER_MODEL_SRC = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
const PLACEHOLDER_POSTER_SRC = "https://placehold.co/600x400.png"; // Generic placeholder

export const interactiveModelsList: InteractiveModel[] = [
  {
    id: 'human-skeleton',
    title: 'Human Skeleton Explorer',
    description: 'Explore the full human skeletal system with detailed annotations for major bones.',
    modelType: 'anatomy',
    iconName: "Bone",
    glbPath: PLACEHOLDER_MODEL_SRC,
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
    modelType: 'anatomy',
    iconName: "Heart",
    glbPath: PLACEHOLDER_MODEL_SRC,
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
    modelType: 'procedure',
    iconName: "Scissors",
    glbPath: PLACEHOLDER_MODEL_SRC, // Using placeholder
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'appendectomy surgery',
    procedureSteps: [
      { stepId: 'incision', title: 'Step 1: Incision', description: 'A McBurney incision is made in the right lower quadrant of the abdomen.', instrument: 'Scalpel, Forceps', modelViewerCameraTarget: "0m 0.1m 0m", modelViewerCameraOrbit: "0deg 75deg 1.5m" },
      { stepId: 'exposure', title: 'Step 2: Exposure of Appendix', description: 'The layers of the abdominal wall are dissected to expose the cecum and appendix.', instrument: 'Retractors, Dissectors', modelViewerCameraTarget: "0m 0m 0m", modelViewerCameraOrbit: "15deg 70deg 1.2m" },
      { stepId: 'ligation', title: 'Step 3: Ligation & Resection', description: 'The mesoappendix is ligated, and the base of the appendix is ligated and then resected.', instrument: 'Suture, Ligatures, Scalpel', modelViewerCameraTarget: "0.1m 0m 0.1m", modelViewerCameraOrbit: "30deg 80deg 1m" },
      { stepId: 'closure', title: 'Step 4: Closure', description: 'The abdominal wall layers are closed meticulously.', instrument: 'Needle holder, Sutures', modelViewerCameraTarget: "0m 0.1m 0m", modelViewerCameraOrbit: "0deg 75deg 1.5m" },
    ],
  },
  {
    id: 'liver-cirrhosis',
    title: 'Liver Cirrhosis Pathology',
    description: 'Compare a healthy liver with one affected by cirrhosis, noting key pathological changes.',
    modelType: 'pathology',
    iconName: "ShieldAlert",
    glbPath: PLACEHOLDER_MODEL_SRC, // Using placeholder
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'liver cirrhosis',
    annotations: [
        { id: 'healthy-liver', name: 'Healthy Liver Tissue', title: 'Normal Liver Appearance', description: 'Smooth surface, uniform texture. Key functions include detoxification, protein synthesis, and bile production.' },
        { id: 'cirrhotic-liver', name: 'Cirrhotic Liver Tissue', title: 'Cirrhotic Liver Changes', description: 'Nodular surface, fibrosis, and altered architecture due to chronic liver damage. Leads to impaired liver function.' },
        { id: 'portal-hypertension', name: 'Portal Hypertension Sign', title: 'Signs of Portal Hypertension', description: 'Associated with cirrhosis, may manifest as ascites, varices. (Visualized conceptually on model)' },
    ],
  },
  {
    id: 'liver-resection',
    title: 'Liver Resection',
    description: 'Step-by-step 3D simulation of liver segmentectomy.',
    glbPath: PLACEHOLDER_MODEL_SRC, // Actual: '/models/liver-resection.glb',
    modelType: 'procedure',
    iconName: 'Scissors',
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'liver surgery',
    procedureSteps: [
      { stepId: 'lr_step1', title: 'Incision', description: 'A subcostal incision (e.g., Kocher) is made to access the liver.', instrument: 'Scalpel', modelViewerCameraTarget: '0m 0.5m 0m', modelViewerCameraOrbit: '30deg 65deg 1.8m' },
      { stepId: 'lr_step2', title: 'Liver Mobilization', description: 'Falciform, coronary, and triangular ligaments are divided as needed to mobilize the relevant liver portion.', instrument: 'Diathermy, Ligasure', modelViewerCameraTarget: '0m 0.3m 0m', modelViewerCameraOrbit: '20deg 60deg 1.4m' },
      { stepId: 'lr_step3', title: 'Parenchymal Transection', description: 'Liver parenchyma is transected along planned resection lines, identifying and controlling vessels and bile ducts.', instrument: 'CUSA, Harmonic Scalpel, Clamps', modelViewerCameraTarget: '0m 0.2m 0.3m', modelViewerCameraOrbit: '45deg 90deg 1.5m' },
      { stepId: 'lr_step4', title: 'Hemostasis & Closure', description: 'Resection bed is checked for hemostasis and bilistasis. Drains may be placed. Incision is closed.', instrument: 'Sutures, Argon Beam Coagulator', modelViewerCameraTarget: '0m 0.5m 0m', modelViewerCameraOrbit: '30deg 65deg 1.8m' },
    ],
  },
  {
    id: 'thyroidectomy',
    title: 'Thyroidectomy',
    description: 'Visual simulation of thyroid gland removal.',
    glbPath: PLACEHOLDER_MODEL_SRC, // Actual: '/models/thyroidectomy.glb',
    modelType: 'procedure',
    iconName: 'Scissors',
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'thyroid surgery',
    procedureSteps: [
      { stepId: 'th_step1', title: 'Incision & Exposure', description: 'A transverse cervical incision is made. Strap muscles are retracted to expose the thyroid gland.', instrument: 'Scalpel, Retractors', modelViewerCameraTarget: '0m 0.1m -0.2m', modelViewerCameraOrbit: '0deg 75deg 1.2m' },
      { stepId: 'th_step2', title: 'Vessel Ligation', description: 'Superior and inferior thyroid arteries and veins are carefully ligated and divided.', instrument: 'Ligatures, Harmonic Scalpel', modelViewerCameraTarget: '0m 0.05m -0.15m', modelViewerCameraOrbit: '10deg 80deg 1m' },
      { stepId: 'th_step3', title: 'Gland Dissection & Removal', description: 'The thyroid lobe(s) are dissected from the trachea, preserving recurrent laryngeal nerves and parathyroid glands.', instrument: 'Dissectors, Nerve Monitor Probe', modelViewerCameraTarget: '0m 0m -0.1m', modelViewerCameraOrbit: '0deg 90deg 0.8m' },
      { stepId: 'th_step4', title: 'Closure', description: 'Hemostasis is ensured, and the incision is closed in layers.', instrument: 'Sutures', modelViewerCameraTarget: '0m 0.1m -0.2m', modelViewerCameraOrbit: '0deg 75deg 1.2m' },
    ],
  },
  {
    id: 'mastectomy',
    title: 'Mastectomy Simulation',
    description: '3D guide for simple or modified radical mastectomy.',
    glbPath: PLACEHOLDER_MODEL_SRC, // Actual: '/models/mastectomy.glb',
    modelType: 'procedure',
    iconName: 'Scissors',
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'mastectomy surgery',
    procedureSteps: [
      { stepId: 'ma_step1', title: 'Incision Planning', description: 'Elliptical incision is marked around the nipple-areola complex, including previous biopsy scars if applicable.', instrument: 'Marking Pen', modelViewerCameraTarget: '0m 0.2m 0m', modelViewerCameraOrbit: '0deg 75deg 1.5m' },
      { stepId: 'ma_step2', title: 'Flap Dissection', description: 'Skin flaps are raised superiorly and inferiorly, preserving appropriate thickness.', instrument: 'Scalpel, Diathermy', modelViewerCameraTarget: '0m 0.1m 0m', modelViewerCameraOrbit: '15deg 70deg 1.3m' },
      { stepId: 'ma_step3', title: 'Breast Tissue Removal', description: 'The breast tissue is dissected off the pectoralis major muscle fascia.', instrument: 'Diathermy, Forceps', modelViewerCameraTarget: '0m 0m 0m', modelViewerCameraOrbit: '0deg 80deg 1.1m' },
      { stepId: 'ma_step4', title: 'Axillary Dissection (if indicated)', description: 'Level I/II axillary lymph nodes are removed if performing modified radical mastectomy.', instrument: 'Dissectors, Clips', modelViewerCameraTarget: '-0.2m 0m 0m', modelViewerCameraOrbit: '30deg 75deg 1.4m' },
      { stepId: 'ma_step5', title: 'Closure & Drains', description: 'Hemostasis is achieved, drains are placed, and incision is closed.', instrument: 'Sutures, Drains', modelViewerCameraTarget: '0m 0.2m 0m', modelViewerCameraOrbit: '0deg 75deg 1.5m' },
    ],
  },
  {
    id: 'colectomy',
    title: 'Colectomy (Colon Resection)',
    description: 'Simulation of segmental colon removal and anastomosis.',
    glbPath: PLACEHOLDER_MODEL_SRC, // Actual: '/models/colectomy.glb',
    modelType: 'procedure',
    iconName: 'Scissors',
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'colon surgery',
    procedureSteps: [
      { stepId: 'co_step1', title: 'Abdominal Incision & Exploration', description: 'Midline or transverse incision is made. Abdomen is explored, and the segment of colon for resection is identified.', instrument: 'Scalpel, Retractors', modelViewerCameraTarget: '0m 0.3m 0m', modelViewerCameraOrbit: '10deg 70deg 1.8m' },
      { stepId: 'co_step2', title: 'Mobilization & Vascular Ligation', description: 'The identified colon segment is mobilized by dividing its mesenteric attachments. Relevant blood vessels are ligated.', instrument: 'Diathermy, Ligasure, Vascular Clamps', modelViewerCameraTarget: '0m 0.1m 0m', modelViewerCameraOrbit: '20deg 75deg 1.5m' },
      { stepId: 'co_step3', title: 'Resection & Anastomosis', description: 'The diseased colon segment is resected. Bowel continuity is restored by creating an anastomosis (e.g., end-to-end).', instrument: 'Staplers, Sutures', modelViewerCameraTarget: '0m 0m 0.1m', modelViewerCameraOrbit: '30deg 85deg 1.2m' },
      { stepId: 'co_step4', title: 'Closure', description: 'Mesenteric defect is closed (if applicable), abdomen is irrigated, and incision closed.', instrument: 'Sutures', modelViewerCameraTarget: '0m 0.3m 0m', modelViewerCameraOrbit: '10deg 70deg 1.8m' },
    ],
  },
];
