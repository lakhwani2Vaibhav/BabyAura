import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Hospital, ShieldAlert } from "lucide-react";

export default function EmergencyPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline text-destructive">
          Emergency Assistance
        </h1>
        <p className="text-muted-foreground mt-2">
          In case of a life-threatening emergency, please call your local
          emergency number immediately.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-destructive" />
              Immediate Medical Emergency
            </CardTitle>
            <CardDescription>
              For urgent, life-threatening situations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="w-full bg-destructive hover:bg-destructive/90">
              <Phone className="mr-2 h-5 w-5" /> Call 911
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hospital className="h-6 w-6 text-primary" />
              Contact Hospital
            </CardTitle>
            <CardDescription>
              For non-life-threatening urgent matters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" variant="outline" className="w-full">
              <Phone className="mr-2 h-5 w-5" /> Call General Hospital
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Emergency Guidelines</CardTitle>
          <CardDescription>
            What to do while waiting for help.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold">Choking</h3>
            <p className="text-muted-foreground">
              If the baby is coughing, let them continue. If they cannot
              breathe, perform back blows and chest thrusts.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">High Fever</h3>
            <p className="text-muted-foreground">
              For a fever above 100.4°F (38°C) in a newborn, contact your
              doctor immediately. Dress the baby in light clothing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
