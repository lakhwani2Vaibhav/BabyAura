
"use client";

import { useState, cloneElement, ReactElement, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ArrowLeft,
  Calendar as CalendarIcon,
  MessageSquare,
  Video,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminData } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";

type Doctor = (typeof adminData.doctors)[0];
type Step = "select_doctor" | "select_time" | "confirm";

const availableTimeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
];

interface ScheduleAppointmentDialogProps {
  triggerButton?: ReactElement;
  initialDoctor?: Doctor;
}

export function ScheduleAppointmentDialog({ triggerButton, initialDoctor }: ScheduleAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("select_doctor");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(initialDoctor || null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (initialDoctor && open) {
        setSelectedDoctor(initialDoctor);
        setStep("select_time");
    } else if (!open) {
        // Reset state when dialog is closed
        setTimeout(() => {
            setStep("select_doctor");
            setSelectedDoctor(null);
            setSelectedDate(new Date());
            setSelectedTime(null);
        }, 300);
    }
  }, [initialDoctor, open]);


  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep("select_time");
  };

  const handleConfirmSchedule = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Missing appointment details.' });
        return;
    }
    
    try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/parent/consultations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                parentId: user.userId,
                doctorId: selectedDoctor.id,
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: selectedTime,
            })
        });
        if(!response.ok) throw new Error("Failed to book appointment.");

         toast({
          title: "Appointment Scheduled!",
          description: `Your appointment with ${
            selectedDoctor?.name
          } on ${format(selectedDate!, "MMMM d, yyyy")} at ${selectedTime} is confirmed.`,
        });
        resetState();
    } catch(err) {
        toast({ variant: 'destructive', title: 'Booking Failed', description: 'Could not schedule your appointment. Please try again.' });
    }

  };

  const resetState = () => {
    setOpen(false);
  };

  const handleBack = () => {
    if (step === "select_time") {
      // If there was an initial doctor, closing the dialog is more intuitive than going back
      if(initialDoctor) {
        setOpen(false);
      } else {
        setStep("select_doctor");
      }
    } else if (step === "confirm") {
      setStep("select_time");
    }
  };

  const handleChatClick = () => {
    toast({
        title: "Coming Soon!",
        description: "Live chat with doctors will be available in a future update.",
    })
  }
  
  const DialogTriggerButton = triggerButton ? (
    cloneElement(triggerButton, { onClick: () => setOpen(true) })
  ) : (
    <Button onClick={() => setOpen(true)}>
      <Plus className="mr-2 h-4 w-4" />
      New Appointment
    </Button>
  );

  const renderStepContent = () => {
    switch (step) {
      case "select_doctor":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Choose an available doctor to schedule a consultation.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] md:max-h-none -mr-6 pr-6">
              <div className="py-4 space-y-4">
                {adminData.doctors
                  .filter((d) => d.status === "Active")
                  .map((doctor) => (
                    <div
                      key={doctor.id}
                      className="flex items-center gap-4 rounded-lg border p-4"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={doctor.avatarUrl} />
                        <AvatarFallback>
                          {getInitials(doctor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <p className="font-semibold">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialty}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                         <Button variant="outline" size="sm" onClick={handleChatClick}>
                           <MessageSquare className="h-4 w-4 mr-2" /> Chat
                         </Button>
                         <Button
                          size="sm"
                          onClick={() => handleSelectDoctor(doctor)}
                        >
                          <Video className="h-4 w-4 mr-2" /> Schedule
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </>
        );

      case "select_time":
        return (
          <>
            <DialogHeader>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-4"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-center">Select Date & Time</DialogTitle>
              <DialogDescription className="text-center">
                With <span className="font-semibold text-primary">{selectedDoctor?.name}</span>
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] md:max-h-none -mr-6 pr-6">
                <div className="grid md:grid-cols-2 gap-6 py-4">
                <div className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        className="rounded-md border"
                    />
                </div>
                <div>
                    <p className="text-sm font-medium mb-2">Available Slots for {selectedDate ? format(selectedDate, "MMMM d") : '...'} </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableTimeSlots.map((time) => (
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
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button
                className="w-full"
                disabled={!selectedTime || !selectedDate}
                onClick={() => setStep("confirm")}
              >
                Continue
              </Button>
            </DialogFooter>
          </>
        );
        
      case "confirm":
        return (
            <>
                <DialogHeader>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-4"
                        onClick={handleBack}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <DialogTitle className="text-center">Confirm Appointment</DialogTitle>
                    <DialogDescription className="text-center">
                        Please review the details below before confirming.
                    </DialogDescription>
                </DialogHeader>
                 <ScrollArea className="max-h-[60vh] md:max-h-none -mr-6 pr-6">
                    <div className="py-4 space-y-4">
                        <div className="flex items-center gap-4 rounded-lg border p-4">
                            <Avatar className="h-12 w-12">
                            <AvatarImage src={selectedDoctor?.avatarUrl} />
                            <AvatarFallback>
                                {getInitials(selectedDoctor?.name || "")}
                            </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold">{selectedDoctor?.name}</p>
                                <p className="text-sm text-muted-foreground">{selectedDoctor?.specialty}</p>
                            </div>
                        </div>
                        <div className="space-y-2 rounded-lg border p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="font-semibold">{format(selectedDate!, "EEEE, MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Time:</span>
                                <span className="font-semibold">{selectedTime}</span>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                 <DialogFooter className="pt-4">
                    <Button onClick={() => setOpen(false)} variant="ghost">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSchedule}>Confirm & Schedule</Button>
                </DialogFooter>
            </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {DialogTriggerButton}
      </DialogTrigger>
      <DialogContent className="max-w-md md:max-w-2xl" onInteractOutside={(e) => {
          if(!open) return;
          e.preventDefault();
        }} onEscapeKeyDown={resetState}>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
