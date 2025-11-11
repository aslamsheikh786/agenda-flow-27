import { AppHeader } from "@/components/AppHeader";
import { CalendarGrid } from "@/components/CalendarGrid";
import { WeekView } from "@/components/WeekView";
import { DayView } from "@/components/DayView";
import { TaskSidebar } from "@/components/TaskSidebar";
import { useState } from "react";
import { toast } from "sonner";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { CalendarView } from "@/components/CalendarViewSwitcher";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
}

const Index = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: "1", title: "Team Standup", date: new Date(), startTime: "09:00", endTime: "10:00" },
    { id: "2", title: "Client Presentation", date: new Date(Date.now() + 86400000), startTime: "14:00", endTime: "15:30" },
  ]);
  const [currentView, setCurrentView] = useState<CalendarView>("month");

  const handleAddEvent = (title: string) => {
    const newEvent = {
      id: Date.now().toString(),
      title,
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
    };
    setEvents([...events, newEvent]);
    toast.success("Task added to calendar");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over) {
      const taskData = active.data.current as any;
      let dropDate: Date;
      
      if (currentView === "month") {
        dropDate = new Date(over.id as string);
      } else if (currentView === "week") {
        const [dateStr, hourStr] = (over.id as string).split("-");
        dropDate = new Date(dateStr);
        const hour = parseInt(hourStr);
        dropDate.setHours(hour);
      } else {
        const hour = parseInt((over.id as string).replace("hour-", ""));
        dropDate = new Date();
        dropDate.setHours(hour);
      }

      const newEvent = {
        id: `event-${Date.now()}`,
        title: taskData.title,
        date: dropDate,
        startTime: dropDate.getHours().toString().padStart(2, "0") + ":00",
        endTime: (dropDate.getHours() + 1).toString().padStart(2, "0") + ":00",
      };

      setEvents([...events, newEvent]);
      toast.success("Task added to calendar");
    }
  };

  const renderCalendarView = () => {
    switch (currentView) {
      case "day":
        return <DayView events={events} />;
      case "week":
        return <WeekView events={events} />;
      case "month":
      default:
        return <CalendarGrid events={events} />;
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-background">
        <AppHeader currentView={currentView} onViewChange={setCurrentView} />
        <div className="flex flex-1 overflow-hidden">
          <TaskSidebar onAddEvent={handleAddEvent} />
          <div className="flex-1 overflow-auto">
            {renderCalendarView()}
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default Index;
