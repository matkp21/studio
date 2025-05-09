import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ title, children, className }: PageWrapperProps) {
  return (
    <div className={cn("container mx-auto py-6", className)}>
      {title && <h1 className="text-3xl font-bold mb-6 text-foreground">{title}</h1>}
      {children}
    </div>
  );
}
