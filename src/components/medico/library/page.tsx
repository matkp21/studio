// src/app/medico/library/page.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProMode } from '@/contexts/pro-mode-context';
import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, getDoc, limit, startAfter, DocumentData } from 'firebase/firestore';
import { Loader2, Library, BookOpen, FileQuestion, Users, UploadCloud, BookmarkCheck, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';
import { Accordion } from '@/components/ui/accordion';
import type { MCQSchema, MedicoFlashcard, EssayQuestion, StructuredAnswer } from '@/ai/schemas/medico-tools-schemas';
import { LibraryCard, type BaseLibraryItem } from './library-card';
import { StructuredAnswerDetails } from './structured-answer-details';

// Redefine types locally for this specific page's needs
type LibraryItemType = 'notes' | 'mcqs' | 'summary' | 'mnemonic' | 'communityNote' | 'communityMnemonic' | 'flowchart' | 'flashcards' | 'examPaper';

interface MyLibraryItem extends BaseLibraryItem {
  notes?: string;
  summaryPoints?: string[];
  mcqs?: MCQSchema[];
  essays?: EssayQuestion[];
  difficulty?: 'easy' | 'medium' | 'hard';
  examType?: 'university' | 'neet-pg' | 'usmle';
  summary?: string;
  originalFileName?: string;
  mnemonic?: string;
  explanation?: string;
  imageUrl?: string;
  flowchartData?: string;
  flashcards?: MedicoFlashcard[];
  subject?: string;
  system?: string;
}

interface CommunityLibraryItem extends BaseLibraryItem {
  content: string;
  authorId: string;
  authorName: string;
  status: 'pending' | 'approved' | 'rejected';
  subject?: string;
  system?: string;
}

type CombinedLibraryItem = MyLibraryItem | CommunityLibraryItem;

const subjects = ["Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology", "Microbiology", "Forensic Medicine", "Community Medicine", "Ophthalmology", "ENT", "General Medicine", "General Surgery", "Obstetrics & Gynaecology", "Pediatrics", "Other"] as const;
const systems = ["Cardiovascular", "Respiratory", "Gastrointestinal", "Neurological", "Musculoskeletal", "Endocrine", "Genitourinary", "Integumentary", "Hematological", "Immunological", "Other"] as const;

export default function StudyLibraryPage() {
  const { user, loading: authLoading } = useProMode();
  const { toast } = useToast();
  const router = useRouter();
  
  const [myLibraryItems, setMyLibraryItems] = useState<MyLibraryItem[]>([]);
  const [communityItems, setCommunityItems] = useState<CommunityLibraryItem[]>([]);
  const [bookmarkedItemIds, setBookmarkedItemIds] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<CombinedLibraryItem | null>(null);
  
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadTopic, setUploadTopic] = useState('');
  const [uploadType, setUploadType] = useState<'communityNote' | 'communityMnemonic'>('communityNote');
  const [uploadContent, setUploadContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSystem, setSelectedSystem] = useState<string>('');

  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchMyLibrary = useCallback(async (uid: string, loadMore = false) => {
    setIsDataLoading(true);
    try {
      let q = query(collection(firestore, `users/${uid}/studyLibrary`), orderBy('createdAt', 'desc'), limit(12));
      if (loadMore && lastVisible) {
        q = query(collection(firestore, `users/${uid}/studyLibrary`), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(12));
      }
      const snapshot = await getDocs(q);
      const newItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MyLibraryItem));
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(newItems.length > 0);
      setMyLibraryItems(prev => loadMore ? [...prev, ...newItems] : newItems);
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Could not fetch library content.", variant: "destructive" });
    } finally {
      setIsDataLoading(false);
    }
  }, [lastVisible, toast]);


  useEffect(() => {
    if (user && !authLoading) {
      fetchMyLibrary(user.uid);
      // Fetch community items, bookmarks etc.
      const fetchOtherData = async () => {
        const communityQuery = query(collection(firestore, 'communityLibrary'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
        const communitySnapshot = await getDocs(communityQuery);
        setCommunityItems(communitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityLibraryItem)));
        
        const userDocRef = doc(firestore, `users/${user.uid}`);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setBookmarkedItemIds(userDocSnap.data().bookmarkedItems || []);
        }
      };
      fetchOtherData();
    } else if (!authLoading) {
      setIsDataLoading(false);
    }
  }, [user, authLoading, fetchMyLibrary]);

  const handleToggleBookmark = useCallback(async (itemId: string) => {
    if (!user) return;
    const userDocRef = doc(firestore, `users/${user.uid}`);
    const isCurrentlyBookmarked = bookmarkedItemIds.includes(itemId);

    try {
      await updateDoc(userDocRef, { bookmarkedItems: isCurrentlyBookmarked ? arrayRemove(itemId) : arrayUnion(itemId) });
      setBookmarkedItemIds(prev => isCurrentlyBookmarked ? prev.filter(id => id !== itemId) : [...prev, itemId]);
      toast({ title: isCurrentlyBookmarked ? "Bookmark Removed" : "Bookmarked!" });
    } catch (error) {
      console.error("Error updating bookmarks:", error);
      toast({ title: "Error", description: "Could not update bookmark.", variant: "destructive" });
    }
  }, [user, bookmarkedItemIds, toast]);
  
  const filteredMyLibrary = useMemo(() => {
    if (!selectedSubject && !selectedSystem) return myLibraryItems;
    return myLibraryItems.filter(item => 
      (!selectedSubject || item.subject === selectedSubject) &&
      (!selectedSystem || item.system === selectedSystem)
    );
  }, [myLibraryItems, selectedSubject, selectedSystem]);

  const filteredCommunityItems = useMemo(() => {
    if (!selectedSubject && !selectedSystem) return communityItems;
    return communityItems.filter(item => 
      (!selectedSubject || item.subject === selectedSubject) &&
      (!selectedSystem || item.system === selectedSystem)
    );
  }, [communityItems, selectedSubject, selectedSystem]);
  
  const filteredBookmarkedItems = useMemo(() => {
    const allItems = [...myLibraryItems, ...communityItems];
    const bookmarked = allItems.filter(item => bookmarkedItemIds.includes(item.id));
    if (!selectedSubject && !selectedSystem) return bookmarked;
    return bookmarked.filter(item => 
      (!selectedSubject || (item as MyLibraryItem).subject === selectedSubject) &&
      (!selectedSystem || (item as MyLibraryItem).system === selectedSystem)
    );
  }, [myLibraryItems, communityItems, bookmarkedItemIds, selectedSubject, selectedSystem]);

  const handleUploadSubmit = async () => {
    if (!uploadTopic.trim() || !uploadContent.trim() || !user) return;
    setIsUploading(true);
    try {
        await addDoc(collection(firestore, 'communityLibrary'), {
            type: uploadType, topic: uploadTopic, content: uploadContent,
            authorId: user.uid, authorName: user.displayName || user.email || "Anonymous Medico",
            status: 'pending', createdAt: serverTimestamp(),
        });
        toast({ title: "Upload Successful!", description: "Your content has been submitted for review." });
        setIsUploadDialogOpen(false);
        setUploadTopic(''); setUploadType('communityNote'); setUploadContent('');
    } catch (error) {
        toast({ title: "Upload Failed", variant: "destructive" });
    } finally {
        setIsUploading(false);
    }
  };

  const handleActionFromDialog = (tool: 'mcq' | 'flashcards' | 'notes') => {
    if (!activeItem) return;
    router.push(`/medico/${tool}?topic=${encodeURIComponent(activeItem.topic)}`);
    setActiveItem(null);
  };
  
  const renderItemDetails = (item: CombinedLibraryItem) => {
    const myItem = item as MyLibraryItem;
    const commItem = item as CommunityLibraryItem;

    switch(item.type) {
        case 'notes': case 'summary':
            return <MarkdownRenderer content={myItem.notes || myItem.summary || ''} />;
        case 'mcqs':
            return (
              <div className="space-y-4">{myItem.mcqs?.map((mcq, index) => (
                <Card key={index} className="p-3 bg-card/80 shadow-sm rounded-lg">
                  <p className="font-semibold mb-2 text-foreground text-sm">Q{index + 1}: {mcq.question}</p>
                  <ul className="space-y-1.5 text-xs">
                    {mcq.options.map((opt, i) => <li key={i} className={cn("p-2 border rounded-md", opt.isCorrect && "border-green-500 bg-green-500/10")}>{opt.text}</li>)}
                  </ul>
                  {mcq.explanation && <div className="text-xs mt-2 text-muted-foreground italic border-t pt-2"><MarkdownRenderer content={`**Explanation:** ${mcq.explanation}`} /></div>}
                </Card>
              ))}</div>
            );
        case 'examPaper':
            return (
              <div className="space-y-4">
                {myItem.essays?.map((essay, index) => (
                  <Card key={`essay-${index}`} className="p-3 bg-card/80 shadow-sm rounded-lg">
                    <p className="font-semibold mb-2 text-foreground text-sm">Essay Q{index + 1}: {essay.question}</p>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="answer-10m"><AccordionTrigger>View 10-Mark Answer</AccordionTrigger><AccordionContent><StructuredAnswerDetails answer={essay.answer10M} /></AccordionContent></AccordionItem>
                      <AccordionItem value="answer-5m"><AccordionTrigger>View 5-Mark Answer</AccordionTrigger><AccordionContent><MarkdownRenderer content={essay.answer5M} /></AccordionContent></AccordionItem>
                    </Accordion>
                  </Card>
                ))}
              </div>
            );
        default: return <p>Details not available for this item type.</p>;
    }
  }
  
  const renderTabContent = (items: CombinedLibraryItem[], tabName: string, showLoadMore = false) => {
    if (isDataLoading && items.length === 0) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (items.length === 0) return <p className="text-center text-muted-foreground p-8">{`No items found in ${tabName}.`}</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
                <LibraryCard key={item.id} item={item} isBookmarked={bookmarkedItemIds.includes(item.id)}
                    onToggleBookmark={() => handleToggleBookmark(item.id)} onViewItem={setActiveItem} />
            ))}
            {showLoadMore && hasMore && (
              <Button onClick={() => user && fetchMyLibrary(user.uid, true)} disabled={isDataLoading} className="sm:col-span-2 md:col-span-3 lg:col-span-4">
                {isDataLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Load More'}
              </Button>
            )}
        </div>
    );
  };


  if (authLoading) return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  if (!user) return <div className="text-center p-8">Please log in to access the library.</div>;

  return (
    <div className="max-w-7xl mx-auto py-6">
      <Card className="shadow-lg rounded-xl border-border/50">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
            <CardTitle className="text-2xl flex items-center gap-2 text-primary"><Library className="h-7 w-7" />Knowledge Hub</CardTitle>
            <CardDescription>Your personal and community-driven study library.</CardDescription>
            </div>
             <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild><Button className="mt-4 sm:mt-0 rounded-lg group"><UploadCloud className="mr-2 h-4 w-4"/>Contribute</Button></DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Contribute to the Community Library</DialogTitle><DialogDescription>Share your notes or mnemonics.</DialogDescription></DialogHeader>
                <div className="space-y-4 py-2">
                    <div><Label htmlFor="upload-topic">Topic</Label><Input id="upload-topic" value={uploadTopic} onChange={(e) => setUploadTopic(e.target.value)} /></div>
                    <div><Label htmlFor="upload-type">Type</Label><Select value={uploadType} onValueChange={(v) => setUploadType(v as any)}><SelectTrigger id="upload-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="communityNote">Note</SelectItem><SelectItem value="communityMnemonic">Mnemonic</SelectItem></SelectContent></Select></div>
                    <div><Label htmlFor="upload-content">Content</Label><Textarea id="upload-content" value={uploadContent} onChange={(e) => setUploadContent(e.target.value)} /></div>
                </div>
                <CardFooter className="p-0 pt-4"><Button onClick={handleUploadSubmit} disabled={isUploading} className="w-full">{isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Submit for Review</Button></CardFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-4 p-2 border bg-muted/50 rounded-lg">
             <Select value={selectedSubject} onValueChange={setSelectedSubject}><SelectTrigger><SelectValue placeholder="Filter by Subject..." /></SelectTrigger><SelectContent><SelectItem value="">All Subjects</SelectItem>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
             <Select value={selectedSystem} onValueChange={setSelectedSystem}><SelectTrigger><SelectValue placeholder="Filter by System..." /></SelectTrigger><SelectContent><SelectItem value="">All Systems</SelectItem>{systems.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
             <Button variant="ghost" onClick={() => { setSelectedSubject(''); setSelectedSystem(''); }} className="text-xs">Clear</Button>
          </div>
          <Tabs defaultValue="my-library" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my-library"><BookOpen className="mr-2 h-4 w-4"/>My Library</TabsTrigger>
              <TabsTrigger value="community"><Users className="mr-2 h-4 w-4"/>Community</TabsTrigger>
              <TabsTrigger value="bookmarked"><BookmarkCheck className="mr-2 h-4 w-4"/>Bookmarked</TabsTrigger>
            </TabsList>
            <TabsContent value="my-library" className="mt-4">{renderTabContent(filteredMyLibrary, "personal library", true)}</TabsContent>
            <TabsContent value="community" className="mt-4">{renderTabContent(filteredCommunityItems, "community library")}</TabsContent>
            <TabsContent value="bookmarked" className="mt-4">{renderTabContent(filteredBookmarkedItems, "bookmarks")}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!activeItem} onOpenChange={(isOpen) => !isOpen && setActiveItem(null)}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[90vh] flex flex-col p-0">
          {activeItem && (<><DialogHeader className="p-6 pb-2"><DialogTitle>{activeItem.topic}</DialogTitle><DialogDescription>Type: {activeItem.type}</DialogDescription></DialogHeader><ScrollArea className="flex-grow p-6 pt-0">{renderItemDetails(activeItem)}</ScrollArea><DialogFooter className="p-4 border-t flex-wrap justify-start gap-2 bg-muted/50"><h4 className="font-semibold text-sm w-full">Launch a tool with this topic:</h4><Button size="sm" variant="outline" onClick={() => handleActionFromDialog('notes')}>Notes</Button><Button size="sm" variant="outline" onClick={() => handleActionFromDialog('mcq')}>MCQs</Button><Button size="sm" variant="outline" onClick={() => handleActionFromDialog('flashcards')}>Flashcards</Button></DialogFooter></>)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
