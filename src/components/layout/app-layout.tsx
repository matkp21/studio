// src/components/layout/app-layout.tsx
"use client";

import type { ReactNode } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelRightOpen, Settings, LogOut, UserCircle, Sparkles, Info, MessageSquareHeart, BriefcaseMedical, School, Stethoscope, UserCog, AlertCircle as DefaultNotifIcon } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Footer } from './footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { OnboardingModal } from '@/components/onboarding/onboarding-modal';
import { useProMode, type UserRole } from '@/contexts/pro-mode-context';
import { Badge } from '@/components/ui/badge';
import { AnimatedTagline } from '@/components/layout/animated-tagline';
import { WelcomeDisplay } from '@/components/welcome/welcome-display';
import { NotificationPanel } from './notification-panel'; // Import new component
import type { NotificationItem } from '@/types/notifications'; // Import notification type

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
  const { isProMode, userRole, selectUserRole } = useProMode();

  // Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const fetchNotifications = useCallback(() => {
    // Simulate fetching notifications
    // In a real app, this would be an API call or Firestore listener
    const mockNotifications: NotificationItem[] = [
      { id: '1', type: 'medication_reminder', title: 'Medication Reminder', body: 'Time for your Amoxicillin (500mg). Take with food.', timestamp: new Date(Date.now() - 1000 * 60 * 5), isRead: false, deepLink: '/medications' },
      { id: '2', type: 'appointment_reminder', title: 'Appointment Soon', body: 'Cardiology check-up with Dr. Smith in 1 hour.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isRead: true, deepLink: '/schedule' },
      { id: '3', type: 'study_material_update', title: 'New Notes Available', body: 'Study notes for "Endocrine System" have been updated.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: false, deepLink: '/medico/notes/endocrine' },
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

  // Simulate new notification arrival for testing animation
  useEffect(() => {
    if (clientLoaded && notifications.length > 0) { // Ensure notifications are loaded before simulating a new one
      const timer = setTimeout(() => {
        const newNotif: NotificationItem = {
          id: `new-${Date.now()}`,
          type: 'general',
          title: 'System Maintenance Scheduled',
          body: 'MediAssistant will undergo brief maintenance tonight at 2 AM.',
          timestamp: new Date(),
          isRead: false,
          deepLink: '/announcements'
        };
        setNotifications(prev => [newNotif, ...prev].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
        setHasNewNotification(true);
        setTimeout(() => setHasNewNotification(false), 5000); // Reset new notification flag after 5s
      }, 10000); // Simulate after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [clientLoaded, notifications.length]); // Rerun if notifications array length changes (initial load)


  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);
  
  const handleViewAllNotifications = () => {
    // Placeholder: navigate to a full notifications page
    setShowNotificationPanel(false);
    console.log("Navigate to all notifications page");
    // router.push('/notifications');
  };

  const handleOpenNotificationSettings = () => {
    // Placeholder: navigate to notification settings
    setShowNotificationPanel(false);
    console.log("Navigate to notification settings");
    // router.push('/settings/notifications');
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
  
  const getRoleDisplayString = (role: UserRole): string => {
    if (role === 'pro') return 'Professional';
    if (role === 'medico') return 'Medical Student';
    if (role === 'diagnosis') return 'Patient/User';
    return 'User';
  }

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
            {isProMode && ( 
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 hidden sm:flex items-center gap-1.5 py-1 px-2.5">
                <Sparkles className="h-3.5 w-3.5" />
                Pro Features
              </Badge>
            )}
            <div className="relative">
                <Button 
                    variant="ghost" 
                    className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full text-foreground/80 hover:text-foreground" 
                    aria-label="Open user menu or notifications"
                    onClick={() => setShowNotificationPanel(prev => !prev)}
                >
                   <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarImage src="https://picsum.photos/id/237/200/200" alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback className="bg-gradient-to-br from-primary via-accent to-primary/70 text-primary-foreground">
                       <DefaultNotifIcon className="h-4 w-4"/>
                    </AvatarFallback>
                  </Avatar>
                   {(hasUnreadNotifications || hasNewNotification) && (
                      <div className={cn(
                          "profile-notification-ring",
                          hasUnreadNotifications && "profile-notification-ring-pulse",
                          hasNewNotification && "profile-notification-ring-comet"
                      )} />
                   )}
                </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full text-foreground/80 hover:text-foreground" aria-label="Open user settings menu">
                   <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/id/237/200/200" alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback className="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 glowing-ring-firebase">
                       <DefaultNotifIcon className="h-4 w-4 text-white"/>
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72"> 
                 <DropdownMenuLabel className="flex items-start gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://picsum.photos/id/237/200/200" alt="User Avatar" data-ai-hint="user avatar" />
                      <AvatarFallback className="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 glowing-ring-firebase">
                        <DefaultNotifIcon className="h-4 w-4 text-white"/>
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>My Account</span>
                      {userRole && <span className="text-xs text-muted-foreground font-normal">{getRoleDisplayString(userRole)}</span>}
                    </div>
                  </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <UserCog className="mr-2 h-4 w-4" /> 
                    <span className={cn(userRole && "firebase-gradient-text font-semibold")}>
                      {userRole ? getRoleDisplayString(userRole) : "Select Role"}
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup 
                        value={userRole ?? ""} 
                        onValueChange={(value) => selectUserRole(value as UserRole)}
                      >
                        <DropdownMenuRadioItem value="pro" className="cursor-pointer">
                          <BriefcaseMedical className="mr-2 h-4 w-4 text-primary" />
                          Professional
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="medico" className="cursor-pointer">
                          <School className="mr-2 h-4 w-4 text-primary" />
                           Medical Student
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="diagnosis" className="cursor-pointer">
                          <Stethoscope className="mr-2 h-4 w-4 text-primary" />
                           Patient/User
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                
                {isProMode && (
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground p-2 focus:bg-transparent">
                    <Info className="mr-2 h-3 w-3 text-primary"/>
                    <span>Professional features enabled.</span>
                  </DropdownMenuItem>
                )}
                 {userRole === 'medico' && (
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground p-2 focus:bg-transparent">
                    <MessageSquareHeart className="mr-2 h-3 w-3 text-primary"/>
                    <span>Medico study tools available.</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </header>
        <main className="flex-1 flex flex-col overflow-auto relative"> {/* Added relative for panel positioning */}
          {children}
           {showNotificationPanel && (
            <NotificationPanel
              notifications={notifications}
              onClose={() => setShowNotificationPanel(false)}
              onMarkAllAsRead={handleMarkAllAsRead}
              onMarkAsRead={handleMarkAsRead}
              onViewAll={handleViewAllNotifications}
              onOpenSettings={handleOpenNotificationSettings}
            />
          )}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
