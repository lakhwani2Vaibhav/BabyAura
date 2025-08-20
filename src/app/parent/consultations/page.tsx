
"use client";

import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader
} from "@/components/ui/card";
import { parentData } from "@/lib/data";
import { ConsultationCard } from "@/components/cards/ConsultationCard";
import { CareTeamMemberCard } from "@/components/cards/CareTeamMemberCard";

export default function ConsultationsPage() {
  const { upcomingConsultations } = parentData;

  const careTeam = [
      {
          id: '1',
          name: 'Dr. Emily Carter',
          type: 'Pediatrician',
          avatarUrl: 'https://placehold.co/100x100.png',
          languages: ['English', 'Hindi'],
          experience: '12 years',
          notes: 'Specializes in newborn care and developmental milestones.',
          pastAppointments: [
              { date: '2024-07-15', notes: "Routine check-up. Baby is healthy.", prescription: "Vitamin D drops" },
              { date: '2024-06-10', notes: "Discussed feeding schedule.", prescription: null },
          ]
      },
      {
          id: '2',
          name: 'Dr. Ben Adams',
          type: 'Nutritionist',
          avatarUrl: 'https://placehold.co/100x100.png',
          languages: ['English'],
          experience: '8 years',
          notes: 'Focuses on infant and maternal nutrition.',
          pastAppointments: [
              { date: '2024-07-01', notes: "Introduced solid foods plan.", prescription: null }
          ]
      }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Consultations & Care Team</h1>
        <p className="text-muted-foreground">
          Manage appointments and connect with your dedicated specialists.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Consultations</h2>
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
      </section>

      <section>
          <h2 className="text-2xl font-semibold mb-4">Your Care Team</h2>
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {careTeam.map(member => (
                  <CareTeamMemberCard key={member.id} member={member} />
              ))}
          </div>
      </section>
    </div>
  );
}
