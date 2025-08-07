
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { MessageSquare, Calendar, Utensils, Brain, Zap, CheckCircle2, ListChecks } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { VaccinationCard } from "@/components/cards/VaccinationCard";
import { ScrollAnimationWrapper } from "@/components/layout/ScrollAnimationWrapper";
import { parentData } from '@/lib/data';
import { JourneyTimeline } from '@/components/timeline/JourneyTimeline';
import { Progress } from '@/components/ui/progress';

const initialJourneyItems = [
    {
        day: "Monday",
        title: "Week 24 Check-in",
        description: "Routine video call with Dr. Carter.",
        icon: Calendar,
        time: "11:00 AM",
        completed: true,
        action: 'join' as const,
    },
    {
        day: "Wednesday",
        title: "Diet Chart Check-in",
        description: "Review feeding schedule with your nutritionist.",
        icon: Utensils,
        time: "02:00 PM",
        completed: false,
        action: 'action' as const,
    },
     {
        day: "Friday",
        title: "Mind Therapist Session",
        description: "A session to support your postpartum wellness journey.",
        icon: Brain,
        time: "04:30 PM",
        completed: false,
        action: 'action' as const,
    },
    {
        day: "Anytime",
        title: "24/7 Emergency Line",
        description: "Immediate support for any urgent medical concerns.",
        icon: Zap,
        time: "Always available",
        completed: false,
        action: 'none' as const,
    }
];

export type JourneyItemData = (typeof initialJourneyItems)[0];


export default function ParentDashboardPage() {
  const { vaccinationStatus } = parentData;
  const [journeyItems, setJourneyItems] = useState(initialJourneyItems);

  const handleToggleItem = (title: string) => {
    setJourneyItems(items => 
        items.map(item => 
            item.title === title ? { ...item, completed: !item.completed } : item
        )
    );
  };
  
  const completedCount = journeyItems.filter(item => item.completed).length;
  const totalCount = journeyItems.filter(item => item.action !== 'none').length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
                <Link href="/parent/contact">
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
                        Your structured care plan for the week ahead. You're doing great!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Weekly Progress
                            </p>
                             <p className="text-sm font-semibold">{completedCount} / {totalCount} done</p>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>
                    <JourneyTimeline items={journeyItems} onToggle={handleToggleItem} />
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/parent/timeline">
                      <ListChecks className="mr-2 h-4 w-4" />
                      Go to your AI-Powered Command Center
                    </Link>
                  </Button>
                </CardFooter>
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
