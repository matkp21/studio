"use client";

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar'; // Ensure useSidebar is correctly imported if used here directly

// Helper component to use useSidebar hook
const ToggleSidebarButton = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  if (isMobile) return null; // Or render a mobile-specific toggle if needed in this position

  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
      {state === 'collapsed' ? <PanelRightOpen /> : <PanelLeftOpen />}
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
};


export function AppLayout({ children }: { children: ReactNode }) {
  // Retrieve sidebar state from cookies or localStorage if persistent state is desired on initial load
  // For now, defaultOpen will handle it.
  // const [isSidebarOpen, setIsSidebarOpen] = React.useState(true); // Example for controlled state

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar
        variant="sidebar" // "sidebar", "floating", "inset"
        collapsible="icon" // "icon", "offcanvas", "none"
        side="left"
      >
        <SidebarNav />
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <div className="md:hidden"> {/* Show SidebarTrigger only on mobile within the header */}
            <SidebarTrigger />
          </div>
          <div className="hidden md:block"> {/* Show custom ToggleSidebarButton on desktop */}
            <ToggleSidebarButton />
          </div>
          {/* Page title or breadcrumbs can go here */}
        </header>
        <main className="flex-1 flex flex-col overflow-auto"> {/* Removed default padding */}
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
