import { AppHeader } from "@/components/AppHeader";
import { CalendarGrid } from "@/components/CalendarGrid";
import { WeekView } from "@/components/WeekView";
import { DayView } from "@/components/DayView";
import { FourDayView } from "@/components/FourDayView";
import { TaskSidebar } from "@/components/TaskSidebar";
import { useState } from "react";
import { toast } from "sonner";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { CalendarView } from "@/components/CalendarViewSwitcher";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  taskId?: string;
}

interface TaskData {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  difficulty?: string;
  duration?: string;
  priority?: string;
  folderId?: string;
}

const Index = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: "1", title: "Team Standup", date: new Date(), startTime: "09:00", endTime: "10:00" },
    { id: "2", title: "Client Presentation", date: new Date(Date.now() + 86400000), startTime: "14:00", endTime: "15:30" },
  ]);
  const [currentView, setCurrentView] = useState<CalendarView>("month");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();

  const handleAddEvent = (title: string, taskId?: string) => {
    const newEvent = {
      id: Date.now().toString(),
      title,
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
      taskId,
    };
    setEvents([...events, newEvent]);
    toast.success("Task added to calendar");
    
    // Close drawer on mobile after adding
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setEvents(events.filter((event) => event.taskId !== taskId));
  };

  const handleDragStart = (event: DragStartEvent) => {
    console.log('🔴 DRAG STARTED');
    setIsDragging(true);
    
    // Close drawer on desktop when dragging starts
    if (!isMobile && drawerOpen) {
      setDrawerOpen(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('🔴 DRAG ENDED');
    setIsDragging(false);
    const { active, over } = event;
    
    if (over && active.data.current) {
      const taskData = active.data.current as TaskData;
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
        taskId: taskData.id,
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
        return isMobile ? <FourDayView events={events} /> : <WeekView events={events} />;
      case "month":
      default:
        return <CalendarGrid events={events} />;
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-background">
        <AppHeader 
          currentView={currentView} 
          onViewChange={setCurrentView}
          onMenuToggle={() => setDrawerOpen(true)}
        />
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop: Always visible sidebar - Drag & Drop works */}
          <div className="hidden lg:block">
            <TaskSidebar 
              onAddEvent={handleAddEvent} 
              onDeleteTask={handleDeleteTask} 
              isDragging={isDragging}
              isMobile={false}
            />
          </div>
          
          {/* Mobile: Drawer sidebar - Use "Schedule" button instead of drag */}
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent className="h-[85vh]">
              <TaskSidebar 
                onAddEvent={handleAddEvent} 
                onDeleteTask={handleDeleteTask} 
                isDragging={isDragging}
                isMobile={true}
              />
            </DrawerContent>
          </Drawer>
          
          {/* Calendar view - full width on mobile, beside sidebar on desktop */}
          <div className="flex-1 overflow-auto w-full">
            {renderCalendarView()}
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default Index;