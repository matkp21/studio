
// src/components/medico/solved-question-papers-viewer.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookCopy, FileText, Wand2, Loader2, Database, AlertCircle, CheckCircle, Pilcrow, FileQuestion, BadgeHelp, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';


// Define the Question type
interface Question {
  id: string;
  questionText: string;
  subject: string;
  system: string;
  answer10M: string;
  answer5M: string;
  diagramURL?: string | null;
  university?: string | null;
  keywords: string[];
  references?: string | null;
}

// AI-generated answer for the seed data
const seedData: Question[] = [
    {
        id: '1',
        questionText: "Describe the clinical features and management of papillary carcinoma thyroid.",
        subject: "Surgery",
        system: "Endocrine",
        keywords: ["thyroid", "papillary", "carcinoma", "surgery"],
        references: "Bailey & Love, Sabiston Textbook of Surgery, Robbins and Cotran Pathologic Basis of Disease",
        university: "Kerala University of Health Sciences",
        diagramURL: "https://placehold.co/600x400.png",
        answer5M: `**Definition:** Papillary Thyroid Carcinoma (PTC) is the most common, well-differentiated thyroid cancer from follicular cells, known for its slow growth and lymphatic spread.\n\n**Clinical Features:** Typically presents as a painless, firm thyroid nodule. Cervical lymphadenopathy can be the first sign. Hoarseness (recurrent laryngeal nerve involvement) and compressive symptoms are late signs.\n\n**Investigations:** Neck Ultrasound is primary, showing suspicious features like microcalcifications and hypoechogenicity. Fine Needle Aspiration Cytology (FNAC) is the diagnostic gold standard, revealing characteristic "Orphan Annie eye" nuclei.\n\n**Management:** Primarily surgical. Total thyroidectomy is standard for most cases >1cm. Post-operative Radioactive Iodine (RAI) ablation is used for high-risk patients to destroy remnant tissue. Lifelong TSH suppression with Levothyroxine is crucial to prevent recurrence. Prognosis is excellent.`,
        answer10M: `
## 1. Definition
Papillary Thyroid Carcinoma (PTC) is the most common type of thyroid cancer, accounting for about 80-85% of all thyroid malignancies. It is a well-differentiated tumor arising from the follicular epithelial cells of the thyroid gland. It is characterized by its papillary architecture and distinctive nuclear features.

## 2. Relevant Anatomy
The thyroid gland is a butterfly-shaped endocrine gland located in the anterior neck, consisting of two lobes connected by an isthmus. It has a rich lymphatic drainage system, primarily to the central and lateral cervical lymph nodes, which is crucial for understanding PTC's metastatic pattern.

## 3. Etiology / Risk Factors
- **Radiation Exposure:** The most well-established risk factor, especially during childhood.
- **Family History:** A first-degree relative with thyroid cancer increases risk.
- **Genetic Syndromes:** Familial adenomatous polyposis (FAP), Gardner syndrome, and Carney complex.
- **Iodine Intake:** High dietary iodine intake has been associated with a higher incidence of PTC.
- **Sex and Age:** More common in females (3:1 ratio) and typically presents between ages 30-50.

## 4. Pathophysiology
PTC is driven by genetic mutations, most commonly:
- **BRAF V600E mutation:** Present in ~50% of cases, associated with more aggressive tumors and higher recurrence rates.
- **RET/PTC rearrangements:** Result from chromosomal inversions or translocations.
The tumor grows slowly and tends to spread via lymphatics to regional lymph nodes. Hematogenous spread is less common but can occur to lungs and bones.

## 5. Clinical Features
- **Painless Thyroid Nodule:** The most common presentation is a firm, solitary, slow-growing neck mass.
- **Cervical Lymphadenopathy:** Palpable neck nodes may be the first sign in up to 20-50% of cases, especially in younger patients.
- **Hoarseness:** Suggests involvement of the recurrent laryngeal nerve.
- **Dysphagia or Dyspnea:** Occurs with large tumors compressing the esophagus or trachea.
- **Metastatic Symptoms:** Rarely, patients may present with symptoms from distant metastases (e.g., cough from lung mets).

## 6. Investigations
- **Ultrasound (USG) of the Neck:** The primary imaging modality. Suspicious features include microcalcifications, hypoechogenicity, irregular margins, taller-than-wide shape, and increased vascularity. It also assesses cervical lymph nodes.
- **Fine Needle Aspiration Cytology (FNAC):** The gold standard for diagnosis. Cytology shows characteristic features like papillary clusters, psammoma bodies, and "Orphan Annie eye" nuclei with nuclear grooves.
- **Blood Tests:**
  - **TSH (Thyroid Stimulating Hormone):** Usually normal. A low TSH may suggest a hyperfunctioning nodule, which is less likely to be malignant.
  - **Serum Thyroglobulin (Tg):** Not a diagnostic test, but a crucial tumor marker for post-operative monitoring.

## 7. Management
- **Surgery:** The mainstay of treatment.
  - **Total Thyroidectomy:** The standard procedure for most PTCs >1 cm, or with high-risk features.
  - **Thyroid Lobectomy:** Can be considered for small (<1 cm), unifocal, intrathyroidal tumors without lymph node involvement or high-risk features.
  - **Therapeutic Neck Dissection:** Central and/or lateral neck dissection is performed if lymph nodes are clinically or radiologically positive.
- **Radioactive Iodine (RAI) Ablation:** Post-operative I-131 therapy is used to ablate any remnant thyroid tissue and treat microscopic residual disease. It is typically recommended for patients with high-risk features (large tumor size, lymph node metastasis, extrathyroidal extension).
- **TSH Suppression Therapy:** Patients are placed on lifelong Levothyroxine to suppress TSH levels, which reduces the risk of tumor recurrence.

## 8. Complications
- **Surgical Complications:** Hypoparathyroidism (leading to hypocalcemia), recurrent laryngeal nerve injury (hoarseness), bleeding.
- **RAI Complications:** Sialadenitis, xerostomia, risk of secondary malignancies (long-term).
- **Recurrence:** Can recur in cervical lymph nodes or distant sites.

## 9. Prognosis
The prognosis for PTC is generally excellent, especially in younger patients with small tumors. The 10-year survival rate is over 95%. Prognosis is worse in older patients (>55 years), with large tumors, extrathyroidal extension, or distant metastases.

## 10. Flowcharts / Tables / Diagrams
\`\`\`mermaid
graph TD
    A[Patient with Thyroid Nodule] --> B{Neck USG + TSH};
    B --> C{Suspicious USG Features?};
    C -- Yes --> D[FNAC];
    C -- No --> E[Follow-up / Monitor];
    D --> F{FNAC shows PTC};
    F -- Yes --> G[Surgical Management: Total Thyroidectomy +/- Neck Dissection];
    F -- No --> H[Benign: Observe or Lobectomy];
    G --> I[Post-op RAI Ablation (if indicated)];
    I --> J[TSH Suppression Therapy + Surveillance];
\`\`\`

## 11. References
- Bailey & Love's Short Practice of Surgery
- Sabiston Textbook of Surgery
- Robbins and Cotran Pathologic Basis of Disease
`
    }
];


