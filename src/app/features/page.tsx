
"use client";

import { Footer } from '@/components/layout/Footer';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Baby,
  Stethoscope,
  Building,
  Heart,
  BookImage,
  BarChart2,
  Users,
  Video,
  FileText,
  DollarSign,
  LayoutDashboard,
  LucideIcon,
  Info,
} from 'lucide-react';
import React from 'react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string;
}

const featuresData: { [key: string]: Feature[] } = {
  parent: [
    {
      icon: Video,
      title: "Tele-Consultations",
      description: "Connect with doctors via video call.",
      details: "Schedule and join secure video consultations with pediatricians and specialists from the comfort of your home."
    },
    {
      icon: BookImage,
      title: "AI Scrapbook",
      description: "Capture and cherish every moment.",
      details: "Upload photos and videos of your baby's milestones, and let our AI generate heartfelt captions to create a beautiful digital scrapbook."
    },
    {
      icon: BarChart2,
      title: "Growth Tracking",
      description: "Monitor your baby's development.",
      details: "Track important growth metrics like weight and height with interactive charts to ensure your baby is on the right track."
    },
    {
      icon: Users,
      title: "Community Forum",
      description: "Connect with other parents.",
      details: "Join a supportive community to share experiences, ask questions, and get advice from fellow parents on a similar journey."
    },
  ],
  doctor: [
    {
      icon: LayoutDashboard,
      title: "Doctor Dashboard",
      description: "Manage your schedule and patients.",
      details: "An intuitive dashboard to view your daily schedule, manage appointments, and get a quick overview of your patient list."
    },
    {
      icon: Users,
      title: "Patient Management",
      description: "Access patient profiles and records.",
      details: "View detailed patient profiles, including health history, growth charts, and previous consultation notes, all in one place."
    },
    {
      icon: FileText,
      title: "Digital Prescriptions",
      description: "Issue and manage e-prescriptions.",
      details: "Create, renew, and manage digital prescriptions for your patients securely and efficiently, reducing paperwork."
    },
    {
      icon: DollarSign,
      title: "Earnings & Payouts",
      description: "Track your consultation revenue.",
      details: "Monitor your earnings from consultations with detailed reports and manage your payout history seamlessly."
    },
  ],
  hospital: [
    {
      icon: Building,
      title: "Hospital Onboarding",
      description: "Set up your hospital's profile.",
      details: "Easily onboard your facility, add your hospital's information, and list the specialties you offer to patients."
    },
    {
      icon: Stethoscope,
      title: "Doctor Management",
      description: "Onboard and manage your doctors.",
      details: "A centralized system to add new doctors to the platform, manage their profiles, schedules, and monitor their patient load."
    },
    {
      icon: LayoutDashboard,
      title: "Admin Dashboard",
      description: "Oversee hospital-wide operations.",
      details: "Get a comprehensive view of key metrics for your hospital, including doctor activity, patient numbers, and subscription data."
    },
    {
      icon: DollarSign,
      title: "Flexible Business Models",
      description: "Choose your revenue model.",
      details: "Select between a fixed licensing fee or a collaborative revenue-sharing model that aligns with your hospital's financial strategy."
    },
  ]
};

const tabIcons: { [key: string]: LucideIcon } = {
  parent: Baby,
  doctor: Stethoscope,
  hospital: Building,
};


export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-1 py-12 md:py-24 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Features Tailored For You
            </h1>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
              BabyAura is a comprehensive ecosystem designed to support everyone involved in a child's early-stage healthcare journey.
            </p>
          </div>

          <Tabs defaultValue="parent" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="parent" className="py-3 text-base gap-2">
                <Baby className="h-5 w-5" /> For Parents
              </TabsTrigger>
              <TabsTrigger value="doctor" className="py-3 text-base gap-2">
                <Stethoscope className="h-5 w-5" /> For Doctors
              </TabsTrigger>
              <TabsTrigger value="hospital" className="py-3 text-base gap-2">
                <Building className="h-5 w-5" /> For Hospitals
              </TabsTrigger>
            </TabsList>
            
            <TooltipProvider>
              <TabsContent value="parent">
                <FeatureGrid features={featuresData.parent} />
              </TabsContent>
              <TabsContent value="doctor">
                <FeatureGrid features={featuresData.doctor} />
              </TabsContent>
              <TabsContent value="hospital">
                <FeatureGrid features={featuresData.hospital} />
              </TabsContent>
            </TooltipProvider>

          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const FeatureGrid = ({ features }: { features: Feature[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
    {features.map((feature) => (
      <Card key={feature.title}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </div>
             <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                    <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{feature.details}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{feature.description}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);
