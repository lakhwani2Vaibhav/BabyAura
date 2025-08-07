
"use client";

import { adminData } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Phone, ShieldQuestion } from "lucide-react";
import { ContactCard } from "@/components/cards/ContactCard";

export default function ContactPage() {
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">Contact a Specialist</h1>
        <p className="text-muted-foreground mt-2">
          Your dedicated care team is here to help.
        </p>
      </div>

      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardHeader className="text-center items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <ShieldQuestion className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <CardTitle>Start with the Nurse Concierge</CardTitle>
            <CardDescription>
                For all non-emergency questions about feeding, sleep, or general baby care, your Nurse Concierge is the best first point of contact.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://placehold.co/80x80.png" data-ai-hint="nurse smiling" />
              <AvatarFallback>NC</AvatarFallback>
            </Avatar>
            <div className="text-center">
                <p className="font-bold">Nurse Concierge</p>
                <p className="text-sm text-muted-foreground">Available 9am - 7pm</p>
            </div>
            <div className="flex gap-2">
                <Button size="lg"><MessageSquare className="mr-2 h-4 w-4" /> Chat Now</Button>
                <Button size="lg" variant="outline"><Phone className="mr-2 h-4 w-4" /> Request Call</Button>
            </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold font-headline">Other Specialists</h2>
        <p className="text-muted-foreground mt-1">
          You can also reach out directly to other specialists on your care team.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ContactCard 
            name="Pediatrician on Duty"
            title="For medical concerns"
            avatar="https://placehold.co/80x80.png"
            dataAiHint="doctor portrait"
            initials="Dr"
            available
          />
          <ContactCard 
            name="Mind Therapist"
            title="For mental wellness support"
            avatar="https://placehold.co/80x80.png"
            dataAiHint="therapist portrait"
            initials="MT"
          />
          {adminData.doctors.map(doctor => (
              <ContactCard
                key={doctor.id}
                name={doctor.name}
                title={doctor.specialty}
                avatar={doctor.avatarUrl}
                dataAiHint="doctor portrait"
                initials={getInitials(doctor.name)}
                available={doctor.status === 'Active'}
              />
          ))}
      </div>
    </div>
  );
}
