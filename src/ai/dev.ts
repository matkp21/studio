
import { config } from 'dotenv';
config();

import '@/ai/flows/guideline-retrieval.ts';
import '@/ai/flows/image-analyzer.ts';
import '@/ai/flows/symptom-analyzer-flow.ts';
import '@/ai/flows/chat-flow.ts';
import '@/ai/flows/medico/study-notes-flow.ts'; // Add new medico flow
import '@/ai/flows/medico/mcq-generator-flow.ts'; // Add new medico flow
