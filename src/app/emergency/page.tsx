
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Hospital, ShieldAlert } from "lucide-react";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";

export default function EmergencyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold font-headline text-destructive sm:text-4xl">
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
                        <Button asChild size="lg" className="w-full bg-destructive hover:bg-destructive/90">
                            <a href="tel:911">
                                <Phone className="mr-2 h-5 w-5" /> Call 911
                            </a>
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
                         <Button asChild size="lg" variant="outline" className="w-full">
                            <a href="tel:123-456-7890">
                                <Phone className="mr-2 h-5 w-5" /> Call General Hospital
                            </a>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
