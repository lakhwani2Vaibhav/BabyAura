
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { AnimatedContent } from '@/components/layout/AnimatedContent';
import { ScrollAnimationWrapper } from '@/components/layout/ScrollAnimationWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, TrendingUp, Handshake, DollarSign, LayoutGrid } from 'lucide-react';

export default function HospitalsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-1">
        <AnimatedContent>
          {/* Hero Section */}
          <section id="hospitals-hero" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-left-8 duration-1000 ease-out">
                  <div className="flex flex-col justify-center space-y-4">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                      Transform Postnatal Care at Your Hospital
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Partner with BabyAura to offer a state-of-the-art digital care platform. Enhance patient satisfaction, improve outcomes, and create new revenue streams.
                    </p>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      <Button size="lg" asChild>
                        <Link href="/contact?subject=DemoRequest">Schedule a Demo</Link>
                      </Button>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200">
                  <Image
                    src="https://placehold.co/600x400.png"
                    data-ai-hint="hospital building"
                    width="600"
                    height="400"
                    alt="For Hospitals"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                  />
                </ScrollAnimationWrapper>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section id="benefits" className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
              <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Partner with BabyAura?</h2>
                  <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">A partnership that benefits your patients, your doctors, and your bottom line.</p>
                </div>
              </ScrollAnimationWrapper>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <BenefitCard
                  icon={<Handshake className="h-8 w-8 text-primary" />}
                  title="Enhance Patient Engagement"
                  description="Provide continuous care from hospital to home, increasing patient loyalty and satisfaction."
                />
                <BenefitCard
                  icon={<Zap className="h-8 w-8 text-primary" />}
                  title="Streamline Doctor Workflow"
                  description="Efficiently manage patients, appointments, and prescriptions through an intuitive digital interface."
                />
                <BenefitCard
                  icon={<TrendingUp className="h-8 w-8 text-primary" />}
                  title="Improve Health Outcomes"
                  description="Enable proactive monitoring and timely interventions with integrated growth and vaccination tracking."
                />
              </div>
            </div>
          </section>
          
          {/* Features Showcase */}
          <section id="features" className="w-full py-12 md:py-24 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                 <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
                    <Image
                      src="https://placehold.co/600x400.png"
                      data-ai-hint="dashboard analytics"
                      width={600}
                      height={400}
                      alt="Admin Dashboard"
                      className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                    />
                  </ScrollAnimationWrapper>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-right-8 duration-1000 ease-out">
                  <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                      Powerful Features
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Powerful Dashboards for Seamless Management</h2>
                    <p className="text-muted-foreground">Our plug-and-play system is designed for rapid onboarding and immediate impact. Get a comprehensive overview of your hospital's performance, manage doctors, and monitor patient statistics with our powerful admin dashboard.</p>
                     <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 mt-1 text-green-500" />
                          <span>Onboard doctors, manage profiles, and monitor patient loads.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 mt-1 text-green-500" />
                          <span>View key metrics on doctors, parents, and subscriptions.</span>
                        </li>
                         <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 mt-1 text-green-500" />
                          <span>Customize your hospital's profile and specialties.</span>
                        </li>
                      </ul>
                  </div>
                </ScrollAnimationWrapper>
              </div>
            </div>
          </section>

          {/* Business Models Section */}
           <section id="business-models" className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
               <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Flexible Business Models</h2>
                  <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">Choose a partnership model that aligns with your hospital's financial goals.</p>
                </div>
              </ScrollAnimationWrapper>
              <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <LayoutGrid className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Licensing Fee</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">A straightforward, fixed monthly or annual fee for using the BabyAura platform. Ideal for predictable budgeting and unlimited usage within the agreed terms.</p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader>
                    <DollarSign className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Revenue Sharing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">A collaborative model where we share a percentage of the revenue generated from parent subscriptions and consultations. A true partnership focused on mutual growth.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section id="demo" className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
             <div className="container px-4 md:px-6 text-center">
               <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Elevate Your Patient Care?</h2>
                  <p className="max-w-2xl mx-auto mt-4 text-primary-foreground/80">
                    Let's explore how BabyAura can integrate with your hospital. Schedule a personalized demo with our team today.
                  </p>
                  <div className="mt-6">
                     <Button size="lg" variant="secondary" asChild>
                        <Link href="/contact?subject=DemoRequest">Schedule a Demo</Link>
                    </Button>
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
      <Card className="h-full">
        <CardHeader className="flex flex-col items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>{description}</p>
        </CardContent>
      </Card>
    </ScrollAnimationWrapper>
  );
}
