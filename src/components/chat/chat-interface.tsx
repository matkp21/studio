
// src/components/chat/chat-interface.tsx
"use client";

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SendHorizonal, HeartPulse, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { processChatMessage, type ChatMessageInput } from '@/ai/flows/chat-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TypewriterText } from './typewriter-text';

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
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);


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
          // Optionally auto-send message after voice input:
          // if (transcript) handleSendMessage(transcript);
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
          if(isListening) { // if isListening is still true, it means it stopped unexpectedly
             // setIsListening(false); // Already handled by onresult and onerror generally
          }
        };
      }
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, [toast, isListening]);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && text) {
      speechSynthesis.cancel(); // Cancel any ongoing speech
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
    // Send a welcome message only once when the component mounts
    // and if there are no messages yet.
    if (messages.length === 0 && !isLoading) {
      const initialWelcomeMessageText = "Welcome to MediAssistant Chat! I'm here to assist with your medical queries. How can I help you today?";
      const welcomeMessage: Message = {
        id: `welcome-bot-${Date.now()}`,
        content: (
          <TypewriterText
            text={initialWelcomeMessageText}
            speed={50} 
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
  }, []); // Run once on mount

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
            // onComplete removed as the final helper message is no longer chained here
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
             // onComplete removed as the final helper message (error variant) is no longer chained here
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

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <Card className="flex-1 flex flex-col shadow-lg rounded-lg overflow-hidden h-full">
      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
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

