"use client";

import React from "react";
import { withAuth } from "@/components/providers";
import { DoctorHeader } from "@/components/layout/DoctorHeader";

function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DoctorHeader />
      <main className="container mx-auto px-4 pt-24 pb-8">
        {children}
      </main>
    </div>
  );
}

export default withAuth(DoctorLayout, ["Doctor"]);
