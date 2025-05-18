// src/components/layout/app-layout.tsx
"use client";

import type { ReactNode } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const fetchNotifications = useCallback(() => {
    const mockNotifications: NotificationItem[] = [
      { id: '1', type: 'medication_reminder', title: 'Medication Reminder', body: 'Time for Amoxicillin (500mg). Check instructions.', timestamp: new Date(Date.now() - 1000 * 60 * 5), isRead: false, deepLink: '/medications' },
      { id: 'sys-maint', type: 'system_update', title: 'System Maintenance Scheduled', body: 'Brief maintenance tonight at 2 AM. No impact expected.', timestamp: new Date(Date.now() - 1000 * 60 * 30), isRead: false, deepLink: '/' },
      { id: '2', type: 'appointment_reminder', title: 'Appointment Soon', body: 'Cardiology check-up in 1 hour. Remember pre-appointment notes.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isRead: true, deepLink: '/' },
      { id: '3', type: 'study_material_update', title: 'New Notes Available', body: 'Endocrine System notes updated with latest diagrams.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: false, deepLink: '/medico' },
      { id: '4', type: 'general', title: 'MediAssistant v1.2 Update!', body: 'Explore new features and performance improvements across all modes.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), isRead: true, deepLink: '/' },
    ];
    const sortedNotifications = mockNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setNotifications(sortedNotifications);
    setUnreadCount(sortedNotifications.filter(n => !n.isRead).length);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const newNotifications = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      setUnreadCount(newNotifications.filter(n => !n.isRead).length);
      return newNotifications;
    });
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast({ title: "Notifications Updated", description: "All notifications marked as read." });
  }, [toast]);


  const handleLogout = () => {
    toast({ title: "Logged Out", description: "You have been successfully logged out. (Demo)" });
    selectUserRole(null);
    setIsAccountMenuOpen(false);
    router.push('/login');
  };

  const getRoleDisplayString = (role: UserRole | null): string => {
    if (role === 'pro') return 'Professional';
    if (role === 'medico') return 'Medical Student';
    if (role === 'diagnosis') return 'Patient/User';
    return 'Guest';
  };

  useEffect(() => {
    setClientLoaded(true);
    let onboardingComplete = false;
    let welcomeDisplayShownThisSession = false;

    if (typeof window !== 'undefined') {
      onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
      welcomeDisplayShownThisSession = sessionStorage.getItem('welcomeDisplayShown') === 'true';
      
      // onboardingComplete = false; // For testing onboarding
      // welcomeDisplayShownThisSession = false; // For testing welcome display

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
    let welcomeDisplayShownThisSession = false;
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingComplete', 'true');
      welcomeDisplayShownThisSession = sessionStorage.getItem('welcomeDisplayShown') === 'true';
      // welcomeDisplayShownThisSession = false; // For testing
    }
    if (!welcomeDisplayShownThisSession) {
      setShowWelcomeDisplay(true);
    }
  };

  const handleWelcomeDisplayComplete = () => {
    setShowWelcomeDisplay(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('welcomeDisplayShown', 'true');
    }
  };
  

  if (!clientLoaded && !showOnboardingModal && !showWelcomeDisplay) {
    return (
      <div className="event-poster-splash-screen">
        <div className="central-icon-container splash-element-fade-in">
          <heart-ecg-icon class="heart-ecg-icon-splash-static"></heart-ecg-icon>
        </div>
        <div className="bottom-text-container-splash splash-element-fade-in">
          <h1 className="app-name-splash-static">MediAssistant</h1>
          <p className="tagline-splash-static">Simply #Smart. Always <span className="emoji" role="img" aria-label="sparks and brain">✨🧠</span></p>
        </div>
      </div>
    );
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
        <SidebarNav unreadNotificationCount={unreadCount} />
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
            
             <DropdownMenu open={isAccountMenuOpen} onOpenChange={setIsAccountMenuOpen}>
                <DropdownMenuTrigger asChild>
                   <Button
                    variant="ghost"
                    className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full text-foreground/80 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-0"
                    aria-label="Open user menu"
                  >
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                        <AvatarImage src="https://picsum.photos/id/237/200/200" alt="User Avatar" data-ai-hint="user doctor" />
                         <AvatarFallback className="bg-gradient-to-br from-primary via-accent to-primary/70 text-primary-foreground">
                            <HeartPulse className="h-5 w-5"/>
                        </AvatarFallback>
                    </Avatar>
                    {/* Notification ring removed */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-lg border-border/50 bg-card">
                    <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="https://picsum.photos/id/237/200/200" alt="User Avatar" data-ai-hint="user doctor" />
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
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer" onClick={() => setIsAccountMenuOpen(false)}>
                        <UserCircle className="h-4 w-4 text-muted-foreground" /> Profile
                    </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2 cursor-pointer" onClick={() => setIsAccountMenuOpen(false)}>
                        <Settings className="h-4 w-4 text-muted-foreground" /> Settings
                    </Link>
                    </DropdownMenuItem>
                    {/* Notifications link REMOVED from here as per new design */}
                    <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center justify-between gap-2 cursor-pointer">
                        <div className="flex items-center gap-2">
                            <UserCog className="h-4 w-4 text-muted-foreground" />
                            <span>
                                Role: <span className={cn(userRole !== null && "firebase-gradient-text-active-role font-semibold")}>{getRoleDisplayString(userRole)}</span>
                            </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground opacity-70" />
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={userRole || ''} onValueChange={(role) => { selectUserRole(role as UserRole); setIsAccountMenuOpen(false); }}>
                            <DropdownMenuRadioItem value="pro" className="flex items-center gap-2 cursor-pointer">
                                <BriefcaseMedical className="h-4 w-4 text-purple-500" />
                                <span className={cn(userRole === 'pro' && "firebase-gradient-text-active-role font-semibold")}>Professional</span>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="medico" className="flex items-center gap-2 cursor-pointer">
                                <School className="h-4 w-4 text-sky-500" />
                                <span className={cn(userRole === 'medico' && "firebase-gradient-text-active-role font-semibold")}>Medical Student</span>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="diagnosis" className="flex items-center gap-2 cursor-pointer">
                                <Stethoscope className="h-4 w-4 text-green-500" />
                                <span className={cn(userRole === 'diagnosis' && "firebase-gradient-text-active-role font-semibold")}>Patient/User</span>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="" className="flex items-center gap-2 cursor-pointer">
                                <UserCircle className="h-4 w-4 text-muted-foreground" />
                                <span className={cn(userRole === null && "firebase-gradient-text-active-role font-semibold")}>Guest</span>
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
          {/* Pass notification handlers to children if /notifications page needs them */}
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              // @ts-ignore
              return React.cloneElement(child, { 
                // @ts-ignore
                notifications, 
                // @ts-ignore
                markNotificationAsRead: handleMarkAsRead, 
                // @ts-ignore
                markAllNotificationsAsRead: handleMarkAllAsRead 
              });
            }
            return child;
          })}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
