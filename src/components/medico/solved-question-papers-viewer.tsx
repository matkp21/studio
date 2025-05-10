
// src/components/medico/solved-question-papers-viewer.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookCopy, Search, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Placeholder data - in a real app, this would come from Firestore or an API
const samplePapers = [
  { id: 'ped2023', title: 'Pediatrics - 2023 Final Prof', subject: 'Pediatrics', year: 2023, contentPreview: 'Section A: Essays. 1. Discuss Thalassemia Major...' },
  { id: 'sur2022', title: 'Surgery - 2022 Paper II', subject: 'Surgery', year: 2022, contentPreview: 'Short Notes: 1. Burns Management...' },
  { id: 'med2023', title: 'Medicine - 2023 Paper I', subject: 'Medicine', year: 2023, contentPreview: 'Discuss the management of Myocardial Infarction...' },
];

export function SolvedQuestionPapersViewer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<typeof samplePapers[0] | null>(null);

  const filteredPapers = samplePapers.filter(paper => 
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.year.toString().includes(searchTerm)
  );

  // This component is a placeholder. Full PDF viewing or rich text rendering would be more complex.
  // A real implementation might involve fetching PDF URLs from Firestore and using a PDF viewer component.

  return (
    <div className="space-y-6">
        <Alert variant="default" className="border-blue-500/50 bg-blue-500/10">
            <BookCopy className="h-5 w-5 text-blue-600" />
            <AlertTitle className="font-semibold text-blue-700 dark:text-blue-500">Placeholder Feature</AlertTitle>
            <AlertDescription className="text-blue-600/90 dark:text-blue-500/90 text-xs">
            This is a conceptual interface for viewing solved question papers. Full PDF viewing and content retrieval from a database would be implemented in a complete version.
            </AlertDescription>
      </Alert>
      <div className="flex items-center gap-2 p-1">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search papers by title, subject, or year..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg text-base py-2.5 border-border/70 focus:border-primary"
        />
      </div>

      {selectedPaper ? (
        <Card className="shadow-md rounded-xl mt-6 border-indigo-500/30 bg-gradient-to-br from-card via-card to-indigo-500/5">
          <CardHeader>
            <Button variant="outline" size="sm" onClick={() => setSelectedPaper(null)} className="mb-2 text-xs rounded-md self-start">
              &larr; Back to List
            </Button>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-600" />
              {selectedPaper.title}
            </CardTitle>
            <CardDescription>Subject: {selectedPaper.subject} | Year: {selectedPaper.year}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] p-1 border bg-background rounded-lg">
              <div className="p-4 whitespace-pre-wrap text-sm prose prose-sm dark:prose-invert max-w-none">
                <h3 className="font-semibold mb-2">Content Preview:</h3>
                <p>{selectedPaper.contentPreview}</p>
                <p className="mt-4 text-muted-foreground italic">(Full paper content and detailed solutions would be displayed here. This might involve rendering Markdown, HTML, or embedding a PDF viewer.)</p>
                {/* Example of how questions might be listed */}
                <div className="mt-6">
                    <h4 className="font-bold">Sample Questions (Illustrative):</h4>
                    <ul className="list-disc pl-5 mt-2">
                        <li>Define Shock and classify its types. Discuss the pathophysiology and management of hypovolemic shock. (Essay)</li>
                        <li>Write short notes on: Diabetic Ketoacidosis. (Short Note)</li>
                        <li>Which of the following is the most common organism causing community-acquired pneumonia? (MCQ)</li>
                    </ul>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[450px] p-1 border bg-muted/20 rounded-lg">
          {filteredPapers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {filteredPapers.map(paper => (
                <Card 
                  key={paper.id} 
                  className="shadow-sm rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedPaper(paper)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md">{paper.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {paper.subject} - {paper.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground truncate">{paper.contentPreview}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No papers found matching your search criteria.</p>
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}
