// src/components/layout/notification-item-card-compact.tsx
"use client";

import type { NotificationItem } from '@/types/notifications';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';
import { Pill, CalendarDays, Sparkles, Edit, BookOpen, School, FileText, Brain, CheckSquare, AlertCircle, Info, BellRing, Settings as SettingsIconLucide } from 'lucide-react'; // Added SettingsIconLucide
import Link from 'next/link';
import { motion } from 'framer-motion'; // Added motion

const getIconForNotificationType = (type: NotificationItem['type']): React.ElementType => {
  switch (type) {
    case 'medication_reminder': return Pill;
    case 'appointment_reminder': return CalendarDays;
    case 'wellness_nudge': return Sparkles;
    case 'new_content': return Edit;
    case 'study_material_update': return BookOpen;
    case 'study_session_reminder': return School;
    case 'quiz_review_due': return FileText;
    case 'learning_path_update': return Brain;
    case 'task_reminder': return CheckSquare;
    case 'urgent_patient_alert': return AlertCircle;
    case 'summary_ready': return FileText;
    case 'guideline_update': return Info;
    case 'system_update': return SettingsIconLucide; 
    case 'security_alert': return AlertCircle;
    case 'general': return BellRing;
    default: return BellRing; 
  }
};

interface NotificationItemCardCompactProps {
  item: NotificationItem;
  onMarkAsRead: (id: string) => void;
  onClosePanel: () => void; 
}

export function NotificationItemCardCompact({ item, onMarkAsRead, onClosePanel }: NotificationItemCardCompactProps) {
  const IconComponent = getIconForNotificationType(item.type);

  const handleItemClick = () => {
    if (!item.isRead) {
      onMarkAsRead(item.id);
    }
    onClosePanel(); 
  };

  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const content = (
    <motion.div // Wrapped with motion.div
      variants={cardVariants}
      className={cn(
        "notification-item-card-compact flex items-start gap-2 p-2 rounded-md cursor-pointer transition-colors duration-150",
        item.isRead ? 'bg-background hover:bg-muted/50' : 'bg-primary/10 hover:bg-primary/20 border border-primary/30',
      )}
    >
      {!item.isRead && (
        <span className="notification-unread-dot mt-1 flex-shrink-0 h-1.5 w-1.5 bg-primary rounded-full self-center" />
      )}
      {item.isRead && (
          <span className="mt-1 flex-shrink-0 h-1.5 w-1.5" /> 
      )}
      <IconComponent className={cn("h-4 w-4 mt-px flex-shrink-0", item.isRead ? "text-muted-foreground" : "text-primary")} />
      <div className="flex-grow overflow-hidden">
        <div className="flex justify-between items-center">
            <h3 className={cn("text-xs font-medium text-foreground truncate", !item.isRead && "font-semibold")}>{item.title}</h3>
            <p className="text-[10px] text-muted-foreground/90 flex-shrink-0 ml-1.5 whitespace-nowrap">
                {formatDistanceToNowStrict(item.timestamp, { addSuffix: true })}
            </p>
        </div>
        <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug mt-0.5">{item.body}</p>
      </div>
    </motion.div>
  );

  if (item.deepLink) {
    return <Link href={item.deepLink} passHref legacyBehavior><a onClick={handleItemClick}>{content}</a></Link>;
  }
  return <div onClick={handleItemClick}>{content}</div>;
}
