
import { parentData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from 'next/link';
import { formatDistanceToNow } from "date-fns";

export default function ParentDashboardPage() {
  const nextConsultation = parentData.upcomingConsultations[0];
  const nextVaccination = parentData.vaccinationStatus.next;
  const vaccinationDue = formatDistanceToNow(new Date(nextVaccination.date), { addSuffix: true });

  return (
    <div className="grid lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 flex flex-col justify-center space-y-12">
        <div>
          <h1 className="text-4xl font-bold font-headline text-foreground">
            Welcome, {parentData.babyName}
          </h1>
          <p className="text-xl text-muted-foreground mt-2">Here's a quick look at what's important right now.</p>
        </div>
        
        <div className="space-y-8">
            <div className="space-y-3">
            <h2 className="text-xl font-semibold">Upcoming Consultation</h2>
            <p className="text-muted-foreground">
                Pediatrician Consultation with {nextConsultation.doctor}
            </p>
            <Button asChild variant="secondary">
                <Link href="/parent/consultations">View Details</Link>
            </Button>
            </div>

            <div className="space-y-3">
            <h2 className="text-xl font-semibold">Vaccination Status</h2>
            <p className="text-muted-foreground">
                Next vaccination {vaccinationDue}
            </p>
            <Button asChild variant="secondary">
                <Link href="/parent/vaccination">View Schedule</Link>
            </Button>
            </div>

            <div className="space-y-3">
            <h2 className="text-xl font-semibold">Emergency Call</h2>
            <p className="text-muted-foreground">
                Connect with a healthcare professional immediately
            </p>
            <Button asChild variant="secondary">
                <Link href="/parent/emergency">Call Now</Link>
            </Button>
            </div>
        </div>
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
