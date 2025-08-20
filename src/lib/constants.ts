import {
  LayoutDashboard,
  Stethoscope,
  Users,
  FileText,
  Building,
  Briefcase,
  Brain,
  Server,
  Activity,
  Hospital,
  Video,
  BarChart2,
  BookImage,
  Settings,
  type LucideIcon,
  ListChecks,
  MessageSquare,
  Users2,
  FileHeart,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
}

export const parentHeaderNav: NavItem[] = [
  {
    href: "/parent/dashboard",
    label: "Home",
    icon: LayoutDashboard,
  },
  {
    href: "/parent/timeline",
    label: "Timeline",
    icon: ListChecks,
  },
  {
    href: "/parent/consultations",
    label: "Appointments",
    icon: Video,
  },
    {
    href: "/parent/contact",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    href: "/parent/scrapbook",
    label: "Scrapbook",
    icon: BookImage,
  },
  {
    href: "/parent/growth",
    label: "Growth",
    icon: BarChart2,
  },
];


export const doctorHeaderNav: NavItem[] = [
  {
    href: "/doctor/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/doctor/patients",
    label: "Patients",
    icon: Users,
    match: (pathname) => pathname.startsWith("/doctor/patients"),
  },
  {
    href: "/doctor/prescriptions",
    label: "Prescriptions",
    icon: FileText,
  },
  {
    href: "/doctor/earnings",
    label: "Earnings",
    icon: Stethoscope, // Placeholder, will be replaced by custom component
  },
  {
    href: "/doctor/settings",
    label: "Settings",
    icon: Settings,
  },
];

export const adminHeaderNav: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/team",
    label: "Manage Team",
    icon: Users2,
  },
  {
    href: "/admin/parents",
    label: "Parents",
    icon: Users,
  },
  {
    href: "/admin/plans",
    label: "Plans",
    icon: FileHeart,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: Activity,
  },
  {
    href: "/admin/hospital/onboarding",
    label: "Hospital Info",
    icon: Building,
  },
  {
    href: "/admin/billing",
    label: "Billing",
    icon: Briefcase,
  },
];

export const superAdminHeaderNav: NavItem[] = [
  {
    href: "/superadmin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/superadmin/hospitals",
    label: "Hospitals",
    icon: Hospital,
  },
  {
    href: "/superadmin/analytics",
    label: "Analytics",
    icon: Activity,
  },
  {
    href: "/superadmin/logs",
    label: "Usage Logs",
    icon: Server,
  },
];
