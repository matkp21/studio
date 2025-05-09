import { HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  simple?: boolean;
  className?: string;
}

export function Logo({ simple = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 p-1", className)}>
      <div className={cn(
        "flex items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm",
        simple ? "h-8 w-8" : "h-9 w-9"
      )}>
        <HeartPulse className={cn(simple ? "h-4 w-4" : "h-5 w-5")} />
      </div>
      {!simple && (
        <span className="text-lg font-semibold text-foreground tracking-tight">
          MediAssistant
        </span>
      )}
    </div>
  );
}
