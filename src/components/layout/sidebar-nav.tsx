// src/components/layout/sidebar-nav.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home,
  MessageCircleHeart, 
  ClipboardList, 
  ScanEye,       
  Settings2,     
  LogOut,
  GraduationCap, 
  HeartPulse,
  Briefcase, // Icon for Pro Tools
  Users,     // Placeholder for some pro tools, can be more specific
  FileText,  // Placeholder for some pro tools
  FlaskConical, // Placeholder for some pro tools (e.g. Lab/Pharmacopeia)
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProMode } from '@/contexts/pro-mode-context'; 

const baseNavItems = [
  { href: '/', label: 'Home', icon: Home, ariaLabel: 'Go to Home page' },
  { href: '/chat', label: 'Chat', icon: MessageCircleHeart, ariaLabel: 'Open Chat interface' },
  { href: '/ar-viewer', label: 'AR Viewer', icon: ScanEye, ariaLabel: 'Open AR Viewer' },
];

const patientManagementNavItem = { 
  href: '/patient-management', 
  label: 'Patient Management', 
  icon: ClipboardList, 
  ariaLabel: 'Open Patient Management' 
};

const medicoDashboardNavItem = {
  href: '/medico',
  label: 'Medico Tools',
  icon: GraduationCap,
  ariaLabel: 'Open Medico Dashboard'
};

const proToolsNavItem = {
  href: '/pro',
  label: 'Pro Tools',
  icon: Briefcase, // Using Briefcase for general "Professional Tools"
  ariaLabel: 'Open Professional Tools Dashboard'
};

export function SidebarNav() {
  const pathname = usePathname();
  const { userRole } = useProMode(); 

  let navItems = [...baseNavItems];
  
  if (userRole === 'medico') {
    const chatIndex = navItems.findIndex(item => item.href === '/chat');
    if (chatIndex !== -1) {
      navItems.splice(chatIndex + 1, 0, medicoDashboardNavItem);
    } else {
      navItems.push(medicoDashboardNavItem);
    }
    // Medico can also access patient management if needed for learning
    if (!navItems.find(item => item.href === '/patient-management')) {
      const medicoToolsIndex = navItems.findIndex(item => item.href === '/medico');
      if (medicoToolsIndex !== -1) {
        navItems.splice(medicoToolsIndex + 1, 0, patientManagementNavItem);
      } else {
        navItems.push(patientManagementNavItem);
      }
    }
  } else if (userRole === 'pro') {
    const chatIndex = navItems.findIndex(item => item.href === '/chat');
    // Add Pro Tools first, then Patient Management
    if (chatIndex !== -1) {
      navItems.splice(chatIndex + 1, 0, proToolsNavItem, patientManagementNavItem);
    } else {
      navItems.push(proToolsNavItem, patientManagementNavItem);
    }
  }


  return (
    <>
      <SidebarHeader className="p-2 pt-3">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  aria-label={item.ariaLabel}
                  className={cn(
                    "justify-start w-full group-hover/menu-item:bg-sidebar-accent/80 group-hover/menu-item:text-sidebar-accent-foreground transition-all duration-200 ease-in-out transform group-hover/menu-item:scale-105 group-hover/menu-item:shadow-md", 
                    pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg scale-105"
                  )}
                >
                  <a>
                    <item.icon className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover/menu-button:rotate-[-5deg] group-hover/menu-button:scale-110" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/feedback" passHref legacyBehavior>
              <SidebarMenuButton 
                asChild
                className="justify-start w-full group-hover/menu-item:bg-sidebar-accent/80 group-hover/menu-item:text-sidebar-accent-foreground transition-all duration-200 ease-in-out transform group-hover/menu-item:scale-105 group-hover/menu-item:shadow-md" 
                tooltip="Feedback" 
                aria-label="Submit Feedback"
                isActive={pathname === '/feedback'}
               >
                 <a>
                  <MessageCircleHeart className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover/menu-button:rotate-[-5deg] group-hover/menu-button:scale-110" />
                  <span>Feedback</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="justify-start w-full group-hover/menu-item:bg-sidebar-accent/80 group-hover/menu-item:text-sidebar-accent-foreground transition-all duration-200 ease-in-out transform group-hover/menu-item:scale-105 group-hover/menu-item:shadow-md" tooltip="Settings" aria-label="Open Settings">
              <Settings2 className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover/menu-button:rotate-[-5deg] group-hover/menu-button:scale-110" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton className="justify-start w-full group-hover/menu-item:bg-sidebar-accent/80 group-hover/menu-item:text-sidebar-accent-foreground transition-all duration-200 ease-in-out transform group-hover/menu-item:scale-105 group-hover/menu-item:shadow-md" tooltip="Logout" aria-label="Logout">
              <LogOut className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover/menu-button:rotate-[-5deg] group-hover/menu-button:scale-110" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3 p-3 mt-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://picsum.photos/id/237/200/200" alt="User Avatar" data-ai-hint="user avatar" />
             <AvatarFallback className="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 glowing-ring-firebase">
              <HeartPulse className="h-4 w-4 text-white" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">Dr. Robot</span>
            <span className="text-xs text-sidebar-foreground/70">
              {userRole === 'pro' ? 'Professional' : userRole === 'medico' ? 'Medical Student' : userRole === 'diagnosis' ? 'Patient/User' : 'Clinician'}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}

