
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { MetricCard } from "@/components/cards/MetricCard";
import { Stethoscope, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Rupee = () => <span className="font-sans">₹</span>;

const monthlyRevenueConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const userGrowthConfig = {
  parents: {
    label: "Parents",
    color: "hsl(var(--chart-1))",
  },
  doctors: {
    label: "Doctors",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type HospitalAnalyticsData = {
  metrics: {
    doctors: number;
    parents: number;
    monthlyRevenue: number;
  };
  analytics: {
    parentGrowthRate: number;
    monthlyRevenue: { month: string; revenue: number }[];
    userGrowth: { month: string; parents: number; doctors: number }[];
  }
};

export default function AnalyticsPage() {
  const [data, setData] = useState<HospitalAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/admin/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load hospital analytics data.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [toast]);

  if (loading) {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-80 mt-2" />
            </div>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <Skeleton className="h-96" />
                <Skeleton className="h-96" />
            </div>
        </div>
    )
  }

  if (!data) {
    return <p>Could not load analytics data.</p>;
  }

  const { metrics, analytics } = data;

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Hospital Analytics</h1>
            <p className="text-muted-foreground">
                In-depth metrics for your institution.
            </p>
        </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Doctors Onboarded"
          value={metrics.doctors}
          icon={<Stethoscope className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Parents"
          value={metrics.parents}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Monthly Revenue"
          value={`₹${metrics.monthlyRevenue.toLocaleString()}`}
          icon={<Rupee />}
        />
        <MetricCard
          title="Parent Growth Rate"
          value={`${analytics.parentGrowthRate}%`}
          icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>
              Your hospital's revenue over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={monthlyRevenueConfig} className="h-72 w-full">
              <BarChart accessibilityLayer data={analytics.monthlyRevenue}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>
              Parent and Doctor sign-ups over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={userGrowthConfig} className="h-72 w-full">
              <LineChart accessibilityLayer data={analytics.userGrowth}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="parents" stroke="var(--color-parents)" />
                <Line type="monotone" dataKey="doctors" stroke="var(--color-doctors)" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
