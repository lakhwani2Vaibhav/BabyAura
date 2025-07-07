import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Reports</CardTitle>
        <CardDescription>
          Access and download your baby's health reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Health reports page content goes here.</p>
      </CardContent>
    </Card>
  );
}
