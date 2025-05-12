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
  HeartPulse, // Default fallback, used in Avatar
  BriefcaseMedical, 
  BookOpenText,   // Icon for Educational Support
  LayoutDashboard, // Icon for Clinical Dashboard
  Users,     
  FileText,  
  FlaskConical, 
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
  label: 'Pro Suite', // Changed from Pro Tools for brevity
  icon: BriefcaseMedical, 
  ariaLabel: 'Open Professional Clinical Suite'
};

// Educational Support / Clinical Dashboard (depends on role)
const dynamicThirdNavItem = (userRole: string | null) => {
  if (userRole === 'pro') {
    return { href: '/pro/dashboard', label: 'Clinical Dashboard', icon: LayoutDashboard, ariaLabel: 'Open Clinical Dashboard'};
  }
  return { href: '/education', label: 'Educational Support', icon: BookOpenText, ariaLabel: 'Open Educational Support'};
};


export function SidebarNav() {
  const pathname = usePathname();
  const { userRole } = useProMode(); 

  let navItems = [...baseNavItems];
  
  // Add dynamic third nav item (Educational Support or Clinical Dashboard)
  // For now, let's assume /education and /pro/dashboard routes exist or will be handled.
  // We can refine this logic based on how these pages are structured.
  // The ModeSwitcher on the homepage already handles showing the right component for 'education' vs 'dashboard' mode.
  // This sidebar navigation might need a more generic link or be conditional.
  // For simplicity, let's add a general 'Tools' or 'Features' link, or make it conditional.

  if (userRole === 'medico') {
    navItems.push(medicoDashboardNavItem);
    navItems.push(patientManagementNavItem); 
  } else if (userRole === 'pro') {
    navItems.push(proToolsNavItem);
    navItems.push(patientManagementNavItem);
  }
  // If no specific role, or for general users, they get the base items.
  // The 'Educational Support' link could be one of the base items if always visible.
  // Or, the mode switcher on homepage is the primary way to access these different functional areas.


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
                    "justify-start w-full rounded-lg group transition-all duration-200 ease-in-out",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-md",
                    pathname === item.href 
                      ? "bg-sidebar-active-background text-sidebar-active-foreground shadow-lg font-semibold" 
                      : "text-sidebar-foreground/80 hover:text-sidebar-foreground",
                    "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar-background" // Added focus styling
                  )}
                >
                  <a>
                    <item.icon className={cn(
                        "h-5 w-5 transition-transform duration-200 ease-in-out",
                        "group-hover:scale-110"
                       )} 
                     />
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
                className={cn(
                  "justify-start w-full rounded-lg group transition-all duration-200 ease-in-out",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-md",
                   pathname === '/feedback' 
                    ? "bg-sidebar-active-background text-sidebar-active-foreground shadow-lg font-semibold" 
                    : "text-sidebar-foreground/80 hover:text-sidebar-foreground",
                  "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar-background"
                )}
                tooltip="Feedback" 
                aria-label="Submit Feedback"
                isActive={pathname === '/feedback'}
               >
                 <a>
                  <MessageCircleHeart className={cn("h-5 w-5 transition-transform duration-200 ease-in-out", "group-hover:scale-110")} />
                  <span>Feedback</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
                className={cn(
                  "justify-start w-full rounded-lg group transition-all duration-200 ease-in-out",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-md",
                  "text-sidebar-foreground/80 hover:text-sidebar-foreground",
                  "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar-background"
                )} 
                tooltip="Settings" 
                aria-label="Open Settings"
            >
              <Settings2 className={cn("h-5 w-5 transition-transform duration-200 ease-in-out", "group-hover:scale-110")} />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton 
                className={cn(
                  "justify-start w-full rounded-lg group transition-all duration-200 ease-in-out",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-md",
                   "text-sidebar-foreground/80 hover:text-sidebar-foreground",
                  "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar-background"
                )} 
                tooltip="Logout" 
                aria-label="Logout"
            >
              <LogOut className={cn("h-5 w-5 transition-transform duration-200 ease-in-out", "group-hover:scale-110")} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3 p-3 mt-2">
          <Avatar className="h-10 w-10 border-2 border-sidebar-accent">
            <AvatarImage src="https://picsum.photos/id/237/200/200" alt="User Avatar" data-ai-hint="user doctor" />
             <AvatarFallback className="bg-gradient-to-br from-sidebar-accent to-sidebar-primary/30 text-sidebar-primary-foreground glowing-ring-firebase">
              <HeartPulse className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-sidebar-foreground truncate">Dr. Robot</span>
            <span className="text-xs text-sidebar-foreground/70 truncate">
              {userRole === 'pro' ? 'Professional' : userRole === 'medico' ? 'Medical Student' : userRole === 'diagnosis' ? 'Patient/User' : 'Clinician'}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}