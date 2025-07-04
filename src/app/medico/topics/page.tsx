// src/app/medico/topics/page.tsx
"use client";

import Link from 'next/link';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FileQuestion, NotebookText, Network } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Topic {
  name: string;
  competencies: string[]; // e.g., ['MI 1.1', 'MI 1.2']
}
interface System {
  name: string;
  topics: Topic[];
}
interface Subject {
  name: string;
  systems: System[];
}

const curriculumData: Subject[] = [
  {
    name: "Surgery",
    systems: [
      {
        name: "Endocrine",
        topics: [
          { name: "Papillary carcinoma thyroid", competencies: ["SU 7.1", "SU 7.2"] },
        ]
      },
      {
        name: "Vascular",
        topics: [
          { name: "Varicose veins", competencies: ["SU 12.1", "SU 12.3"] },
          { name: "Peripheral Vascular Disease", competencies: ["SU 12.4"] },
        ]
      },
       {
        name: "Abdomen",
        topics: [
            { name: "Inguinal hernia", competencies: ["SU 2.1", "SU 2.2"] },
        ]
      },
       {
        name: "Oncology",
        topics: [
            { name: "Carcinoma breast", competencies: ["SU 8.1", "SU 8.2"] },
            { name: "Malignant melanoma", competencies: ["SU 10.1"] },
        ]
      },
    ]
  },
  {
    name: "Medicine",
    systems: [
       {
        name: "Renal",
        topics: [
            { name: "Nephrotic syndrome", competencies: ["IM 5.1", "IM 5.3"] },
        ]
      },
      {
        name: "Cardiology",
        topics: [
            { name: "Rheumatic heart disease", competencies: ["IM 1.5"] },
        ]
      },
      {
        name: "Hepatology",
        topics: [
            { name: "Cirrhosis of liver", competencies: ["IM 3.4"] },
        ]
      },
      {
        name: "Infectious Diseases",
        topics: [
          { name: "Dengue fever", competencies: ["IM 9.1"] },
        ]
      },
    ]
  },
  {
      name: "Pediatrics",
      systems: [
          {
            name: "Respiratory",
            topics: [
                { name: "Pneumonia in children", competencies: ["PE 3.1"] },
            ]
          }
      ]
  }
];


export default function TopicExplorerPage() {
  return (
    <PageWrapper title="Curriculum Topic Explorer" className="max-w-7xl mx-auto">
      <Card className="shadow-lg rounded-xl border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Network className="h-7 w-7 text-primary" />
            Browse Topics
          </CardTitle>
          <CardDescription>
            Explore topics organized by subject and system, aligned with the medical curriculum. Launch study tools directly from any topic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {curriculumData.map((subject) => (
              <AccordionItem value={subject.name} key={subject.name}>
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">{subject.name}</AccordionTrigger>
                <AccordionContent>
                  <Accordion type="multiple" className="w-full pl-4">
                    {subject.systems.map((system) => (
                      <AccordionItem value={`${subject.name}-${system.name}`} key={system.name}>
                        <AccordionTrigger>{system.name}</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 pl-4">
                            {system.topics.map((topic) => (
                              <li key={topic.name} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 border-b last:border-b-0 hover:bg-muted/50 rounded-md">
                                <div>
                                  <p className="font-medium">{topic.name}</p>
                                  <div className="flex gap-1 mt-1">
                                      {topic.competencies.map(code => <Badge key={code} variant="outline" className="text-xs">{code}</Badge>)}
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-2 sm:mt-0">
                                  <Button asChild variant="ghost" size="sm" className="text-xs">
                                    <Link href={`/medico?tool=theorycoach-generator&topic=${encodeURIComponent(topic.name)}`}>
                                      <NotebookText className="mr-1 h-3.5 w-3.5" /> Notes
                                    </Link>
                                  </Button>
                                  <Button asChild variant="ghost" size="sm" className="text-xs">
                                    <Link href={`/medico?tool=mcq&topic=${encodeURIComponent(topic.name)}`}>
                                      <FileQuestion className="mr-1 h-3.5 w-3.5" /> MCQs
                                    </Link>
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
