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

export const parentSidebarNav: NavItem[] = [
  {
    href: "/parent/consultations",
    label: "Consultations",
    icon: Video,
  },
  {
    href: "/parent/reports",
    label: "Health Reports",
    icon: BarChart2,
  },
  {
    href: "/parent/vaccination",
    label: "Vaccination",
    icon: CalendarCheck,
  },
  {
    href: "/parent/emergency",
    label: "Emergency",
    icon: Phone,
  },
  {
    href: "/parent/scrapbook",
    label: "Scrapbook",
    icon: BookImage,
  },
];

export const doctorSidebarNav: NavItem[] = [
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

export const adminSidebarNav: NavItem[] = [
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
    label: "Billing Model",
    icon: Briefcase,
  },
];

export const superAdminSidebarNav: NavItem[] = [
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
