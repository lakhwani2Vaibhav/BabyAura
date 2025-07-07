import { parentData } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConsultationCard } from "@/components/cards/ConsultationCard";
import { VaccinationCard } from "@/components/cards/VaccinationCard";
import { Button } from "@/components/ui/button";
import { Phone, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ParentDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Welcome, {parentData.babyName}'s Family!
        </h1>
        <p className="text-muted-foreground">
          Here's a summary of your baby's health and upcoming events.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <VaccinationCard nextVaccination={parentData.vaccinationStatus.next} />
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Emergency Assistance</CardTitle>
            <CardDescription>
              Quick access in case of an emergency.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            <Button size="lg" variant="destructive" className="w-full h-24 text-lg">
              <Phone className="mr-4 h-8 w-8" />
              Call Emergency
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold font-headline">
            Upcoming Consultations
          </h2>
          <Button variant="outline" asChild>
            <Link href="/parent/consultations">
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule New
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {parentData.upcomingConsultations.map((consultation) => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
