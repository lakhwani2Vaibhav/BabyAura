
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ChecklistItemProps {
  id: number;
  text: string;
  completed: boolean;
  onToggle: (id: number) => void;
}

export function ChecklistItem({ id, text, completed, onToggle }: ChecklistItemProps) {
  return (
    <div
      onClick={() => onToggle(id)}
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 cursor-pointer transition-all",
        completed ? "bg-green-500/10" : "bg-muted/50 hover:bg-muted"
      )}
    >
      <Checkbox
        id={`task-${id}`}
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className="h-5 w-5"
      />
      <label
        htmlFor={`task-${id}`}
        className={cn(
          "flex-1 text-sm font-medium cursor-pointer",
          completed ? "text-muted-foreground line-through" : "text-foreground"
        )}
      >
        {text}
      </label>
    </div>
  );
}
