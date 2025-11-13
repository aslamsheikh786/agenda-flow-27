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

interface WeekViewProps {
  events?: CalendarEvent[];
  onEventDrop?: (taskId: string, date: Date, time: string) => void;
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
      className={`min-h-[60px] border-b border-r border-border p-1 transition-colors ${
        isOver ? "bg-primary/10" : "hover:bg-muted/30"
      }`}
    >
      {slotEvents.map((event) => (
        <div
          key={event.id}
          className="text-xs p-2 mb-1 rounded-md bg-calendar-event text-primary-foreground shadow-soft"
        >
          <div className="font-semibold truncate">{event.title}</div>
          {event.startTime && (
            <div className="text-[10px] opacity-90">
              {event.startTime} - {event.endTime}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const WeekView = ({ events = [] }: WeekViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="flex-1 p-4 bg-background overflow-auto flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            Week of {weekDates[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousWeek}
              className="hover:bg-muted/50 border-input shadow-soft"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextWeek}
              className="hover:bg-muted/50 border-input shadow-soft"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-medium border border-border mb-4 flex-shrink-0">
          <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-card">
            <div className="border-r border-b border-border p-3 bg-muted/20"></div>
            {weekDates.map((date) => (
              <div
                key={date.toISOString()}
                className={`border-r border-b border-border p-3 text-center ${
                  isToday(date) ? "bg-primary/10" : ""
                }`}
              >
                <div className="font-semibold text-sm text-foreground">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div
                  className={`text-lg font-bold mt-1 ${
                    isToday(date)
                      ? "bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow-soft"
                      : "text-foreground"
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            ))}
          </div>

          <div className="max-h-[40vh] overflow-y-auto">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-[80px_repeat(7,1fr)]">
                <div className="border-r border-border p-2 text-xs text-muted-foreground text-right pr-3 bg-muted/10">
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </div>
                {weekDates.map((date) => (
                  <TimeSlot
                    key={`${date.toISOString()}-${hour}`}
                    date={date}
                    hour={hour}
                    events={events}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {events.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-medium">
            <h3 className="text-lg font-semibold mb-3 text-foreground">This Week's Events</h3>
            <div className="space-y-2">
              {events.slice(0, 6).map((event) => (
                <div key={event.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="font-medium text-foreground">{event.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    {event.startTime && ` • ${event.startTime} - ${event.endTime}`}
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
