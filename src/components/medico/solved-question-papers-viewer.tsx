// src/components/medico/solved-question-papers-viewer.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookCopy, FileText, Wand2, Loader2, Database, AlertCircle, CheckCircle, Pilcrow, FileQuestion, BadgeHelp, ArrowLeft, ListFilter, Search as SearchIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';


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

// Expanded AI-generated answer data
const seedData: Question[] = [
    {
        id: '1',
        questionText: "Describe the clinical features and management of papillary carcinoma thyroid.",
        subject: "Surgery",
        system: "Endocrine",
        keywords: ["thyroid", "papillary", "carcinoma", "surgery", "endocrine"],
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
    },
    {
        id: '2',
        questionText: "Discuss the etiology, clinical features, and management of varicose veins of the lower limb.",
        subject: "Surgery",
        system: "Vascular",
        keywords: ["varicose", "veins", "vascular", "surgery", "limb"],
        references: "Bailey & Love, Rutherford's Vascular Surgery",
        university: "AIIMS",
        answer5M: `**Definition:** Varicose veins are dilated, tortuous, superficial veins, resulting from valvular incompetence.\n\n**Etiology:** Primary (idiopathic, 95%) due to congenital valve weakness, aggravated by prolonged standing, obesity, pregnancy. Secondary due to DVT, AV fistulas.\n\n**Clinical Features:** Visible, tortuous veins, aching/heaviness, ankle swelling, itching. Complications include pigmentation, lipodermatosclerosis, venous ulcers (CEAP classification C0-C6).\n\n**Investigations:** Hand-held Doppler, Duplex Ultrasound (gold standard) to map reflux at saphenofemoral/saphenopopliteal junctions and perforators.\n\n**Management:** Conservative (leg elevation, compression stockings), Endovenous ablation (laser/RFA), Sclerotherapy, or Surgical (Trendelenburg's operation with stripping and multiple avulsions).`,
        answer10M: `
## 1. Definition
Varicose veins are abnormally dilated, elongated, and tortuous superficial veins of the lower limbs, resulting from incompetence of the venous valves and subsequent venous hypertension.

## 2. Relevant Anatomy
The venous system of the leg consists of superficial veins (Great Saphenous Vein - GSV, Small Saphenous Vein - SSV) and deep veins (Femoral, Popliteal, Tibial). Perforator veins connect these two systems. The key junctions are the Saphenofemoral Junction (SFJ) and Saphenopopliteal Junction (SPJ), where valve failure commonly occurs.

## 3. Etiology / Risk Factors
- **Primary (95%):** Congenital weakness of vein walls/valves.
- **Secondary (5%):** Due to deep vein thrombosis (DVT), congenital AV fistulas, or pelvic tumors causing obstruction.
- **Aggravating Factors:** Prolonged standing, obesity, female gender, pregnancy, family history.

## 4. Pathophysiology
Valve incompetence leads to reflux of blood from the deep to the superficial system, causing venous hypertension. This sustained pressure leads to vein dilation, inflammation, and leakage of fluid and red cells into the interstitium, causing the clinical signs and symptoms.

## 5. Clinical Features (CEAP Classification)
- **C0:** No visible signs.
- **C1:** Telangiectasias or reticular veins.
- **C2:** Varicose veins.
- **C3:** Edema.
- **C4:** Skin changes (pigmentation, eczema, lipodermatosclerosis).
- **C5:** Healed venous ulcer.
- **C6:** Active venous ulcer.
**Symptoms:** Aching, heaviness, throbbing, itching, night cramps, ankle swelling.

## 6. Investigations
- **Clinical Tests (Historical):** Trendelenburg test (for SFJ incompetence), Tourniquet tests (multiple levels), Perthes test (deep vein patency).
- **Hand-Held Doppler:** Simple, office-based test to detect reflux at SFJ and SPJ.
- **Duplex Ultrasound:** **Gold Standard.** Provides anatomical mapping and physiological information about reflux and obstruction in superficial, deep, and perforator veins.

## 7. Management
- **Conservative:** Leg elevation, compression stockings (Class II), lifestyle changes (weight loss, exercise).
- **Sclerotherapy:** Injection of a sclerosant to obliterate small veins (C1). Foam sclerotherapy for larger veins.
- **Endovenous Thermal Ablation (EVLA/RFA):** Minimally invasive, gold standard for GSV/SSV incompetence. A laser or radiofrequency catheter is used to heat and close the vein from within.
- **Surgery:** Reserved for specific cases.
  - **Trendelenburg's Operation:** Flush ligation of the SFJ with stripping of the GSV.
  - **Multiple Phlebectomies/Avulsions:** Removal of smaller varicosities through tiny incisions.

## 8. Complications
- **Superficial thrombophlebitis**
- **Bleeding** from ruptured varicosity
- **Chronic venous insufficiency:** edema, eczema, lipodermatosclerosis, ulceration.

## 9. Prognosis
Treatment generally provides excellent symptomatic relief. Recurrence is common due to the progressive nature of the disease.

## 10. References
- Bailey & Love's Short Practice of Surgery
- Rutherford's Vascular Surgery
`
    },
    {
        id: '3',
        questionText: "Define nephrotic syndrome. Discuss its pathophysiology and management.",
        subject: "Medicine",
        system: "Renal",
        keywords: ["nephrotic", "syndrome", "renal", "kidney", "proteinuria"],
        references: "Harrison's Principles of Internal Medicine, Davidson's Principles and Practice of Medicine",
        university: "JIPMER",
        answer5M: `**Definition:** Nephrotic syndrome is a clinical triad of heavy proteinuria (>3.5g/24h), hypoalbuminemia (<3 g/dL), and peripheral edema. Hyperlipidemia is also a key feature.\n\n**Pathophysiology:** The core defect is damage to the glomerular filtration barrier (podocytes), leading to increased permeability to proteins, especially albumin. Massive protein loss in urine (proteinuria) causes low serum albumin (hypoalbuminemia). This reduces plasma oncotic pressure, causing fluid shift into the interstitium (edema). Hypoalbuminemia also stimulates hepatic lipoprotein synthesis, causing hyperlipidemia.\n\n**Management:**
1.  **General:** Salt and fluid restriction, high-protein diet (controversial), diuretics (for edema).
2.  **Specific:** Based on cause. Corticosteroids are first-line for Minimal Change Disease. Immunosuppressants (e.g., cyclophosphamide) for refractory cases or other glomerulopathies.
3.  **Complications:** ACE inhibitors/ARBs to reduce proteinuria, statins for hyperlipidemia, anticoagulation for thromboembolism prophylaxis.`,
        answer10M: `
## 1. Definition
Nephrotic syndrome is a clinical entity characterized by a tetrad of:
1.  **Heavy Proteinuria:** >3.5 g / 1.73 m² / 24 hours in adults.
2.  **Hypoalbuminemia:** Serum albumin < 3.0 g/dL.
3.  **Peripheral Edema:** Generalized edema (anasarca) is common.
4.  **Hyperlipidemia & Lipiduria:** Elevated serum cholesterol, triglycerides, and lipids in urine.

## 2. Etiology
- **Primary (Idiopathic):** Most common in children.
  - Minimal Change Disease (MCD): Most common cause in children.
  - Focal Segmental Glomerulosclerosis (FSGS): Common cause in adults.
  - Membranous Nephropathy: Another common cause in adults.
- **Secondary:**
  - **Systemic Diseases:** Diabetes Mellitus, Systemic Lupus Erythematosus (SLE), Amyloidosis.
  - **Infections:** Hepatitis B, Hepatitis C, HIV.
  - **Drugs:** NSAIDs, Penicillamine, Gold.
  - **Malignancies:** Lymphoma, Leukemia, solid tumors.

## 3. Pathophysiology
The fundamental abnormality is damage to the glomerular basement membrane (GBM) and podocytes, which form the glomerular filtration barrier.
- **Podocyte Injury:** Effacement (flattening) of podocyte foot processes and loss of slit diaphragms leads to a massive increase in the permeability of the glomerular capillary wall to plasma proteins.
- **Proteinuria:** Large amounts of protein, primarily albumin, are filtered and lost in the urine.
- **Hypoalbuminemia:** Hepatic synthesis of albumin cannot compensate for the massive urinary loss, leading to low serum albumin levels.
- **Edema:** The reduction in plasma oncotic pressure due to hypoalbuminemia causes fluid to shift from the intravascular to the interstitial compartment, leading to pitting edema. Intravascular volume depletion can also activate the Renin-Angiotensin-Aldosterone System (RAAS), promoting salt and water retention, which worsens edema.
- **Hyperlipidemia:** Reduced plasma oncotic pressure and/or low albumin levels stimulate the liver to increase the synthesis of lipoproteins (VLDL, LDL), leading to hypercholesterolemia and hypertriglyceridemia.

## 4. Clinical Features
- **Edema:** Initially periorbital and pedal, progressing to anasarca (generalized edema), ascites, and pleural effusions.
- **Frothy Urine:** Due to heavy proteinuria.
- **Fatigue and Anorexia.**
- **Signs of complications:** Dyspnea (pleural effusion), thrombotic events (e.g., DVT, PE).

## 5. Investigations
- **Urinalysis:** 3+ or 4+ protein on dipstick.
- **24-hour Urine Protein Collection:** Quantifies proteinuria (>3.5g/day).
- **Spot Urine Protein:Creatinine Ratio:** A convenient alternative to 24h collection.
- **Blood Tests:** Serum albumin, lipid profile, renal function tests (creatinine, urea), serological tests for secondary causes (ANA, anti-dsDNA, viral markers).
- **Renal Biopsy:** Often required in adults to determine the underlying histopathological cause and guide specific treatment.

## 6. Management
**A. General / Symptomatic Management:**
- **Edema:** Salt restriction (<2g/day), fluid restriction, loop diuretics (e.g., Furosemide).
- **Diet:** Adequate protein intake (unless severe renal failure).
- **Hyperlipidemia:** Statins (e.g., Atorvastatin).

**B. Management of Complications:**
- **Thromboembolism:** Prophylactic anticoagulation (e.g., Warfarin) is considered in high-risk patients (e.g., serum albumin <2.0-2.5 g/dL, membranous nephropathy).
- **Infection:** Prophylactic antibiotics are not routinely recommended, but prompt treatment of infections is vital. Pneumococcal vaccination is advised.
- **Proteinuria Reduction:** ACE inhibitors (e.g., Ramipril) or ARBs (e.g., Losartan) are used to reduce proteinuria and slow the progression of kidney disease.

**C. Specific Management (based on etiology):**
- **Minimal Change Disease:** Corticosteroids are the mainstay of treatment, with a high response rate.
- **FSGS/Membranous Nephropathy:** May require corticosteroids and other immunosuppressive agents like cyclophosphamide, tacrolimus, or rituximab.
- **Secondary Causes:** Treat the underlying condition (e.g., control blood sugar in diabetes, treat infection).

## 7. References
- Harrison's Principles of Internal Medicine
- Davidson's Principles and Practice of Medicine
`
    }
];


