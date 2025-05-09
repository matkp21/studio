import { BotMessageSquare } from 'lucide-react';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2 p-1">
      <BotMessageSquare className="h-8 w-8 text-sidebar-primary" />
      <span className="text-xl font-semibold text-sidebar-foreground">MediAssistant</span>
    </div>
  );
}
