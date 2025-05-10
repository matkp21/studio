// src/components/pro/research-summarizer.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Library, Lightbulb, Search, Loader2, FileText, BookOpen } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';

interface SummarizedArticle {
  title: string;
  authors: string;
  journal: string;
  year: number;
  summary: string;
  keywords: string[];
  doiLink?: string;
}

export function ResearchSummarizer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summaries, setSummaries] = useState<SummarizedArticle[]>([]);

  const handleSearchAndSummarize = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a clinical question or topic to search.");
      return;
    }
    setIsLoading(true);
    setSummaries([]);
    // Simulate API call to PubMed/Semantic Scholar and AI summarization
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Placeholder results
    const results: SummarizedArticle[] = [
      {
        title: `Efficacy of New Drug X vs. Standard Care for Condition Y: A Randomized Controlled Trial`,
        authors: "Smith J, Doe A, et al.",
        journal: "New England Journal of Medicine",
        year: 2023,
        summary: `This large multicenter RCT found that New Drug X significantly improved outcomes (Primary Endpoint: 25% reduction in mortality, p=0.002) compared to standard care for patients with Condition Y. Key secondary endpoints also favored New Drug X. Adverse event profiles were comparable, with mild GI upset being slightly more common in the New Drug X group. Conclusion: New Drug X represents a promising new therapeutic option for Condition Y. (AI-generated summary of a fictional paper)`,
        keywords: ["Condition Y", "New Drug X", "RCT", "Mortality"],
        doiLink: "https://doi.org/10.xxxx/NEJMxxxxxxx"
      },
      {
        title: `Systematic Review and Meta-Analysis of Treatment Z for Disease Q`,
        authors: "Lee B, Kim C, et al.",
        journal: "The Lancet",
        year: 2022,
        summary: `This comprehensive meta-analysis of 15 RCTs (n=5200 patients) evaluated Treatment Z for Disease Q. The pooled results suggest a modest benefit in symptom reduction (Standardized Mean Difference -0.35, 95% CI -0.50 to -0.20) but no significant impact on long-term progression. Heterogeneity was moderate. Further research on specific patient subgroups is warranted. (AI-generated summary of a fictional paper)`,
        keywords: ["Disease Q", "Treatment Z", "Meta-Analysis", "Systematic Review"],
        doiLink: "https://doi.org/10.xxxx/Sxxxx(xx)xxxxx-x"
      }
    ];
    setSummaries(searchTerm.toLowerCase().includes("condition y") || searchTerm.toLowerCase().includes("drug x") ? [results[0]] : results);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-teal-500/50 bg-teal-500/10">
            <Lightbulb className="h-5 w-5 text-teal-600" />
            <AlertTitle className="font-semibold text-teal-700 dark:text-teal-500">Conceptual Tool</AlertTitle>
            <AlertDescription className="text-teal-600/90 dark:text-teal-500/90 text-xs">
            This interface is for the AI-Powered Research & Literature Summarizer. A full version would integrate with actual medical databases (e.g., PubMed API), perform semantic search, and use advanced NLP models for summarization.
            </AlertDescription>
      </Alert>

      <Card className="shadow-md rounded-xl border-cyan-500/30 bg-gradient-to-br from-card via-card to-cyan-500/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Library className="h-6 w-6 text-cyan-600" />
            AI-Powered Research &amp; Literature Summarizer
          </CardTitle>
          <CardDescription>Enter a clinical question or topic to find and summarize relevant medical literature.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
              <Label htmlFor="research-query">Clinical Question or Topic</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                    id="research-query" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    placeholder="e.g., Best treatment for early-stage diabetic nephropathy" 
                    className="rounded-lg flex-grow"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchAndSummarize()}
                />
                <Button onClick={handleSearchAndSummarize} disabled={isLoading} className="rounded-lg">
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                    <span className="sr-only sm:not-sr-only sm:ml-2">Search & Summarize</span>
                </Button>
              </div>
            </div>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Searching and summarizing literature...</p>
        </div>
      )}

      {!isLoading && summaries.length > 0 && (
        <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Summarized Articles for "{searchTerm}"</h3>
            <ScrollArea className="h-[50vh] p-1 border rounded-lg bg-background">
                <div className="p-3 space-y-4">
                {summaries.map((article, index) => (
                    <Card key={index} className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-md hover:text-primary transition-colors">
                            {article.doiLink ? (
                                <a href={article.doiLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                                    {article.title} <BookOpen className="h-4 w-4 text-muted-foreground"/>
                                </a>
                            ) : article.title }
                        </CardTitle>
                        <CardDescription className="text-xs">
                        {article.authors} ({article.year}). <em>{article.journal}</em>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-2 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">{article.summary}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                            <span className="text-xs font-medium mr-1">Keywords:</span>
                            {article.keywords.map(kw => <Badge key={kw} variant="secondary" className="text-xs">{kw}</Badge>)}
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </ScrollArea>
        </div>
      )}
       {!isLoading && summaries.length === 0 && searchTerm && (
        <div className="text-center py-10 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 text-primary/50" />
          <p>No articles found or summarized for "{searchTerm}".</p>
          <p className="text-xs">Try refining your search query.</p>
        </div>
      )}
    </div>
  );
}
