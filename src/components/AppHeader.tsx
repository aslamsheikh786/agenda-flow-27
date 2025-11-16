import { Search, Settings, Sun, Moon, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { CalendarViewSwitcher, CalendarView } from "./CalendarViewSwitcher";

interface AppHeaderProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onMenuToggle?: () => void;
}

export const AppHeader = ({ currentView, onViewChange, onMenuToggle }: AppHeaderProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 shadow-soft backdrop-blur-sm">
      <div className="flex items-center gap-2 md:gap-4">
        {onMenuToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden hover:bg-muted/50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Zenex
        </h1>
      </div>
      
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events and tasks..."
            className="pl-10 bg-background border-input shadow-soft"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-3">
        <CalendarViewSwitcher currentView={currentView} onViewChange={onViewChange} />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="hover:bg-muted/50"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-foreground" />
          ) : (
            <Moon className="h-5 w-5 text-foreground" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-muted/50">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};