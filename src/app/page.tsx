import { ChatInterface } from '@/components/chat/chat-interface';
import { PageWrapper } from '@/components/layout/page-wrapper';

export default function HomePage() {
  return (
    <PageWrapper title="MediAssistant Chat">
      <ChatInterface />
    </PageWrapper>
  );
}
