// src/components/medico/note-summarizer.tsx
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileText, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { summarizeNoteText, type MedicoNoteSummarizerInput, type MedicoNoteSummarizerOutput } from '@/ai/agents/medico/NoteSummarizerAgent';
import { Textarea } from '../ui/textarea';

const getDocument = async (url: string) => {
  const { getDocument } = await import('pdfjs-dist');
  return getDocument(url).promise;
};

const formSchema = z.object({
  file: z.instanceof(File, { message: "Please upload a file." })
    .refine(file => file.size > 0, "File cannot be empty.")
    .refine(file => file.size < 5 * 1024 * 1024, "File size must be less than 5MB.")
    .refine(file => ["application/pdf", "text/plain", "image/jpeg"].includes(file.type), "Only .pdf, .txt, and .jpeg files are supported."),
  format: z.enum(['bullet', 'flowchart', 'table']).default('bullet'),
});

type SummarizerFormValues = z.infer<typeof formSchema>;

export function NoteSummarizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [summaryResult, setSummaryResult] = useState<MedicoNoteSummarizerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<SummarizerFormValues>({
    resolver: zodResolver(formSchema),
  });

  const extractTextFromFile = async (file: File) => {
    if (file.type === 'text/plain') {
      return file.text();
    }
    if (file.type === 'application/pdf') {
      const { GlobalWorkerOptions } = await import('pdfjs-dist');
      GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer });
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
      }
      return fullText;
    }
    throw new Error("Unsupported file type for text extraction");
  };

  const onSubmit: SubmitHandler<SummarizerFormValues> = async (data) => {
    setIsLoading(true);
    setSummaryResult(null);
    setExtractedText(null);
    setError(null);

    try {
      let input: MedicoNoteSummarizerInput;
      const fileType = data.file.type;

      if (fileType === 'application/pdf' || fileType === 'text/plain') {
        const text = await extractTextFromFile(data.file);
        setExtractedText(text);
        if (text.length < 100) {
          throw new Error("Document content is too short to summarize effectively.");
        }
        input = { text, format: data.format };
      } else if (fileType === 'image/jpeg') {
        const reader = new FileReader();
        const dataUriPromise = new Promise<string>((resolve, reject) => {
            reader.onerror = reject;
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(data.file);
        });
        const imageDataUri = await dataUriPromise;
        setExtractedText(null); // No text preview for images
        input = { imageDataUri, format: data.format };
      } else {
        throw new Error("Unsupported file type.");
      }

      const result = await summarizeNoteText(input);
      setSummaryResult(result);
      toast({
        title: "Summary Generated!",
        description: `Your document has been summarized as a ${data.format}.`,
      });

    } catch (err) {
      console.error("Summarization error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        title: "Summarization Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="file-upload-summarizer" className="text-base">Upload Notes File</FormLabel>
                  <FormControl>
                    <Input
                      id="file-upload-summarizer"
                      type="file"
                      accept=".pdf,.txt,.jpeg,.jpg"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="rounded-lg text-base py-2.5 border-border/70 focus:border-primary file:text-sm file:font-medium"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">Supports .pdf, .txt, and .jpeg files up to 5MB.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="format-select-summarizer" className="text-base">Summary Format</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger id="format-select-summarizer" className="rounded-lg text-base py-2.5 border-border/70 focus:border-primary">
                        <SelectValue placeholder="Select a format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bullet">Bullet Points</SelectItem>
                      <SelectItem value="flowchart">Flowchart (Mermaid)</SelectItem>
                      <SelectItem value="table">Table (Markdown)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto rounded-lg py-3 text-base group" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Summarize Notes
              </>
            )}
          </Button>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {summaryResult && (
        <Card className="shadow-md rounded-xl mt-6 border-fuchsia-500/30 bg-gradient-to-br from-card via-card to-fuchsia-500/5">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="h-6 w-6 text-fuchsia-600" />
                    AI-Generated Summary
                </CardTitle>
                 <CardDescription>Format: <span className="font-semibold capitalize">{summaryResult.format}</span>. You can copy the content below.</CardDescription>
            </CardHeader>
             <CardContent>
                <ScrollArea className="h-auto max-h-[400px] p-1 border bg-background rounded-lg">
                    <pre className="p-4 whitespace-pre-wrap text-sm font-sans">
                        <code>{summaryResult.summary}</code>
                    </pre>
                </ScrollArea>
            </CardContent>
        </Card>
      )}

      {extractedText && !summaryResult && (
        <Card className="shadow-md rounded-xl mt-6">
            <CardHeader>
                <CardTitle>Extracted Text</CardTitle>
                <CardDescription>Review the text extracted from your document before summarization.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-48 border rounded-lg bg-muted/30 p-2">
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{extractedText}</p>
                </ScrollArea>
            </CardContent>
        </Card>
      )}

    </div>
  );
}