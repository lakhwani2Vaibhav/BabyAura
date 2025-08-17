
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { AnimatedContent } from '@/components/layout/AnimatedContent';
import { ScrollAnimationWrapper } from '@/components/layout/ScrollAnimationWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Zap, Handshake, Mail, Rocket, Video, CheckCircle, Brain, Utensils, Stethoscope } from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { HowItWorksSteps } from '@/components/hospitals/HowItWorksSteps';
import { PartnershipForm } from '@/components/hospitals/PartnershipForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ScheduleDemoForm } from '@/components/hospitals/ScheduleDemoForm';


const Rupee = () => <span className="font-sans h-8 w-8 text-primary flex items-center justify-center text-3xl font-bold">₹</span>;

export default function HospitalsPage() {
  const [partnershipFormOpen, setPartnershipFormOpen] = useState(false);
  const [demoFormOpen, setDemoFormOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <MarketingHeader />
      <main className="flex-1">
        <AnimatedContent>
          {/* Hero Section */}
          <section id="hospitals-hero" className="w-full py-16 md:py-24 lg:py-32 landing-page-gradient-bg">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-left-8 duration-1000 ease-out">
                  <div className="flex flex-col justify-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                      Become a Leader in Digital Postnatal Care
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Elevate your patient experience, empower your doctors, and unlock new revenue streams with BabyAura’s all-in-one digital care platform.
                    </p>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      <Button size="lg" asChild>
                        <a href="#partner-form">Become a Partner</a>
                      </Button>
                      <Dialog open={demoFormOpen} onOpenChange={setDemoFormOpen}>
                        <DialogTrigger asChild>
                           <Button size="lg" variant="outline">Schedule a Demo</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                           <DialogHeader className="text-center items-center">
                                <Video className="mx-auto h-10 w-10 text-primary mb-2" />
                                <DialogTitle className="text-2xl font-bold font-headline">Schedule a Demo</DialogTitle>
                                <DialogDescription className="text-base text-muted-foreground">See how BabyAura can transform your hospital.</DialogDescription>
                            </DialogHeader>
                            <div className="px-6 py-2">
                                <ScheduleDemoForm onFormSubmit={() => setDemoFormOpen(false)} />
                            </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200">
                  <Image
                    src="/doct.png"
                    data-ai-hint="doctor tablet patient"
                    width="600"
                    height="450"
                    alt="Doctor showing patient a tablet"
                    className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover shadow-2xl"
                  />
                </ScrollAnimationWrapper>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section id="benefits" className="w-full py-12 md:py-24 bg-background">
            <div className="container px-4 md:px-6">
              <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <div className="text-center space-y-4 mb-12">
                    <Badge variant="outline" className="text-primary border-primary/50 py-1 px-3">Our Value Proposition</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">A Partnership for the Future of Healthcare</h2>
                    <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">Go beyond traditional care. Offer a premium, continuous-care experience that parents love and doctors prefer.</p>
                </div>
              </ScrollAnimationWrapper>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <BenefitCard
                  icon={<Rupee />}
                  title="Create Recurring Revenue"
                  description="Introduce a new, predictable revenue stream with our subscription model. Start with no upfront cost and grow with our flexible partnership options."
                />
                <BenefitCard
                  icon={<Heart className="h-8 w-8 text-primary" />}
                  title="Enhance Quality of Care"
                  description="Improve patient outcomes with continuous monitoring, proactive communication, and a secure digital health record from hospital to home."
                />
                <BenefitCard
                  icon={<Zap className="h-8 w-8 text-primary" />}
                  title="Become a Tech-Forward Hospital"
                  description="Differentiate your hospital by offering a state-of-the-art digital experience that modern parents expect. Boost your brand and patient loyalty."
                />
              </div>
            </div>
          </section>

          {/* BabyAura 360 Section */}
          <section id="babyaura-360" className="w-full py-12 md:py-24 bg-muted/40">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
                  <Image
                    src="https://placehold.co/600x450.png"
                    data-ai-hint="team doctors collaborating"
                    width="600"
                    height="450"
                    alt="BabyAura 360"
                    className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover shadow-lg"
                  />
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-right-8 duration-1000 ease-out">
                  <div className="space-y-4">
                    <Badge variant="secondary" className="py-1 px-3 text-base">BabyAura 360°</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">The All-Inclusive Care Partnership</h2>
                    <p className="text-muted-foreground md:text-lg">
                      Our premium revenue-share model where we become a true extension of your team. BabyAura provides an in-house team of specialists—nutritionists, therapists, and more—to deliver comprehensive, wrap-around care under your hospital's trusted brand.
                    </p>
                    <ul className="space-y-3 pt-2">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span><strong>Dedicated Specialist Team:</strong> We provide and manage nutritionists, mind therapists, and a nurse concierge service.</span>
                      </li>
                       <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span><strong>Zero Upfront Cost:</strong> A pure revenue-share model means we only succeed when you succeed.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span><strong>Enhanced Patient Experience:</strong> Offer a complete, holistic care journey that significantly boosts patient satisfaction and loyalty.</span>
                      </li>
                    </ul>
                  </div>
                </ScrollAnimationWrapper>
              </div>
            </div>
          </section>
          
          {/* How It Works Section */}
          <section id="how-it-works" className="w-full py-12 md:py-24 bg-background">
            <div className="container px-4 md:px-6">
                 <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Seamless Integration in 3 Simple Steps</h2>
                    </div>
                </ScrollAnimationWrapper>
                <HowItWorksSteps />
            </div>
          </section>
          
          {/* Partnership Models CTA */}
          <section id="partnership-models" className="w-full py-12 md:py-24 bg-primary/5">
            <div className="container px-4 md:px-6">
              <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
                <Dialog open={partnershipFormOpen} onOpenChange={setPartnershipFormOpen}>
                  <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">Explore Our All-Inclusive Partnership Models</h2>
                    <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-xl">
                      From fixed licensing fees to our premium BabyAura 360° revenue-share model, we have a partnership that fits your hospital's needs.
                    </p>
                    <div className="mt-8">
                       <DialogTrigger asChild>
                          <Button size="lg">
                            Talk to our Partnership Team
                          </Button>
                        </DialogTrigger>
                    </div>
                  </div>
                  <DialogContent className="sm:max-w-2xl">
                     <DialogHeader className="text-center items-center">
                        <Handshake className="mx-auto h-12 w-12 text-primary mb-2" />
                        <DialogTitle className="text-2xl font-bold font-headline">Start Your Partnership Journey</DialogTitle>
                        <DialogDescription className="text-lg text-muted-foreground">Fill out the form below and our team will be in touch shortly.</DialogDescription>
                    </DialogHeader>
                    <div className="px-6 py-2 max-h-[70vh] overflow-y-auto">
                        <PartnershipForm onFormSubmit={() => setPartnershipFormOpen(false)} />
                    </div>
                  </DialogContent>
                </Dialog>
              </ScrollAnimationWrapper>
            </div>
          </section>

          {/* Upcoming Partnership Section */}
          <section id="partnership-announcement" className="w-full py-12 md:py-24 bg-background">
            <div className="container px-4 md:px-6">
              <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
                <div className="max-w-3xl mx-auto bg-muted/50 rounded-xl p-8 md:p-12 text-center">
                  <Badge variant="secondary" className="mb-4">Coming Soon</Badge>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                    A New Era of Care is on the Horizon
                  </h2>
                  <p className="mt-4 text-muted-foreground md:text-xl">
                    BabyAura is proud to announce our upcoming partnership with <span className="font-semibold text-primary">DR DUDE</span>, a network of over 1500 Tier 2/3 hospitals across India.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    This collaboration will bring our digital care ecosystem to thousands of new families, revolutionizing post-discharge care nationwide.
                  </p>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </section>

          {/* Partnership Form Section */}
          <section id="partner-form" className="w-full py-12 md:py-24 bg-muted/40">
             <div className="container px-4 md:px-6">
               <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
                    <div className="max-w-3xl mx-auto">
                        <Card className="shadow-2xl">
                            <CardHeader className="text-center p-8 bg-background rounded-t-lg">
                                <Handshake className="mx-auto h-12 w-12 text-primary mb-4" />
                                <CardTitle className="text-3xl font-bold font-headline">Start Your Partnership Journey</CardTitle>
                                <CardDescription className="text-lg text-muted-foreground">Fill out the form below and our team will be in touch shortly.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <PartnershipForm />
                            </CardContent>
                        </Card>
                    </div>
               </ScrollAnimationWrapper>
             </div>
          </section>

        </AnimatedContent>
      </main>
      <Footer />
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
      <Card className="h-full text-center border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-col items-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4 inline-flex">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>{description}</p>
        </CardContent>
      </Card>
    </ScrollAnimationWrapper>
  );
}
