"use client";

import React from "react";
import { withAuth } from "@/components/providers";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { parentSidebarNav } from "@/lib/constants";

function ParentLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout navItems={parentSidebarNav}>{children}</DashboardLayout>;
}

export default withAuth(ParentLayout, ["Parent"]);
