import { Button } from '@/components/ui/button';
import { BabyAuraLogo } from '@/components/icons/BabyAuraLogo';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function HospitalsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <BabyAuraLogo />
        </Link>
        <nav className="hidden md:flex gap-4 sm:gap-6 items-center">
          <Link href="/features" className="text-sm font-medium hover:underline underline-offset-4">
            Features
          </Link>
          <Link href="/hospitals" className="text-sm font-medium hover:underline underline-offset-4">
            For Hospitals
          </Link>
          <Link href="/parents" className="text-sm font-medium hover:underline underline-offset-4">
            For Parents
          </Link>
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        </nav>
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <nav className="grid gap-6 text-lg font-medium mt-6">
                        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                            <BabyAuraLogo />
                        </Link>
                        <Link href="/features" className="text-muted-foreground hover:text-foreground">
                            Features
                        </Link>
                        <Link href="/hospitals" className="text-muted-foreground hover:text-foreground">
                            For Hospitals
                        </Link>
                        <Link href="/parents" className="text-muted-foreground hover:text-foreground">
                            For Parents
                        </Link>
                        <Button asChild className="mt-4">
                            <Link href="/auth/login">Login</Link>
                        </Button>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
      </header>
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
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t animate-in fade-in duration-1000 ease-out delay-500">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} BabyAura. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
