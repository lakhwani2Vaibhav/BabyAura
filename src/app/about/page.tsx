import { Footer } from "@/components/layout/Footer";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  About BabyAura
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Empowering families and transforming healthcare, one baby at a time.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 animate-in fade-in slide-in-from-left-8 duration-1000 ease-out">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Our Mission</h2>
                <p className="text-muted-foreground">
                  Our mission is to provide a comprehensive, intuitive, and supportive digital care ecosystem that bridges the gap between hospitals and homes. We believe that every parent deserves peace of mind and every child deserves the best possible start in life. BabyAura is designed to be a trusted companion for parents, a powerful tool for doctors, and a seamless platform for hospitals.
                </p>
                <p className="text-muted-foreground">
                  From tracking vaccinations and growth milestones to providing instant access to medical professionals and a supportive community, we are committed to making the early stages of parenthood a more connected and confident experience.
                </p>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                data-ai-hint="team collaboration"
                width="600"
                height="400"
                alt="Our Mission"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full animate-in fade-in zoom-in-95 duration-1000 ease-out"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
