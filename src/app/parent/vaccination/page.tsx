import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VaccinationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vaccination Schedule</CardTitle>
        <CardDescription>
          Keep track of all completed and upcoming vaccinations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Vaccination schedule page content goes here.</p>
      </CardContent>
    </Card>
  );
}
