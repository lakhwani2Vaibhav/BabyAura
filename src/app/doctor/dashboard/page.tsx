
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MetricCard } from "@/components/cards/MetricCard";
import { Users, Video, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { doctorData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const recentChats = [
  { id: 'chat1', patientName: 'Baby Williams', lastMessage: 'The rash seems to be getting a bit better, but still red.', time: '5m ago' },
  { id: 'chat2', patientName: 'Baby Smith', lastMessage: 'Just confirming our appointment for tomorrow.', time: '1h ago' },
];

type DashboardData = {
  activePatients: number;
  todaysConsultations: typeof doctorData.todaysConsultations;
};

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/doctor/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load dashboard data.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user, toast]);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80" />
        </div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
             <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your patients today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Today's Consultations"
          value={data?.todaysConsultations.length || 0}
          icon={<Video className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard
          title="Active Patients"
          value={data?.activePatients || 0}
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
             {data?.todaysConsultations.map((consultation) => (
                <Card key={consultation.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md w-16 text-center">
                       <p className="text-lg sm:text-xl font-bold">{consultation.time.split(' ')[0]}</p>
                       <p className="text-xs text-muted-foreground">{consultation.time.split(' ')[1]}</p>
                    </div>
                    <div className="flex-grow sm:hidden">
                        <p className="font-bold">{consultation.patientName}</p>
                        <p className="text-sm text-muted-foreground">{consultation.reason}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block flex-grow">
                    <p className="font-bold">{consultation.patientName}</p>
                    <p className="text-sm text-muted-foreground">{consultation.reason}</p>
                  </div>
                  <Button className="w-full sm:w-auto mt-2 sm:mt-0">
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
                    <Avatar className="h-10 w-10 border flex-shrink-0">
                        <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="baby photo" />
                        <AvatarFallback>{getInitials(chat.patientName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold truncate">{chat.patientName}</p>
                            <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">{chat.time}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                     <Button variant="ghost" size="icon" className="flex-shrink-0">
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
