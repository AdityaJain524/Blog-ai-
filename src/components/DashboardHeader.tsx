import { Sparkles, User, LogOut, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User as SupaUser } from "@supabase/supabase-js";

interface DashboardHeaderProps {
  user?: SupaUser | null;
  onAuthClick?: () => void;
  onSignOut?: () => void;
  onBulkClick?: () => void;
}

export function DashboardHeader({ user, onAuthClick, onSignOut, onBulkClick }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-border gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl gradient-primary flex items-center justify-center glow-primary shrink-0">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-heading font-bold text-foreground tracking-tight truncate">Blogy AI Engine Pro</h1>
          <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Hybrid AI Blog Generator • SEO Optimized</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <Button size="sm" variant="secondary" onClick={onBulkClick} className="gap-1 sm:gap-1.5 h-7 sm:h-8 px-2 sm:px-3 text-xs">
          <Layers className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> <span className="hidden sm:inline">Bulk</span>
        </Button>
        <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow hidden sm:block" />
        <span className="text-xs text-muted-foreground hidden sm:inline">AI Ready</span>
        {user ? (
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs text-foreground hidden sm:inline">{user.email?.split("@")[0]}</span>
            <Button size="icon" variant="ghost" onClick={onSignOut} className="h-7 w-7 sm:h-8 sm:w-8">
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={onAuthClick} className="gap-1 sm:gap-1.5 h-7 sm:h-8 px-2 sm:px-3 text-xs">
            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
