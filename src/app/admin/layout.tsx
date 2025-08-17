
"use client";

import React from "react";
import { withAuth } from "@/components/providers";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { useAuth } from "@/hooks/use-auth";
import { SuspendedAccountOverlay } from "@/components/auth/SuspendedAccountOverlay";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isSuspended } = useAuth();
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader />
      <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-8 relative">
        {isSuspended ? <SuspendedAccountOverlay /> : children}
      </main>
    </div>
  );
}

export default withAuth(AdminLayout, ["Admin", "Superadmin"], { loginPath: '/auth/login/admins' });
