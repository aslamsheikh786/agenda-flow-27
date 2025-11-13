import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";

export type CalendarView = "day" | "week" | "month";

interface CalendarViewSwitcherProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export const CalendarViewSwitcher = ({
  currentView,
  onViewChange,
}: CalendarViewSwitcherProps) => {
  return (
    <div className="flex gap-0.5 md:gap-1 bg-muted/30 p-0.5 md:p-1 rounded-lg shadow-soft">
      <Button
        variant={currentView === "day" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("day")}
        className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 h-8"
      >
        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Day</span>
      </Button>
      <Button
        variant={currentView === "week" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("week")}
        className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 h-8"
      >
        <CalendarDays className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Week</span>
      </Button>
      <Button
        variant={currentView === "month" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("month")}
        className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 h-8"
      >
        <CalendarRange className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Month</span>
      </Button>
    </div>
  );
};
