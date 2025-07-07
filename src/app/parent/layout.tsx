"use client";

import React from "react";
import { withAuth } from "@/components/providers";
import { ParentHeader } from "@/components/layout/ParentHeader";

function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ParentHeader />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export default withAuth(ParentLayout, ["Parent"]);
