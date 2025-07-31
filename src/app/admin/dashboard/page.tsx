
"use client";

import { adminData } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { MetricCard } from "@/components/cards/MetricCard";
import {
  Stethoscope,
  Users,
  DollarSign,
  CheckCircle,
  Activity,
  UserCheck,
  Star
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminDashboardPage() {
  const router = useRouter();
  
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your hospital's operations on BabyAura.
          </p>
        </div>
        <Button asChild>
            <Link href="/admin/analytics">
                <Activity className="mr-2 h-4 w-4" />
                View Analytics
            </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card onClick={() => router.push('/admin/doctors')} className="cursor-pointer hover:bg-muted/50 transition-colors">
            <MetricCard
            title="Doctors Onboarded"
            value={adminData.metrics.doctors}
            icon={<Stethoscope className="h-5 w-5 text-muted-foreground" />}
            />
        </Card>
        <Card onClick={() => router.push('/admin/parents')} className="cursor-pointer hover:bg-muted/50 transition-colors">
            <MetricCard
            title="Total Parents"
            value={adminData.metrics.parents}
            icon={<Users className="h-5 w-5 text-muted-foreground" />}
            description="-2.5% from last month"
            />
        </Card>
         <Card onClick={() => router.push('/admin/billing')} className="cursor-pointer hover:bg-muted/50 transition-colors">
            <MetricCard
            title="Active Subscriptions"
            value={adminData.metrics.activeSubscriptions}
            icon={<CheckCircle className="h-5 w-5 text-muted-foreground" />}
            />
        </Card>
        <Card onClick={() => router.push('/admin/analytics')} className="cursor-pointer hover:bg-muted/50 transition-colors">
            <MetricCard
            title="Monthly Revenue"
            value={`$${adminData.metrics.monthlyRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
            />
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Activity Snapshot</CardTitle>
          <CardDescription>
            Overview of doctor performance and workload.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {adminData.doctors.map((doctor) => (
            <Card key={doctor.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
                <div className="flex items-center gap-4 w-full sm:w-1/3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={doctor.avatarUrl} />
                        <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <p className="font-bold">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-grow w-full sm:w-2/3">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">{doctor.patients}</p>
                            <p className="text-xs text-muted-foreground">Parents</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">{doctor.consultationsThisMonth}</p>
                            <p className="text-xs text-muted-foreground">Consults (30d)</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">{doctor.satisfaction}</p>
                            <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                    </div>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full sm:w-auto flex-shrink-0">
                    <Link href={`/admin/doctors`}>View Profile</Link>
                </Button>
            </Card>
            ))}
        </CardContent>
         <CardFooter>
            <Button variant="ghost" asChild className="w-full">
                <Link href="/admin/doctors">Manage All Doctors</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
