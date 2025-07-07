import { superAdminData } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MetricCard } from "@/components/cards/MetricCard";
import {
  DollarSign,
  Activity,
  TrendingDown,
  Hospital,
  UserPlus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Superadmin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Platform-wide overview and management tools.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Hospitals"
          value={superAdminData.metrics.activeHospitals}
          icon={<Hospital className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Total MRR"
          value={`$${superAdminData.metrics.totalMRR.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Churn Rate"
          value={superAdminData.metrics.churnRate}
          icon={<TrendingDown className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Daily Active Users"
          value={superAdminData.metrics.userActivity.toLocaleString()}
          icon={<Activity className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hospital Onboarding Requests</CardTitle>
            <CardDescription>
              New hospitals waiting for approval.
            </CardDescription>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add Hospital Manually
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital Name</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {superAdminData.onboardingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>
                    {format(new Date(request.date), "MMMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
