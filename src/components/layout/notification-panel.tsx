// src/components/layout/notification-panel.tsx
"use client";

import type { NotificationItem } from '@/types/notifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { 
  AlertCircle, BellRing, CheckSquare, Pill, CalendarDays, BookOpen, Brain, 
  GraduationCap, Sparkles, Settings, FileText, Users, MessageSquareHeart, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationPanelProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onViewAll: () => void; // Placeholder for navigating to full history
  onOpenSettings: () => void; // Placeholder for navigating to notification settings
}

const getIconForNotificationType = (type: NotificationItem['type']): React.ElementType => {
  switch (type) {
    case 'medication_reminder': return Pill;
    case 'appointment_reminder': return CalendarDays;
    case 'wellness_nudge': return Sparkles;
    case 'new_content': return BookOpen;
    case 'study_material_update': return GraduationCap;
    case 'study_session_reminder': return CalendarDays;
    case 'quiz_review_due': return FileText;
    case 'learning_path_update': return Brain;
    case 'task_reminder': return CheckSquare;
    case 'urgent_patient_alert': return AlertCircle;
    case 'summary_ready': return FileText;
    case 'guideline_update': return Info;
    case 'system_update': return Settings;
    case 'security_alert': return AlertCircle;
    case 'general': return BellRing;
    default: return BellRing;
  }
};

export function NotificationPanel({
  notifications,
  onClose,
  onMarkAllAsRead,
  onMarkAsRead,
  onViewAll,
  onOpenSettings,
}: NotificationPanelProps) {

  const panelVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.2, ease: "easeOut" }
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.15, ease: "easeIn" } }
  };
  
  const handleItemClick = (item: NotificationItem) => {
    if (!item.isRead) {
      onMarkAsRead(item.id);
    }
    if (item.deepLink) {
      // In a real app, use Next.js router.push(item.deepLink)
      console.log("Navigating to:", item.deepLink);
    }
    onClose(); // Close panel on item click
  };

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="notification-panel fixed top-16 right-4 z-50 w-[380px] max-h-[calc(100vh-100px)] flex flex-col rounded-xl shadow-2xl overflow-hidden border border-border/20"
      aria-modal="true"
      role="dialog"
      aria-labelledby="notification-panel-title"
    >
      <div className="notification-panel-frosted p-4 border-b border-border/10">
        <div className="flex justify-between items-center">
          <h2 id="notification-panel-title" className="text-lg font-semibold text-foreground">Notifications</h2>
          <div className="flex items-center gap-2">
            <Button variant="link" size="sm" onClick={onMarkAllAsRead} className="text-xs text-muted-foreground hover:text-primary p-0 h-auto">
              Mark all as read
            </Button>
            <Button variant="ghost" size="iconSm" onClick={onOpenSettings} className="text-muted-foreground hover:text-primary h-7 w-7">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Notification Settings</span>
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-grow bg-background/50">
        <div className="p-2 space-y-1.5">
          <AnimatePresence initial={false}>
            {notifications.length === 0 ? (
              <motion.div
                variants={itemVariants} custom={0} initial="hidden" animate="visible" exit="exit"
                className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground p-4"
              >
                <BellRing className="h-10 w-10 mb-3 opacity-50" />
                <p className="text-sm font-medium">You're all caught up!</p>
                <p className="text-xs">No new notifications right now.</p>
              </motion.div>
            ) : (
              notifications.map((item, index) => {
                const IconComponent = getIconForNotificationType(item.type);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    variants={itemVariants}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "notification-item-card flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-150",
                      item.isRead ? 'bg-card/70 hover:bg-muted/60' : 'bg-primary/5 hover:bg-primary/10 border border-primary/20',
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
              })
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="notification-panel-frosted p-3 border-t border-border/10 text-center">
        <Button variant="link" size="sm" onClick={onViewAll} className="text-xs text-primary p-0 h-auto">
          View All Notifications
        </Button>
      </div>
    </motion.div>
  );
}
