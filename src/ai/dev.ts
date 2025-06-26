
import { config } from 'dotenv';
config();

import '@/ai/flows/guideline-retrieval.ts';
import '@/ai/schemas/guideline-retrieval-schemas.ts'; // Ensure schemas are part of dev compilation if separate
import '@/ai/flows/image-analyzer.ts';
import '@/ai/flows/symptom-analyzer-flow.ts';
import '@/ai/flows/chat-flow.ts';
import '@/ai/flows/medico/study-notes-flow.ts'; 
import '@/ai/flows/medico/mcq-generator-flow.ts'; 
import '@/ai/flows/medico/exam-paper-flow.ts'; // Added new agent/flow

// New Medico tool imports:
import '@/ai/flows/medico/study-timetable-creator-flow.ts';
import '@/ai/flows/medico/flashcard-generator-flow.ts';
import '@/ai/flows/medico/clinical-case-simulation-flow.ts';
import '@/ai/flows/medico/anatomy-visualizer-flow.ts';
import '@/ai/flows/medico/mnemonics-generator-flow.ts';
import '@/ai/flows/medico/differential-diagnosis-trainer-flow.ts';
import '@/ai/flows/medico/virtual-patient-rounds-flow.ts';
import '@/ai/flows/medico/high-yield-topic-predictor-flow.ts';
import '@/ai/flows/medico/drug-dosage-calculator-flow.ts';

// Professional tools
import '@/ai/flows/pro/discharge-summary-generator-flow.ts';
import '@/ai/schemas/pro-schemas.ts'; // Ensure pro schemas are included
import '@/ai/schemas/symptom-analyzer-schemas.ts'; // Ensure symptom schemas are included
import '@/ai/schemas/medico-tools-schemas.ts'; // Ensure medico schemas are included
