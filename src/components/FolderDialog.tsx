import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderPlus } from "lucide-react";

interface FolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (folderName: string) => void;
}

export const FolderDialog = ({ open, onOpenChange, onSave }: FolderDialogProps) => {
  const [folderName, setFolderName] = useState("");

  const handleSave = () => {
    if (folderName.trim()) {
      onSave(folderName);
      setFolderName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border shadow-medium">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <FolderPlus className="h-5 w-5 text-primary" />
            Create New Folder
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Organize your tasks by creating folders.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name" className="text-foreground">
              Folder Name
            </Label>
            <Input
              id="folder-name"
              placeholder="e.g., Work, Personal, School"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              className="bg-background border-input"
            />
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
            onClick={handleSave}
            disabled={!folderName.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft"
          >
            Create Folder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
