import { config } from 'dotenv';
config();

import '@/ai/flows/guideline-retrieval.ts';
import '@/ai/flows/image-analyzer.ts';
import '@/ai/flows/symptom-analyzer.ts';