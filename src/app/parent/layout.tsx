
"use client";

import React from "react";
import { withAuth } from "@/components/providers";
import { ParentHeader } from "@/components/layout/ParentHeader";

function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <ParentHeader />
      <main className="container mx-auto px-4 pt-20 pb-4 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default withAuth(ParentLayout, ["Parent"]);
