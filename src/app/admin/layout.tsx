"use client";

import React from "react";
import { withAuth } from "@/components/providers";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminSidebarNav } from "@/lib/constants";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout navItems={adminSidebarNav}>{children}</DashboardLayout>;
}

export default withAuth(AdminLayout, ["Admin", "Superadmin"]);
