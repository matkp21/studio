// src/app/medico/library/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useProMode } from '@/contexts/pro-mode-context';
import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Loader2, Library, BookOpen, FileQuestion, StickyNote, Users, UploadCloud } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { MCQSchema } from '@/ai/schemas/medico-tools-schemas';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';


// Define types for library items
interface MyLibraryItem {
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

interface CommunityLibraryItem {
  id: string;
  type: 'Note' | 'Mnemonic';
  topic: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
}

export default function StudyLibraryPage() {
  const { user, loading: authLoading } = useProMode();
  const { toast } = useToast();
  
  const [myLibraryItems, setMyLibraryItems] = useState<MyLibraryItem[]>([]);
  const [communityItems, setCommunityItems] = useState<CommunityLibraryItem[]>([]);
  
  const [isLoadingMyLibrary, setIsLoadingMyLibrary] = useState(true);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(true);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadTopic, setUploadTopic] = useState('');
  const [uploadType, setUploadType<'Note' | 'Mnemonic'>>('Note');
  const [uploadContent, setUploadContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);


  useEffect(() => {
    const fetchMyLibraryContent = async () => {
      if (!user) {
        if (!authLoading) setIsLoadingMyLibrary(false);
        return;
      }
      setIsLoadingMyLibrary(true);
      try {
        const libraryQuery = query(
          collection(firestore, `users/${user.uid}/studyLibrary`),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(libraryQuery);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as MyLibraryItem));
        setMyLibraryItems(items);
      } catch (error) {
        console.error("Error fetching study library:", error);
      } finally {
        setIsLoadingMyLibrary(false);
      }
    };

    fetchMyLibraryContent();
  }, [user, authLoading]);
  
