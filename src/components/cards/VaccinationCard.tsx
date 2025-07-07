import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

type Vaccination = {
  name: string;
  date: string;
};

interface VaccinationCardProps {
  nextVaccination: Vaccination;
}

export function VaccinationCard({ nextVaccination }: VaccinationCardProps) {
  return (
    <Card className="bg-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Baby className="h-6 w-6" />
          Vaccination Status
        </CardTitle>
        <CardDescription>
          Next up for your little one's protection.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-lg font-semibold">{nextVaccination.name}</p>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(nextVaccination.date), "EEEE, MMMM d, yyyy")}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="p-0" asChild>
          <Link href="/parent/vaccination">View Full Schedule</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
