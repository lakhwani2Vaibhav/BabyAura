
"use client";

import { JourneyItemData } from "@/app/parent/dashboard/page";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Check, CheckCircle2 } from "lucide-react";

interface JourneyTimelineItemProps {
    item: JourneyItemData;
    isLast: boolean;
    onToggle: (title: string) => void;
}

export const JourneyTimelineItem = ({ item, isLast, onToggle }: JourneyTimelineItemProps) => {
    return (
        <div className="relative flex items-start gap-6">
            {/* Icon and Connector */}
            <div className="flex flex-col items-center">
                <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors",
                    item.completed 
                        ? "bg-green-100 border-green-300 text-green-600" 
                        : "bg-primary/10 border-primary/20 text-primary"
                )}>
                   {item.completed ? <CheckCircle2 className="h-6 w-6" /> : <item.icon className="h-6 w-6" />}
                </div>
            </div>

            {/* Content */}
            <div className={cn(
                "flex-1 pt-2 transition-opacity",
                item.completed && "opacity-60"
            )}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className={cn(
                            "font-bold",
                            item.completed && "line-through"
                        )}>{item.title}</p>
                        <p className={cn(
                            "text-sm text-muted-foreground",
                             item.completed && "line-through"
                        )}>{item.description}</p>
                    </div>
                     <div className="text-left sm:text-right mt-2 sm:mt-0 flex-shrink-0">
                        <p className="text-sm font-semibold">{item.day}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                </div>
                {!item.completed && item.day !== "Anytime" && (
                     <div className="mt-3">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onToggle(item.title)}
                        >
                           <Check className="h-4 w-4 mr-2" /> Mark as Done
                        </Button>
                     </div>
                )}
            </div>
        </div>
    );
};
