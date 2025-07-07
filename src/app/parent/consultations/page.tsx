import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parentData } from "@/lib/data";
import { ConsultationCard } from "@/components/cards/ConsultationCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ConsultationsPage() {
  const { upcomingConsultations, pastConsultations } = parentData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Consultations</h1>
          <p className="text-muted-foreground">
            View past and upcoming consultations. Schedule new appointments.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {upcomingConsultations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingConsultations.map((consultation) => (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                />
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-12">
              <CardTitle>No Upcoming Consultations</CardTitle>
              <CardDescription className="mt-2">
                You're all caught up!
              </CardDescription>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          {pastConsultations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastConsultations.map((consultation) => (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  isPast
                />
              ))}
            </div>
          ) : (
            <p>No past consultations.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
