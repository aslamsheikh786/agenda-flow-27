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

interface FourDayViewProps {
  events?: CalendarEvent[];
}

interface TimeSlotProps {
  date: Date;
  hour: number;
  events: CalendarEvent[];
}

const TimeSlot = ({ date, hour, events }: TimeSlotProps) => {
  const slotId = `${date.toDateString()}-${hour}`;
  const { setNodeRef, isOver } = useDroppable({ id: slotId });

  const slotEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const eventHour = event.startTime ? parseInt(event.startTime.split(":")[0]) : 0;
    return (
      eventDate.toDateString() === date.toDateString() &&
      eventHour === hour
    );
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[50px] border-b border-r border-border p-1 transition-colors ${
        isOver ? "bg-primary/10" : "hover:bg-muted/30"
      }`}
    >
      {slotEvents.map((event) => (
        <div
          key={event.id}
          className="text-xs p-1.5 mb-1 rounded-md bg-calendar-event text-primary-foreground shadow-soft"
        >
          <div className="font-semibold truncate text-[10px]">{event.title}</div>
          {event.startTime && (
            <div className="text-[9px] opacity-90">
              {event.startTime}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const FourDayView = ({ events = [] }: FourDayViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getFourDays = (date: Date) => {
    const days = [];
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 4; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const fourDays = getFourDays(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const previousDays = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 4);
    setCurrentDate(newDate);
  };

  const nextDays = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 4);
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="flex-1 p-4 bg-background overflow-auto flex flex-col">
      <div className="max-w-full mx-auto w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">
            {fourDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousDays}
              className="h-8 w-8 hover:bg-muted/50 border-input shadow-soft"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextDays}
              className="h-8 w-8 hover:bg-muted/50 border-input shadow-soft"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden shadow-medium border border-border mb-4 flex-shrink-0">
          <div className="grid grid-cols-[60px_repeat(4,1fr)] bg-card">
            <div className="border-r border-b border-border p-2 bg-muted/10"></div>
            {fourDays.map((day) => (
              <div
                key={day.toDateString()}
                className={`border-r border-b border-border p-2 text-center ${
                  isToday(day) ? "bg-primary/10" : "bg-card"
                }`}
              >
                <div className="text-xs font-medium text-foreground">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className={`text-sm ${isToday(day) ? "font-bold text-primary" : "text-muted-foreground"}`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          <div className="max-h-[35vh] overflow-y-auto">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-[60px_repeat(4,1fr)]">
                <div className="border-r border-border p-1.5 text-[10px] text-muted-foreground text-right pr-2 bg-muted/10">
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </div>
                {fourDays.map((day) => (
                  <TimeSlot key={`${day.toDateString()}-${hour}`} date={day} hour={hour} events={events} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {events.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-3 shadow-medium">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Upcoming Events</h3>
            <div className="space-y-2">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="p-2 rounded-lg bg-muted/50 border border-border">
                  <div className="font-medium text-sm text-foreground">{event.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {event.startTime && ` • ${event.startTime}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
