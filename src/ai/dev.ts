
import { config } from 'dotenv';
config();

import '@/ai/flows/guideline-retrieval';
import '@/ai/schemas/guideline-retrieval-schemas'; // Ensure schemas are part of dev compilation if separate
import '@/ai/flows/image-analyzer';
import '@/ai/flows/symptom-analyzer-flow';
import '@/ai/flows/chat-flow';
import '@/ai/flows/medico/study-notes-flow';
import '@/ai/flows/medico/mcq-generator-flow';

// New Medico tool imports:
import '@/ai/flows/medico/study-timetable-creator-flow';
import '@/ai/flows/medico/flashcard-generator-flow';
import '@/ai/flows/medico/clinical-case-simulation-flow';
import '@/ai/flows/medico/anatomy-visualizer-flow';
import '@/ai/flows/medico/mnemonics-generator-flow';
import '@/ai/flows/medico/differential-diagnosis-trainer-flow';
import '@/ai/flows/medico/virtual-patient-rounds-flow';
import '@/ai/flows/medico/high-yield-topic-predictor-flow';
import '@/ai/flows/medico/drug-dosage-calculator-flow';

// Professional tools
import '@/ai/flows/pro/discharge-summary-generator-flow';
import '@/ai/schemas/pro-schemas'; // Ensure pro schemas are included
import '@/ai/schemas/symptom-analyzer-schemas'; // Ensure symptom schemas are included
import '@/ai/schemas/medico-tools-schemas'; // Ensure medico schemas are included
