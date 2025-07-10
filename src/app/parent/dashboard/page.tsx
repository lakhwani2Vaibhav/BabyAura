import { parentData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from 'next/link';
import { format } from "date-fns";
import { Calendar, Star, BookImage } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ParentDashboardPage() {
  const { babyName, upcomingConsultations } = parentData;

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline">
            Welcome back, {babyName}'s Family!
          </CardTitle>
          <CardDescription>
            Here's a summary of your baby's health.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href="/parent/consultations">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Consultation
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Consultations
          </CardTitle>
          <CardDescription>
            Your upcoming scheduled appointments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingConsultations.map((consultation) => (
            <Card key={consultation.id} className="p-4 flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://placehold.co/100x100.png`} />
                <AvatarFallback>{getInitials(consultation.doctor)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="font-bold">{consultation.doctor}</p>
                <p className="text-sm text-muted-foreground">{consultation.specialty}</p>
                <p className="text-sm text-primary font-medium mt-1">
                  {format(new Date(consultation.date), "yyyy-MM-dd 'at' hh:mm a")}
                </p>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">4.8</span>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookImage className="h-5 w-5 text-primary" />
            AI Scrapbook
          </CardTitle>
          <CardDescription>
            Create beautiful captions for your baby's memories.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
           <Image
            src="https://placehold.co/600x400.png"
            data-ai-hint="scrapbook baby"
            alt="AI Scrapbook"
            width={600}
            height={400}
            className="rounded-lg object-cover w-full aspect-video mb-4"
          />
          <p className="text-muted-foreground mb-4">
            Turn your precious moments into lasting memories with AI-generated captions.
          </p>
          <Button asChild>
            <Link href="/parent/scrapbook">Go to Scrapbook</Link>
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
