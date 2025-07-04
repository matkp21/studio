// src/components/chat/chat-interface.tsx
"use client";

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SendHorizonal, HeartPulse, Mic, MicOff, Volume2, VolumeX, ArrowDownCircle, BookCopy, FileQuestion } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { processChatMessage, type ChatMessageInput } from '@/ai/agents/ChatAgent';
import { generateTheoryAnswer, type TheoryCoachInput, type TheoryCoachOutput } from '@/ai/agents/medico/TheoryCoachAgent';
import { generateMCQs, type MedicoMCQGeneratorInput, type MedicoMCQGeneratorOutput, type MCQSchema as SingleMCQ } from '@/ai/agents/medico/MCQGeneratorAgent';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TypewriterText } from './typewriter-text';
import { cn } from '@/lib/utils';
import { useProMode } from '@/contexts/pro-mode-context';

interface Message {
  id: string;
  content: ReactNode; // Can be string or JSX for rich content
  sender: 'user' | 'bot';
  timestamp: Date;
  isCommandResponse?: boolean; // To style medico tool responses differently
  isErrorResponse?: boolean; // To style error messages from the bot
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { userRole } = useProMode();

  const [isListening, setIsListening] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);


  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[event.results.length - 1][0].transcript.trim();
          setInputValue(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          toast({
            variant: 'destructive',
            title: 'Voice Input Error',
            description: `Could not recognize speech: ${event.error}`,
          });
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          // setIsListening(false) handled by onresult/onerror
        };
      }
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, [toast]);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && text) {
      speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else if (!text) {
      console.warn("SpeakText: No text to speak.");
    }
     else {
      console.warn("Speech Synthesis API not supported or no text provided.");
    }
  };

  useEffect(() => {
    if (messages.length === 0 && !isLoading) {
      let welcomeText = "Welcome to MediAssistant Chat! I'm here to assist with your queries. How can I help you today?";
      if (userRole === 'medico') {
        welcomeText += "\nAs a medico user, you can try commands like `/notes <topic>` or `/mcq <topic> <number_of_questions>`."
      }
      const welcomeMessage: Message = {
        id: `welcome-bot-${Date.now()}`,
        content: <TypewriterText text={welcomeText} speed={50} />, // Adjusted speed
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      if (isVoiceOutputEnabled) {
        speakText(welcomeText);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]); 

  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (hasMicPermission === null) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          setHasMicPermission(true);
          toast({ title: "Microphone access granted." });
          recognitionRef.current?.start();
          setIsListening(true);
        } catch (err) {
          setHasMicPermission(false);
          toast({
            variant: "destructive",
            title: "Microphone Access Denied",
            description: "Please enable microphone permissions for voice input.",
          });
          console.error("Mic permission error:", err);
        }
      } else if (hasMicPermission) {
        recognitionRef.current?.start();
        setIsListening(true);
      } else {
        toast({
          variant: "destructive",
          title: "Microphone Access Required",
          description: "Microphone permission was previously denied. Enable it in browser settings.",
        });
      }
    }
  };

  const formatMCQResponse = (mcqData: MedicoMCQGeneratorOutput): ReactNode => {
    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-base">MCQs for: {mcqData.topicGenerated}</h4>
        {mcqData.mcqs.map((mcq: SingleMCQ, index: number) => (
          <Card key={index} className="p-3 bg-card/70 shadow-sm">
            <p className="font-medium mb-1">Q{index + 1}: {mcq.question}</p>
            <ul className="list-disc list-inside ml-4 text-sm space-y-0.5">
              {mcq.options.map((opt, optIndex) => (
                <li key={optIndex} className={cn(opt.isCorrect && "text-green-600 dark:text-green-400 font-semibold")}>
                  {String.fromCharCode(65 + optIndex)}. {opt.text}
                </li>
              ))}
            </ul>
            {mcq.explanation && <p className="text-xs mt-1.5 text-muted-foreground italic">Explanation: {mcq.explanation}</p>}
          </Card>
        ))}
      </div>
    );
  };

  const formatTheoryAnswerResponse = (notesData: TheoryCoachOutput, topic: string): ReactNode => {
     return (
      <div className="space-y-3">
        <h4 className="font-semibold text-base">Study Notes for: {topic}</h4>
        <div className="text-sm whitespace-pre-wrap bg-card/70 p-3 rounded-md shadow-sm prose prose-sm dark:prose-invert max-w-none">{notesData.notes}</div>
        {notesData.summaryPoints && notesData.summaryPoints.length > 0 && (
          <div className="mt-2">
            <h5 className="font-medium text-sm mb-1">Key Summary Points:</h5>
            <ul className="list-disc list-inside ml-4 text-sm space-y-0.5">
              {notesData.summaryPoints.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
        )}
      </div>
    );
  }


  const handleSendMessage = async (messageContent?: string) => {
    const currentMessage = (typeof messageContent === 'string' ? messageContent : inputValue).trim();
    if (currentMessage === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    if (typeof messageContent !== 'string') { 
        setInputValue('');
    }
    setIsLoading(true);

    let botResponseContent: ReactNode | string = "Sorry, I couldn't process that.";
    let isCommandResp = false;
    let isErrorRespFlag = false;

    try {
      if (userRole === 'medico' && currentMessage.startsWith('/')) {
        const [command, ...args] = currentMessage.split(' ');
        const fullArgs = args.join(' ').trim();

        if (command === '/notes') {
          isCommandResp = true;
          const topic = fullArgs;
          if (!topic) {
            botResponseContent = "Please provide a topic for notes. Usage: `/notes <topic>` (e.g., `/notes Diabetes Mellitus`)";
            isErrorRespFlag = true;
          } else {
            const notesInput: TheoryCoachInput = { topic, answerLength: '10-mark' }; // Default to 10-mark for chat
            const result = await generateTheoryAnswer(notesInput);
            botResponseContent = formatTheoryAnswerResponse(result, topic);
            if (isVoiceOutputEnabled && typeof result.notes === 'string') speakText(`Generated study notes for ${topic}. Please check the chat for details.`);
          }
        } else if (command === '/mcq') {
          isCommandResp = true;
          // Regex to separate topic from an optional count at the end
          const mcqArgsMatch = fullArgs.match(/^(.*?)(?:\s+(\d+))?$/);
          const topic = mcqArgsMatch?.[1]?.trim();
          const countStr = mcqArgsMatch?.[2];
          const count = countStr ? parseInt(countStr, 10) : 5; // Default to 5 MCQs
          
          if (!topic) {
            botResponseContent = "Please provide a topic for MCQs. Usage: `/mcq <topic> [number_of_questions]` (e.g., `/mcq Cardiology 5`)";
             isErrorRespFlag = true;
          } else if (isNaN(count) || count < 1 || count > 10) {
            botResponseContent = "Invalid number of questions. Please provide a number between 1 and 10.";
             isErrorRespFlag = true;
          }
          else {
            const mcqInput: MedicoMCQGeneratorInput = { topic, count, difficulty: 'medium', examType: 'university' };
            const result = await generateMCQs(mcqInput);
            botResponseContent = formatMCQResponse(result);
            if (isVoiceOutputEnabled) speakText(`Generated ${result.mcqs.length} MCQs for ${topic}. Check the chat for details.`);
          }
        } else {
           botResponseContent = `Unknown medico command: ${command}. Try /notes <topic> or /mcq <topic> [count]. For general chat, just type your message.`;
           isErrorRespFlag = true;
        }
      } else {
        const chatInput: ChatMessageInput = { message: userMessage.content as string };
        const result = await processChatMessage(chatInput);
        botResponseContent = result.response;
        if (isVoiceOutputEnabled && typeof botResponseContent === 'string') speakText(botResponseContent);
      }

      const botMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        content: typeof botResponseContent === 'string' ? <TypewriterText text={botResponseContent} speed={50} /> : botResponseContent,
        sender: 'bot',
        timestamp: new Date(),
        isCommandResponse: isCommandResp,
        isErrorResponse: isErrorRespFlag,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Chat processing error:", error);
      isErrorRespFlag = true;
      const errorMessageText = error instanceof Error ? error.message : "An unknown error occurred.";
      
      const errorBotResponse: Message = {
        id: (Date.now() + Math.random() + 1).toString(),
        content: <TypewriterText text={`Sorry, I encountered an error: ${errorMessageText}`} speed={50} />,
        sender: 'bot',
        timestamp: new Date(),
        isErrorResponse: true,
      };
      setMessages((prevMessages) => [...prevMessages, errorBotResponse]);
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: errorMessageText,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior });
    }
  };
  
  useEffect(() => {
    scrollToBottom('auto');
  }, [messages]);


  const handleScroll = () => {
    if (viewportRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
      const atBottom = scrollHeight - scrollTop <= clientHeight + 5; 
      setShowScrollToBottom(!atBottom && scrollTop < scrollHeight - clientHeight - 50);
    }
  };

  useEffect(() => {
    const currentViewport = viewportRef.current;
    if (currentViewport) {
      currentViewport.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentViewport) {
        currentViewport.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);


  return (
    <Card className="chat-glow-container flex-1 flex flex-col shadow-lg rounded-xl h-full relative bg-gradient-to-br from-card via-card to-secondary/10 dark:from-card dark:via-card dark:to-secondary/5">
      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        <ScrollArea className="flex-grow p-4" viewportRef={viewportRef} ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 fade-in ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'bot' && (
                  <Avatar className="h-8 w-8 self-start flex-shrink-0">
                    <AvatarImage src="/placeholder-bot.jpg" alt="Bot Avatar" data-ai-hint="robot avatar" />
                     <AvatarFallback className="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 glowing-ring-firebase">
                      <HeartPulse className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-xs lg:max-w-md rounded-xl p-3 shadow-md transition-all duration-300",
                     message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-br-none' 
                      : message.isErrorResponse 
                        ? 'bg-destructive/20 border border-destructive/50 text-destructive-foreground rounded-bl-none animate-error-highlight' 
                        : message.isCommandResponse 
                          ? "bg-gradient-to-tr from-accent/20 via-accent/30 to-accent/40 border border-accent/60 text-accent-foreground rounded-bl-none shadow-accent/20"
                          : 'bg-secondary text-secondary-foreground rounded-bl-none shadow-secondary/20'
                  )}
                >
                  {message.content}
                  <p className="mt-1 text-xs opacity-70 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 self-start flex-shrink-0">
                    <AvatarImage src="https://picsum.photos/id/237/100/100" alt="User Avatar" data-ai-hint="person doctor" />
                    <AvatarFallback>DR</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2 fade-in justify-start">
                <Avatar className="h-8 w-8 self-start flex-shrink-0">
                  <AvatarImage src="/placeholder-bot.jpg" alt="Bot Avatar" data-ai-hint="robot avatar" />
                   <AvatarFallback className="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 glowing-ring-firebase">
                      <HeartPulse className="h-4 w-4 text-white" />
                    </AvatarFallback>
                </Avatar>
                <div
                  className="max-w-xs lg:max-w-md rounded-xl p-3 shadow-md bg-secondary text-secondary-foreground flex items-center space-x-2 rounded-bl-none"
                >
                  <HeartPulse className="h-5 w-5 text-primary animate-ecg-beat" />
                  <p className="text-sm italic">MediAssistant is thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
         {showScrollToBottom && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-20 right-4 h-10 w-10 rounded-full bg-background/70 backdrop-blur-sm shadow-lg hover:bg-primary/20 z-10" 
            onClick={() => scrollToBottom()}
            aria-label="Scroll to bottom"
          >
            <ArrowDownCircle className="h-5 w-5 text-primary" />
          </Button>
        )}
      </CardContent>
      <div className="border-t p-4 bg-background/80 backdrop-blur-sm">
        {hasMicPermission === false && (
             <Alert variant="destructive" className="mb-2">
              <AlertTitle>Microphone Access Denied</AlertTitle>
              <AlertDescription>
                Voice input is disabled. Please enable microphone permissions in your browser settings.
              </AlertDescription>
            </Alert>
        )}
        {typeof window !== 'undefined' && !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && (
          <Alert variant="destructive" className="mb-2">
            <AlertTitle>Voice Input Not Supported</AlertTitle>
            <AlertDescription>
              Your browser does not support voice input. Try a different browser like Chrome or Edge.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleListening}
            disabled={hasMicPermission === false || !(typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window))}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            className="hover:bg-primary/10"
          >
            {isListening ? <MicOff className="h-5 w-5 text-destructive" /> : <Mic className="h-5 w-5 text-primary" />}
          </Button>
          <div className="relative flex-1">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full resize-none pr-3 rounded-xl border-border/70 focus:border-primary input-focus-glow" 
              rows={1}
              placeholder={isListening ? "Listening..." : ""} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading || isListening}
              aria-label="Message input"
            />
             {inputValue === '' && !isListening && (
              <div
                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center"
                aria-hidden="true"
              >
                <span>Type your message {userRole === 'medico' && "or /command"}</span>
                <span className="animate-pulse-medical ml-1.5">
                  <HeartPulse size={14} className="inline-block text-primary/80" />
                </span>
              </div>
            )}
          </div>
          <Button onClick={() => handleSendMessage()} size="icon" aria-label="Send message" disabled={isLoading || inputValue.trim() === ''} className="rounded-full">
            {isLoading ? <HeartPulse className="h-5 w-5 animate-ecg-beat text-primary-foreground" /> : <SendHorizonal className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVoiceOutputEnabled(prev => !prev)}
            aria-label={isVoiceOutputEnabled ? "Disable voice output" : "Enable voice output"}
            disabled={!(typeof window !== 'undefined' && 'speechSynthesis' in window)}
            className="hover:bg-primary/10"
          >
            {isVoiceOutputEnabled ? <Volume2 className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
          </Button>
        </div>
        {userRole === 'medico' && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-x-4 gap-y-1 flex-wrap">
            <p className="flex items-center gap-1"><BookCopy size={12} /> Try: <code className="bg-muted px-1 py-0.5 rounded">/notes &lt;topic&gt;</code></p>
            <p className="flex items-center gap-1"><FileQuestion size={12} /> Try: <code className="bg-muted px-1 py-0.5 rounded">/mcq &lt;topic&gt; [num]</code></p>
          </div>
        )}
      </div>
    </Card>
  );
}
