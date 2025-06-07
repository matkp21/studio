
// src/types/ar-tools.ts
import type { UserRole } from '@/contexts/pro-mode-context';
import type { LucideIcon } from 'lucide-react';

export interface ArToolDefinition {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  modes: UserRole[]; // Specifies which user roles this tool is relevant for
  detailedDescription?: string; // More detailed explanation for the "active tool" view
  usageInstructions?: string; // Conceptual usage
}
