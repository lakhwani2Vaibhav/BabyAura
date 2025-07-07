import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PatientsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patients</CardTitle>
        <CardDescription>
          View all patients associated with the hospital.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Patients page content goes here.</p>
      </CardContent>
    </Card>
  );
}
