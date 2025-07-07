import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PrescriptionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescriptions</CardTitle>
        <CardDescription>
          Manage and issue new prescriptions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Prescriptions page content goes here.</p>
      </CardContent>
    </Card>
  );
}
