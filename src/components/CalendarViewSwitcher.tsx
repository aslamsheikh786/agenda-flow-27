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
    <div className="flex gap-1 bg-muted/30 p-1 rounded-lg shadow-soft">
      <Button
        variant={currentView === "day" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("day")}
        className="gap-2"
      >
        <Calendar className="h-4 w-4" />
        Day
      </Button>
      <Button
        variant={currentView === "week" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("week")}
        className="gap-2"
      >
        <CalendarDays className="h-4 w-4" />
        Week
      </Button>
      <Button
        variant={currentView === "month" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("month")}
        className="gap-2"
      >
        <CalendarRange className="h-4 w-4" />
        Month
      </Button>
    </div>
  );
};
