
// src/components/chat/chat-interface.tsx
"use client";

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SendHorizonal, HeartPulse, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { processChatMessage, type ChatMessageInput } from '@/ai/flows/chat-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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


  // Placeholder for speech recognition and synthesis
  useEffect(() => {
    if (isListening && hasMicPermission === null) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setHasMicPermission(true);
          toast({ title: "Microphone access granted." });
          // Start actual speech recognition here in a real implementation
        })
        .catch(err => {
          setHasMicPermission(false);
          setIsListening(false);
          toast({
            variant: "destructive",
            title: "Microphone Access Denied",
            description: "Please enable microphone permissions to use voice input.",
          });
          console.error("Mic permission error:", err);
        });
    } else if (isListening && !hasMicPermission) {
        setIsListening(false); // Turn off if permission was denied previously
         toast({
            variant: "destructive",
            title: "Microphone Access Required",
            description: "Microphone permission was previously denied. Please enable it in your browser settings.",
          });
    }
  }, [isListening, hasMicPermission, toast]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatInput: ChatMessageInput = { message: userMessage.content as string };
      const result = await processChatMessage(chatInput);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: result.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);

      if (isVoiceOutputEnabled && result.response) {
        // Placeholder for speech synthesis
        // const utterance = new SpeechSynthesisUtterance(result.response);
        // window.speechSynthesis.speak(utterance);
        console.log("TTS (simulated):", result.response);
      }

    } catch (error) {
      console.error("Chat processing error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      const errorBotResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${errorMessage}`,
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
                className={`flex items-end gap-2 ${
                  message.sender === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.sender === 'bot' && (
                  <Avatar className="h-8 w-8 self-start">
                    <AvatarImage src="/placeholder-bot.jpg" alt="Bot Avatar" data-ai-hint="robot avatar" />
                    <AvatarFallback>MA</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs lg:max-w-md rounded-lg p-3 shadow ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {typeof message.content === 'string' ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ): (
                    message.content
                  )}
                  <p className="mt-1 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 self-start">
                    <AvatarImage src="https://picsum.photos/id/237/100/100" alt="User Avatar" data-ai-hint="person doctor" />
                    <AvatarFallback>DR</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2">
                <Avatar className="h-8 w-8 self-start">
                  <AvatarImage src="/placeholder-bot.jpg" alt="Bot Avatar" data-ai-hint="robot avatar" />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
                <div className="max-w-xs lg:max-w-md rounded-lg p-3 shadow bg-secondary text-secondary-foreground">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="border-t p-4 bg-background">
        {hasMicPermission === false && !isListening && (
             <Alert variant="destructive" className="mb-2">
              <AlertTitle>Microphone Access Denied</AlertTitle>
              <AlertDescription>
                Voice input is disabled. Please enable microphone permissions in your browser settings and refresh the page.
              </AlertDescription>
            </Alert>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsListening(prev => !prev)}
            disabled={hasMicPermission === false}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? <MicOff className="h-5 w-5 text-destructive" /> : <Mic className="h-5 w-5" />}
          </Button>
          <div className="relative flex-1">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full resize-none pr-3"
              rows={1}
              placeholder={isListening ? "Listening..." : "Type your message..."}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading || isListening}
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
          <Button onClick={handleSendMessage} size="icon" aria-label="Send message" disabled={isLoading || inputValue.trim() === ''}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVoiceOutputEnabled(prev => !prev)}
            aria-label={isVoiceOutputEnabled ? "Disable voice output" : "Enable voice output"}
          >
            {isVoiceOutputEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
