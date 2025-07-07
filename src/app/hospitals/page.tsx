import { Button } from '@/components/ui/button';
import { BabyAuraLogo } from '@/components/icons/BabyAuraLogo';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Footer } from '@/components/layout/Footer';
import { MarketingHeader } from '@/components/layout/MarketingHeader';

export default function HospitalsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-1">
        <section id="hospitals" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
               <div className="flex flex-col justify-center space-y-4 animate-in fade-in slide-in-from-left-8 duration-1000 ease-out">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Partner with BabyAura
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Empower your hospital with a state-of-the-art digital care platform. Increase patient engagement and streamline postnatal care.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button size="lg" asChild>
                        <Link href="/auth/login?role=Admin">Onboard Your Hospital</Link>
                    </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                data-ai-hint="hospital building"
                width="600"
                height="400"
                alt="For Hospitals"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
