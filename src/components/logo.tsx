import { Activity } from 'lucide-react'; // Changed from BotMessageSquare

export function Logo() {
  return (
    <div className="flex items-center gap-3 p-2"> {/* Increased gap and padding slightly */}
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-md"> {/* Circular badge */}
        <Activity className="h-5 w-5" /> {/* Adjusted icon size for badge */}
      </div>
      <span className="text-xl font-semibold text-sidebar-foreground tracking-tight"> {/* Added tracking-tight */}
        MediAssistant
      </span>
    </div>
  );
}
