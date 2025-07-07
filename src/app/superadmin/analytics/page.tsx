import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Analytics</CardTitle>
        <CardDescription>
          Detailed analytics and reporting for the BabyAura platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Analytics page content goes here.</p>
      </CardContent>
    </Card>
  );
}
