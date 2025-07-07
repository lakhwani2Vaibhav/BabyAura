"use client";

import React from "react";
import { withAuth } from "@/components/providers";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { superAdminSidebarNav } from "@/lib/constants";

function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={superAdminSidebarNav}>
      {children}
    </DashboardLayout>
  );
}

export default withAuth(SuperAdminLayout, ["Superadmin"]);