export function SolvedQuestionPapersViewer() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching data
    setIsLoading(true);
    setTimeout(() => {
        setQuestions(seedData);
        setIsLoading(false);
    }, 500);
  }, []);

  if (selectedQuestion) {
    return (
        <Card className="shadow-lg rounded-xl border-indigo-500/30">
            <CardHeader>
                <Button onClick={() => setSelectedQuestion(null)} variant="outline" size="sm" className="mb-4 text-xs group">
                    <ArrowLeft className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"/> Back to Question List
                </Button>
                <CardTitle>{selectedQuestion.questionText}</CardTitle>
                <CardDescription>Subject: {selectedQuestion.subject} | System: {selectedQuestion.system}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="10m">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="10m"><FileQuestion className="mr-2 h-4 w-4"/> 10-Mark Answer</TabsTrigger>
                        <TabsTrigger value="5m"><Pilcrow className="mr-2 h-4 w-4"/> 5-Mark Answer</TabsTrigger>
                    </TabsList>
                    <TabsContent value="10m">
                        <ScrollArea className="h-[60vh] mt-4 border rounded-lg p-4 bg-background">
                            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedQuestion.answer10M.replace(/##/g, '<h3>').replace(/\n/g, '<br/>') }} />
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="5m">
                       <ScrollArea className="h-[60vh] mt-4 border rounded-lg p-4 bg-background">
                            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedQuestion.answer5M.replace(/\n/g, '<br/>') }} />
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-blue-500/50 bg-blue-500/10">
        <BookCopy className="h-5 w-5 text-blue-600" />
        <AlertTitle className="font-semibold text-blue-700 dark:text-blue-500">Solved Question Papers</AlertTitle>
        <AlertDescription className="text-blue-600/90 dark:text-blue-500/90 text-xs">
          Browse structured answers to university-style questions. The content is AI-generated and should be used as a study guide.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
            <CardTitle>Solved Question Bank</CardTitle>
            <CardDescription>Select a question to view the detailed, structured answer.</CardDescription>
        </CardHeader>
        <CardContent>
             {isLoading && <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div>}
             {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
             {!isLoading && !error && questions.length === 0 && (
                 <div className="text-center p-8 border border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">Your question bank is empty.</p>
                </div>
             )}
            {!isLoading && !error && questions.length > 0 && (
                <ScrollArea className="h-[50vh]">
                    <div className="space-y-2 pr-4">
                        {questions.map(q => (
                            <button key={q.id} onClick={() => setSelectedQuestion(q)} className="w-full text-left p-3 border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-colors">
                                <p className="font-medium">{q.questionText}</p>
                                <p className="text-xs text-muted-foreground">{q.subject} - {q.system}</p>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
