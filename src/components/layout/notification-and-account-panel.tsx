// src/components/layout/notification-and-account-panel.tsx
"use client";

import type { ReactNode } from 'react';
import type { NotificationItem } from '@/types/notifications';
import type { UserRole } from '@/contexts/pro-mode-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BellRing, UserCircle, Settings, LogOut, HelpCircle, Edit, ChevronRight,
  BriefcaseMedical, School, Stethoscope, UserCog, AlertCircle, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const getIconForNotificationType = (type: NotificationItem['type']): React.ElementType => {
  switch (type) {
    case 'medication_reminder': return Stethoscope; // Pill might be too specific
    case 'appointment_reminder': return UserCircle; // CalendarDays
    case 'wellness_nudge': return Sparkles;
    case 'new_content': return Edit; // BookOpen
    case 'study_material_update': return School; // GraduationCap
    case 'study_session_reminder': return UserCircle; // CalendarDays
    case 'quiz_review_due': return Edit; // FileText
    case 'learning_path_update': return Brain;
    case 'task_reminder': return CheckSquare;
    case 'urgent_patient_alert': return AlertCircle;
    case 'summary_ready': return Edit; // FileText
    case 'guideline_update': return Info;
    case 'system_update': return Settings;
    case 'security_alert': return AlertCircle;
    case 'general': return BellRing;
    default: return BellRing;
  }
};


interface NotificationItemCardProps {
  item: NotificationItem;
  onMarkAsRead: (id: string) => void;
  onClosePanel: () => void;
}

const NotificationItemCard: React.FC<NotificationItemCardProps> = ({ item, onMarkAsRead, onClosePanel }) => {
  const IconComponent = getIconForNotificationType(item.type);
  const handleItemClick = () => {
    if (!item.isRead) {
      onMarkAsRead(item.id);
    }
    if (item.deepLink) {
      // In a real app, use Next.js router.push(item.deepLink)
      console.log("Navigating to:", item.deepLink);
    }
    onClosePanel();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.15, ease: "easeIn" } }}
      onClick={handleItemClick}
      className={cn(
        "notification-item-card-in-panel flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-150",
        item.isRead ? 'bg-white/70 dark:bg-zinc-800/70 hover:bg-white/90 dark:hover:bg-zinc-700/90' : 'bg-blue-500/10 dark:bg-blue-400/10 hover:bg-blue-500/20 dark:hover:bg-blue-400/20 border border-blue-500/30 dark:border-blue-400/30',
      )}
    >
      {!item.isRead && (
        <span className="notification-unread-dot mt-1.5 flex-shrink-0 h-2 w-2 bg-primary rounded-full" />
      )}
      {item.isRead && (
          <span className="mt-1.5 flex-shrink-0 h-2 w-2" /> // Placeholder for alignment
      )}
      <IconComponent className={cn("h-5 w-5 mt-0.5 flex-shrink-0", item.isRead ? "text-muted-foreground" : "text-primary")} />
      <div className="flex-grow overflow-hidden">
        <h3 className={cn("text-sm font-semibold text-foreground truncate", !item.isRead && "text-primary")}>{item.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{item.body}</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {formatDistanceToNow(item.timestamp, { addSuffix: true })}
        </p>
      </div>
    </motion.div>
  );
};


interface NotificationAndAccountPanelProps {
  notifications: NotificationItem[];
  hasUnreadNotifications: boolean;
  activeTab: 'notifications' | 'account';
  setActiveTab: (tab: 'notifications' | 'account') => void;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onViewAllNotifications: () => void;
  onOpenNotificationSettings: () => void;
  userRole: UserRole | null;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  onLogout: () => void;
  onSelectUserRole: (role: UserRole) => void;
  getRoleDisplayString: (role: UserRole) => string;
}

