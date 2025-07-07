"use client";

import { useState } from "react";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parentData } from "@/lib/data";
import { ConsultationCard } from "@/components/cards/ConsultationCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ConsultationsPage() {
  const { upcomingConsultations, pastConsultations } = parentData;
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleScheduleAppointment = () => {
    toast({
      title: "Appointment Scheduled",
      description: "Your new appointment has been successfully scheduled.",
    });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Consultations</h1>
          <p className="text-muted-foreground">
            View past and upcoming consultations. Schedule new appointments.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Fill in the details to schedule a new consultation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="doctor-name">Doctor Name</Label>
                <Input
                  id="doctor-name"
                  placeholder="e.g., Dr. Emily Carter"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-time">Date & Time</Label>
                <Input id="date-time" placeholder="e.g., Tomorrow at 10:00 AM" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Textarea
                  id="reason"
                  placeholder="e.g., Routine check-up, fever, etc."
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleScheduleAppointment}>
                Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
