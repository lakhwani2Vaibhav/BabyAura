
"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { Video, Mic, Image as ImageIcon, Calendar } from "lucide-react";
import type { scrapbookMemories } from "@/lib/data";

type Memory = (typeof scrapbookMemories)[0];

interface ScrapbookTimelineProps {
  memories: Memory[];
}

const typeIcons: { [key: string]: React.ReactNode } = {
  image: <ImageIcon className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  audio: <Mic className="h-5 w-5" />,
};

export function ScrapbookTimeline({ memories }: ScrapbookTimelineProps) {
  return (
    <div className="relative pl-8">
      {/* The vertical timeline bar */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-border -translate-x-1/2" />
      <div className="space-y-8">
        {memories.map((memory) => (
          <div
            key={memory.id}
            className="relative animate-in fade-in-0 slide-in-from-left-4 duration-700 ease-out"
          >
            <div className="absolute -left-8 top-1 h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center ring-4 ring-background -translate-x-1/2">
              {typeIcons[memory.type]}
            </div>
            <Card className="ml-4 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-lg">{memory.title}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(parseISO(memory.date), "MMMM d, yyyy")}
                    </span>
                  </div>
                </div>
                {memory.type === "image" && memory.url.startsWith("https") && (
                  <div className="pt-4">
                    <Image
                      src={memory.url}
                      data-ai-hint={memory.dataAiHint}
                      alt={memory.caption}
                      width={600}
                      height={400}
                      className="rounded-lg object-cover w-full aspect-video"
                    />
                  </div>
                )}
                {memory.type === "video" && (
                  <div className="pt-4 bg-black rounded-lg flex items-center justify-center aspect-video">
                    <Video className="h-16 w-16 text-white/50" />
                  </div>
                )}
                {memory.type === "audio" && (
                  <div className="pt-4 flex items-center gap-4 bg-muted p-4 rounded-lg">
                    <Mic className="h-8 w-8 text-primary" />
                    <div className="w-full h-2 bg-border rounded-full">
                      <div className="w-1/3 h-full bg-primary rounded-full"></div>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90">{memory.caption}</p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 flex-wrap">
                  {memory.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
