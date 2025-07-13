import { parentData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';
import { format } from "date-fns";
import { Calendar, Star, BookImage, ArrowRight, Video } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VaccinationCard } from "@/components/cards/VaccinationCard";

export default function ParentDashboardPage() {
  const { babyName, upcomingConsultations, vaccinationStatus } = parentData;

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-bold font-headline">
              Welcome back, {babyName}'s Family!
            </CardTitle>
            <CardDescription>
              Here's a summary of your baby's health.
            </CardDescription>
          </div>
          <Button size="lg" className="w-full sm:w-auto mt-4 sm:mt-0" asChild>
            <Link href="/parent/consultations">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Consultation
            </Link>
          </Button>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                <Card key={consultation.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                   <div className="flex items-center gap-4 w-full">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="doctor portrait" />
                        <AvatarFallback>{getInitials(consultation.doctor)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                            <p className="font-bold">{consultation.doctor}</p>
                            <div className="flex sm:hidden items-center gap-1 text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-bold text-sm">4.8</span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{consultation.specialty}</p>
                        <p className="text-sm text-primary font-medium mt-1">
                          {format(new Date(consultation.date), "yyyy-MM-dd 'at' hh:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">4.8</span>
                    </div>
                    <Button className="w-full sm:w-auto flex-shrink-0">
                        <Video className="mr-2 h-4 w-4" />
                        Join Call
                    </Button>
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
            <CardContent className="flex flex-col items-center text-center">
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
                <Link href="/parent/scrapbook">
                  Go to Scrapbook <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
            <VaccinationCard nextVaccination={vaccinationStatus.next} />
        </div>
      </div>
    </div>
  );
}
