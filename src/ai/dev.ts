
import { config } from 'dotenv';
config();

import '@/ai/flows/guideline-retrieval.ts';
import '@/ai/flows/image-analyzer.ts';
import '@/ai/flows/symptom-analyzer-flow.ts';
import '@/ai/flows/chat-flow.ts';
import '@/ai/flows/medico/study-notes-flow.ts'; 
import '@/ai/flows/medico/mcq-generator-flow.ts'; 

// Future medico tools would be imported here:
// import '@/ai/flows/medico/study-timetable-flow.ts';
// import '@/ai/flows/medico/flashcard-generator-flow.ts';
// import '@/ai/flows/medico/clinical-case-simulation-flow.ts';
// import '@/ai/flows/medico/anatomy-visualizer-flow.ts';
// import '@/ai/flows/medico/mnemonics-generator-flow.ts';
