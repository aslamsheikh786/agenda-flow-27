import { Plus, Circle, CheckCircle2, Calendar, Trash2, Zap, FolderPlus, ChevronRight, ChevronDown, Folder, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskDialog } from "./TaskDialog";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";
import { useDraggable } from "@dnd-kit/core";
import { FolderDialog } from "./FolderDialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  difficulty?: string;
  duration?: string;
  priority?: string;
  folderId?: string;
}

interface TaskFolder {
  id: string;
  name: string;
  collapsed: boolean;
}

interface DraggableTaskProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddToCalendar: (task: Task) => void;
  getDifficultyColor: (difficulty?: string) => string;
  getPriorityColor: (priority?: string) => string;
}

const DraggableTask = ({
  task,
  onToggle,
  onDelete,
  onAddToCalendar,
  getDifficultyColor,
  getPriorityColor,
}: DraggableTaskProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 'auto',
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-2 p-3 rounded-xl hover:bg-sidebar-accent transition-all border border-transparent hover:border-border shadow-soft hover:shadow-medium ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div
        className="mt-0.5 flex-shrink-0 cursor-grab active:cursor-grabbing hover:text-primary transition-colors"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-task-complete" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            task.completed
              ? "line-through text-muted-foreground"
              : "text-sidebar-foreground"
          }`}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {task.difficulty && (
            <Badge variant="outline" className={`text-xs px-2 py-0 ${getDifficultyColor(task.difficulty)}`}>
              {task.difficulty}
            </Badge>
          )}
          {task.duration && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {task.duration}m
            </span>
          )}
          {task.priority && (
            <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          )}
        </div>
        {task.dueDate && (
          <p className="text-xs text-muted-foreground mt-1">
            Due: {task.dueDate.toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCalendar(task);
          }}
        >
          <Calendar className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:text-destructive hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface TaskSidebarProps {
  onAddEvent?: (title: string) => void;
}

export const TaskSidebar = ({ onAddEvent }: TaskSidebarProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: "1", 
      title: "Team meeting preparation", 
      completed: false, 
      dueDate: new Date(),
      difficulty: "medium",
      duration: "60",
      priority: "high",
      folderId: "folder-1"
    },
    { 
      id: "2", 
      title: "Review project proposal", 
      completed: false,
      difficulty: "hard",
      duration: "90",
      priority: "medium",
      folderId: "folder-1"
    },
    { 
      id: "3", 
      title: "Update documentation", 
      completed: true,
      difficulty: "easy",
      duration: "30",
      priority: "low",
      folderId: "folder-2"
    },
  ]);
  const [folders, setFolders] = useState<TaskFolder[]>([
    { id: "folder-1", name: "Work", collapsed: false },
    { id: "folder-2", name: "Personal", collapsed: false },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);

  const triggerCelebration = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const addTask = (taskData: {
    title: string;
    difficulty: string;
    duration: string;
    dueDate?: Date;
    priority: string;
  }) => {
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        title: taskData.title,
        completed: false,
        dueDate: taskData.dueDate,
        difficulty: taskData.difficulty,
        duration: taskData.duration,
        priority: taskData.priority,
        folderId: folders.length > 0 ? folders[0].id : undefined,
      },
    ]);
  };

  const addFolder = (folderName: string) => {
    setFolders([
      ...folders,
      {
        id: `folder-${Date.now()}`,
        name: folderName,
        collapsed: false,
      },
    ]);
  };

  const toggleFolder = (folderId: string) => {
    setFolders(
      folders.map((folder) =>
        folder.id === folderId ? { ...folder, collapsed: !folder.collapsed } : folder
      )
    );
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      triggerCelebration();
    }
    
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

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/20 text-green-700 dark:text-green-400";
      case "medium": return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      case "hard": return "bg-red-500/20 text-red-700 dark:text-red-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "low": return "text-muted-foreground";
      case "medium": return "text-blue-600 dark:text-blue-400";
      case "high": return "text-red-600 dark:text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const unassignedTasks = tasks.filter((task) => !task.folderId);

  return (
    <div className="w-80 border-r border-border bg-sidebar flex flex-col h-screen shadow-soft">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Tasks</h2>
          <Badge variant="secondary" className="text-xs">
            {tasks.filter(t => !t.completed).length} active
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setDialogOpen(true)}
            className="flex-1 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground shadow-soft"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
          <Button
            onClick={() => setFolderDialogOpen(true)}
            variant="outline"
            size="icon"
            className="border-input hover:bg-muted/50 shadow-soft"
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {folders.map((folder) => {
            const folderTasks = tasks.filter((task) => task.folderId === folder.id);
            return (
              <Collapsible
                key={folder.id}
                open={!folder.collapsed}
                onOpenChange={() => toggleFolder(folder.id)}
              >
                <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 hover:bg-sidebar-accent rounded-lg transition-colors group">
                  {folder.collapsed ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Folder className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-sidebar-foreground flex-1 text-left">
                    {folder.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {folderTasks.filter(t => !t.completed).length}
                  </Badge>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2 ml-6">
                  {folderTasks.map((task) => (
                    <DraggableTask
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      onAddToCalendar={addToCalendar}
                      getDifficultyColor={getDifficultyColor}
                      getPriorityColor={getPriorityColor}
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}

          {unassignedTasks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2">
                <span className="text-sm font-semibold text-muted-foreground">Unassigned</span>
                <Badge variant="secondary" className="text-xs">
                  {unassignedTasks.filter(t => !t.completed).length}
                </Badge>
              </div>
              <div className="space-y-2">
                {unassignedTasks.map((task) => (
                  <DraggableTask
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onAddToCalendar={addToCalendar}
                    getDifficultyColor={getDifficultyColor}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={addTask}
      />
      <FolderDialog
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
        onSave={addFolder}
      />
    </div>
  );
};
