"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function SuperAdminDashboardPage() {
  const [addHospitalOpen, setAddHospitalOpen] = useState(false);
  const { toast } = useToast();

  const handleAddHospital = () => {
    toast({
      title: "Hospital Added",
      description: "The new hospital has been successfully added.",
    });
    setAddHospitalOpen(false);
  };

  const handleReviewRequest = () => {
    toast({
      title: "Review Request",
      description:
        "This would open the review flow for the hospital onboarding request.",
    });
  };

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
          <Dialog open={addHospitalOpen} onOpenChange={setAddHospitalOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add Hospital Manually
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Hospital</DialogTitle>
                <DialogDescription>
                  Enter the details for the new hospital to onboard them.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    defaultValue="New City Hospital"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plan" className="text-right">
                    Plan
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="licensing">Licensing</SelectItem>
                      <SelectItem value="revenue-share">
                        Revenue Share
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button" onClick={handleAddHospital}>
                  Add Hospital
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReviewRequest}
                    >
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
