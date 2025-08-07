
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, HeartHandshake, Stethoscope, Utensils, DollarSign, BarChart, Handshake, Aperture } from 'lucide-react';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { Footer } from '@/components/layout/Footer';
import { ScrollAnimationWrapper } from '@/components/layout/ScrollAnimationWrapper';
import { CostBreakdown } from '@/components/hospitals/CostBreakdown';

const specialists = [
    {
        icon: Utensils,
        title: 'Pediatric Nutritionist',
        description: "Parents receive personalized diet charts and expert guidance on lactation, feeding schedules, and introducing solids, ensuring optimal infant nutrition."
    },
    {
        icon: Brain,
        title: 'Mind Therapist',
        description: "Postpartum care is a challenging and stressful journey. We provide dedicated mental wellness support for parents, helping them navigate anxiety and stress."
    },
    {
        icon: Stethoscope,
        title: '24/7 Emergency Support',
        description: "A dedicated, always-available line for urgent medical issues, providing parents with immediate peace of mind and reducing unnecessary ER visits for your hospital."
    },
    {
        icon: HeartHandshake,
        title: 'Dedicated Nurse Concierge',
        description: "A single point of contact for all non-medical, non-emergency parenting doubts. From sleep patterns to product questions, our nurses provide trusted answers."
    }
];

const benefits = [
    {
        icon: DollarSign,
        title: 'Zero Upfront Investment',
        description: 'Launch a premium, revenue-generating service for your parents from day one without adding any fixed costs or licensing fees to your budget.'
    },
    {
        icon: BarChart,
        title: 'Increase Patient Loyalty',
        description: "Offer a continuous, supportive post-discharge experience that modern parents love, creating a stronger, lasting bond with your hospital."
    },
    {
        icon: Handshake,
        title: 'A True Care Partnership',
        description: "We invest in and manage the specialist team on your behalf. Our success is tied to yours, ensuring a mutually beneficial relationship."
    }
];


export default function BabyAura360Page() {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <MarketingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-12 pb-16 md:pb-24 bg-background">
            <div className="container px-4 md:px-6">
                 <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-90 duration-1000 ease-out">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500 dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                            BabyAura 360°
                        </h1>
                        <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">
                            A first-of-its-kind partnership that extends your trusted care with our in-house team of specialists, creating a new revenue stream for your hospital.
                        </p>
                    </div>
                </ScrollAnimationWrapper>
            </div>
        </section>
        
        {/* Benefits Section */}
        <section className="w-full py-12 md:py-24 bg-muted/40">
            <div className="container px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <ScrollAnimationWrapper key={benefit.title} animationClasses={`animate-in fade-in zoom-in-95 duration-700 ease-out delay-${100 + (index * 100)}`}>
                            <Card className="h-full text-center border p-6 bg-background shadow-lg hover:shadow-primary/10 transition-all">
                                <CardHeader className="p-0 flex flex-col items-center gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <benefit.icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 pt-4">
                                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        </ScrollAnimationWrapper>
                    ))}
                </div>
            </div>
        </section>

        {/* Specialists Section */}
        <section className="w-full py-12 md:py-24 bg-background">
            <div className="container px-4 md:px-6">
                <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Our In-House Specialist Team: An Extension of Your Care</h2>
                        <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">We handle the hiring, training, and management of a dedicated team that complements your pediatricians, reducing their workload from non-critical queries.</p>
                    </div>
                </ScrollAnimationWrapper>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                    {specialists.map((specialist, index) => (
                        <ScrollAnimationWrapper key={specialist.title} animationClasses={`animate-in fade-in zoom-in-95 duration-700 ease-out delay-${200 + (index * 100)}`}>
                           <Card className="h-full text-center border bg-muted/30 p-6 shadow-md hover:shadow-xl transition-shadow">
                                <CardHeader className="p-0 flex flex-col items-center gap-4">
                                    <div className="bg-primary/10 p-4 rounded-full">
                                        <specialist.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle>{specialist.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 pt-4">
                                    <p className="text-muted-foreground text-sm">{specialist.description}</p>
                                </CardContent>
                            </Card>
                        </ScrollAnimationWrapper>
                    ))}
                </div>
            </div>
        </section>
        
        {/* Cost Breakdown Section */}
        <section className="w-full py-12 md:py-24 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-5xl">
              <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
                <CostBreakdown />
              </ScrollAnimationWrapper>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-background">
            <div className="container px-4 md:px-6 text-center">
                 <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Ready to Transform Postnatal Care?</h2>
                    <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-xl">
                        Let's build the future of healthcare together. Schedule a free demo to see how BabyAura 360 can benefit your hospital and patients.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" asChild>
                           <a href="mailto:babyauraindia@gmail.com?subject=Demo Request">Schedule a Demo</a>
                        </Button>
                    </div>
                </ScrollAnimationWrapper>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
