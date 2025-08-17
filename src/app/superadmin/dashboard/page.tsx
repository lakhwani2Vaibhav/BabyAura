
"use client";

import { useState, useEffect } from "react";
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
  Users,
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
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type OnboardingRequest = {
  _id: string;
  hospitalName: string;
  createdAt: string;
};

type DashboardData = {
    metrics: {
        activeHospitals: number;
        totalUsers: number;
        totalMRR: number;
        churnRate: string;
    },
    onboardingRequests: OnboardingRequest[];
}

const Rupee = () => <span className="font-sans">₹</span>;

export default function SuperAdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('babyaura_token');
            const response = await fetch('/api/superadmin/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch dashboard data.");
            const dashboardData = await response.json();
            setData(dashboardData);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: "Could not fetch dashboard data."
            });
        } finally {
            setLoading(false);
        }
    }
    fetchDashboardData();
  }, [toast]);


  const handleReviewRequest = (hospitalId: string) => {
    router.push(`/superadmin/hospitals/${hospitalId}`);
  };

  if (loading) {
      return (
          <div className="space-y-8">
              <div>
                  <Skeleton className="h-8 w-72" />
                  <Skeleton className="h-4 w-96 mt-2" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
              </div>
               <Card>
                  <CardHeader>
                      <Skeleton className="h-6 w-64" />
                      <Skeleton className="h-4 w-80 mt-1" />
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                      </div>
                  </CardContent>
              </Card>
          </div>
      )
  }

  if (!data) {
      return <div className="text-center">Failed to load dashboard data.</div>
  }


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
          value={data.metrics.activeHospitals}
          icon={<Hospital className="h-5 w-5 text-muted-foreground" />}
        />
         <MetricCard
          title="Total Users"
          value={data.metrics.totalUsers.toLocaleString()}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Total MRR"
          value={`₹${data.metrics.totalMRR.toLocaleString()}`}
          icon={<Rupee />}
        />
        <MetricCard
          title="Churn Rate"
          value={data.metrics.churnRate}
          icon={<TrendingDown className="h-5 w-5 text-muted-foreground" />}
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
              {data.onboardingRequests.length > 0 ? (
                data.onboardingRequests.map((request) => (
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
