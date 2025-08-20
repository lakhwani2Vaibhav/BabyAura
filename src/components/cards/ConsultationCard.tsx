
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, FileText, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";

type Consultation = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: "Upcoming" | "Past";
};

interface ConsultationCardProps {
  consultation: Consultation;
  isPast?: boolean;
}

export function ConsultationCard({
  consultation,
  isPast = false,
}: ConsultationCardProps) {
  const [manageOpen, setManageOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(consultation.date)
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(
    consultation.time
  );
  const { toast } = useToast();

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  const handleReschedule = () => {
    toast({
      title: "Appointment Rescheduled!",
      description: `Your appointment with ${
        consultation.doctor
      } is now on ${format(selectedDate!, "MMMM d, yyyy")} at ${selectedTime}.`,
    });
    setManageOpen(false);
  };
  
  const handleCancelAppointment = () => {
    toast({
        variant: "destructive",
        title: "Appointment Cancelled",
        description: `Your appointment with ${consultation.doctor} has been cancelled.`
    })
    setManageOpen(false);
  }

  return (
    <Dialog open={manageOpen} onOpenChange={setManageOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="doctor portrait" />
            <AvatarFallback>{getInitials(consultation.doctor)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{consultation.doctor}</CardTitle>
            <CardDescription>{consultation.specialty}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(consultation.date), "EEEE, MMMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{consultation.time}</span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {isPast ? (
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              View Summary
            </Button>
          ) : (
            <>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Manage
                </Button>
              </DialogTrigger>
              <Button className="w-full">
                <Video className="mr-2 h-4 w-4" />
                Join Call
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Appointment</DialogTitle>
          <DialogDescription>
            Reschedule or cancel your upcoming appointment with {consultation.doctor}.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] -mr-6 pr-6">
            <div className="grid md:grid-cols-2 gap-6 py-4 pr-1">
                <div className="flex justify-center">
                    <CalendarPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    className="rounded-md border"
                    />
                </div>
                <div>
                    <p className="text-sm font-medium mb-2">
                    Available Slots for {selectedDate ? format(selectedDate, "MMMM d") : '...'}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"].map((time) => (
                            <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => setSelectedTime(time)}
                            >
                            {time}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
             <Button
                className="w-full mt-4"
                onClick={handleReschedule}
                disabled={!selectedDate || !selectedTime}
                >
                Confirm New Time
            </Button>
        </ScrollArea>
        <DialogFooter className="pt-4 border-t !justify-start">
             <AlertDialog>
             <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Cancel Appointment
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently cancel your appointment with {consultation.doctor}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Go Back</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelAppointment}>Yes, Cancel</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
