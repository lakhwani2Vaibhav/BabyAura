
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { AnimatedContent } from '@/components/layout/AnimatedContent';
import { ScrollAnimationWrapper } from '@/components/layout/ScrollAnimationWrapper';
import { ShieldCheck, Video, FileText, BookImage } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const parentTestimonials = [
    {
        quote: "Having a direct line to our actual pediatrician through BabyAura has been a game-changer. No more late-night Googling or relying on questionable advice from forums. It's real peace of mind.",
        name: "Anjali M.",
        title: "Mother of a 4-month-old",
        avatar: "https://placehold.co/100x100.png"
    },
    {
        quote: "All of our daughter's health records, from her first check-up at the hospital to our recent video consultation, are in one place. It's so organized and easy to manage.",
        name: "Priya S.",
        title: "Mother of a 9-month-old",
        avatar: "https://placehold.co/100x100.png"
    }
];


export default function ParentsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <MarketingHeader />
      <main className="flex-1">
        <AnimatedContent>
          {/* Hero Section */}
          <section className="w-full py-16 md:py-24 lg:py-32 landing-page-gradient-bg">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-left-8 duration-1000 ease-out">
                  <div className="flex flex-col justify-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                      The Care You Trust, The Connection You Cherish.
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      BabyAura isn't just another parenting app. It's a secure digital bridge to the doctors and hospital you already know and trust, bringing their expert care right into your home.
                    </p>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      <Button size="lg" asChild>
                        <Link href="/auth/login?role=Parent">Access Your Dashboard</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link href="/features">See All Features</Link>
                      </Button>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200">
                  <Image
                    src="https://placehold.co/600x450.png"
                    data-ai-hint="parent baby video call doctor"
                    width="600"
                    height="450"
                    alt="Parent on video call with doctor"
                    className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover shadow-2xl"
                  />
                </ScrollAnimationWrapper>
              </div>
            </div>
          </section>

          {/* The BabyAura Difference Section */}
          <section className="w-full py-12 md:py-24 bg-background">
            <div className="container px-4 md:px-6">
                 <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why BabyAura is Different</h2>
                        <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">Stop guessing and start getting answers from the professionals who know your child's history.</p>
                    </div>
                 </ScrollAnimationWrapper>
                 <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                    <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200">
                        <Card className="h-full p-6 text-center bg-primary/5 border-primary/20">
                            <CardHeader className="p-0">
                                <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-4">
                                    <ShieldCheck className="h-8 w-8" />
                                </div>
                                <CardTitle>With BabyAura</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 pt-4 space-y-3">
                                <p>Direct video calls with <span className="font-semibold">your trusted pediatrician.</span></p>
                                <p>Health records are <span className="font-semibold">integrated with your hospital.</span></p>
                                <p>Advice from <span className="font-semibold">verified medical professionals.</span></p>
                            </CardContent>
                        </Card>
                    </ScrollAnimationWrapper>
                     <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-300">
                        <Card className="h-full p-6 text-center bg-muted/50 border">
                             <CardHeader className="p-0">
                                <CardTitle className="text-muted-foreground">Typical Parenting Apps</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 pt-4 space-y-3 text-muted-foreground">
                                <p>Advice from forums or unknown doctors.</p>
                                <p>Manually entered data, isolated from your doctor.</p>
                                <p>Relying on community answers for health questions.</p>
                            </CardContent>
                        </Card>
                     </ScrollAnimationWrapper>
                 </div>
            </div>
          </section>

          {/* Core Features Section */}
          <section className="w-full py-12 md:py-24 bg-muted/40">
             <div className="container px-4 md:px-6">
                 <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Everything You Need, All in One Place</h2>
                    </div>
                </ScrollAnimationWrapper>
                <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                    <FeatureCard
                        icon={<Video className="h-8 w-8 text-primary" />}
                        title="Tele-Consultations"
                        description="Connect directly with your doctor via secure video call. Get prescriptions and expert advice without leaving home."
                    />
                     <FeatureCard
                        icon={<FileText className="h-8 w-8 text-primary" />}
                        title="Unified Health Records"
                        description="All your child's reports, vaccination schedules, and growth charts, shared securely between you and your hospital."
                    />
                     <FeatureCard
                        icon={<BookImage className="h-8 w-8 text-primary" />}
                        title="AI-Powered Scrapbook"
                        description="Capture every precious milestone. Our Gen-AI helps you write the perfect caption for your photos and videos."
                    />
                </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="w-full py-12 md:py-24 bg-background">
            <div className="container px-4 md:px-6">
               <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">The Confidence Every Parent Deserves</h2>
                  <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">Hear from parents who have found peace of mind with BabyAura.</p>
                </div>
              </ScrollAnimationWrapper>
              <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                {parentTestimonials.map(testimonial => (
                <ScrollAnimationWrapper key={testimonial.name} animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
                    <Card className="h-full">
                    <CardContent className="p-6">
                        <p className="text-muted-foreground italic mb-6">"{testimonial.quote}"</p>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={testimonial.avatar} data-ai-hint="parent portrait" />
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

        </AnimatedContent>
      </main>
      <Footer />
    </div>
  );
}


function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
      <Card className="h-full text-center border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-col items-center p-0">
          <div className="bg-primary/10 p-4 rounded-full mb-4 inline-flex">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground p-0 pt-2">
          <p>{description}</p>
        </CardContent>
      </Card>
    </ScrollAnimationWrapper>
  );
}
