"use client";

import { scrapbookMemories as initialScrapbookMemories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UploadMemoryModal } from "@/components/scrapbook/UploadMemoryModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookImage, Plus } from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";

type Memory = (typeof initialScrapbookMemories)[0];

export default function ScrapbookPage() {
  const [memories] = useState<Memory[]>(initialScrapbookMemories);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookImage className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold font-headline">
              AI Scrapbook
            </CardTitle>
          </div>
          <CardDescription className="mt-1">
            A timeline of your baby's most precious moments.
          </CardDescription>
        </div>
        <UploadMemoryModal />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory) => (
            <Card key={memory.id} className="overflow-hidden group">
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                {memory.type === "image" && (
                   <Image
                      src={memory.url}
                      data-ai-hint={memory.dataAiHint}
                      alt={memory.title}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                )}
              </div>
              <div className="p-4 bg-background">
                 <p className="text-muted-foreground italic text-sm">"{memory.caption}"</p>
                 <p className="text-xs text-muted-foreground/80 text-right mt-2">{format(parseISO(memory.date), "MMMM d, yyyy")}</p>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
