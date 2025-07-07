"use client";

import { scrapbookMemories as initialScrapbookMemories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { UploadMemoryModal } from "@/components/scrapbook/UploadMemoryModal";
import { ScrapbookTimeline } from "@/components/scrapbook/ScrapbookTimeline";

type Memory = (typeof initialScrapbookMemories)[0];

export default function ScrapbookPage() {
  const [memories, setMemories] =
    useState<Memory[]>(initialScrapbookMemories);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredAndSortedMemories = useMemo(() => {
    let filtered = memories;

    if (searchTerm) {
      filtered = filtered.filter(
        (memory) =>
          memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          memory.caption.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((memory) => memory.tags.includes(selectedTag));
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [memories, searchTerm, sortOrder, selectedTag]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    memories.forEach((memory) => memory.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [memories]);

  return (
    <div className="bg-background rounded-lg relative animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          My Baby's Scrapbook
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A collection of precious moments, milestones, and memories.
        </p>
      </div>

      <div className="my-8 space-y-4 md:flex md:items-center md:justify-between md:space-y-0 md:gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search memories by title or caption..."
            className="pl-12 h-12 bg-muted border-none text-base rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-lg h-12">
                Tag: {selectedTag || "All"}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedTag(null)}>
                All
              </DropdownMenuItem>
              {allTags.map((tag) => (
                <DropdownMenuItem key={tag} onClick={() => setSelectedTag(tag)}>
                  {tag}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-lg h-12">
                Sort: {sortOrder === "newest" ? "Newest First" : "Oldest First"}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredAndSortedMemories.length > 0 ? (
        <ScrapbookTimeline memories={filteredAndSortedMemories} />
      ) : (
        <div className="text-center text-muted-foreground py-20">
          <h2 className="text-xl font-semibold">No memories found</h2>
          <p className="mt-2">Try adjusting your search or filters.</p>
        </div>
      )}

      <div className="fixed bottom-8 right-8 z-50">
        <UploadMemoryModal />
      </div>
    </div>
  );
}
