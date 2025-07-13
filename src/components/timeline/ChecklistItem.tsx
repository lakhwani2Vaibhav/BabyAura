
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
        "flex items-center gap-4 rounded-lg p-3 cursor-pointer transition-all border",
        completed
          ? "bg-green-500/10 border-green-500/20"
          : "bg-muted/50 hover:bg-muted"
      )}
    >
      <Checkbox
        checked={completed}
        aria-label={`Task: ${text}`}
        className="h-5 w-5 rounded-full pointer-events-none"
      />
      <span
        className={cn(
          "flex-1 text-sm font-medium",
          completed ? "text-muted-foreground line-through" : "text-foreground"
        )}
      >
        {text}
      </span>
    </div>
  );
}
