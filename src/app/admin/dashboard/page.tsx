"use client";

import { adminData } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MetricCard } from "@/components/cards/MetricCard";
import {
  Stethoscope,
  Users,
  CheckCircle,
  Briefcase,
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function AdminDashboardPage() {
  const [revenueModel, setRevenueModel] = useState(adminData.revenueModel);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your hospital's operations on BabyAura.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Doctors Onboarded"
          value={adminData.metrics.doctors}
          icon={<Stethoscope className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Parents"
          value={adminData.metrics.parents}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Active Subscriptions"
          value={adminData.metrics.activeSubscriptions}
          icon={<CheckCircle className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Doctor Management</CardTitle>
            <CardDescription>
              Overview of doctors at your facility.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead className="text-right">Patients</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminData.doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{doctor.specialty}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {doctor.patients}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Business Model
            </CardTitle>
            <CardDescription>
              Adjust your hospital's revenue model.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {revenueModel === "licensing" ? "Licensing Fee" : "Revenue Share"}
              </p>
              <p className="text-sm text-muted-foreground">
                {revenueModel === "licensing"
                  ? "A fixed monthly fee for the platform."
                  : "A percentage of each consultation."}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="revenue-model" className="text-xs">Share</Label>
              <Switch
                id="revenue-model"
                checked={revenueModel === "licensing"}
                onCheckedChange={(checked) =>
                  setRevenueModel(checked ? "licensing" : "revenue-share")
                }
              />
               <Label htmlFor="revenue-model" className="text-xs">License</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
