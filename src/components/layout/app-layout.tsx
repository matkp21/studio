// src/components/layout/app-layout.tsx
"use client";

import type { ReactNode } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Button } from '@/components/ui/button';
import { 
  PanelLeftOpen, PanelRightOpen, Settings, LogOut, UserCircle, Sparkles, Info, 
  MessageSquareHeart, BriefcaseMedical, School, Stethoscope, UserCog, Bell, ChevronDown, Edit, HeartPulse
} from 'lucide-react';
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
import { NotificationPanelCompact } from './notification-panel-compact';
import type { NotificationItem } from '@/types/notifications';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

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
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false); // For comet animation

  const fetchNotifications = useCallback(() => {
    const mockNotifications: NotificationItem[] = [
      { id: '1', type: 'medication_reminder', title: 'Medication Reminder', body: 'Time for Amoxicillin (500mg).', timestamp: new Date(Date.now() - 1000 * 60 * 5), isRead: false, deepLink: '/medications' },
      { id: '2', type: 'appointment_reminder', title: 'Appointment Soon', body: 'Cardiology check-up in 1 hour.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isRead: true, deepLink: '/schedule' },
      { id: '3', type: 'study_material_update', title: 'New Notes Available', body: 'Endocrine System notes updated.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: false, deepLink: '/medico' },
      { id: '4', type: 'general', title: 'Welcome to MediAssistant v1.1!', body: 'Explore new features and improvements.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), isRead: true, deepLink: '/' },
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
    if (clientLoaded && notifications.length > 0 && !sessionStorage.getItem('initialNewNotificationShown')) {
      const timer = setTimeout(() => {
        const newNotif: NotificationItem = {
          id: `new-${Date.now()}`, type: 'system_update', title: 'System Maintenance Scheduled',
          body: 'Brief maintenance tonight at 2 AM.', timestamp: new Date(), isRead: false, deepLink: '/'
        };
        setNotifications(prev => [newNotif, ...prev].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
        setHasNewNotification(true);
        sessionStorage.setItem('initialNewNotificationShown', 'true');
        setTimeout(() => setHasNewNotification(false), 7000); 
      }, 15000); 
      return () => clearTimeout(timer);
    }
  }, [clientLoaded, notifications.length]);


  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast({ title: "Notifications", description: "All notifications marked as read." });
  }, [toast]);
  
  const handleViewAllNotifications = () => {
    setShowNotificationPanel(false); // Close compact panel first
    // Here you would navigate to a full notifications page, e.g., router.push('/notifications/all')
    toast({title: "Navigation", description: "Navigating to all notifications page (Conceptual)."});
  };

  const handleLogout = () => {
    toast({ title: "Logged Out", description: "You have been successfully logged out. (Demo)" });
    selectUserRole(null); 
    setShowNotificationPanel(false); // Close panel on logout
  };

  const getRoleDisplayString = (role: UserRole | null): string => {
    if (role === 'pro') return 'Professional';
    if (role === 'medico') return 'Medical Student';
    if (role === 'diagnosis') return 'Patient/User';
    return 'Guest';
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
    // Render nothing or a very minimal loader on the server / before client hydration
    // This helps avoid hydration mismatches with localStorage/sessionStorage logic
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
             <DropdownMenu onOpenChange={(open) => { if(!open) setShowNotificationPanel(false); }}>
                <DropdownMenuTrigger asChild>
                  <Button 
                      variant="ghost" 
                      className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full text-foreground/80 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                      aria-label="Open user menu"
                  >
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                        <AvatarImage src="https://picsum.photos/id/237/200/200" alt="User Avatar" data-ai-hint="user doctor" />
                         <AvatarFallback className="bg-gradient-to-br from-primary via-accent to-primary/70 text-primary-foreground">
                            <HeartPulse className="h-5 w-5"/>
                        </AvatarFallback>
                    </Avatar>
                    {(hasUnreadNotifications || hasNewNotification) && (
                        <div className={cn(
                            "profile-notification-ring",
                            hasUnreadNotifications && !hasNewNotification && "profile-notification-ring-pulse", // Pulse for existing unread
                            hasNewNotification && "profile-notification-ring-comet" // Comet for new arrival
                        )} />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-lg border-border/50 bg-card">
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="https://picsum.photos/id/237/200/200" alt="User Avatar" data-ai-hint="user avatar" />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                                DR
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-foreground">Dr. Medi User</p>
                            <p className="text-xs text-muted-foreground">medi.user@example.com</p>
                        </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <UserCircle className="h-4 w-4 text-muted-foreground" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4 text-muted-foreground" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowNotificationPanel(prev => !prev)} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" /> Notifications
                    </div>
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 px-1.5 text-xs">{unreadCount}</Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
                        <UserCog className="h-4 w-4 text-muted-foreground" /> 
                        <span>Mode: {getRoleDisplayString(userRole)}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={userRole || ''} onValueChange={(role) => selectUserRole(role as UserRole)}>
                            <DropdownMenuRadioItem value="pro" className="flex items-center gap-2 cursor-pointer">
                                <BriefcaseMedical className="h-4 w-4 text-purple-500" /> Professional
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="medico" className="flex items-center gap-2 cursor-pointer">
                                <School className="h-4 w-4 text-sky-500" /> Medical Student
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="diagnosis" className="flex items-center gap-2 cursor-pointer">
                                <Stethoscope className="h-4 w-4 text-green-500" /> Patient/User
                            </DropdownMenuRadioItem>
                             <DropdownMenuRadioItem value="" className="flex items-center gap-2 cursor-pointer">
                                <UserCircle className="h-4 w-4 text-muted-foreground" /> Guest
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </nav>
        </header>
        <main className="flex-1 flex flex-col overflow-auto relative">
          {children}
          {/* NotificationPanelCompact is now triggered by the DropdownMenuItem */}
          {showNotificationPanel && (
            <NotificationPanelCompact
              notifications={notifications}
              onClose={() => setShowNotificationPanel(false)}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onViewAllNotifications={handleViewAllNotifications}
            />
          )}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
