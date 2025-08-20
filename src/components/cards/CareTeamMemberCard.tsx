
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
import { Badge } from "@/components/ui/badge";
import { Languages, Briefcase, FileText, CalendarPlus, History, MessageSquare, View } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";

type PastAppointment = {
    date: string;
    notes: string;
    prescription: string | null;
}

interface Member {
    id: string;
    name: string;
    type: string;
    avatarUrl: string;
    languages: string[];
    experience: string;
    notes: string;
    pastAppointments: PastAppointment[];
}

interface CareTeamMemberCardProps {
    member: Member;
}

export function CareTeamMemberCard({ member }: CareTeamMemberCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  const handleBookAppointment = () => {
    toast({
        title: "Functionality Coming Soon",
        description: "Booking new appointments directly from here will be enabled shortly."
    })
  }

  return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatarUrl} data-ai-hint="doctor portrait" />
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.type}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2">
             <Button variant="outline" className="w-full" asChild>
                <Link href={`/parent/${member.id}/chat`}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Start Chat
                </Link>
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                        <View className="mr-2 h-4 w-4" /> View More
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{member.name}</DialogTitle>
                        <DialogDescription>{member.type}</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] -mx-6 px-6">
                        <div className="space-y-4 pt-4">
                            <div className="text-sm space-y-2">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <span>{member.experience} of experience</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Languages className="h-4 w-4 text-muted-foreground" />
                                    <span>Speaks: {member.languages.join(', ')}</span>
                                </div>
                            </div>
                            <div className="p-3 bg-muted rounded-md text-sm">
                                <p className="font-semibold mb-1">A note from {member.name.split(' ')[0]}:</p>
                                <p className="text-muted-foreground italic">"{member.notes}"</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><History className="h-4 w-4" /> Past Appointments</h4>
                                <div className="space-y-2">
                                    {member.pastAppointments.map(appt => (
                                        <div key={appt.date} className="p-3 border rounded-md">
                                            <p className="font-semibold text-sm">{appt.date}</p>
                                            <p className="text-xs text-muted-foreground">{appt.notes}</p>
                                            {appt.prescription && <Badge className="mt-1" variant="secondary">{appt.prescription}</Badge>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                    <DialogFooter className="pt-4">
                        <Button onClick={handleBookAppointment} className="w-full">
                            <CalendarPlus className="mr-2 h-4 w-4" /> Book New Appointment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardContent>
      </Card>
  );
}
