import { doctorData } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users } from "lucide-react";
import { MetricCard } from "@/components/cards/MetricCard";

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Doctor's Dashboard</h1>
        <p className="text-muted-foreground">
          Here's your schedule and earnings summary for today.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Today's Revenue"
          value={`$${doctorData.revenue.today}`}
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Weekly Revenue"
          value={`$${doctorData.revenue.thisWeek}`}
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
        />
         <MetricCard
          title="Today's Consultations"
          value={doctorData.todaysConsultations.length}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>
            A list of your consultations for today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Reason for Visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctorData.todaysConsultations.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell className="font-medium">
                    {consultation.time}
                  </TableCell>
                  <TableCell>{consultation.patientName}</TableCell>
                  <TableCell>{consultation.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
