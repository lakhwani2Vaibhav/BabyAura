import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConsultationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultations</CardTitle>
        <CardDescription>
          View past and upcoming consultations. Schedule new appointments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Consultations page content goes here.</p>
      </CardContent>
    </Card>
  );
}
