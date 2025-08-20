
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
import { ChevronDown, Languages, Briefcase, FileText, CalendarPlus, History, MessageSquare } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useToast } from "@/hooks/use-toast";

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
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
        <CardContent className="space-y-4">
             <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" /> Start Chat
            </Button>
            <CollapsibleContent className="space-y-4 pt-4">
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
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button onClick={handleBookAppointment} className="w-full">
                        <CalendarPlus className="mr-2 h-4 w-4" /> Book New Appointment
                    </Button>
                </div>
            </CollapsibleContent>
        </CardContent>
        <CardFooter className="p-3 pt-0">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full text-sm">
                View {isOpen ? "Less" : "More"}
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </CardFooter>
      </Card>
    </Collapsible>
  );
}
