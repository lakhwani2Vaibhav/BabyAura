'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import {
  Stethoscope,
  FileText,
  Phone,
  Baby,
  Briefcase,
  Users,
  MessagesSquare,
  MessageCircleMore,
  ShieldCheck,
  ScreenShare,
  BookOpenCheck,
  CheckCircle2,
  XCircle,
  Info,
  Heart,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { AnimatedContent } from '@/components/layout/AnimatedContent';
import { ScrollAnimationWrapper } from '@/components/layout/ScrollAnimationWrapper';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { ourDoctors, testimonials } from '@/lib/data';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';


export default function Home() {
    const plugin = React.useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false })
  )
  const [isAnnual, setIsAnnual] = useState(false);
  const { toast } = useToast();

  const handleDownloadClick = () => {
    toast({
      title: "App Coming Soon!",
      description: (
        <span>
          Our mobile app is under development.{" "}
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLScT83PqypfnGSLGSzdXaSx8i3MypuG31KxGF1-fC14ZwzanqA/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            Join the waitlist
          </Link>{" "}
          to be notified!
        </span>
      ),
    });
  };

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
      { name: 'Automated Essentials Delivery', info: 'Automated delivery of baby essentials.' },
      { name: 'Growth Trackers & Milestones', info: 'Track your baby\'s growth and milestones.' },
      { name: 'Immunization Alerts & Support', info: 'Get alerts for upcoming immunizations.' },
      { name: 'Health Feedback & Prescription Reminders', info: 'Reminders for prescriptions and health feedback.' },
      { name: 'Quick Chat/Call Support', info: 'Quick support via chat or call.' },
      { name: 'Dedicated Dietician Support', info: 'Get support from a dedicated dietician.' },
      { name: 'AI Assistance', info: 'Get AI-powered assistance for your queries.' },
      { name: 'Early Access to Beta Updates', info: 'Get early access to our new features.' },
  ];

  const planFeatures = {
    basic: {
      'Dedicated Pediatrics Support': true,
      '24/7 Call Assistance': true,
      'Automated Essentials Delivery': false,
      'Growth Trackers & Milestones': true,
      'Immunization Alerts & Support': true,
      'Health Feedback & Prescription Reminders': true,
      'Quick Chat/Call Support': '3 Credits',
      'Dedicated Dietician Support': false,
      'AI Assistance': 'Simple',
      'Early Access to Beta Updates': false,
    },
    premium: {
      'Dedicated Pediatrics Support': true,
      '24/7 Call Assistance': true,
      'Automated Essentials Delivery': true,
      'Growth Trackers & Milestones': true,
      'Immunization Alerts & Support': true,
      'Health Feedback & Prescription Reminders': true,
      'Quick Chat/Call Support': '5 Credits',
      'Dedicated Dietician Support': true,
      'AI Assistance': 'Advanced',
      'Early Access to Beta Updates': true,
    }
  };

  return (
    <div className="flex flex-col min-h-screen landing-page-gradient-bg">
      <MarketingHeader />
      <main className="flex-1">
        <AnimatedContent>
          <section className="w-full pt-8 pb-12 md:pt-10 lg:pt-14 lg:pb-32 xl:pt-20 xl:pb-48">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-top-4 duration-1000 ease-out">
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                        Welcome to BabyAura
                      </h1>
                    </ScrollAnimationWrapper>
                    <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-top-2 duration-1000 ease-out delay-200">
                      <p className="max-w-[600px] text-muted-foreground md:text-xl">
                        Digital care for your little one, from hospital to home. We
                        provide a seamless e-care system for postnatal and early
                        childhood support.
                      </p>
                    </ScrollAnimationWrapper>
                  </div>
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-top-0 duration-1000 ease-out delay-400">
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      <Button size="lg" asChild>
                        <Link href="/auth/login">Get Started</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link href="https://docs.google.com/forms/d/e/1FAIpQLScT83PqypfnGSLGSzdXaSx8i3MypuG31KxGF1-fC14ZwzanqA/viewform" target="_blank" rel="noopener noreferrer">
                          Join Waitlist
                        </Link>
                      </Button>
                    </div>
                  </ScrollAnimationWrapper>
                </div>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200">
                  <Image
                    src="https://placehold.co/600x400.png"
                    data-ai-hint="happy baby"
                    width="600"
                    height="400"
                    alt="Hero"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                  />
                </ScrollAnimationWrapper>
              </div>
              
              {/* <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out delay-600">
                <div className="mt-12 flex items-center justify-center gap-8 text-center md:gap-16">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">X+</p>
                      <p className="text-sm text-muted-foreground">
                        Expert doctors
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">X+</p>
                      <p className="text-sm text-muted-foreground">
                        Parents Trust BabyAura
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper> */}
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
                      expert medical professionals.
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

          <section className="w-full py-12 md:py-24 lg:py-32 bg-[#FFF7F1] dark:bg-zinc-900/40">
            <div className="container px-4 md:px-6">
              <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="inline-block rounded-md border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-sm text-orange-600 dark:text-orange-400">
                    INDIA&apos;S #1 PARENTING PLATFORM
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                    How Can We Help You Today?
                  </h2>
                </div>
              </ScrollAnimationWrapper>

              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
                <ScrollAnimationWrapper
                  animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out"
                  className="lg:col-span-2"
                >
                  <Card className="group relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-xl border-2 border-orange-400 p-6 transition-transform duration-300 hover:scale-105 md:flex-row md:items-center">
                    <div className="z-10 flex-1">
                      <h3 className="text-2xl font-bold">24/7 Pediatric Care</h3>
                      <Badge className="mt-2 border-none bg-orange-400 text-orange-50 hover:bg-orange-500">
                        ★ Featured
                      </Badge>
                    </div>
                    <div className="relative mt-4 h-36 w-full md:mt-0 md:h-full md:w-2/5">
                      <Image
                        src="https://placehold.co/250x150.png"
                        data-ai-hint="doctor baby"
                        alt="Pediatric Care"
                        layout="fill"
                        objectFit="contain"
                        className="transition-transform duration-300 group-hover:scale-110 md:absolute md:right-0 md:bottom-0"
                      />
                    </div>
                  </Card>
                </ScrollAnimationWrapper>

                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-100">
                  <Card className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl p-6 transition-transform duration-300 hover:scale-105">
                    <h3 className="text-xl font-bold">Pregnancy Webinar</h3>
                    <Image
                      src="https://placehold.co/200x150.png"
                      data-ai-hint="pregnant woman"
                      alt="Pregnancy Webinar"
                      width={180}
                      height={180}
                      className="mt-4 self-end transition-transform duration-300 group-hover:scale-110"
                    />
                  </Card>
                </ScrollAnimationWrapper>

                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-200">
                  <Card className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl p-6 transition-transform duration-300 hover:scale-105">
                    <h3 className="text-xl font-bold">
                      Breastfeeding Guidance
                    </h3>
                    <Image
                      src="https://placehold.co/200x150.png"
                      data-ai-hint="mother breastfeeding"
                      alt="Breastfeeding Guidance"
                      width={180}
                      height={180}
                      className="mt-4 self-end transition-transform duration-300 group-hover:scale-110"
                    />
                  </Card>
                </ScrollAnimationWrapper>

                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-300">
                  <Card className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl p-6 transition-transform duration-300 hover:scale-105">
                    <h3 className="text-xl font-bold">Baby Vaccinations</h3>
                    <Image
                      src="https://placehold.co/200x150.png"
                      data-ai-hint="baby vaccine"
                      alt="Baby Vaccinations"
                      width={180}
                      height={180}
                      className="mt-4 self-end transition-transform duration-300 group-hover:scale-110"
                    />
                  </Card>
                </ScrollAnimationWrapper>

                <div className="flex flex-col gap-6">
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-400">
                    <Card className="group relative flex h-full items-center justify-between overflow-hidden rounded-xl p-4 transition-transform duration-300 hover:scale-105">
                      <h3 className="text-lg font-semibold">
                        Solids/Nutrition Planning
                      </h3>
                      <Image
                        src="https://placehold.co/80x60.png"
                        data-ai-hint="toddler eating"
                        alt="Nutrition"
                        width={80}
                        height={60}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </Card>
                  </ScrollAnimationWrapper>
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-500">
                    <Card className="group relative flex h-full items-center justify-between overflow-hidden rounded-xl p-4 transition-transform duration-300 hover:scale-105">
                      <h3 className="text-lg font-semibold">Sleep Support</h3>
                      <Image
                        src="https://placehold.co/80x60.png"
                        data-ai-hint="baby sleeping"
                        alt="Sleep Support"
                        width={80}
                        height={60}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </Card>
                  </ScrollAnimationWrapper>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-left-8 duration-1000 ease-out">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                      Why Parents choose BabyAura
                    </h2>
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleDownloadClick}>
                      Download App
                    </Button>
                  </div>
                </ScrollAnimationWrapper>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-200">
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 h-full hover:shadow-lg transition-shadow">
                      <MessagesSquare className="h-8 w-8 text-purple-600" />
                      <div>
                        <h3 className="text-lg font-bold">Instant Chat with Pediatricians</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Get quick answers and support from experienced MD pediatricians.
                        </p>
                      </div>
                    </div>
                  </ScrollAnimationWrapper>
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-300">
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 h-full hover:shadow-lg transition-shadow">
                      <MessageCircleMore className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="text-lg font-bold">Empowering, Judgment-Free Support</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ask any question, big or small, without feeling judged.
                        </p>
                      </div>
                    </div>
                  </ScrollAnimationWrapper>
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-400">
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 h-full hover:shadow-lg transition-shadow">
                      <ShieldCheck className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-bold">Cautious Medication</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          We prioritize your child's well-being and avoid unnecessary treatments.
                        </p>
                      </div>
                    </div>
                  </ScrollAnimationWrapper>
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-500">
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 h-full hover:shadow-lg transition-shadow">
                      <Users className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-bold">Personalized Team of Doctors</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Dedicated experts for every stage of your parenting journey.
                        </p>
                      </div>
                    </div>
                  </ScrollAnimationWrapper>
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-600">
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 h-full hover:shadow-lg transition-shadow">
                      <ScreenShare className="h-8 w-8 text-pink-600" />
                      <div>
                        <h3 className="text-lg font-bold">24/7 Pediatric Support</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Video consultations with pediatricians, anytime you need them.
                        </p>
                      </div>
                    </div>
                  </ScrollAnimationWrapper>
                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out delay-700">
                    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 h-full hover:shadow-lg transition-shadow">
                      <BookOpenCheck className="h-8 w-8 text-pink-600" />
                      <div>
                        <h3 className="text-lg font-bold">Expert-Led Resources</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Access courses and webinars from experienced pediatricians.
                        </p>
                      </div>
                    </div>
                  </ScrollAnimationWrapper>
                </div>
              </div>
            </div>
          </section>

          <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted dark:bg-card">
            <div className="container px-4 md:px-6">
              <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                    Loved by Mothers Everywhere
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Hear what parents are saying about their BabyAura experience. Real stories from real moms.
                  </p>
                </div>
              </ScrollAnimationWrapper>
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <ScrollAnimationWrapper
                    key={testimonial.id}
                    animationClasses={`animate-in fade-in zoom-in-95 duration-700 ease-out delay-${100 + index * 100}`}
                  >
                    <Card className="h-full flex flex-col justify-between p-6 bg-card border shadow-sm">
                      <CardContent className="p-0 mb-4">
                        <p className="text-foreground/90 italic">"{testimonial.quote}"</p>
                      </CardContent>
                      <CardFooter className="p-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={testimonial.avatarUrl} data-ai-hint={testimonial.dataAiHint} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">Mother of a {testimonial.childAge} old</p>
                          </div>
                        </div>
                        <Heart className="h-5 w-5 text-pink-500 fill-current" />
                      </CardFooter>
                    </Card>
                  </ScrollAnimationWrapper>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container px-4 md:px-6">
              <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                    Meet Our Doctors
                  </h2>
                  <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                    Our team of experienced and caring professionals is here to support you.
                  </p>
                </div>
              </ScrollAnimationWrapper>
              <ScrollAnimationWrapper animationClasses="animate-in fade-in duration-1000 ease-out delay-200">
                <Carousel
                  plugins={[plugin.current]}
                  className="w-full max-w-6xl mx-auto mt-12"
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {ourDoctors.map((doctor, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <div className="p-1">
                          <Card className="overflow-hidden group border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="relative bg-blue-50 dark:bg-blue-900/20 p-4 aspect-[4/3] flex items-center justify-center">
                              <Image
                                src={doctor.imageUrl}
                                data-ai-hint={doctor.dataAiHint}
                                alt={doctor.name}
                                width={200}
                                height={200}
                                className="rounded-full mx-auto aspect-square object-cover border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <CardContent className="p-4 text-center bg-white dark:bg-card">
                              <h3 className="font-bold text-lg">{doctor.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1 h-10">{doctor.title}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                </Carousel>
              </ScrollAnimationWrapper>
            </div>
          </section>

           <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted dark:bg-card">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-7xl mx-auto lg:sticky-container">
                   <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-left-8 duration-1000 ease-out delay-300" className="lg:order-2 order-3 lg:sticky top-24">
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
                                        {value === true ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : (value === false ? <XCircle className="h-5 w-5 text-red-500" /> : <span className='text-xs font-bold text-primary w-5 text-center'>✓</span>)}
                                        <span className="flex-1">{typeof value === 'string' ? <><span className='font-bold'>{value}</span> {feature.name.split(' ').slice(1).join(' ')}</> : feature.name}</span>
                                    </li>
                                    );
                                })}
                            </ul>
                        </CardContent>
                    </Card>
                  </ScrollAnimationWrapper>

                  <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-500" className="lg:order-3 order-2">
                    <Card className="relative flex flex-col h-full border-2 border-primary shadow-lg">
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">MOST POPULAR</Badge>
                        <div className="bg-primary/90 text-primary-foreground rounded-t-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-white">Premium Plan</CardTitle>
                                <p className="text-3xl font-bold text-white">₹{currentPlan.premium.price.toLocaleString()}<span className="text-sm font-normal text-white/80">{currentPlan.premium.period}</span></p>
                                <p className="text-sm text-white/80">Complete care for your baby's journey</p>
                            </CardHeader>
                        </div>
                        <CardContent className="pt-6 flex-grow">
                           <ul className="space-y-4">
                                {featuresList.map(feature => {
                                    const value = planFeatures.premium[feature.name as keyof typeof planFeatures.premium];
                                    return (
                                    <li key={feature.name} className="flex items-center gap-3 text-sm">
                                        {value === true ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : (value === false ? <XCircle className="h-5 w-5 text-red-500" /> : <span className='text-xs font-bold text-primary w-5 text-center'>✓</span>)}
                                        <span className="flex-1">{typeof value === 'string' ? <><span className='font-bold'>{value}</span> {feature.name.split(' ').slice(1).join(' ')}</> : feature.name}</span>
                                    </li>
                                    );
                                })}
                            </ul>
                        </CardContent>
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
