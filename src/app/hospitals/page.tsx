
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { AnimatedContent } from '@/components/layout/AnimatedContent';
import { ScrollAnimationWrapper } from '@/components/layout/ScrollAnimationWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Zap, Handshake, Mail } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { HowItWorksSteps } from '@/components/hospitals/HowItWorksSteps';

const Rupee = () => <span className="font-sans">₹</span>;

const hospitalTestimonials = [
    {
        quote: "Partnering with BabyAura transformed our postnatal care program. Our patient satisfaction scores have never been higher, and our doctors appreciate the streamlined communication.",
        name: "Dr. Alisha Chen",
        title: "Chief Medical Officer, General Hospital",
        avatar: "https://placehold.co/100x100.png"
    },
    {
        quote: "The recurring revenue model has opened up a new, predictable income stream for us. The no-upfront-cost option made the decision to join incredibly easy.",
        name: "Mark Johnson",
        title: "CEO, Lakeside Children's",
        avatar: "https://placehold.co/100x100.png"
    }
];

export default function HospitalsPage() {
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
                        <a href="mailto:contact@babyaura.in?subject=Partnership Inquiry">Become a Partner</a>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <a href="mailto:contact@babyaura.in?subject=Demo Request">Schedule a Demo</a>
                      </Button>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200">
                  <Image
                    src="https://placehold.co/600x450.png"
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
          
          {/* How It Works Section */}
          <section id="how-it-works" className="w-full py-12 md:py-24 bg-muted/40">
            <div className="container px-4 md:px-6">
                 <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Seamless Integration in 3 Simple Steps</h2>
                    </div>
                </ScrollAnimationWrapper>
                <HowItWorksSteps />
            </div>
          </section>
          
          {/* BabyAura 360 CTA */}
          <section id="babyaura-360" className="w-full py-12 md:py-24 bg-primary/5">
            <div className="container px-4 md:px-6">
              <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">Explore Our All-Inclusive Partnership Models</h2>
                  <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-xl">
                    From licensing fees to our premium BabyAura 360° revenue-share model with an in-house specialist team, we have a partnership that fits your hospital's needs.
                  </p>
                  <div className="mt-8">
                    <Button size="lg" asChild>
                      <a href="mailto:babyauraindia@gmail.com?subject=Partnership Models Inquiry">
                        Talk to our Partnership Team
                      </a>
                    </Button>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="w-full py-12 md:py-24 bg-background">
            <div className="container px-4 md:px-6">
               <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Trusted by Leading Hospitals</h2>
                  <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">Hear from administrators who have transformed their care with BabyAura.</p>
                </div>
              </ScrollAnimationWrapper>
              <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                {hospitalTestimonials.map(testimonial => (
                <ScrollAnimationWrapper key={testimonial.name} animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
                    <Card className="h-full">
                    <CardContent className="p-6">
                        <p className="text-muted-foreground italic mb-6">"{testimonial.quote}"</p>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={testimonial.avatar} data-ai-hint="person portrait" />
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                            </div>
                        </div>
                    </CardContent>
                    </Card>
                </ScrollAnimationWrapper>
                ))}
              </div>
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
                                <CardDescription className="text-lg text-muted-foreground">Contact our partnership team today to get started.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 flex justify-center">
                                <Button asChild size="lg">
                                  <a href="mailto:contact@babyaura.in?subject=Partnership Inquiry">
                                    <Mail className="mr-2 h-5 w-5" />
                                    Contact Partnership Team
                                  </a>
                                </Button>
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
