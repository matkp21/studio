import { ChatInterface } from '@/components/chat/chat-interface';

export default function HomePage() {
  return (
    // This div will be a direct child of <main> in AppLayout
    // AppLayout's <main> is flex-1 and flex-col.
    // This div will take full height of <main> if it's also flex-1
    <div className="flex-1 flex flex-col p-2 sm:p-4 h-full"> {/* Ensure h-full for ChatInterface to flex-1 properly */}
      {/* Optionally, a title here or integrated into AppLayout based on route */}
      {/* <h1 className="text-2xl font-semibold mb-4 text-foreground">MediAssistant Chat</h1> */}
      <ChatInterface />
    </div>
  );
}
