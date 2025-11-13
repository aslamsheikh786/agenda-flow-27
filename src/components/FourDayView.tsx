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
    <div className="flex-1 p-4 bg-background overflow-auto">
      <div className="max-w-full mx-auto">
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

        <div className="rounded-lg overflow-hidden shadow-medium border border-border">
          <div className="grid grid-cols-[60px_repeat(4,1fr)] bg-card">
            <div className="sticky top-0 z-20 bg-card border-r border-b border-border p-2">
              <span className="text-xs font-medium text-muted-foreground">Time</span>
            </div>
            {fourDays.map((date) => (
              <div
                key={date.toDateString()}
                className={`sticky top-0 z-20 text-center p-2 border-r border-b border-border ${
                  isToday(date) ? "bg-calendar-today/10" : "bg-card"
                }`}
              >
                <div className="text-xs font-medium text-muted-foreground">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div
                  className={`text-sm font-bold mt-1 ${
                    isToday(date) ? "text-calendar-today" : "text-foreground"
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            ))}

            {hours.map((hour) => (
              <div key={hour} className="contents">
                <div className="bg-card border-r border-border p-2 text-right">
                  <span className="text-xs text-muted-foreground">
                    {hour.toString().padStart(2, "0")}:00
                  </span>
                </div>
                {fourDays.map((date) => (
                  <TimeSlot
                    key={`${date.toDateString()}-${hour}`}
                    date={date}
                    hour={hour}
                    events={events}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
