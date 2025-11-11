import { Plus, Circle, CheckCircle2, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

interface TaskSidebarProps {
  onAddEvent?: (title: string) => void;
}

export const TaskSidebar = ({ onAddEvent }: TaskSidebarProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Team meeting preparation", completed: false, dueDate: new Date() },
    { id: "2", title: "Review project proposal", completed: false },
    { id: "3", title: "Update documentation", completed: true },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTaskTitle,
          completed: false,
        },
      ]);
      setNewTaskTitle("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const addToCalendar = (task: Task) => {
    if (onAddEvent) {
      onAddEvent(task.title);
    }
  };

  return (
    <div className="w-80 border-r border-border bg-sidebar flex flex-col h-screen">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground mb-4">Tasks</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Add new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            className="flex-1 bg-background"
          />
          <Button
            onClick={addTask}
            size="icon"
            className="bg-sidebar-primary hover:bg-sidebar-primary/90"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-start gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="mt-0.5 flex-shrink-0"
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-task-complete" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm ${
                    task.completed
                      ? "line-through text-muted-foreground"
                      : "text-sidebar-foreground"
                  }`}
                >
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {task.dueDate.toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => addToCalendar(task)}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:text-destructive"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
