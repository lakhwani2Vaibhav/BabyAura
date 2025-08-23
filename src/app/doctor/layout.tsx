
"use client";

import React from "react";
import { withAuth } from "@/components/providers";
import { DoctorHeader } from "@/components/layout/DoctorHeader";
import { useAuth } from "@/hooks/use-auth";
import { SuspendedAccountOverlay } from "@/components/auth/SuspendedAccountOverlay";

function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { isSuspended } = useAuth();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DoctorHeader />
      <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-8 relative overflow-y-auto">
        {isSuspended ? <SuspendedAccountOverlay /> : children}
      </main>
    </div>
  );
}

export default withAuth(DoctorLayout, ["Doctor"], { loginPath: '/auth/login/admins'});
