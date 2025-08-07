
"use client";

import { JourneyItemData } from "@/app/parent/dashboard/page";
import { JourneyTimelineItem } from "./JourneyTimelineItem";

interface JourneyTimelineProps {
    items: JourneyItemData[];
    onToggle: (title: string) => void;
}

export const JourneyTimeline = ({ items, onToggle }: JourneyTimelineProps) => {
    return (
        <div className="relative pt-6">
            {/* The vertical timeline bar */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border -translate-x-1/2" />
            
            <div className="space-y-10">
                {items.map((item, index) => (
                    <JourneyTimelineItem 
                        key={item.title} 
                        item={item} 
                        isLast={index === items.length - 1}
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </div>
    );
};
