// src/app/medico/library/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useProMode } from '@/contexts/pro-mode-context';
import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Loader2, Library, BookOpen, FileQuestion, StickyNote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { MCQSchema } from '@/ai/schemas/medico-tools-schemas'; // For typing

// Define a unified type for library items
interface StudyLibraryItem {
  id: string;
  type: 'notes' | 'mcqs';
  topic: string;
  createdAt: Timestamp;
  // notes-specific fields
  notes?: string;
  summaryPoints?: string[];
  // mcqs-specific fields
  mcqs?: MCQSchema[];
  difficulty?: 'easy' | 'medium' | 'hard';
  examType?: 'university' | 'neet-pg' | 'usmle';
}

export default function StudyLibraryPage() {
  const { user, loading: authLoading } = useProMode();
  const [libraryItems, setLibraryItems] = useState<StudyLibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLibraryContent = async () => {
      if (!user) {
        if (!authLoading) setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const libraryQuery = query(
          collection(firestore, `users/${user.uid}/studyLibrary`),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(libraryQuery);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as StudyLibraryItem));
        setLibraryItems(items);
      } catch (error) {
        console.error("Error fetching study library:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibraryContent();
  }, [user, authLoading]);

  const savedNotes = libraryItems.filter(item => item.type === 'notes');
  const savedMcqs = libraryItems.filter(item => item.type === 'mcqs');

  if (isLoading || authLoading) {
    return (
      <PageWrapper title="Loading Study Library...">
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </PageWrapper>
    );
  }

  if (!user) {
    return (
      <PageWrapper title="Access Denied">
        <p>You must be logged in to view your Study Library.</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Study Library" className="max-w-7xl mx-auto">
      <Card className="shadow-lg rounded-xl border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Library className="h-7 w-7 text-primary" />
            Your Saved Study Materials
          </CardTitle>
          <CardDescription>
            All your AI-generated notes and MCQs are saved here for easy access and review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes"><BookOpen className="mr-2 h-4 w-4"/>Notes</TabsTrigger>
              <TabsTrigger value="mcqs"><FileQuestion className="mr-2 h-4 w-4"/>MCQs</TabsTrigger>
            </TabsList>
            <TabsContent value="notes" className="mt-4">
              <div className="space-y-4">
                {savedNotes.length === 0 ? (
                  <p className="text-center text-muted-foreground p-8">No study notes saved yet. Generate some from the Medico Hub!</p>
                ) : (
                  savedNotes.map(note => (
                    <Accordion key={note.id} type="single" collapsible>
                        <AccordionItem value={note.id}>
                            <AccordionTrigger className="p-3 bg-muted/50 rounded-lg hover:no-underline">
                                <div className="text-left">
                                    <p className="font-semibold">{note.topic}</p>
                                    <p className="text-xs text-muted-foreground">Saved on {format(note.createdAt.toDate(), 'PPP')}</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 border rounded-b-lg -mt-1">
                                {note.summaryPoints && note.summaryPoints.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-semibold text-md mb-2 text-primary flex items-center"><StickyNote className="mr-2 h-4 w-4"/>Key Summary Points:</h4>
                                    <ul className="list-disc list-inside ml-4 space-y-1 text-sm bg-secondary/50 p-3 rounded-md">
                                    {note.summaryPoints.map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                    </ul>
                                </div>
                                )}
                                <div className="whitespace-pre-wrap text-sm prose prose-sm dark:prose-invert max-w-none">
                                    {note.notes}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="mcqs" className="mt-4">
              <div className="space-y-4">
                {savedMcqs.length === 0 ? (
                   <p className="text-center text-muted-foreground p-8">No MCQs saved yet. Generate some from the Medico Hub!</p>
                ) : (
                  savedMcqs.map(mcqSet => (
                    <Accordion key={mcqSet.id} type="single" collapsible>
                      <AccordionItem value={mcqSet.id}>
                        <AccordionTrigger className="p-3 bg-muted/50 rounded-lg hover:no-underline">
                           <div className="text-left">
                              <p className="font-semibold">{mcqSet.topic}</p>
                              <p className="text-xs text-muted-foreground">
                                {mcqSet.mcqs?.length} MCQs | Difficulty: {mcqSet.difficulty} | Style: {mcqSet.examType} | Saved on {format(mcqSet.createdAt.toDate(), 'PPP')}
                              </p>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 border rounded-b-lg -mt-1">
                          <div className="space-y-4">
                            {mcqSet.mcqs?.map((mcq, index) => (
                              <Card key={index} className="p-3 bg-card/80 shadow-sm rounded-lg">
                                <p className="font-semibold mb-2 text-foreground text-sm">Q{index + 1}: {mcq.question}</p>
                                <ul className="space-y-1.5 text-xs">
                                  {mcq.options.map((opt, optIndex) => (
                                    <li key={optIndex} className={cn("p-2 border rounded-md transition-colors", opt.isCorrect ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-medium" : "border-border")}>
                                      {String.fromCharCode(65 + optIndex)}. {opt.text}
                                    </li>
                                  ))}
                                </ul>
                                {mcq.explanation && (
                                  <p className="text-xs mt-2 text-muted-foreground italic border-t pt-2">
                                    <span className="font-semibold">Explanation:</span> {mcq.explanation}
                                  </p>
                                )}
                              </Card>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
