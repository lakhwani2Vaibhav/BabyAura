import {
  Baby,
  LayoutDashboard,
  Phone,
  Stethoscope,
  Users,
  FileText,
  DollarSign,
  Building,
  UserPlus,
  Briefcase,
  Brain,
  Server,
  Activity,
  Hospital,
  Video,
  BarChart2,
  CalendarCheck,
  BookImage,
} from "lucide-react";
import type { ReactNode } from "react";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  match?: (pathname: string) => boolean;
}

export const parentSidebarNav: NavItem[] = [
  {
    href: "/parent/consultations",
    label: "Consultations",
    icon: <Video className="w-5 h-5" />,
  },
  {
    href: "/parent/reports",
    label: "Health Reports",
    icon: <BarChart2 className="w-5 h-5" />,
  },
  {
    href: "/parent/vaccination",
    label: "Vaccination",
    icon: <CalendarCheck className="w-5 h-5" />,
  },
  {
    href: "/parent/emergency",
    label: "Emergency",
    icon: <Phone className="w-5 h-5" />,
  },
  {
    href: "/parent/scrapbook",
    label: "Scrapbook",
    icon: <BookImage className="w-5 h-5" />,
  },
];

export const doctorSidebarNav: NavItem[] = [
  {
    href: "/doctor/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/doctor/patients",
    label: "Patients",
    icon: <Users className="w-5 h-5" />,
  },
  {
    href: "/doctor/prescriptions",
    label: "Prescriptions",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    href: "/doctor/earnings",
    label: "Earnings",
    icon: <DollarSign className="w-5 h-5" />,
  },
];

export const adminSidebarNav: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/admin/doctors",
    label: "Manage Doctors",
    icon: <Stethoscope className="w-5 h-5" />,
  },
  {
    href: "/admin/patients",
    label: "Patients",
    icon: <Users className="w-5 h-5" />,
  },
  {
    href: "/admin/hospital/onboarding",
    label: "Hospital Info",
    icon: <Building className="w-5 h-5" />,
  },
  {
    href: "/admin/billing",
    label: "Billing Model",
    icon: <Briefcase className="w-5 h-5" />,
  },
];

export const superAdminSidebarNav: NavItem[] = [
  {
    href: "/superadmin/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/superadmin/hospitals",
    label: "Hospitals",
    icon: <Hospital className="w-5 h-5" />,
  },
  {
    href: "/superadmin/analytics",
    label: "Analytics",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    href: "/superadmin/logs",
    label: "Usage Logs",
    icon: <Server className="w-5 h-5" />,
  },
];
