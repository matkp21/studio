
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
  MessageCircleMore, // Using a more generic chat icon as BotMessageSquare might not be available or fit all contexts
  ClipboardList, 
  ScanEye,       
  Settings2,     
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProMode } from '@/contexts/pro-mode-context'; // Import context

const baseNavItems = [
  { href: '/', label: 'Home', icon: Home, ariaLabel: 'Go to Home page' },
  { href: '/chat', label: 'Chat', icon: MessageCircleMore, ariaLabel: 'Open Chat interface' },
  // Patient Management will be added conditionally
  { href: '/ar-viewer', label: 'AR Viewer', icon: ScanEye, ariaLabel: 'Open AR Viewer' },
];

const patientManagementNavItem = { 
  href: '/patient-management', 
  label: 'Patient Management', 
  icon: ClipboardList, 
  ariaLabel: 'Open Patient Management' 
};

export function SidebarNav() {
  const pathname = usePathname();
  const { userRole } = useProMode(); // Get userRole from context

  const navItems = [...baseNavItems];
  if (userRole === 'pro' || userRole === 'medico') {
    // Insert Patient Management at a specific position, e.g., after Chat
    const chatIndex = navItems.findIndex(item => item.href === '/chat');
    if (chatIndex !== -1) {
      navItems.splice(chatIndex + 1, 0, patientManagementNavItem);
    } else {
      navItems.push(patientManagementNavItem); // Fallback if chat isn't found
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
                    "justify-start w-full group-hover/menu-item:bg-sidebar-accent/80 group-hover/menu-item:text-sidebar-accent-foreground", 
                    pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <a>
                    <item.icon className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover/menu-button:scale-110" />
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
            <SidebarMenuButton className="justify-start w-full group-hover/menu-item:bg-sidebar-accent/80 group-hover/menu-item:text-sidebar-accent-foreground" tooltip="Settings" aria-label="Open Settings">
              <Settings2 className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover/menu-button:scale-110" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton className="justify-start w-full group-hover/menu-item:bg-sidebar-accent/80 group-hover/menu-item:text-sidebar-accent-foreground" tooltip="Logout" aria-label="Logout">
              <LogOut className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover/menu-button:scale-110" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3 p-3 mt-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://picsum.photos/id/237/200/200" alt="User Avatar" data-ai-hint="user avatar" />
            <AvatarFallback>DR</AvatarFallback>
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