export function SolvedQuestionPapersViewer() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [systemFilter, setSystemFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate fetching data
    setIsLoading(true);
    setTimeout(() => {
        setQuestions(seedData);
        setIsLoading(false);
    }, 500);
  }, []);

  const uniqueSubjects = useMemo(() => ['all', ...Array.from(new Set(questions.map(q => q.subject)))], [questions]);
  const uniqueSystems = useMemo(() => ['all', ...Array.from(new Set(questions.map(q => q.system)))], [questions]);
  
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const subjectMatch = subjectFilter === 'all' || q.subject === subjectFilter;
      const systemMatch = systemFilter === 'all' || q.system === systemFilter;
      const searchMatch = searchQuery === '' || 
                          q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return subjectMatch && systemMatch && searchMatch;
    });
  }, [questions, subjectFilter, systemFilter, searchQuery]);


  if (selectedQuestion) {
    return (
        <Card className="shadow-lg rounded-xl border-indigo-500/30">
            <CardHeader>
                <Button onClick={() => setSelectedQuestion(null)} variant="outline" size="sm" className="mb-4 text-xs group w-fit">
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
        <AlertTitle className="font-semibold text-blue-700 dark:text-blue-500">Theory Q-Bank</AlertTitle>
        <AlertDescription className="text-blue-600/90 dark:text-blue-500/90 text-xs">
          Browse structured answers to university-style questions. The content is AI-generated and should be used as a study guide.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
            <CardTitle>Question Bank</CardTitle>
            <CardDescription>Filter questions by subject or system, or search for keywords.</CardDescription>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full sm:w-[180px] rounded-md"><SelectValue placeholder="Filter by Subject..." /></SelectTrigger>
                <SelectContent>{uniqueSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
               <Select value={systemFilter} onValueChange={setSystemFilter}>
                <SelectTrigger className="w-full sm:w-[180px] rounded-md"><SelectValue placeholder="Filter by System..." /></SelectTrigger>
                <SelectContent>{uniqueSystems.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search questions or keywords..." className="pl-9 rounded-md"/>
              </div>
            </div>
        </CardHeader>
        <CardContent>
             {isLoading && <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div>}
             {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
             {!isLoading && !error && filteredQuestions.length === 0 && (
                 <div className="text-center p-8 border border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">No questions match your criteria.</p>
                </div>
             )}
            {!isLoading && !error && filteredQuestions.length > 0 && (
                <ScrollArea className="h-[50vh]">
                    <div className="space-y-2 pr-4">
                        {filteredQuestions.map(q => (
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
