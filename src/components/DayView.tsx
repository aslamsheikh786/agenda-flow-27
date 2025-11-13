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
      className={`min-h-[50px] border-b border-border p-2 transition-colors ${
        isOver ? "bg-primary/10" : "hover:bg-muted/30"
      }`}
    >
      {slotEvents.map((event) => (
        <div
          key={event.id}
          className="text-xs p-2 mb-1 rounded-lg bg-calendar-event text-primary-foreground shadow-soft"
        >
          <div className="font-semibold truncate">{event.title}</div>
          {event.startTime && (
            <div className="text-[10px] opacity-90 mt-0.5">
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
    <div className="flex-1 p-4 bg-background overflow-auto flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
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

        <div className="rounded-xl overflow-hidden shadow-medium border border-border bg-card mb-4 flex-shrink-0">
          <div className="max-h-[40vh] overflow-y-auto">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-[80px_1fr]">
                <div className="border-r border-border p-2 text-xs text-muted-foreground text-right pr-2 bg-muted/10">
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </div>
                <TimeSlot hour={hour} events={todayEvents} />
              </div>
            ))}
          </div>
        </div>

        {todayEvents.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-medium">
            <h3 className="text-lg font-semibold mb-3 text-foreground">Today's Events</h3>
            <div className="space-y-2">
              {todayEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="font-medium text-foreground">{event.title}</div>
                  {event.startTime && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {event.startTime} - {event.endTime}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
