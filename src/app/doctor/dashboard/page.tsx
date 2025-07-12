import { doctorData } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/cards/MetricCard";
import { Users, Video, MessageSquare } from "lucide-react";
import { format } from "date-fns";

const recentChats = [
    { id: 'chat1', patientName: 'Baby Williams', lastMessage: 'The rash seems to be getting a bit better, but still red.', time: '5m ago' },
    { id: 'chat2', patientName: 'Baby Smith', lastMessage: 'Just confirming our appointment for tomorrow.', time: '1h ago' },
];

export default function DoctorDashboardPage() {
   const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Doctor's Dashboard</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your patients today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Today's Consultations"
          value={doctorData.todaysConsultations.length}
          icon={<Video className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Active Patients"
          value={doctorData.patients.filter(p => p.status === 'Active').length}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Consultations</CardTitle>
            <CardDescription>
              Your scheduled appointments for the rest of today.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {doctorData.todaysConsultations.map((consultation) => (
                <Card key={consultation.id} className="p-4 flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md w-20">
                     <p className="text-xl font-bold">{consultation.time.split(' ')[0]}</p>
                     <p className="text-xs text-muted-foreground">{consultation.time.split(' ')[1]}</p>
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold">{consultation.patientName}</p>
                    <p className="text-sm text-muted-foreground">{consultation.reason}</p>
                  </div>
                  <Button>
                    <Video className="mr-2 h-4 w-4" />
                    Join Call
                  </Button>
                </Card>
              ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Patient Chats</CardTitle>
             <CardDescription>
              Messages from your patients.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentChats.map((chat) => (
                 <div key={chat.id} className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="baby photo" />
                        <AvatarFallback>{getInitials(chat.patientName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold">{chat.patientName}</p>
                            <p className="text-xs text-muted-foreground">{chat.time}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                     <Button variant="ghost" size="icon">
                        <MessageSquare className="h-5 w-5" />
                    </Button>
                 </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
