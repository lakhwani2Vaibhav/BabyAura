"use client";

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
import { superAdminData } from "@/lib/data";
import { MetricCard } from "@/components/cards/MetricCard";
import { DollarSign, Hospital, Users, TrendingUp } from "lucide-react";

const monthlyRevenueConfig = {
  revenue: {
    label: "MRR",
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

export default function AnalyticsPage() {
  const { analytics } = superAdminData;
  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Hospitals"
          value={analytics.totalHospitals}
          icon={<Hospital className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Users"
          value={analytics.totalUsers.toLocaleString()}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Platform MRR"
          value={`$${analytics.platformMRR.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Growth Rate"
          value={`${analytics.growthRate}%`}
          icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Recurring Revenue</CardTitle>
            <CardDescription>
              Platform MRR over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={monthlyRevenueConfig} className="h-72 w-full">
              <BarChart accessibilityLayer data={analytics.monthlyRevenue}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
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