export function NotificationAndAccountPanel({
  notifications,
  hasUnreadNotifications,
  activeTab,
  setActiveTab,
  onClose,
  onMarkAllAsRead,
  onMarkAsRead,
  onViewAllNotifications,
  onOpenNotificationSettings,
  userRole,
  userName,
  userEmail,
  avatarUrl,
  onLogout,
  onSelectUserRole,
  getRoleDisplayString
}: NotificationAndAccountPanelProps) {

  const panelVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.15, ease: "easeIn" } }
  };

  const accountMenuItems = [
    { label: 'Profile', href: '/profile', icon: UserCircle },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Help & Support', href: '/feedback', icon: HelpCircle }, // Changed to /feedback
  ];
  
  const RoleIcon = userRole === 'pro' ? BriefcaseMedical : userRole === 'medico' ? School : userRole === 'diagnosis' ? Stethoscope : UserCog;


  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="tabbed-user-panel fixed top-16 right-4 z-50 w-[380px] max-h-[calc(100vh-100px)] flex flex-col rounded-xl shadow-2xl overflow-hidden"
      aria-modal="true"
      role="dialog"
    >
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'notifications' | 'account')} className="flex flex-col h-full">
        <TabsList className="tabbed-user-panel-tabs-list grid w-full grid-cols-2 h-12 shrink-0">
          <TabsTrigger value="notifications" className="tabbed-user-panel-trigger">
            <BellRing className="mr-1.5 h-4 w-4" /> Notifications
            {hasUnreadNotifications && <span className="ml-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse"></span>}
          </TabsTrigger>
          <TabsTrigger value="account" className="tabbed-user-panel-trigger">
            <UserCircle className="mr-1.5 h-4 w-4" /> Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="tabbed-user-panel-content flex-grow overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border/10 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            <Button variant="link" size="xs" onClick={onMarkAllAsRead} className="text-muted-foreground hover:text-primary">
              Mark all as read
            </Button>
          </div>
          <ScrollArea className="flex-grow p-2 space-y-1.5">
            <AnimatePresence initial={false}>
              {notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4"
                >
                  <BellRing className="h-10 w-10 mb-3 opacity-50" />
                  <p className="text-sm font-medium">You're all caught up!</p>
                  <p className="text-xs">No new notifications right now.</p>
                </motion.div>
              ) : (
                notifications.map((item) => (
                  <NotificationItemCard key={item.id} item={item} onMarkAsRead={onMarkAsRead} onClosePanel={onClose} />
                ))
              )}
            </AnimatePresence>
          </ScrollArea>
          <div className="p-2 border-t border-border/10 flex justify-between items-center">
            <Button variant="link" size="xs" onClick={onViewAllNotifications} className="text-primary">
              View All Notifications
            </Button>
            <Button variant="ghost" size="iconSm" onClick={onOpenNotificationSettings} className="text-muted-foreground hover:text-primary h-7 w-7">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Notification Settings</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="account" className="tabbed-user-panel-content flex-grow overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/10 flex items-center gap-3">
                 <Avatar className="h-12 w-12">
                    <AvatarImage src={avatarUrl || "https://picsum.photos/id/237/200/200"} alt={userName || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {userName ? userName.charAt(0).toUpperCase() : <UserCircle />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{userName || "Medi User"}</p>
                    <p className="text-xs text-muted-foreground">{userEmail || "user@example.com"}</p>
                  </div>
            </div>
          <ScrollArea className="flex-grow p-2">
            <div className="space-y-1">
              {accountMenuItems.map((item) => (
                <Link key={item.href} href={item.href} passHref legacyBehavior>
                  <a
                    onClick={onClose}
                    className="account-menu-item-in-panel flex items-center gap-3 p-2.5 rounded-md hover:bg-muted/50 dark:hover:bg-zinc-700/50 transition-colors text-sm text-foreground"
                  >
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </a>
                </Link>
              ))}
              <Separator className="my-2 bg-border/20" />
               <div className="p-2.5 space-y-1">
                 <p className="text-xs text-muted-foreground px-1 pb-1">Current Role:</p>
                <div className="flex items-center gap-3 p-2.5 rounded-md bg-muted/30 dark:bg-zinc-800/30 text-sm text-foreground">
                    <RoleIcon className={cn("h-5 w-5", userRole === 'pro' ? 'text-purple-500' : userRole === 'medico' ? 'text-sky-500' : userRole === 'diagnosis' ? 'text-green-500' : 'text-muted-foreground')} />
                    <span>{getRoleDisplayString(userRole)}</span>
                    <Button variant="link" size="xs" className="ml-auto p-0 h-auto text-primary text-xs" onClick={() => {onClose(); /* TODO: Trigger role change modal or page */}}>Change</Button>
                </div>
               </div>

              <Separator className="my-2 bg-border/20" />
              <Button
                variant="ghost"
                onClick={() => { onLogout(); onClose(); }}
                className="account-menu-item-in-panel w-full flex items-center justify-start gap-3 p-2.5 rounded-md hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors text-sm text-destructive"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}