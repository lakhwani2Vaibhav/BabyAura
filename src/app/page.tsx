
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import {
  Stethoscope,
  FileText,
  Phone,
  Baby,
  Users,
  MessagesSquare,
  MessageCircleMore,
  ShieldCheck,
  ScreenShare,
  BookImage,
  CheckCircle2,
  XCircle,
  Info,
  Building,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { AnimatedContent } from '@/components/layout/AnimatedContent';
import { ScrollAnimationWrapper } from '@/components/layout/ScrollAnimationWrapper';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React, { useState } from 'react';
import { endorsements } from '@/lib/data';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils';

export default function Home() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = {
    monthly: {
      basic: { price: 2499, period: '/month' },
      premium: { price: 2999, period: '/month' },
    },
    annual: {
      basic: { price: 24999, period: '/year' },
      premium: { price: 29999, period: '/year' },
    },
  };

  const currentPlan = isAnnual ? plans.annual : plans.monthly;

  const featuresList = [
      { name: 'Dedicated Pediatrics Support', info: '24/7 access to our pediatricians.' },
      { name: '24/7 Call Assistance', info: 'Immediate help via call anytime.' },
      { name: 'Growth Trackers & Milestones', info: 'Track your baby\'s growth and milestones.' },
      { name: 'Immunization Alerts & Support', info: 'Get alerts for upcoming immunizations.' },
      { name: 'Health Feedback & Prescription Reminders', info: 'Reminders for prescriptions and health feedback.' },
      { name: 'Quick Chat/Call Support', info: 'Quick support via chat or call.' },
      { name: 'Dedicated Dietician Support', info: 'Get support from a dedicated dietician.' },
      { name: 'Automated Essentials Delivery', info: 'Automated delivery of baby essentials.' },
      { name: 'AI Assistance', info: 'Get AI-powered assistance for your queries.' },
      { name: 'Early Access to Beta Updates', info: 'Get early access to our new features.' },
  ];

  const planFeatures = {
    basic: {
      'Dedicated Pediatrics Support': true,
      '24/7 Call Assistance': true,
      'Growth Trackers & Milestones': true,
      'Immunization Alerts & Support': true,
      'Health Feedback & Prescription Reminders': true,
      'Quick Chat/Call Support': true,
      'Dedicated Dietician Support': true,
      'Automated Essentials Delivery': false,
      'AI Assistance': true,
      'Early Access to Beta Updates': false,
    },
    premium: {
      'Dedicated Pediatrics Support': true,
      '24/7 Call Assistance': true,
      'Growth Trackers & Milestones': true,
      'Immunization Alerts & Support': true,
      'Health Feedback & Prescription Reminders': true,
      'Quick Chat/Call Support': true,
      'Dedicated Dietician Support': true,
      'Automated Essentials Delivery': true,
      'AI Assistance': true,
      'Early Access to Beta Updates': true,
    }
  };

  const getEndorsementIcon = (type: 'academic' | 'foundation' | 'advisor' | 'default') => {
    switch (type) {
        case 'academic':
            return <GraduationCap className="h-10 w-10 text-primary" />;
        case 'foundation':
            return <Sparkles className="h-10 w-10 text-primary" />;
        case 'advisor':
            return <Stethoscope className="h-10 w-10 text-primary" />;
        default:
            return <Building className="h-10 w-10 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-1 landing-page-gradient-bg">
        <AnimatedContent>
          <section className="w-full pt-8 pb-12 md:pt-10 lg:pt-14 lg:pb-32 xl:pt-20 xl:pb-48">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-top-4 duration-1000 ease-out">
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                        Digitizing Post-Discharge Newborn Care
                      </h1>
                    </ScrollAnimationWrapper>
                    <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-top-2 duration-1000 ease-out delay-200">
                      <p className="max-w-[600px] text-muted-foreground md:text-xl">
                        A true care partner for your hospital. We provide an in-house team of specialists—nutritionists, therapists, and more—to deliver continuous, structured care to your parents.
                      </p>
                    </ScrollAnimationWrapper>
                  </div>
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-top-0 duration-1000 ease-out delay-400">
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      <Button size="lg" asChild>
                        <Link href="/hospitals">Partner With Us</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link href="/auth/login">Parent Login</Link>
                      </Button>
                    </div>
                  </ScrollAnimationWrapper>
                </div>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200">
                  <Image
                    src="https://res.cloudinary.com/dg0qkunjk/image/upload/v1751958248/grok_image_xkp1vgg_f6s9on.jpg"
                    data-ai-hint="happy baby"
                    width="600"
                    height="400"
                    alt="Hero"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                  />
                </ScrollAnimationWrapper>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                      Complete Infant Care{' '}
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        Platform
                      </span>
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                      Everything parents need for their baby's health journey, powered by
                      expert medical professionals from your hospital.
                    </p>
                  </div>
                </div>
              </ScrollAnimationWrapper>
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200">
                  <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Stethoscope className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Expert Consultations</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect with pediatricians and specialists anytime, anywhere.
                      </p>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-300">
                  <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Digital Health Records</h3>
                      <p className="text-sm text-muted-foreground">
                        Secure, organized health reports and vaccination tracking.
                      </p>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-400">
                  <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                      <Phone className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">24/7 Emergency Support</h3>
                      <p className="text-sm text-muted-foreground">
                        Instant access to emergency hotlines and SOS features.
                      </p>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-500">
                  <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                      <Baby className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Growth Monitoring</h3>
                      <p className="text-sm text-muted-foreground">
                        Track milestones and developmental progress with AI insights.
                      </p>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-left-8 duration-1000 ease-out">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                      Why Hospitals Choose BabyAura
                    </h2>
                    <p className="text-muted-foreground md:text-lg">
                      Enhance patient loyalty, improve post-discharge care outcomes, and create a new recurring revenue stream for your institution.
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/hospitals">
                           Learn More for Hospitals
                        </Link>
                    </Button>
                  </div>
                </ScrollAnimationWrapper>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-200">
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 h-full hover:shadow-lg transition-shadow">
                      <MessagesSquare className="h-8 w-8 text-purple-600" />
                      <div>
                        <h3 className="text-lg font-bold">Streamlined Communication</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Reduce administrative overhead with secure, direct-to-patient messaging and tele-consultations.
                        </p>
                      </div>
                    </div>
                  </ScrollAnimationWrapper>
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-300">
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 h-full hover:shadow-lg transition-shadow">
                      <MessageCircleMore className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="text-lg font-bold">Plug-and-Play Platform</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Our system integrates seamlessly with no upfront costs and flexible business models.
                        </p>
                      </div>
                    </div>
                  </ScrollAnimationWrapper>
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-400">
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 h-full hover:shadow-lg transition-shadow">
                      <ShieldCheck className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-bold">Enhanced Patient Retention</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Offer a premium digital experience that modern parents expect, boosting loyalty to your hospital.
                        </p>
                      </div>
                    </div>
                  </ScrollAnimationWrapper>
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-500">
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 h-full hover:shadow-lg transition-shadow">
                      <BookImage className="h-8 w-8 text-orange-600" />
                      <div>
                        <h3 className="text-lg font-bold">Analytics</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Leverage AI tools for patient timeline management and scrapbook generation, adding value to your care packages.
                        </p>
                      </div>
                    </div>
                  </ScrollAnimationWrapper>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted dark:bg-card">
            <div className="container px-4 md:px-6">
              <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                    Endorsed By & Advised By
                  </h2>
                  <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                    Our platform is backed by leading institutions and experts in digital health and healthcare management.
                  </p>
                </div>
              </ScrollAnimationWrapper>
              <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-12 py-12">
                {endorsements.map((item, index) => (
                  <ScrollAnimationWrapper
                    key={index}
                    animationClasses={`animate-in fade-in zoom-in-95 duration-700 ease-out delay-${200 + index * 100}`}
                  >
                    <Card className="h-full text-center flex flex-col items-center p-6 bg-background shadow-md hover:shadow-xl transition-shadow">
                      <CardHeader className="p-0">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                          {getEndorsementIcon(item.type)}
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </CardContent>
                    </Card>
                  </ScrollAnimationWrapper>
                ))}
              </div>
            </div>
          </section>

           <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <TooltipProvider>
              <div className="container px-4 md:px-6">
                 <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                        Choose the Right Plan for Your Baby
                      </h2>
                      <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Select a plan that grows with your family's needs
                      </p>
                    </div>
                  </ScrollAnimationWrapper>

                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200">
                    <div className="flex items-center justify-center gap-4 my-8">
                        <Label htmlFor="pricing-toggle">Monthly</Label>
                        <Switch id="pricing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
                        <Label htmlFor="pricing-toggle">Annual</Label>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Save</Badge>
                    </div>
                  </ScrollAnimationWrapper>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-7xl mx-auto">
                   <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-left-8 duration-1000 ease-out delay-300" className="lg:order-2 order-3">
                      <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {featuresList.map((feature) => (
                                <li key={feature.name} className="flex items-center justify-between text-sm py-2 border-b">
                                    <span>{feature.name}</span>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{feature.info}</p>
                                    </TooltipContent>
                                    </Tooltip>
                                </li>
                                ))}
                            </ul>
                        </CardContent>
                      </Card>
                    </ScrollAnimationWrapper>

                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-400" className="order-1">
                    <Card className="flex flex-col h-full">
                        <CardHeader>
                            <CardTitle className="text-2xl">Basic Plan</CardTitle>
                            <p className="text-3xl font-bold">₹{currentPlan.basic.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">{currentPlan.basic.period}</span></p>
                            <p className="text-sm text-muted-foreground">Essential support for new parents</p>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <ul className="space-y-4">
                                {featuresList.map(feature => {
                                    const value = planFeatures.basic[feature.name as keyof typeof planFeatures.basic];
                                    return (
                                    <li key={feature.name} className="flex items-center gap-3 text-sm">
                                        {value === true ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                        <span className="flex-1">{feature.name}</span>
                                    </li>
                                    );
                                })}
                            </ul>
                        </CardContent>
                         <CardFooter>
                           <Button className="w-full" asChild>
                                <Link href="/auth/register">Choose Basic</Link>
                           </Button>
                        </CardFooter>
                    </Card>
                  </ScrollAnimationWrapper>

                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-500" className="lg:order-3 order-2">
                    <Card className="relative flex flex-col h-full border-2 border-primary shadow-lg">
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">MOST POPULAR</Badge>
                        <div className={cn("rounded-t-lg", "bg-primary/5")}>
                            <CardHeader className="opacity-60">
                                <CardTitle className="text-2xl">Premium Plan</CardTitle>
                                <p className="text-3xl font-bold">₹{currentPlan.premium.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">{currentPlan.premium.period}</span></p>
                                <p className="text-sm text-muted-foreground">Complete care for your baby's journey</p>
                            </CardHeader>
                        </div>
                        <CardContent className="pt-6 flex-grow opacity-60">
                           <ul className="space-y-4">
                                {featuresList.map(feature => {
                                    const value = planFeatures.premium[feature.name as keyof typeof planFeatures.premium];
                                    return (
                                    <li key={feature.name} className="flex items-center gap-3 text-sm">
                                        {value === true ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                       <span className="flex-1">{feature.name}</span>
                                    </li>
                                    );
                                })}
                            </ul>
                        </CardContent>
                         <CardFooter>
                           <Button className="w-full" disabled>
                                Coming Soon
                           </Button>
                        </CardFooter>
                    </Card>
                   </ScrollAnimationWrapper>
                </div>
              </div>
            </TooltipProvider>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted dark:bg-card">
            <div className="container px-4 md:px-6">
              <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                      Tailored For Everyone
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Whether you're a parent, a doctor, or a hospital administrator, BabyAura has features designed for you.
                    </p>
                  </div>
                </div>
              </ScrollAnimationWrapper>
              <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-12 py-12">
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200" className="grid gap-2 text-center">
                  <div>
                    <h3 className="text-xl font-bold">Comprehensive Features</h3>
                    <p className="text-sm text-muted-foreground">From smart scrapbooks to vaccination tracking, explore all that BabyAura offers.</p>
                    <Button variant="link" asChild><Link href="/features">Learn More</Link></Button>
                  </div>
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-300" className="grid gap-2 text-center">
                  <div>
                    <h3 className="text-xl font-bold">For Hospitals</h3>
                    <p className="text-sm text-muted-foreground">Onboard your facility, manage staff, and choose a business model that works for you.</p>
                    <Button variant="link" asChild><Link href="/hospitals">Learn More</Link></Button>
                  </div>
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-400" className="grid gap-2 text-center">
                  <div>
                    <h3 className="text-xl font-bold">For Parents</h3>
                    <p className="text-sm text-muted-foreground">Track milestones, schedule consultations, and connect with a supportive community.</p>
                    <Button variant="link" asChild><Link href="/parents">Learn More</Link></Button>
                  </div>
                </ScrollAnimationWrapper>
              </div>
            </div>
          </section>
        </AnimatedContent>
      </main>
      <Footer />
    </div>
  );
}
