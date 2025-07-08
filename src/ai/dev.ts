
import { config } from 'dotenv';
config();

import '@/ai/agents/GuidelineRetrievalAgent.ts';
import '@/ai/schemas/guideline-retrieval-schemas.ts'; // Ensure schemas are part of dev compilation if separate
import '@/ai/agents/ImageAnalyzerAgent.ts';
import '@/ai/agents/SymptomAnalyzerAgent.ts';
import '@/ai/agents/ChatAgent.ts';

// Medico tool imports:
import '@/ai/agents/medico/StudyNotesAgent.ts'; 
import '@/ai/agents/medico/MCQGeneratorAgent.ts'; 
import '@/ai/agents/medico/ExamPaperAgent.ts';
import '@/ai/agents/medico/StudyTimetableCreatorAgent.ts';
import '@/ai/agents/medico/FlashcardGeneratorAgent.ts';

// Professional tools
import '@/ai/agents/pro/DischargeSummaryGeneratorAgent.ts';
import '@/ai/agents/pro/TriageAndReferralAgent.ts'; // Import the new coordinator agent
import '@/ai/schemas/pro-schemas.ts'; // Ensure pro schemas are included
import '@/ai/schemas/symptom-analyzer-schemas.ts'; // Ensure symptom schemas are included
import '@/ai/schemas/medico-tools-schemas.ts'; // Ensure medico schemas are included
