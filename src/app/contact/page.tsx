"use client";

import { Footer } from "@/components/layout/Footer";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Message Sent!",
            description: "Thank you for contacting us. We'll get back to you shortly.",
        });
    }
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold font-headline">Contact Us</CardTitle>
                        <CardDescription>We'd love to hear from you. Fill out the form below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Your Name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="your@email.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Your message..." required />
                            </div>
                            <Button type="submit" className="w-full">Send Message</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
