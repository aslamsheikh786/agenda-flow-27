import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  color?: string;
}

interface CalendarGridProps {
  events?: CalendarEvent[];
}

interface DayCardProps {
  day: number;
  today: boolean;
  dayEvents: CalendarEvent[];
  date: Date;
}

const DayCard = ({ day, today, dayEvents, date }: DayCardProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: date.toDateString(),
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-card p-3 min-h-[120px] hover:bg-calendar-hover transition-all cursor-pointer group ${
        today ? "ring-2 ring-primary ring-inset" : ""
      } ${isOver ? "bg-primary/10 ring-2 ring-primary" : ""}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`text-sm font-semibold transition-all ${
            today
              ? "bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center shadow-soft"
              : "text-foreground group-hover:text-primary"
          }`}
        >
          {day}
        </span>
      </div>
      <div className="space-y-1">
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className="text-xs p-1.5 rounded-md bg-calendar-event text-primary-foreground truncate hover:opacity-90 transition-all shadow-soft"
          >
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CalendarGrid = ({ events = [] }: CalendarGridProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  return (
    <div className="flex-1 p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousMonth}
              className="hover:bg-muted/50 border-input shadow-soft"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="hover:bg-muted/50 border-input shadow-soft"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden shadow-medium">
          {/* Day headers */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="bg-card p-3 text-center font-semibold text-muted-foreground text-sm"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="bg-muted/20 min-h-[120px]"
            />
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayEvents = getEventsForDay(day);
            const today = isToday(day);
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

            return (
              <DayCard
                key={day}
                day={day}
                today={today}
                dayEvents={dayEvents}
                date={date}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
