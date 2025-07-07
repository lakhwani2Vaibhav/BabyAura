import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CarePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Care Resources</CardTitle>
        <CardDescription>
          Find articles and resources for baby care.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Care resources page content goes here.</p>
      </CardContent>
    </Card>
  );
}
