
"use client";

import { Footer } from "@/components/layout/Footer";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/ContactForm";

export default function ContactPage() {
    
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold font-headline">Contact Us</CardTitle>
                        <CardDescription>We'd love to hear from you. Fill out the form below and we'll get back to you soon.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ContactForm />
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
