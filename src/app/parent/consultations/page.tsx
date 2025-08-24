
"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultationCard } from "@/components/cards/ConsultationCard";
import { CareTeamMemberCard } from "@/components/cards/CareTeamMemberCard";
import { Calendar, Users, HeartHandshake, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ScheduleAppointmentDialog } from "@/components/consultations/ScheduleAppointmentDialog";
import { Button } from "@/components/ui/button";

type Consultation = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: "Upcoming" | "Past";
};

type CareTeamMember = {
    id: string;
    name: string;
    type: string;
    avatarUrl: string;
    languages: string[];
    experience: string;
    notes: string;
    pastAppointments: { date: string; notes: string; prescription: string | null; }[];
}

type ConsultationData = {
    upcomingConsultations: Consultation[];
    careTeam: CareTeamMember[];
}


export default function ConsultationsPage() {
  const [data, setData] = useState<ConsultationData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/parent/consultations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch consultation data');
        }
        const consultationData = await response.json();
        setData(consultationData);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load your appointment data.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!data || data.careTeam.length === 0) {
    return (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
                <HeartHandshake className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">Welcome to BabyAura!</CardTitle>
            <CardDescription className="mt-2 max-w-md text-base">
                Your dedicated care team is being assembled and will be assigned to you shortly. You'll receive a notification as soon as they are ready.
            </CardDescription>
        </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Consultations & Care Team</h1>
            <p className="text-muted-foreground">
            Manage appointments and connect with your dedicated specialists.
            </p>
        </div>
        <ScheduleAppointmentDialog triggerButton={
            <Button>
                <Plus className="mr-2 h-4 w-4" /> New Appointment
            </Button>
        } />
      </div>

       <Tabs defaultValue="team" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="team">
                    <Users className="mr-2 h-4 w-4" />
                    Your Care Team
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                    <Calendar className="mr-2 h-4 w-4" />
                    Upcoming
                </TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-6">
                {data && data.upcomingConsultations.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {data.upcomingConsultations.map((consultation) => (
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
                        You're all caught up! Book a new one with your care team.
                        </CardDescription>
                    </Card>
                )}
            </TabsContent>
            <TabsContent value="team" className="mt-6">
                 {data && data.careTeam.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {data?.careTeam.map(member => (
                            <CareTeamMemberCard key={member.id} member={member} />
                        ))}
                    </div>
                 ) : (
                    <Card className="flex flex-col items-center justify-center p-12">
                        <CardTitle>No Care Team Assigned</CardTitle>
                        <CardDescription className="mt-2">
                        Your hospital has not assigned a care team to you yet.
                        </CardDescription>
                    </Card>
                 )}
            </TabsContent>
        </Tabs>
    </div>
  );
}
