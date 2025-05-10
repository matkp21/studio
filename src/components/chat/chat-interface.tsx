
// src/components/chat/chat-interface.tsx
"use client";

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SendHorizonal, HeartPulse, Mic, MicOff, Volume2, VolumeX, ChevronDown, ArrowDownCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { processChatMessage, type ChatMessageInput } from '@/ai/flows/chat-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TypewriterText } from './typewriter-text';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: ReactNode; // Can be string or JSX for rich content
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
          if(isListening) { 
            // setIsListening(false); // Already handled by onresult and onerror
          }
        };
      }
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, [toast, isListening]);

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
      const initialWelcomeMessageText = "Welcome to MediAssistant Chat! I'm here to assist with your medical queries. How can I help you today?";
      const welcomeMessage: Message = {
        id: `welcome-bot-${Date.now()}`,
        content: (
          <TypewriterText
            text={initialWelcomeMessageText}
            speed={50} 
            onComplete={() => {
              // This is where the "I'm here for you always" message was, it's removed per prior request.
            }}
          />
        ),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      if (isVoiceOutputEnabled) {
        speakText(initialWelcomeMessageText);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

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

    try {
      const chatInput: ChatMessageInput = { message: userMessage.content as string };
      const result = await processChatMessage(chatInput);
      const botResponseContent = result.response;

      const botMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        content: (
          <TypewriterText
            text={botResponseContent}
            speed={50}
          />
        ),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      if (isVoiceOutputEnabled && botResponseContent) {
        speakText(botResponseContent);
      }

    } catch (error) {
      console.error("Chat processing error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      
      const errorBotResponse: Message = {
        id: (Date.now() + Math.random() + 1).toString(),
        content: (
          <TypewriterText
            text={`Sorry, I encountered an error: ${errorMessage}`}
            speed={50} 
          />
        ),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorBotResponse]);
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: errorMessage,
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
      // Show button if user has scrolled up more than a certain threshold (e.g., 100px)
      // and is not already at the bottom.
      const atBottom = scrollHeight - scrollTop <= clientHeight + 5; // +5 for a little tolerance
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
    <Card className="flex-1 flex flex-col shadow-lg rounded-lg overflow-hidden h-full relative">
      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        <ScrollArea className="flex-grow p-4" viewportRef={viewportRef} ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 fade-in ${
                  message.sender === 'user' ? 'justify-end' : ''
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
                  className={`max-w-xs lg:max-w-md rounded-lg p-3 shadow ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
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
              <div className="flex items-end gap-2 fade-in">
                <Avatar className="h-8 w-8 self-start flex-shrink-0">
                  <AvatarImage src="/placeholder-bot.jpg" alt="Bot Avatar" data-ai-hint="robot avatar" />
                   <AvatarFallback className="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 glowing-ring-firebase">
                      <HeartPulse className="h-4 w-4 text-white" />
                    </AvatarFallback>
                </Avatar>
                <div
                  className="max-w-xs lg:max-w-md rounded-lg p-3 shadow bg-secondary text-secondary-foreground flex items-center space-x-2"
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
            className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-background/70 backdrop-blur-sm shadow-lg hover:bg-primary/20 z-10"
            onClick={() => scrollToBottom()}
            aria-label="Scroll to bottom"
          >
            <ArrowDownCircle className="h-5 w-5 text-primary" />
          </Button>
        )}
      </CardContent>
      <div className="border-t p-4 bg-background">
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
          >
            {isListening ? <MicOff className="h-5 w-5 text-destructive" /> : <Mic className="h-5 w-5" />}
          </Button>
          <div className="relative flex-1">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full resize-none pr-3" 
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
                <span>Type your message</span>
                <span className="animate-pulse-medical ml-1.5">
                  <HeartPulse size={14} className="inline-block text-primary/80" />
                </span>
              </div>
            )}
          </div>
          <Button onClick={() => handleSendMessage()} size="icon" aria-label="Send message" disabled={isLoading || inputValue.trim() === ''}>
            {isLoading ? <HeartPulse className="h-5 w-5 animate-ecg-beat text-primary-foreground" /> : <SendHorizonal className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVoiceOutputEnabled(prev => !prev)}
            aria-label={isVoiceOutputEnabled ? "Disable voice output" : "Enable voice output"}
            disabled={!(typeof window !== 'undefined' && 'speechSynthesis' in window)}
          >
            {isVoiceOutputEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}