  useEffect(() => {
    const fetchCommunityLibrary = async () => {
        setIsLoadingCommunity(true);
        try {
            const communityQuery = query(
                collection(firestore, `communityLibrary`),
                where('status', '==', 'approved'),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(communityQuery);
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as CommunityLibraryItem));
            setCommunityItems(items);
        } catch (error) {
            console.error("Error fetching community library:", error);
        } finally {
            setIsLoadingCommunity(false);
        }
    };
    fetchCommunityLibrary();
  }, []);

  const handleUploadSubmit = async () => {
    if (!uploadTopic.trim() || !uploadContent.trim()) {
        toast({ title: "Missing Information", description: "Please provide a topic and content to upload.", variant: "destructive" });
        return;
    }
    if (!user) {
        toast({ title: "Authentication Required", description: "You must be logged in to upload content.", variant: "destructive" });
        return;
    }
    setIsUploading(true);
    try {
        await addDoc(collection(firestore, 'communityLibrary'), {
            type: uploadType,
            topic: uploadTopic,
            content: uploadContent,
            authorId: user.uid,
            authorName: user.displayName || "Anonymous Medico",
            status: 'pending', // All uploads start as pending for moderation
            createdAt: serverTimestamp(),
        });
        toast({ title: "Upload Successful!", description: "Your content has been submitted for review. Thank you for contributing!" });
        setIsUploadDialogOpen(false);
        setUploadTopic('');
        setUploadType('Note');
        setUploadContent('');
    } catch (error) {
        console.error("Error uploading content:", error);
        toast({ title: "Upload Failed", description: "Could not submit your content. Please try again.", variant: "destructive" });
    } finally {
        setIsUploading(false);
    }
  };


  if (authLoading) {
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
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Library className="h-7 w-7 text-primary" />
              Your Knowledge Hub
            </CardTitle>
            <CardDescription>
              Access your saved study materials and explore content shared by the community.
            </CardDescription>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
                 <Button className="mt-4 sm:mt-0 rounded-lg group">
                    <UploadCloud className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5"/>
                    Upload to Community
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Contribute to the Community Library</DialogTitle>
                    <DialogDescription>Share your notes or mnemonics with other students. Submissions are reviewed before publishing.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div><Label htmlFor="upload-topic">Topic</Label><Input id="upload-topic" value={uploadTopic} onChange={(e) => setUploadTopic(e.target.value)} placeholder="e.g., Brachial Plexus"/></div>
                    <div><Label htmlFor="upload-type">Content Type</Label>
                        <Select value={uploadType} onValueChange={(v) => setUploadType(v as 'Note' | 'Mnemonic')}>
                            <SelectTrigger id="upload-type"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Note">Note</SelectItem><SelectItem value="Mnemonic">Mnemonic</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div><Label htmlFor="upload-content">Content</Label><Textarea id="upload-content" value={uploadContent} onChange={(e) => setUploadContent(e.target.value)} placeholder={`Enter your ${uploadType.toLowerCase()} here...`} className="min-h-[150px]"/></div>
                </div>
                <CardFooter className="p-0 pt-4">
                    <Button onClick={handleUploadSubmit} disabled={isUploading} className="w-full">
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <UploadCloud className="mr-2 h-4 w-4"/>}
                        Submit for Review
                    </Button>
                </CardFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="my-library" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-library"><BookOpen className="mr-2 h-4 w-4"/>My Saved Library</TabsTrigger>
              <TabsTrigger value="community-library"><Users className="mr-2 h-4 w-4"/>Community Library</TabsTrigger>
            </TabsList>

            <TabsContent value="my-library" className="mt-4">
              {isLoadingMyLibrary ? (
                 <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : myLibraryItems.length === 0 ? (
                  <p className="text-center text-muted-foreground p-8">Your personal library is empty. AI-generated notes and MCQs will be saved here automatically.</p>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                    {myLibraryItems.map(item => (
                        <AccordionItem value={item.id} key={item.id}>
                            <AccordionTrigger className="p-3 bg-muted/50 rounded-lg hover:no-underline text-left">
                                <div className="flex items-center gap-2">
                                {item.type === 'notes' ? <StickyNote className="h-4 w-4 text-primary flex-shrink-0"/> : <FileQuestion className="h-4 w-4 text-primary flex-shrink-0"/>}
                                <div>
                                    <p className="font-semibold">{item.topic}</p>
                                    <p className="text-xs text-muted-foreground">Type: {item.type} | Saved: {format(item.createdAt.toDate(), 'PPP')}</p>
                                </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 border rounded-b-lg -mt-1">
                                {item.type === 'notes' && item.notes && (
                                    <>
                                        {item.summaryPoints && item.summaryPoints.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="font-semibold text-md mb-2 text-primary flex items-center"><StickyNote className="mr-2 h-4 w-4"/>Key Points:</h4>
                                            <ul className="list-disc list-inside ml-4 space-y-1 text-sm bg-secondary/50 p-3 rounded-md">
                                                {item.summaryPoints.map((point, index) => <li key={index}>{point}</li>)}
                                            </ul>
                                        </div>
                                        )}
                                        <div className="whitespace-pre-wrap text-sm prose prose-sm dark:prose-invert max-w-none">{item.notes}</div>
                                    </>
                                )}
                                {item.type === 'mcqs' && item.mcqs && (
                                    <div className="space-y-4">
                                    {item.mcqs.map((mcq, index) => (
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
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
              )}
            </TabsContent>

            <TabsContent value="community-library" className="mt-4">
                 {isLoadingCommunity ? (
                    <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                 ) : communityItems.length === 0 ? (
                    <p className="text-center text-muted-foreground p-8">The community library is just getting started. Be the first to contribute!</p>
                 ) : (
                    <Accordion type="single" collapsible className="w-full">
                         {communityItems.map(item => (
                             <AccordionItem value={item.id} key={item.id}>
                                <AccordionTrigger className="p-3 bg-muted/50 rounded-lg hover:no-underline text-left">
                                     <div>
                                        <p className="font-semibold">{item.topic}</p>
                                        <p className="text-xs text-muted-foreground">Type: {item.type} | By: {item.authorName}</p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4 border rounded-b-lg -mt-1 whitespace-pre-wrap text-sm">
                                    {item.content}
                                </AccordionContent>
                            </AccordionItem>
                         ))}
                    </Accordion>
                 )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
