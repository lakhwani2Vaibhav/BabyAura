"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Hospital } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";

const registerSchema = z.object({
  ownerName: z.string().min(1, { message: "Owner's full name is required" }),
  hospitalName: z.string().min(3, { message: "Hospital name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.string().min(10, { message: "Full hospital address is required" }),
  mobile: z.string().min(10, { message: "A valid mobile number is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export function HospitalRegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const { formState: { isSubmitting } } = form;

  const onSubmit = async (data: RegisterValues) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/register/hospital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "An error occurred");
      }

      toast({
        title: "Registration Submitted!",
        description: "Your hospital registration is under review. You will be notified upon approval.",
      });
      
      router.push('/auth/login/admins');

    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
          <Hospital className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-headline mt-2">Hospital Registration</CardTitle>
        <CardDescription>Join the BabyAura network to provide digital care.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Registration Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
             <FormField control={form.control} name="ownerName" render={({ field }) => (
                <FormItem>
                    <FormLabel>Owner's Full Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Dr. Jane Doe" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
             <FormField control={form.control} name="hospitalName" render={({ field }) => (
                <FormItem>
                    <FormLabel>Hospital Name</FormLabel>
                    <FormControl><Input placeholder="e.g., City General Hospital" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
             <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                    <FormLabel>Official Email</FormLabel>
                    <FormControl><Input type="email" placeholder="contact@hospital.com" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
            <FormField control={form.control} name="mobile" render={({ field }) => (
                <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl><Input type="tel" placeholder="e.g., 9876543210" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
            <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                    <FormLabel>Hospital Address</FormLabel>
                    <FormControl><Textarea placeholder="Full hospital address" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
            <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
             <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit for Verification"}
            </Button>
            </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">
          Already have an account?{" "}
          <Link href="/auth/login/admins" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
