
"use client";

import { scrapbookMemories as initialScrapbookMemories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UploadMemoryModal } from "@/components/scrapbook/UploadMemoryModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookImage, Plus } from "lucide-react";
import { ScrapbookTimeline } from "@/components/scrapbook/ScrapbookTimeline";

type Memory = (typeof initialScrapbookMemories)[0];

export default function ScrapbookPage() {
  const [memories] = useState<Memory[]>(initialScrapbookMemories);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <BookImage className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold font-headline">
              AI Scrapbook
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            A timeline of your baby's most precious moments.
          </p>
        </div>
        <UploadMemoryModal />
      </div>

      <ScrapbookTimeline memories={memories} />

    </div>
  );
}
