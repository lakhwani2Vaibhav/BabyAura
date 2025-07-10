import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, Calendar, Bell, Syringe } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "../ui/badge";

type Vaccination = {
  name: string;
  date: string;
};

interface VaccinationCardProps {
  nextVaccination: Vaccination;
}

export function VaccinationCard({ nextVaccination }: VaccinationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Syringe className="h-5 w-5 text-primary" />
          Vaccination Status
        </CardTitle>
        <CardDescription>
          An overview of your child's upcoming immunizations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Card className="bg-green-500/10 border-green-500/20 p-4">
            <p className="text-sm text-green-800 font-medium">Next Vaccination</p>
            <p className="text-lg font-bold text-green-900">{nextVaccination.name}</p>
            <p className="text-sm text-green-800">{format(new Date(nextVaccination.date), "yyyy-MM-dd")}</p>
        </Card>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <Button variant="outline">
          <Bell className="mr-2 h-4 w-4" />
          Set Reminder
        </Button>
        <Button asChild>
          <Link href="/parent/vaccination">View Full Schedule</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
