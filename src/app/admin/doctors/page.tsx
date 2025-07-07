import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ManageDoctorsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Doctors</CardTitle>
        <CardDescription>
          Onboard, offboard, and manage doctor profiles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Manage Doctors page content goes here.</p>
      </CardContent>
    </Card>
  );
}
