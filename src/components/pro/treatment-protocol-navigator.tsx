// src/components/pro/treatment-protocol-navigator.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardCheck, Search, BookOpen, Lightbulb, ChevronRight } from 'lucide-react';
import { retrieveGuidelines, GuidelineRetrievalInput, GuidelineRetrievalOutput } from '@/ai/flows/guideline-retrieval';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// This component is a placeholder and conceptual representation.
// Full implementation would involve robust backend logic for guideline fetching, parsing, and display.

interface Protocol {
  id: string;
  title: string;
  summary: string;
  source?: string;
  // fullContent?: string; // For detailed view
}

export function TreatmentProtocolNavigator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<GuidelineRetrievalOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null); // For displaying a single selected protocol

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({ title: "Search term required", description: "Please enter a condition or topic.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setSearchResults(null);
    setSelectedProtocol(null);

    try {
      const input: GuidelineRetrievalInput = { query: searchTerm };
      const result = await retrieveGuidelines(input);
      setSearchResults(result);
      if (!result.guidelines) {
        toast({ title: "No guidelines found", description: `Could not find guidelines for "${searchTerm}".`});
      } else {
         toast({ title: "Guidelines Retrieved", description: `Found information for "${searchTerm}".`});
      }
    } catch (error) {
      console.error("Guideline retrieval error:", error);
      toast({ title: "Search Failed", description: (error as Error).message || "Unknown error", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simulate selecting a protocol for detailed view
  const handleSelectProtocol = (guidelineText: string, source?: string) => {
    setSelectedProtocol({
        id: 'detail-1', // Placeholder ID
        title: `Details for: ${searchTerm}`,
        summary: guidelineText, // Use full text as summary for now
        source: source || "AI Aggregated"
    });
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-md rounded-xl border-green-500/30 bg-gradient-to-br from-card via-card to-green-500/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-green-600" />
            Treatment Protocol Navigator
          </CardTitle>
          <CardDescription>Search for evidence-based treatment guidelines and protocols.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              type="search"
              placeholder="Search by condition, e.g., Hypertension, Sepsis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg flex-grow border-border/70 focus:border-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading} className="rounded-lg">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              <span className="sr-only sm:not-sr-only sm:ml-2">Search</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedProtocol ? (
         <Card className="mt-6 shadow-md rounded-xl">
            <CardHeader>
                <Button variant="outline" size="sm" onClick={() => setSelectedProtocol(null)} className="mb-3 text-xs rounded-md self-start">
                 &larr; Back to Search Results
                </Button>
                <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {selectedProtocol.title}
                </CardTitle>
                {selectedProtocol.source && <CardDescription className="text-xs">Source: {selectedProtocol.source}</CardDescription>}
            </CardHeader>
            <CardContent>
                 <ScrollArea className="h-[400px] p-1 border bg-background rounded-lg">
                    <div className="p-4 whitespace-pre-wrap text-sm prose prose-sm dark:prose-invert max-w-none">
                        {selectedProtocol.summary}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      ) : searchResults && searchResults.guidelines ? (
         <Card className="mt-6 shadow-md rounded-xl">
            <CardHeader>
                <CardTitle className="text-lg">Search Results for "{searchTerm}"</CardTitle>
            </CardHeader>
            <CardContent>
                 <div 
                    className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 cursor-pointer transition-colors"
                    onClick={() => handleSelectProtocol(searchResults.guidelines, searchResults.source)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectProtocol(searchResults.guidelines, searchResults.source)}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-semibold text-md text-primary">
                                {searchResults.source ? `Guideline from ${searchResults.source}` : `Information on ${searchTerm}`}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{searchResults.guidelines.substring(0,150)}...</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground"/>
                    </div>
                </div>
            </CardContent>
        </Card>
      ) : !isLoading && searchTerm ? (
        <div className="text-center py-10 text-muted-foreground">
          <Lightbulb className="h-12 w-12 mx-auto mb-3 text-primary/50" />
          <p>No results found for "{searchTerm}" or initial state.</p>
          <p className="text-xs">Try a different search term or check spelling.</p>
        </div>
      ): null}
    </div>
  );
}