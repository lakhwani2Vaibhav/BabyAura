import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HospitalsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Hospitals</CardTitle>
        <CardDescription>
          View and manage all partner hospitals on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Manage Hospitals page content goes here.</p>
      </CardContent>
    </Card>
  );
}
