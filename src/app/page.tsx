import { Button } from '@/components/ui/button';
import { BabyAuraLogo } from '@/components/icons/BabyAuraLogo';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  Stethoscope,
  FileText,
  Phone,
  Baby,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Footer } from '@/components/layout/Footer';


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <BabyAuraLogo />
        </Link>
        <nav className="hidden md:flex gap-4 sm:gap-6 items-center">
          <Link
            href="/features"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="/hospitals"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            For Hospitals
          </Link>
          <Link
            href="/parents"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
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
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <BabyAuraLogo />
                        </Link>
                        <Link
                            href="/features"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Features
                        </Link>
                        <Link
                            href="/hospitals"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            For Hospitals
                        </Link>
                        <Link
                            href="/parents"
                            className="text-muted-foreground hover:text-foreground"
                        >
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
        <section className="w-full pt-24 pb-12 md:pt-36 md:pb-24 lg:pt-44 lg:pb-32 xl:pt-60 xl:pb-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline animate-in fade-in slide-in-from-top-4 duration-1000 ease-out">
                    Welcome to BabyAura
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl animate-in fade-in slide-in-from-top-2 duration-1000 ease-out delay-200">
                    Digital care for your little one, from hospital to home. We
                    provide a seamless e-care system for postnatal and early
                    childhood support.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row animate-in fade-in slide-in-from-top-0 duration-1000 ease-out delay-400">
                  <Button size="lg" asChild>
                    <Link href="/auth/login">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    Join Waitlist
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                data-ai-hint="happy baby"
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
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
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200">
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
              <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg animate-in fade-in zoom-in-95 duration-1000 ease-out delay-300">
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
              <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg animate-in fade-in zoom-in-95 duration-1000 ease-out delay-400">
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
              <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg animate-in fade-in zoom-in-95 duration-1000 ease-out delay-500">
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
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Tailored For Everyone
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Whether you're a parent, a doctor, or a hospital administrator, BabyAura has features designed for you.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-12 py-12">
              <div className="grid gap-2 text-center animate-in fade-in zoom-in-95 duration-1000 ease-out delay-200">
                <h3 className="text-xl font-bold">Comprehensive Features</h3>
                <p className="text-sm text-muted-foreground">From smart scrapbooks to vaccination tracking, explore all that BabyAura offers.</p>
                <Button variant="link" asChild><Link href="/features">Learn More</Link></Button>
              </div>
              <div className="grid gap-2 text-center animate-in fade-in zoom-in-95 duration-1000 ease-out delay-300">
                <h3 className="text-xl font-bold">For Hospitals</h3>
                <p className="text-sm text-muted-foreground">Onboard your facility, manage staff, and choose a business model that works for you.</p>
                <Button variant="link" asChild><Link href="/hospitals">Learn More</Link></Button>
              </div>
              <div className="grid gap-2 text-center animate-in fade-in zoom-in-95 duration-1000 ease-out delay-400">
                <h3 className="text-xl font-bold">For Parents</h3>
                <p className="text-sm text-muted-foreground">Track milestones, schedule consultations, and connect with a supportive community.</p>
                <Button variant="link" asChild><Link href="/parents">Learn More</Link></Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
