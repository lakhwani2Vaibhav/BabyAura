
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
import { adminData } from "@/lib/data";
import { MetricCard } from "@/components/cards/MetricCard";
import { Stethoscope, Users, TrendingUp } from "lucide-react";

// Using a custom Rupee icon component might be better if you have one
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

export default function AnalyticsPage() {
  const { analytics, metrics } = adminData;
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
