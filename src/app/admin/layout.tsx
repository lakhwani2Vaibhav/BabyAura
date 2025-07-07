"use client";

import React from "react";
import { withAuth } from "@/components/providers";
import { AdminHeader } from "@/components/layout/AdminHeader";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader />
      <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}

export default withAuth(AdminLayout, ["Admin", "Superadmin"]);
