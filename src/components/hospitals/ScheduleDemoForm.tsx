
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

const demoSchema = z.object({
  name: z.string().min(2, "Name is required."),
  hospitalName: z.string().min(3, "Hospital name is required."),
  email: z.string().email("A valid email is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  message: z.string().optional(),
});

type DemoFormValues = z.infer<typeof demoSchema>;

interface ScheduleDemoFormProps {
  onFormSubmit?: () => void;
}

export function ScheduleDemoForm({ onFormSubmit }: ScheduleDemoFormProps) {
  const { toast } = useToast();
  const form = useForm<DemoFormValues>({
    resolver: zodResolver(demoSchema),
    defaultValues: { name: "", hospitalName: "", email: "", phone: "", message: "" },
  });

  const onSubmit = async (data: DemoFormValues) => {
    try {
      const response = await fetch('/api/contact/schedule-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send request.');
      }

      toast({
        title: "Demo Request Sent!",
        description: "Our team will be in touch shortly to schedule your demo.",
      });
      form.reset();
      if (onFormSubmit) onFormSubmit();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send your request. Please try again later.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl><Input placeholder="e.g., Dr. Jane Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hospitalName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hospital Name</FormLabel>
              <FormControl><Input placeholder="e.g., City General Hospital" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Work Email</FormLabel>
                <FormControl><Input type="email" placeholder="your.email@hospital.com" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl><Input type="tel" placeholder="Your contact number" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Times or Questions (Optional)</FormLabel>
              <FormControl><Textarea placeholder="Any specific questions or times that work best for you?" {...field} rows={3} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Request Demo
        </Button>
      </form>
    </Form>
  );
}
