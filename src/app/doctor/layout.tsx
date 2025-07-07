"use client";

import React from "react";
import { withAuth } from "@/components/providers";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { doctorSidebarNav } from "@/lib/constants";

function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout navItems={doctorSidebarNav}>{children}</DashboardLayout>;
}

export default withAuth(DoctorLayout, ["Doctor"]);
