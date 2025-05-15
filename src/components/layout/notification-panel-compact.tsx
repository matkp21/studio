// src/components/layout/notification-panel-compact.tsx
"use client";

import type { NotificationItem } from '@/types/notifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { NotificationItemCardCompact } from './notification-item-card-compact';
import { X, CheckCheck, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NotificationPanelCompactProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onViewAllNotifications: () => void;
  className?: string; // Added className prop for conditional styling
}

export function NotificationPanelCompact({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAllNotifications,
  className,
}: NotificationPanelCompactProps) {

  const panelVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "notification-panel-compact fixed top-16 right-4 z-50 w-[320px] max-w-[calc(100vw-2rem)] max-h-[400px] flex flex-col rounded-xl shadow-2xl overflow-hidden bg-background", // Solid background
        className // Apply conditional class for animated border
      )}
      style={{
        // Removed inline backdrop-filter and gradient for solid background approach
        // These will be handled by globals.css if className for animated border is passed
      }}
      aria-modal="true"
      role="dialog"
    >
      <div className="flex items-center justify-between p-3 border-b border-border/50 shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
        <div className="flex items-center gap-1">
            {unreadCount > 0 && (
                 <Button variant="link" size="xs" onClick={onMarkAllAsRead} className="text-primary hover:text-primary/80 p-0 h-auto">
                    <CheckCheck className="mr-1 h-3.5 w-3.5" /> Mark all read
                </Button>
            )}
            <Button variant="ghost" size="iconSm" onClick={onClose} className="text-muted-foreground hover:text-foreground rounded-full h-7 w-7">
                <X className="h-4 w-4" />
                <span className="sr-only">Close notifications</span>
            </Button>
        </div>
      </div>

      <ScrollArea className="flex-grow p-2 space-y-1.5">
        <AnimatePresence initial={false}>
          {notifications.length === 0 ? (
            <motion.div
                key="empty-notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 text-xs"
            >
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p>You're all caught up!</p>
            </motion.div>
          ) : (
            notifications.map((item) => (
              <NotificationItemCardCompact key={item.id} item={item} onMarkAsRead={onMarkAsRead} onClosePanel={onClose} />
            ))
          )}
        </AnimatePresence>
      </ScrollArea>

      <div className="p-2.5 border-t border-border/50 flex justify-center shrink-0">
        <Button variant="link" size="sm" onClick={onViewAllNotifications} className="text-primary hover:text-primary/80 p-0 h-auto text-xs">
          View All Notifications
        </Button>
      </div>
    </motion.div>
  );
}
