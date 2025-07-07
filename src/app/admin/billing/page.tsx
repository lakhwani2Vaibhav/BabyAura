import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BillingPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Model</CardTitle>
        <CardDescription>
          Manage your hospital's billing and subscription model.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Billing Model page content goes here.</p>
      </CardContent>
    </Card>
  );
}
