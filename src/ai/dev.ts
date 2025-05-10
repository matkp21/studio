
import { config } from 'dotenv';
config();

import '@/ai/flows/guideline-retrieval.ts';
import '@/ai/flows/image-analyzer.ts';
import '@/ai/flows/symptom-analyzer.ts';
import '@/ai/flows/chat-flow.ts'; // Add the new chat flow
