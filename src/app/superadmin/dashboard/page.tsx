
"use client";

import { useState, useEffect } from "react";
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
  Activity,
  TrendingDown,
  Hospital,
  UserPlus,
  CheckCircle,
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
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { useRouter } from "next/navigation";


type OnboardingRequest = {
  _id: string;
  hospitalName: string;
  createdAt: string;
  status: string;
};

const Rupee = () => <span className="font-sans">₹</span>;

export default function SuperAdminDashboardPage() {
  const [requests, setRequests] = useState<OnboardingRequest[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const fetchOnboardingRequests = async () => {
    try {
      const response = await fetch('/api/superadmin/hospitals');
      if (!response.ok) throw new Error("Failed to fetch requests.");
      const allHospitals = await response.json();
      setRequests(allHospitals.filter((h: OnboardingRequest) => h.status === 'pending_verification'));
    } catch(e) {
      toast({ variant: 'destructive', title: 'Error', description: "Could not fetch onboarding requests."})
    }
  }

  useEffect(() => {
    fetchOnboardingRequests();
  }, []);

  const handleReviewRequest = (hospitalId: string) => {
    router.push(`/superadmin/hospitals/${hospitalId}`);
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
          value={`₹${superAdminData.metrics.totalMRR.toLocaleString()}`}
          icon={<Rupee />}
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
        <CardHeader>
          <CardTitle>Hospital Onboarding Requests</CardTitle>
          <CardDescription>
            New hospitals waiting for approval.
          </CardDescription>
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
              {requests.length > 0 ? (
                requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell className="font-medium">{request.hospitalName}</TableCell>
                    <TableCell>
                      {format(new Date(request.createdAt), "MMMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReviewRequest(request._id)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No pending requests.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
