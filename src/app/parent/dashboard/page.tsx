
"use client";

import React from 'react';
import { parentData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { MessageSquare, Calendar, Utensils, Brain, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VaccinationCard } from "@/components/cards/VaccinationCard";
import { ScrollAnimationWrapper } from "@/components/layout/ScrollAnimationWrapper";
import { Separator } from '@/components/ui/separator';

const journeyItems = [
    {
        day: "Monday",
        title: "Week 24 Check-in",
        description: "Routine video call with Dr. Carter.",
        icon: Calendar,
        time: "11:00 AM"
    },
    {
        day: "Wednesday",
        title: "Diet Chart Check-in",
        description: "Review feeding schedule with your nutritionist.",
        icon: Utensils,
        time: "02:00 PM"
    },
     {
        day: "Friday",
        title: "Mind Therapist Session",
        description: "A session to support your postpartum wellness journey.",
        icon: Brain,
        time: "04:30 PM"
    },
    {
        day: "Anytime",
        title: "24/7 Emergency Line",
        description: "Immediate support for any urgent medical concerns.",
        icon: Zap,
        time: "Always available"
    }
]

export default function ParentDashboardPage() {
  const { vaccinationStatus } = parentData;

  return (
    <div className="space-y-6">
       <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out">
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle className="text-2xl font-bold font-headline">
                Welcome Back Mrs. CRO
                </CardTitle>
                <CardDescription>
                Chief Responsible Officer
                </CardDescription>
            </div>
            <Button size="lg" className="w-full sm:w-auto mt-4 sm:mt-0" asChild>
                <Link href="/parent/consultations">
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask a Doubt?
                </Link>
            </Button>
            </CardHeader>
        </Card>
      </ScrollAnimationWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-200">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    This Week's Journey
                </CardTitle>
                <CardDescription>
                    Your structured care plan for the week ahead.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {journeyItems.map((item, index) => (
                        <React.Fragment key={item.title}>
                             <div className="flex items-start gap-4 p-4 rounded-lg">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                                    <item.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                     <p className="text-sm font-semibold">{item.day}</p>
                                     <p className="text-xs text-muted-foreground">{item.time}</p>
                                </div>
                            </div>
                            {index < journeyItems.length - 1 && <Separator />}
                        </React.Fragment>
                    ))}
                </CardContent>
            </Card>
          </ScrollAnimationWrapper>
        </div>
        <div className="space-y-6">
            <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-300">
                <VaccinationCard nextVaccination={vaccinationStatus.next} />
            </ScrollAnimationWrapper>
        </div>
      </div>
    </div>
  );
}
