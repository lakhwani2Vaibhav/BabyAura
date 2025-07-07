"use client";

import { scrapbookMemories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, Plus } from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { UploadMemoryModal } from "@/components/scrapbook/UploadMemoryModal";

export default function ScrapbookPage() {
  return (
    <div className="bg-background rounded-lg relative">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Scrapbook</h1>
        <p className="text-muted-foreground mt-2">
          Capture and cherish every moment of your baby's journey.
        </p>
      </div>
      
      <div className="my-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search memories"
            className="pl-12 h-14 bg-secondary border-none text-base rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="bg-secondary rounded-lg">
                Tags <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Firsts</DropdownMenuItem>
              <DropdownMenuItem>Family</DropdownMenuItem>
              <DropdownMenuItem>Holidays</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="bg-secondary rounded-lg">
                Date <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Newest First</DropdownMenuItem>
              <DropdownMenuItem>Oldest First</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="bg-secondary rounded-lg">
                Suggestions <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Add 'First Haircut'</DropdownMenuItem>
              <DropdownMenuItem>Add 'First Vacation'</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="relative pl-5 py-5">
        <div className="absolute left-[23px] top-0 h-full w-0.5 bg-border -translate-x-1/2" />
        <div className="space-y-10">
          {scrapbookMemories.map((milestone) => (
            <div key={milestone.id} className="relative flex items-center">
              <div className="z-10 absolute left-0 flex items-center justify-center">
                 <Image
                    src={milestone.iconUrl}
                    data-ai-hint={milestone.dataAiHint}
                    alt={milestone.title}
                    width={48}
                    height={48}
                    className="rounded-full object-cover ring-4 ring-background"
                  />
              </div>
              <div className="ml-20">
                <p className="font-medium text-foreground">{milestone.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(milestone.date), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-8 right-8 flex flex-col items-center gap-4 z-50">
        <Button variant="outline" className="rounded-full shadow-lg bg-card hover:bg-muted">
            Relive Day
        </Button>
        <UploadMemoryModal />
      </div>
    </div>
  );
}
