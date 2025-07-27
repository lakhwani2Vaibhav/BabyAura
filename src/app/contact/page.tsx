
"use client";

import { Footer } from "@/components/layout/Footer";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

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
                        <CardDescription>We'd love to hear from you. Click the button below to send us an email.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button asChild size="lg">
                            <a href="mailto:babyauraindia@gmail.com">
                                <Mail className="mr-2 h-5 w-5" />
                                Send us an Email
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
