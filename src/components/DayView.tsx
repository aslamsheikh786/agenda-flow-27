import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  color?: string;
}

interface DayViewProps {
  events?: CalendarEvent[];
}

interface TimeSlotProps {
  hour: number;
  events: CalendarEvent[];
}

const TimeSlot = ({ hour, events }: TimeSlotProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: `hour-${hour}` });

  const slotEvents = events.filter((event) => {
    const eventHour = event.startTime ? parseInt(event.startTime.split(":")[0]) : 0;
    return eventHour === hour;
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[80px] border-b border-border p-3 transition-colors ${
        isOver ? "bg-primary/10" : "hover:bg-muted/30"
      }`}
    >
      {slotEvents.map((event) => (
        <div
          key={event.id}
          className="text-sm p-3 mb-2 rounded-lg bg-calendar-event text-primary-foreground shadow-soft"
        >
          <div className="font-semibold">{event.title}</div>
          {event.startTime && (
            <div className="text-xs opacity-90 mt-1">
              {event.startTime} - {event.endTime}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const DayView = ({ events = [] }: DayViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const previousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === currentDate.toDateString();
  });

  const isToday = new Date().toDateString() === currentDate.toDateString();

  return (
    <div className="flex-1 p-6 bg-background overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {currentDate.toLocaleDateString("en-US", { 
              weekday: "long",
              month: "long", 
              day: "numeric",
              year: "numeric" 
            })}
            {isToday && (
              <span className="ml-3 text-sm font-normal text-primary">(Today)</span>
            )}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousDay}
              className="hover:bg-muted/50 border-input shadow-soft"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextDay}
              className="hover:bg-muted/50 border-input shadow-soft"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-medium border border-border bg-card">
          <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-[100px_1fr]">
                <div className="border-r border-border p-4 text-sm text-muted-foreground text-right pr-4 bg-muted/10">
                  {hour === 0 ? "12:00 AM" : hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`}
                </div>
                <TimeSlot hour={hour} events={todayEvents} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
