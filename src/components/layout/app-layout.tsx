// src/components/layout/app-layout.tsx
"use client";

import type { ReactNode } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Button } from '@/components/ui/button';
import { 
  PanelLeftOpen, PanelRightOpen, Settings, LogOut, UserCircle, Sparkles, Info, 
  MessageSquareHeart, BriefcaseMedical, School, Stethoscope, UserCog, Bell 
} from 'lucide-react'; // Keep Bell if used as fallback
import { useSidebar } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Footer } from './footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OnboardingModal } from '@/components/onboarding/onboarding-modal';
import { useProMode, type UserRole } from '@/contexts/pro-mode-context';
import { Badge } from '@/components/ui/badge';
import { AnimatedTagline } from '@/components/layout/animated-tagline';
import { WelcomeDisplay } from '@/components/welcome/welcome-display';
import { NotificationAndAccountPanel } from './notification-and-account-panel';
import type { NotificationItem } from '@/types/notifications';
import { useToast } from '@/hooks/use-toast';

const ToggleSidebarButton = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  if (isMobile) return null;

  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex text-foreground/80 hover:text-foreground" aria-label={state === 'collapsed' ? "Expand sidebar" : "Collapse sidebar"}>
      {state === 'collapsed' ? <PanelRightOpen /> : <PanelLeftOpen />}
    </Button>
  );
};

