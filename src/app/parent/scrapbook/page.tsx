import { scrapbookMemories } from "@/lib/data";
import { UploadMemoryModal } from "@/components/scrapbook/UploadMemoryModal";
import { ScrapbookTimeline } from "@/components/scrapbook/ScrapbookTimeline";

export default function ScrapbookPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Baby's Scrapbook</h1>
          <p className="text-muted-foreground">
            A collection of precious moments and milestones.
          </p>
        </div>
        <UploadMemoryModal />
      </div>

      <ScrapbookTimeline memories={scrapbookMemories} />
    </div>
  );
}
