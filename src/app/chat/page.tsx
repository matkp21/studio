// src/app/chat/page.tsx
"use client"; // Add "use client" for useState and useEffect

import { useState, useEffect } from 'react'; // Import useState and useEffect
import { ChatInterface } from '@/components/chat/chat-interface';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { ChatInterfaceAnimation } from '@/components/chat/chat-interface-animation'; // Import the animation
import { Loader2 } from 'lucide-react';

export default function ChatPage() {
  const [showAnimation, setShowAnimation] = useState(true); // State to control animation
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Logic to show animation only once per session or based on some condition could be added here
    // For now, it shows every time the page is loaded.
    // To show only once per session, you could use sessionStorage:
    // const animationShown = sessionStorage.getItem('chatAnimationShown');
    // if (animationShown) {
    //   setShowAnimation(false);
    // } else {
    //   sessionStorage.setItem('chatAnimationShown', 'true');
    // }
  }, []);


  if (!isClient) {
    return (
      <PageWrapper title="Loading Chat..." className="flex-1 flex flex-col h-full p-0 sm:p-0">
        <div className="flex-1 flex flex-col h-full items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </PageWrapper>
    );
  }

  if (showAnimation) {
    return <ChatInterfaceAnimation onAnimationComplete={() => setShowAnimation(false)} />;
  }

  return (
    <PageWrapper title="MediAssistant Chat" className="flex-1 flex flex-col h-full p-0 sm:p-0">
      <div className="flex-1 flex flex-col h-full p-2 sm:p-4">
         <ChatInterface />
      </div>
    </PageWrapper>
  );
}
