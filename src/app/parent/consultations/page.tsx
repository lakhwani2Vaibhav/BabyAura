
"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultationCard } from "@/components/cards/ConsultationCard";
import { CareTeamMemberCard } from "@/components/cards/CareTeamMemberCard";
import { Calendar, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Consultations & Care Team</h1>
        <p className="text-muted-foreground">
          Manage appointments and connect with your dedicated specialists.
        </p>
      </div>

       <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">
                    <Calendar className="mr-2 h-4 w-4" />
                    Upcoming
                </TabsTrigger>
                <TabsTrigger value="team">
                    <Users className="mr-2 h-4 w-4" />
                    Your Care Team
                </TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-6">
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                    </div>
                ) : data && data.upcomingConsultations.length > 0 ? (
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
                        You're all caught up!
                        </CardDescription>
                    </Card>
                )}
            </TabsContent>
            <TabsContent value="team" className="mt-6">
                 {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                    </div>
                 ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {data?.careTeam.map(member => (
                            <CareTeamMemberCard key={member.id} member={member} />
                        ))}
                    </div>
                 )}
            </TabsContent>
        </Tabs>
    </div>
  );
}
