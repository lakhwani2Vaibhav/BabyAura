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
import { Calendar, Clock, Video } from "lucide-react";
import { format } from "date-fns";

type Consultation = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
};

interface ConsultationCardProps {
  consultation: Consultation;
}

export function ConsultationCard({ consultation }: ConsultationCardProps) {
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={`https://placehold.co/100x100.png`} />
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
          <span>{format(new Date(consultation.date), "EEEE, MMMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{consultation.time}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Video className="mr-2 h-4 w-4" />
          Join Video Call
        </Button>
      </CardFooter>
    </Card>
  );
}
