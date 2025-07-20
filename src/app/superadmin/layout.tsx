
"use client";

import React from "react";
import { withAuth } from "@/components/providers";
import { SuperAdminHeader } from "@/components/layout/SuperAdminHeader";

function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <SuperAdminHeader />
      <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}

export default withAuth(SuperAdminLayout, ["Superadmin"], { loginPath: '/auth/login/admins' });
