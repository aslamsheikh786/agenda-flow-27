import { AppHeader } from "@/components/AppHeader";
import { CalendarGrid } from "@/components/CalendarGrid";
import { TaskSidebar } from "@/components/TaskSidebar";
import { useState } from "react";
import { toast } from "sonner";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
}

const Index = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: "1", title: "Team Standup", date: new Date() },
    { id: "2", title: "Client Presentation", date: new Date(Date.now() + 86400000) },
  ]);

  const handleAddEvent = (title: string) => {
    const newEvent = {
      id: Date.now().toString(),
      title,
      date: new Date(),
    };
    setEvents([...events, newEvent]);
    toast.success("Task added to calendar");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <TaskSidebar onAddEvent={handleAddEvent} />
        <div className="flex-1 overflow-auto">
          <CalendarGrid events={events} />
        </div>
      </div>
    </div>
  );
};

export default Index;
