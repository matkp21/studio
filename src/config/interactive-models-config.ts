// src/config/interactive-models-config.ts
import type { InteractiveModel } from '@/types/interactive-models';

// Using a specific anatomy model for some entries, and modelviewer.dev astronaut as a placeholder for others.
const HUMAN_ANATOMY_MODEL_SRC = "/models/Astronaut.glb"; // Path corrected to use the placeholder model
const PLACEHOLDER_MODEL_SRC = "/models/Astronaut.glb"; // Consistent placeholder path
const PLACEHOLDER_POSTER_SRC = "https://placehold.co/600x400.png"; // Generic placeholder

export const interactiveModelsList: InteractiveModel[] = [
  {
    id: 'human-skeleton', // Retained ID, but content changed
    title: 'Human Anatomy Explorer',
    description: 'Explore the skeletal and organ systems of the human body in 3D.',
    modelType: 'anatomy',
    iconName: "Stethoscope",
    glbPath: HUMAN_ANATOMY_MODEL_SRC,
    posterSrc: PLACEHOLDER_POSTER_SRC, // Generic poster for now
    dataAiHint: 'human anatomy',
    annotations: [
      { id: 'skull', name: 'Skull', title: 'Cranium (Skull)', description: 'Protects the brain and houses sensory organs. Composed of 22 bones.', cameraTarget: "0m 1.7m 0m", cameraOrbit: "0deg 75deg 0.8m" },
      { id: 'ribcage', name: 'Rib Cage', title: 'Thoracic Cage', description: 'Protects vital organs like the heart and lungs.', cameraTarget: "0m 1.4m 0m", cameraOrbit: "0deg 75deg 1m" },
      { id: 'femur', name: 'Femur', title: 'Femur (Thigh Bone)', description: 'The longest and strongest bone in the human body.', cameraTarget: "0m 0.6m 0.1m", cameraOrbit: "0deg 75deg 1.2m" },
      { id: 'pelvis', name: 'Pelvis', title: 'Pelvic Girdle', description: 'Connects the trunk to the legs and supports abdominal organs.', cameraTarget: "0m 0.9m 0m", cameraOrbit: "0deg 75deg 1.1m" },
      { id: 'heart-general', name: 'Heart (General Location)', title: 'Heart', description: 'The heart is a muscular organ that pumps blood through the body.', cameraTarget: '0m 1.4m 0.1m', cameraOrbit: '0deg 75deg 0.9m' },
      { id: 'liver-general', name: 'Liver (General Location)', title: 'Liver', description: 'The liver filters blood and produces bile.', cameraTarget: '0.1m 1.25m 0m', cameraOrbit: '0deg 65deg 1m' },
    ],
  },
  {
    id: 'heart-anatomy',
    title: 'Heart Anatomy Explorer',
    description: 'Explore the human heart within a full anatomical model.',
    iconName: 'Heart',
    modelType: 'anatomy',
    glbPath: HUMAN_ANATOMY_MODEL_SRC, // Uses the placeholder anatomy model
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'human heart anatomy',
    annotations: [
      {
        id: 'heart-front',
        name: 'Anterior View', // Name for list
        title: 'Anterior View of Heart',
        description: 'The heart is a muscular organ located slightly left of the midline, enclosed within the mediastinum. Visible are the right ventricle, parts of the left ventricle, and major vessels.',
        cameraTarget: '0m 1.3m 0.15m', // Adjusted for full body model
        cameraOrbit: '0deg 75deg 1.0m',   // Zoomed out slightly
      },
      {
        id: 'heart-superior', // Changed ID for uniqueness
        name: 'Superior View',
        title: 'Superior View of Heart & Great Vessels',
        description: 'From above, the heart reveals the origins of the great vessels — aorta, pulmonary trunk, and venae cavae entering the atria.',
        cameraTarget: '0m 1.35m 0.1m', // Adjusted for full body model
        cameraOrbit: '-90deg 65deg 0.8m', // Closer zoom for superior view
      },
      {
        id: 'heart-posterior', // Changed ID
        name: 'Posterior View',
        title: 'Posterior View of Heart',
        description: 'The posterior aspect mainly shows the left atrium receiving pulmonary veins, and parts of the ventricles.',
        cameraTarget: '0m 1.3m -0.1m', // Adjusted for full body model
        cameraOrbit: '180deg 70deg 1.0m',  // Zoomed out slightly
      }
    ],
  },
  {
    id: 'appendectomy-sim',
    title: 'Appendectomy Simulation',
    description: 'Step-by-step visual guide of an appendectomy procedure.',
    modelType: 'procedure',
    iconName: "Scissors",
    glbPath: PLACEHOLDER_MODEL_SRC,
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'appendectomy surgery',
    procedureSteps: [
      { stepId: 'inc', title: 'Step 1: Incision & Access', description: 'A small incision (e.g., McBurney or laparoscopic port) is made in the right lower quadrant.', instrument: 'Scalpel, Trocar', cameraTarget: "0m 0.1m 0m", cameraOrbit: "0deg 75deg 1.5m" },
      { stepId: 'exp', title: 'Step 2: Exposure of Appendix', description: 'The cecum is identified, and the appendix is located and exposed.', instrument: 'Grasper, Retractor', cameraTarget: "0m 0m 0m", cameraOrbit: "15deg 70deg 1.2m" },
      { stepId: 'lig', title: 'Step 3: Ligation & Resection', description: 'The mesoappendix (containing appendiceal artery) is ligated, and the base of the appendix is ligated and then resected.', instrument: 'Ligatures/Stapler, Scalpel/Scissors', cameraTarget: "0.1m 0m 0.1m", cameraOrbit: "30deg 80deg 1m" },
      { stepId: 'cls', title: 'Step 4: Closure', description: 'The appendiceal stump may be inverted or simply ligated. The incision is closed in layers.', instrument: 'Sutures', cameraTarget: "0m 0.1m 0m", cameraOrbit: "0deg 75deg 1.5m" },
    ],
  },
  {
    id: 'liver-cirrhosis',
    title: 'Liver Cirrhosis Pathology',
    description: 'Compare a healthy liver with one affected by cirrhosis, noting key pathological changes.',
    modelType: 'pathology',
    iconName: "ShieldAlert",
    glbPath: PLACEHOLDER_MODEL_SRC,
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'liver cirrhosis',
    annotations: [
        { id: 'healthy-liver', name: 'Healthy Liver Tissue', title: 'Normal Liver Appearance', description: 'Smooth surface, uniform texture. Key functions include detoxification, protein synthesis, and bile production.' },
        { id: 'cirrhotic-liver', name: 'Cirrhotic Liver Tissue', title: 'Cirrhotic Liver Changes', description: 'Nodular surface, fibrosis, and altered architecture due to chronic liver damage. Leads to impaired liver function.' },
        { id: 'portal-hypertension', name: 'Signs of Portal Hypertension', title: 'Signs of Portal Hypertension', description: 'Associated with cirrhosis, may manifest as ascites, varices. (Visualized conceptually on model)' },
    ],
  },
  {
    id: 'liver-resection',
    title: 'Liver Resection',
    description: 'Step-by-step 3D simulation of liver segmentectomy.',
    glbPath: PLACEHOLDER_MODEL_SRC,
    modelType: 'procedure',
    iconName: 'Scissors',
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'liver surgery',
    procedureSteps: [
      { stepId: 'lr_inc', title: 'Incision', description: 'A subcostal incision (e.g., Kocher) or laparoscopic ports are made to access the liver.', instrument: 'Scalpel, Trocars', modelViewerCameraTarget: '0m 0.5m 0m', modelViewerCameraOrbit: '30deg 65deg 1.8m' },
      { stepId: 'lr_mob', title: 'Liver Mobilization', description: 'Falciform, coronary, and triangular ligaments are divided as needed to mobilize the relevant liver portion.', instrument: 'Diathermy, Ligasure', modelViewerCameraTarget: '0m 0.3m 0m', modelViewerCameraOrbit: '20deg 60deg 1.4m' },
      { stepId: 'lr_pt', title: 'Parenchymal Transection', description: 'Liver parenchyma is transected along planned resection lines, identifying and controlling vessels and bile ducts.', instrument: 'CUSA, Harmonic Scalpel, Clamps', modelViewerCameraTarget: '0m 0.2m 0.3m', modelViewerCameraOrbit: '45deg 90deg 1.5m' },
      { stepId: 'lr_hc', title: 'Hemostasis & Closure', description: 'Resection bed is checked for hemostasis and bilistasis. Drains may be placed. Incision is closed.', instrument: 'Sutures, Argon Beam Coagulator', modelViewerCameraTarget: '0m 0.5m 0m', modelViewerCameraOrbit: '30deg 65deg 1.8m' },
    ],
  },
  {
    id: 'thyroidectomy',
    title: 'Thyroidectomy',
    description: 'Visual simulation of thyroid gland removal.',
    glbPath: PLACEHOLDER_MODEL_SRC,
    modelType: 'procedure',
    iconName: 'Scissors',
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'thyroid surgery',
    procedureSteps: [
      { stepId: 'th_inc', title: 'Incision & Exposure', description: 'A transverse cervical incision is made. Strap muscles are retracted to expose the thyroid gland.', instrument: 'Scalpel, Retractors', modelViewerCameraTarget: '0m 0.1m -0.2m', cameraOrbit: '0deg 75deg 1.2m' },
      { stepId: 'th_vlig', title: 'Vessel Ligation', description: 'Superior and inferior thyroid arteries and veins are carefully ligated and divided.', instrument: 'Ligatures, Harmonic Scalpel', modelViewerCameraTarget: '0m 0.05m -0.15m', cameraOrbit: '10deg 80deg 1m' },
      { stepId: 'th_gdr', title: 'Gland Dissection & Removal', description: 'The thyroid lobe(s) are dissected from the trachea, preserving recurrent laryngeal nerves and parathyroid glands.', instrument: 'Dissectors, Nerve Monitor Probe', modelViewerCameraTarget: '0m 0m -0.1m', cameraOrbit: '0deg 90deg 0.8m' },
      { stepId: 'th_cls', title: 'Closure', description: 'Hemostasis is ensured, and the incision is closed in layers.', instrument: 'Sutures', modelViewerCameraTarget: '0m 0.1m -0.2m', cameraOrbit: '0deg 75deg 1.2m' },
    ],
  },
  {
    id: 'mastectomy',
    title: 'Mastectomy Simulation',
    description: '3D guide for simple or modified radical mastectomy.',
    glbPath: PLACEHOLDER_MODEL_SRC,
    modelType: 'procedure',
    iconName: 'Scissors',
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'mastectomy surgery',
    procedureSteps: [
      { stepId: 'ma_plan', title: 'Incision Planning', description: 'Elliptical incision is marked around the nipple-areola complex, including previous biopsy scars if applicable.', instrument: 'Marking Pen', modelViewerCameraTarget: '0m 0.2m 0m', cameraOrbit: '0deg 75deg 1.5m' },
      { stepId: 'ma_flap', title: 'Flap Dissection', description: 'Skin flaps are raised superiorly and inferiorly, preserving appropriate thickness.', instrument: 'Scalpel, Diathermy', modelViewerCameraTarget: '0m 0.1m 0m', cameraOrbit: '15deg 70deg 1.3m' },
      { stepId: 'ma_rem', title: 'Breast Tissue Removal', description: 'The breast tissue is dissected off the pectoralis major muscle fascia.', instrument: 'Diathermy, Forceps', modelViewerCameraTarget: '0m 0m 0m', cameraOrbit: '0deg 80deg 1.1m' },
      { stepId: 'ma_axd', title: 'Axillary Dissection (if indicated)', description: 'Level I/II axillary lymph nodes are removed if performing modified radical mastectomy.', instrument: 'Dissectors, Clips', modelViewerCameraTarget: '-0.2m 0m 0m', cameraOrbit: '30deg 75deg 1.4m' },
      { stepId: 'ma_cls', title: 'Closure & Drains', description: 'Hemostasis is achieved, drains are placed, and incision is closed.', instrument: 'Sutures, Drains', modelViewerCameraTarget: '0m 0.2m 0m', cameraOrbit: '0deg 75deg 1.5m' },
    ],
  },
  {
    id: 'colectomy',
    title: 'Colectomy (Colon Resection)',
    description: 'Simulation of segmental colon removal and anastomosis.',
    glbPath: PLACEHOLDER_MODEL_SRC,
    modelType: 'procedure',
    iconName: 'Scissors',
    posterSrc: PLACEHOLDER_POSTER_SRC,
    dataAiHint: 'colon surgery',
    procedureSteps: [
      { stepId: 'co_inc', title: 'Abdominal Incision & Exploration', description: 'Midline or transverse incision is made. Abdomen is explored, and the segment of colon for resection is identified.', instrument: 'Scalpel, Retractors', modelViewerCameraTarget: '0m 0.3m 0m', modelViewerCameraOrbit: '10deg 70deg 1.8m' },
      { stepId: 'co_mob', title: 'Mobilization & Vascular Ligation', description: 'The identified colon segment is mobilized by dividing its mesenteric attachments. Relevant blood vessels are ligated.', instrument: 'Diathermy, Ligasure, Vascular Clamps', modelViewerCameraTarget: '0m 0.1m 0m', modelViewerCameraOrbit: '20deg 75deg 1.5m' },
      { stepId: 'co_res', title: 'Resection & Anastomosis', description: 'The diseased colon segment is resected. Bowel continuity is restored by creating an anastomosis (e.g., end-to-end).', instrument: 'Staplers, Sutures', modelViewerCameraTarget: '0m 0m 0.1m', cameraOrbit: '30deg 85deg 1.2m' },
      { stepId: 'co_cls', title: 'Closure', description: 'Mesenteric defect is closed (if applicable), abdomen is irrigated, and incision closed.', instrument: 'Sutures', modelViewerCameraTarget: '0m 0.3m 0m', cameraOrbit: '10deg 70deg 1.8m' },
    ],
  },
];