export function AppLayout({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showWelcomeDisplay, setShowWelcomeDisplay] = useState(false);
  const [clientLoaded, setClientLoaded] = useState(false);
  const { userRole, selectUserRole } = useProMode();

  const { toast } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [activeTabInPanel, setActiveTabInPanel] = useState<'notifications' | 'account'>('account');
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const fetchNotifications = useCallback(() => {
    const mockNotifications: NotificationItem[] = [
      { id: '1', type: 'medication_reminder', title: 'Medication Reminder', body: 'Time for your Amoxicillin (500mg). Take with food.', timestamp: new Date(Date.now() - 1000 * 60 * 5), isRead: false, deepLink: '/medications' },
      { id: '2', type: 'appointment_reminder', title: 'Appointment Soon', body: 'Cardiology check-up with Dr. Smith in 1 hour.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isRead: true, deepLink: '/schedule' },
      { id: '3', type: 'study_material_update', title: 'New Notes Available', body: 'Study notes for "Endocrine System" have been updated.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: false, deepLink: '/medico' },
    ];
    setNotifications(mockNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const unread = notifications.some(n => !n.isRead);
    setHasUnreadNotifications(unread);
  }, [notifications]);

  useEffect(() => {
    if (clientLoaded && notifications.length > 0) {
      const timer = setTimeout(() => {
        const newNotif: NotificationItem = {
          id: `new-${Date.now()}`,
          type: 'general',
          title: 'System Maintenance Scheduled',
          body: 'MediAssistant will undergo brief maintenance tonight at 2 AM.',
          timestamp: new Date(),
          isRead: false,
          deepLink: '/' // Or an announcements page
        };
        setNotifications(prev => [newNotif, ...prev].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
        setHasNewNotification(true); // Trigger comet animation
        setTimeout(() => setHasNewNotification(false), 5000); // Comet duration
      }, 10000); // Simulate new notification after 10s
      return () => clearTimeout(timer);
    }
  }, [clientLoaded, notifications.length]); // Depend on notifications.length to re-trigger if notifications are fetched

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast({ title: "Notifications", description: "All notifications marked as read." });
  }, [toast]);
  
  const handleViewAllNotifications = () => {
    setShowUserPanel(false);
    toast({title: "Navigation", description: "Navigating to all notifications page (Conceptual)."});
    // Implement navigation to a dedicated notifications page if needed
  };

  const handleOpenNotificationSettings = () => {
    setShowUserPanel(false);
    toast({title: "Navigation", description: "Navigating to notification settings page (Conceptual)."});
    // Implement navigation to notification settings page
  };

  const handleToggleUserPanel = () => {
    setShowUserPanel(prev => {
      if (!prev) { // Panel is about to open
        if (hasUnreadNotifications) {
          setActiveTabInPanel('notifications');
        } else {
          setActiveTabInPanel('account');
        }
      }
      return !prev;
    });
  };
  
  const handleLogout = () => {
    toast({ title: "Logged Out", description: "You have been successfully logged out. (Demo)" });
    selectUserRole(null); 
    setShowUserPanel(false); // Close panel on logout
  };

  const getRoleDisplayString = (role: UserRole): string => {
    if (role === 'pro') return 'Professional';
    if (role === 'medico') return 'Medical Student';
    if (role === 'diagnosis') return 'Patient/User';
    return 'User'; // Fallback for null or unexpected role
  };

  useEffect(() => {
    setClientLoaded(true); 
    if (typeof window !== 'undefined') {
      const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
      const welcomeDisplayShownThisSession = sessionStorage.getItem('welcomeDisplayShown') === 'true';
      const storedUserRole = localStorage.getItem('userRole') as UserRole;

      if (!onboardingComplete) {
        setShowOnboardingModal(true);
      } else {
        if (!welcomeDisplayShownThisSession) {
          setShowWelcomeDisplay(true); 
        }
        if (storedUserRole && !userRole) { 
          selectUserRole(storedUserRole);
        }
      }
    }
    
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setScrolled(window.scrollY > 20);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [userRole, selectUserRole]);
  
  const handleOnboardingClose = () => {
    setShowOnboardingModal(false);
    if (typeof window !== 'undefined') { 
      localStorage.setItem('onboardingComplete', 'true');
      const welcomeDisplayShownThisSession = sessionStorage.getItem('welcomeDisplayShown') === 'true';
      if (!welcomeDisplayShownThisSession) {
        setShowWelcomeDisplay(true);
      }
    }
  };

  const handleWelcomeDisplayComplete = () => {
    setShowWelcomeDisplay(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('welcomeDisplayShown', 'true');
    }
  };
  
  if (!clientLoaded) {
    return null; 
  }

  if (showOnboardingModal) {
    return (
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={handleOnboardingClose}
      />
    );
  }

  if (showWelcomeDisplay) {
    return (
      <WelcomeDisplay onDisplayComplete={handleWelcomeDisplayComplete} />
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        side="left"
        className="border-r border-sidebar-border/50"
      >
        <SidebarNav />
      </Sidebar>
      <SidebarInset className="flex flex-col bg-background">
        <header 
          className={cn(
            "sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/70 backdrop-blur-md px-4 md:px-6 transition-all duration-300 ease-in-out fade-in",
            scrolled ? "h-14 shadow-md" : "h-16 border-transparent"
          )}
          id="main-header"
        >
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <div className="hidden md:block">
              <ToggleSidebarButton />
            </div>
            <div className={cn("transition-all duration-300", scrolled ? "opacity-0 md:opacity-100" : "opacity-100")}>
              <Link href="/" className="flex items-center gap-2" aria-label="Go to homepage">
                <Logo simple={scrolled} />
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex flex-1 items-center justify-center px-4">
            {clientLoaded && !showOnboardingModal && !showWelcomeDisplay && <AnimatedTagline />}
          </div>
          
          <nav className="flex items-center gap-2 sm:gap-4">
            {userRole === 'pro' && ( 
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 hidden sm:flex items-center gap-1.5 py-1 px-2.5">
                <Sparkles className="h-3.5 w-3.5" />
                Pro Features
              </Badge>
            )}
             <div className="relative">
                <Button 
                    variant="ghost" 
                    className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full text-foreground/80 hover:text-foreground" 
                    aria-label="Open user menu and notifications"
                    onClick={handleToggleUserPanel}
                >
                   <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarImage src="https://picsum.photos/id/237/200/200" alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback className="bg-gradient-to-br from-primary via-accent to-primary/70 text-primary-foreground">
                       <Bell className="h-4 w-4"/>
                    </AvatarFallback>
                  </Avatar>
                   {(hasUnreadNotifications || hasNewNotification) && (
                      <div className={cn(
                          "profile-notification-ring",
                          hasUnreadNotifications && !hasNewNotification && "profile-notification-ring-pulse",
                          hasNewNotification && "profile-notification-ring-comet" 
                      )} />
                   )}
                </Button>
            </div>
          </nav>
        </header>
        <main className="flex-1 flex flex-col overflow-auto relative">
          {children}
           {showUserPanel && (
            <NotificationAndAccountPanel
              notifications={notifications}
              hasUnreadNotifications={hasUnreadNotifications}
              activeTab={activeTabInPanel}
              setActiveTab={setActiveTabInPanel}
              onClose={() => setShowUserPanel(false)}
              onMarkAllAsRead={handleMarkAllAsRead}
              onMarkAsRead={handleMarkAsRead}
              onViewAllNotifications={handleViewAllNotifications}
              onOpenNotificationSettings={handleOpenNotificationSettings}
              userRole={userRole}
              userName="Dr. Medi User" // Placeholder, fetch from auth
              userEmail="medi.user@example.com" // Placeholder
              avatarUrl="https://picsum.photos/id/237/200/200" // Placeholder
              onLogout={handleLogout}
              onSelectUserRole={selectUserRole}
              getRoleDisplayString={getRoleDisplayString}
            />
          )}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}