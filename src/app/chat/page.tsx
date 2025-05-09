// src/app/chat/page.tsx
import { ChatInterface } from '@/components/chat/chat-interface';
import { PageWrapper } from '@/components/layout/page-wrapper';

export default function ChatPage() {
  return (
    <PageWrapper title="MediAssistant Chat" className="flex-1 flex flex-col h-full p-0 sm:p-0">
      <div className="flex-1 flex flex-col h-full p-2 sm:p-4">
         <ChatInterface />
      </div>
    </PageWrapper>
  );
}
