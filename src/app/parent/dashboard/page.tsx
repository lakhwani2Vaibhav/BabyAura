
import { parentData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from 'next/link';
import { formatDistanceToNow } from "date-fns";
import { Phone, Video, Syringe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VaccinationCard } from "@/components/cards/VaccinationCard";

export default function ParentDashboardPage() {
  const nextConsultation = parentData.upcomingConsultations[0];
  const nextVaccination = parentData.vaccinationStatus.next;
  const vaccinationDue = formatDistanceToNow(new Date(nextVaccination.date), { addSuffix: true });

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-4xl font-bold font-headline text-foreground">
            Welcome, {parentData.babyName}'s Family!
          </h1>
          <p className="text-xl text-muted-foreground mt-2">Here's a quick look at what's important right now.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
           <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Video className="h-6 w-6 text-primary"/>Upcoming Consultation</CardTitle>
                <CardDescription>
                    Your next appointment is with {nextConsultation.doctor}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="font-semibold">{nextConsultation.date ? formatDistanceToNow(new Date(nextConsultation.date), { addSuffix: true }) : 'Soon'}</p>
            </CardContent>
           </Card>

            <VaccinationCard nextVaccination={nextVaccination} />
        </div>

        <Card className="bg-destructive/10 border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Phone className="h-6 w-6 text-destructive"/>Emergency Call</CardTitle>
              <CardDescription className="text-destructive/80">
                  Connect with a healthcare professional immediately.
              </CardDescription>
            </div>
             <Button asChild variant="destructive">
                <Link href="/parent/emergency">Call Now</Link>
            </Button>
          </CardHeader>
        </Card>

      </div>

      <div className="space-y-6 hidden lg:block">
        <Image
          src="https://placehold.co/600x400.png"
          data-ai-hint="doctor baby"
          alt="Doctor with a baby"
          width={600}
          height={400}
          className="rounded-xl object-cover w-full aspect-[4/3]"
        />
        <Image
          src="https://placehold.co/600x400.png"
          data-ai-hint="mother child"
          alt="Mother and child"
          width={600}
          height={400}
          className="rounded-xl object-cover w-full aspect-[4/3]"
        />
        <Image
          src="https://placehold.co/600x400.png"
          data-ai-hint="mother selfie"
          alt="Mother taking a selfie with her baby"
          width={600}
          height={400}
          className="rounded-xl object-cover w-full aspect-[4/3]"
        />
      </div>
    </div>
  );
}
