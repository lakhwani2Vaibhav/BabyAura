import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EmergencyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Assistance</CardTitle>
        <CardDescription>
          Contact information and guidelines for emergencies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Emergency assistance page content goes here.</p>
      </CardContent>
    </Card>
  );
}
