import {
  LayoutDashboard,
  Phone,
  Stethoscope,
  Users,
  FileText,
  DollarSign,
  Building,
  Briefcase,
  Brain,
  Server,
  Activity,
  Hospital,
  Video,
  BarChart2,
  CalendarCheck,
  BookImage,
  type LucideIcon,
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
    label: "Overview",
    icon: LayoutDashboard,
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
  {
    href: "/parent/care",
    label: "Care",
    icon: Stethoscope,
  },
  {
    href: "/parent/community",
    label: "Community",
    icon: Users,
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
  },
  {
    href: "/doctor/prescriptions",
    label: "Prescriptions",
    icon: FileText,
  },
  {
    href: "/doctor/earnings",
    label: "Earnings",
    icon: DollarSign,
  },
];

export const adminHeaderNav: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/doctors",
    label: "Manage Doctors",
    icon: Stethoscope,
  },
  {
    href: "/admin/patients",
    label: "Patients",
    icon: Users,
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
