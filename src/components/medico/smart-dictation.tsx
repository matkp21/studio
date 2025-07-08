
// src/components/medico/smart-dictation.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Settings, Wand2, Loader2, FileText, AlertTriangle, Info, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { structureNote } from '@/ai/agents/medico/NoteStructurerAgent';

interface DictationSegment {
  timestamp: Date;
  text: string;
}

export function SmartDictation() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalizedTranscript, setFinalizedTranscript] = useState<DictationSegment[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<'general' | 'soap'>('general');
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognitionImpl = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionImpl) {
        const recognitionInstance = new SpeechRecognitionImpl();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const finalText = event.results[i][0].transcript.trim();
              setFinalizedTranscript(prev => [...prev, { timestamp: new Date(), text: `${finalText}.` }]);
              setTranscript('');
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          setTranscript(interimTranscript);
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          toast({
            variant: 'destructive',
            title: 'Voice Input Error',
            description: `Could not recognize speech: ${event.error}`,
          });
          setIsListening(false);
        };
        
        recognitionInstance.onend = () => {
            setIsListening(false);
        };
        recognitionRef.current = recognitionInstance;
      }
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, [toast]);

  const toggleListening = async () => {
    if (!recognitionRef.current) {
        toast({title: "Dictation Not Supported", description: "Speech recognition is not available in your browser.", variant: "destructive"});
        return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast({ title: "Dictation Stopped" });
    } else {
      if (hasMicPermission === null || hasMicPermission === false) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          setHasMicPermission(true);
          toast({ title: "Microphone access granted."});
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          setHasMicPermission(false);
          toast({
            variant: "destructive",
            title: "Microphone Access Denied",
            description: "Please enable microphone permissions for dictation.",
          });
          console.error("Mic permission error:", err);
          return;
        }
      } else {
         recognitionRef.current.start();
         setIsListening(true);
         toast({ title: "Dictation Started" });
      }
    }
  };
  
  const combinedTranscript = finalizedTranscript.map(seg => seg.text).join(' ') + transcript;
  
  const handleStructureNote = async () => {
    if (!combinedTranscript.trim()) {
        toast({ title: "No Text", description: "There is no dictated text to structure.", variant: "destructive" });
        return;
    }
    setIsLoadingAi(true);
    try {
        const result = await structureNote({ rawText: combinedTranscript, template: selectedTemplate });
        const structuredSegment: DictationSegment = {
            timestamp: new Date(),
            text: result.structuredText,
        };
        setFinalizedTranscript([structuredSegment]); // Replace all previous segments with the single structured one
        setTranscript(''); // Clear any interim transcript
        toast({ title: "Note Structured!", description: `Your note has been formatted as a ${selectedTemplate.toUpperCase()} note.` });
    } catch (err) {
        toast({ title: "Structuring Failed", description: err instanceof Error ? err.message : "An unknown error occurred.", variant: "destructive" });
    } finally {
        setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-orange-500/50 bg-orange-500/10">
        <Info className="h-5 w-5 text-orange-600" />
        <AlertTitle className="font-semibold text-orange-700 dark:text-orange-500">Smart Dictation Tool</AlertTitle>
        <AlertDescription className="text-orange-600/90 dark:text-orange-500/90 text-xs">
          Use your voice to dictate notes. After dictating, use the "Structure with AI" button to organize your text into a clean format like a SOAP note. This uses client-side speech recognition.
        </AlertDescription>
      </Alert>

      <Card className="shadow-md rounded-xl border-teal-500/30 bg-gradient-to-br from-card via-card to-teal-500/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Mic className="h-6 w-6 text-teal-600" />
            Smart Dictation & Note Assistant
          </CardTitle>
          <CardDescription>Dictate your clinical notes and let AI assist with structuring.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
             <Button onClick={toggleListening} disabled={hasMicPermission === false && typeof window !== 'undefined' && !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)} className={cn("w-full sm:w-auto rounded-lg py-3 text-base group", isListening && "bg-red-600 hover:bg-red-700")}>
              {isListening ? <MicOff className="mr-2 h-5 w-5" /> : <Mic className="mr-2 h-5 w-5" />}
              {isListening ? 'Stop Dictation' : 'Start Dictation'}
            </Button>
            <div className="flex-grow w-full sm:w-auto">
                <Label htmlFor="note-template" className="sr-only">Note Template for Structuring</Label>
                <Select value={selectedTemplate} onValueChange={(v) => setSelectedTemplate(v as any)}>
                    <SelectTrigger id="note-template" className="w-full rounded-lg">
                        <SelectValue placeholder="Select template for AI structuring" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="general">General Cleanup</SelectItem>
                        <SelectItem value="soap">SOAP Note</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleStructureNote} variant="outline" className="w-full sm:w-auto rounded-lg text-sm" disabled={isLoadingAi || !combinedTranscript.trim()}>
                {isLoadingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BrainCircuit className="mr-2 h-4 w-4"/>}
                Structure with AI
            </Button>
          </div>
          {hasMicPermission === false && (
             <Alert variant="destructive" className="rounded-lg">
                <AlertTriangle className="h-4 w-4"/>
                <AlertTitle>Microphone Access Denied</AlertTitle>
                <AlertDescription className="text-xs">Please enable microphone permissions in your browser settings to use dictation.</AlertDescription>
             </Alert>
          )}
           {typeof window !== 'undefined' && !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && hasMicPermission === null && (
             <Alert variant="destructive" className="rounded-lg">
                <AlertTriangle className="h-4 w-4"/>
                <AlertTitle>Dictation Not Supported</AlertTitle>
                <AlertDescription className="text-xs">Your browser does not support speech recognition. Try Chrome or Edge.</AlertDescription>
             </Alert>
            )}

          <div>
            <Label htmlFor="dictation-output" className="font-semibold">Dictated Notes</Label>
            <ScrollArea className="h-[250px] mt-1 border rounded-lg p-3 bg-background">
              <Textarea
                id="dictation-output"
                value={combinedTranscript}
                readOnly
                placeholder={isListening ? "Listening..." : "Your dictated notes will appear here."}
                className="min-h-full resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-sm whitespace-pre-wrap"
              />
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 pt-4 border-t">
            <Button className="w-full sm:w-auto rounded-lg" onClick={() => toast({title: "Note Saved (Demo)", description: "Your clinical note has been saved."})}>
                <FileText className="mr-2 h-4 w-4"/>Save Note
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
