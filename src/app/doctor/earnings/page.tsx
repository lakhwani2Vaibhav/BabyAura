import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EarningsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings</CardTitle>
        <CardDescription>
          View your earnings summary and history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Earnings page content goes here.</p>
      </CardContent>
    </Card>
  );
}
