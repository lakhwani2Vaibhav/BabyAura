'use client';

import { parentData } from "@/lib/data";
import { doctorData } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft, BarChart2, Syringe, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function PatientProfilePage({
  params,
}: {
  params: { patientId: string };
}) {
  const { patientId } = params;
  const patient = doctorData.patients.find((p) => p.id === patientId);
  const babyData = parentData; // Using parentData as a template for a single baby's detailed info

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Patient not found</h1>
        <Button asChild className="mt-6">
          <Link href="/doctor/patients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients List
          </Link>
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  const chartConfig = {
    weight: {
      label: "Weight (kg)",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/doctor/patients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={`https://placehold.co/100x100.png`}
            data-ai-hint="baby photo"
          />
          <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold font-headline">{patient.name}</h1>
          <p className="text-muted-foreground">Patient ID: {patient.id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Patient Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <strong>Status:</strong>
              <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                {patient.status}
              </Badge>
            </div>
            <p>
              <strong>Last Visit:</strong>{" "}
              {format(new Date(patient.lastVisit), "MMMM d, yyyy")}
            </p>
            <p>
              <strong>Baby's DOB:</strong> December 5, 2023
            </p>
            <p>
              <strong>Parent's Name:</strong> Parent's Name
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Syringe className="w-5 h-5" /> Vaccination Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Next Vaccination:</strong>{" "}
              {babyData.vaccinationStatus.next.name}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {format(
                new Date(babyData.vaccinationStatus.next.date),
                "MMMM d, yyyy"
              )}
            </p>
            <Button variant="link" asChild className="p-0">
              <Link href={`/doctor/patients/${patientId}/vaccination`}>View Full Schedule</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5" /> Growth Chart (Weight)
          </CardTitle>
          <CardDescription>Weight progress over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <LineChart
              accessibilityLayer
              data={babyData.growthData.weight}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickFormatter={(value) => `${value} kg`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                dataKey="weight"
                type="monotone"
                stroke="var(--color-weight)"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" /> Health Reports
          </CardTitle>
          <CardDescription>
            Recent consultation summaries and reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {babyData.healthReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.doctor}</TableCell>
                  <TableCell>{report.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
