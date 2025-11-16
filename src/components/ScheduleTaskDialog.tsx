import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface ScheduleTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSchedule: (task: Task, date: Date, startTime: string, endTime: string) => void;
}

export const ScheduleTaskDialog = ({ 
  open, 
  onOpenChange, 
  task,
  onSchedule 
}: ScheduleTaskDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");

  const handleSchedule = () => {
    if (selectedDate && task && startTime && endTime) {
      // Validate that end time is after start time
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (endMinutes <= startMinutes) {
        alert("End time must be after start time!");
        return;
      }

      onSchedule(task, selectedDate, startTime, endTime);
      onOpenChange(false);
      // Reset for next use
      setSelectedDate(new Date());
      setStartTime("09:00");
      setEndTime("10:00");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border shadow-medium">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Schedule Task
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {task ? `Schedule "${task.title}" to your calendar` : "Select a date and time"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Picker */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Select Date</span>
            </div>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-lg border border-border bg-background"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
            {selectedDate && (
              <p className="text-center text-sm text-muted-foreground">
                Selected: {format(selectedDate, "PPPP")}
              </p>
            )}
          </div>

          {/* Custom Time Inputs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Select Time Range</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Time */}
              <div className="space-y-2">
                <Label htmlFor="start-time" className="text-sm text-foreground">
                  Start Time
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-background border-input"
                />
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <Label htmlFor="end-time" className="text-sm text-foreground">
                  End Time
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-background border-input"
                />
              </div>
            </div>

            {/* Time Summary */}
            <div className="rounded-lg bg-muted/50 p-3 border border-border">
              <p className="text-sm text-center text-foreground">
                <Clock className="inline h-4 w-4 mr-1" />
                {startTime} - {endTime}
                <span className="text-muted-foreground ml-2">
                  ({calculateDuration(startTime, endTime)})
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-input hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={!selectedDate || !task || !startTime || !endTime}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Schedule Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to calculate duration
function calculateDuration(startTime: string, endTime: string): string {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const durationMinutes = endMinutes - startMinutes;

  if (durationMinutes <= 0) return "Invalid";

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}