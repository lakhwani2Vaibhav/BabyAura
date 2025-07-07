import { Button } from '@/components/ui/button';
import { BabyAuraLogo } from '@/components/icons/BabyAuraLogo';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Footer } from '@/components/layout/Footer';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { AnimatedContent } from '@/components/layout/AnimatedContent';
import { ScrollAnimationWrapper } from '@/components/layout/ScrollAnimationWrapper';

export default function ParentsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-1">
        <AnimatedContent>
          <section id="parents" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-1000 ease-out">
                  <Image
                    src="https://placehold.co/600x400.png"
                    data-ai-hint="parent baby scrapbook"
                    width="600"
                    height="400"
                    alt="For Parents"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                  />
                </ScrollAnimationWrapper>
                <ScrollAnimationWrapper animationClasses="animate-in fade-in slide-in-from-right-8 duration-1000 ease-out delay-200">
                  <div className="flex flex-col justify-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                      Cherish Every Moment
                    </h2>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                        Our Gen AI-powered scrapbook helps you create a beautiful story of your baby's journey, from the first smile to the first steps.
                    </p>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                        <Button size="lg" asChild>
                            <Link href="/auth/login?role=Parent">Create Your Scrapbook</Link>
                        </Button>
                    </div>
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
