
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { parentData } from "@/lib/data";
import { CheckCircle, Clock, Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";

type Vaccination = {
  id: string;
  name: string;
  age: string;
  date: string;
};

type VaccinationWithStatus = Vaccination & { status: "Upcoming" | "Taken" | "Missed" };

export default function VaccinationPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "taken" | "missed">("upcoming");
  const [open, setOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccination | null>(null);
  const { toast } = useToast();

  const handleScheduleClick = (vaccine: Vaccination) => {
    setSelectedVaccine(vaccine);
    setOpen(true);
  };
  
  const handleConfirmSchedule = () => {
    toast({
        title: "Appointment Scheduled",
        description: `Your appointment for ${selectedVaccine?.name} has been successfully scheduled.`,
    });
    setOpen(false);
  }

  // Example data for different states
  const upcomingVaccinations: VaccinationWithStatus[] = [
    { ...parentData.vaccinationStatus.next, status: "Upcoming" },
    { id: "v-next-2", name: "Rotavirus (RV)", date: "2024-09-15T00:00:00.000Z", age: "2 Months", status: "Upcoming" },
    { id: "v-next-3", name: "Diphtheria, tetanus, & acellular pertussis (DTaP)", date: "2024-09-15T00:00:00.000Z", age: "2 Months", status: "Upcoming" },
    { id: "v-next-4", name: "Haemophilus influenzae type b (Hib)", date: "2024-11-15T00:00:00.000Z", age: "4 Months", status: "Upcoming" },
  ];
  const takenVaccinations: VaccinationWithStatus[] = parentData.vaccinationStatus.history.map(v => ({...v, status: 'Taken'}));
  const missedVaccinations: VaccinationWithStatus[] = [
      { id: 'v-missed-1', name: 'Polio (IPV)', date: '2024-07-01T00:00:00.000Z', age: '1 Month', status: 'Missed'}
  ];
  
  const vaccinations = {
    upcoming: upcomingVaccinations,
    taken: takenVaccinations,
    missed: missedVaccinations,
  };

  const getStatusIcon = (status: "Upcoming" | "Taken" | "Missed") => {
    switch (status) {
      case "Upcoming":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "Taken":
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case "Missed":
        return <ShieldX className="h-5 w-5 text-red-500" />;
    }
  };

  const currentVaccinations = vaccinations[activeTab];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold font-headline">Vaccination Schedule</CardTitle>
              <CardDescription>Keep track of your baby's immunization schedule.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-1 rounded-lg bg-muted p-1 mb-6">
            {(Object.keys(vaccinations) as Array<keyof typeof vaccinations>).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                  activeTab === tab ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-background/50"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({vaccinations[tab].length})
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {currentVaccinations.map((vaccine) => (
              <Card key={vaccine.id} className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                <div className="flex items-center gap-4 flex-grow">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 flex-shrink-0">
                    {getStatusIcon(vaccine.status)}
                  </div>
                  <div>
                    <p className="font-semibold">{vaccine.name}</p>
                    <p className="text-sm text-muted-foreground">Due: {vaccine.age}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:ml-auto flex-shrink-0">
                  {vaccine.status === "Upcoming" && (
                    <>
                      <Badge variant="outline" className="border-blue-500/50 text-blue-600 bg-blue-500/10">Upcoming</Badge>
                      <Button onClick={() => handleScheduleClick(vaccine)} className="w-full sm:w-auto">Schedule Now</Button>
                    </>
                  )}
                  {vaccine.status === "Taken" && (
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">Taken</Badge>
                  )}
                  {vaccine.status === "Missed" && (
                      <Badge variant="destructive">Missed</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Vaccination</DialogTitle>
              <DialogDescription>
                Select a date for the {selectedVaccine?.name} vaccine.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
                <Calendar
                    mode="single"
                    selected={new Date()}
                    onSelect={() => {}} // In a real app, you would handle date selection state here
                    className="rounded-md border"
                />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleConfirmSchedule}>
                Confirm Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  );
}
