
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Hospital, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";

const hospitalCodeSchema = z.object({
  hospitalCode: z.string().min(1, { message: "Please enter a hospital code." }),
});

const independentParentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  phone: z.string().min(10, { message: "A valid phone number is required" }),
  address: z.string().min(10, { message: "A valid address is required" }),
});

const affiliatedParentSchema = independentParentSchema; // Same fields for now

type HospitalCodeValues = z.infer<typeof hospitalCodeSchema>;
type IndependentParentValues = z.infer<typeof independentParentSchema>;
type AffiliatedParentValues = z.infer<typeof affiliatedParentSchema>;


const validHospitalCode = "GAH789";
const hospitalName = "General Hospital";

type Step = 'initial' | 'enterCode' | 'confirmHospital' | 'affiliatedDetails' | 'independentDetails';

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('initial');
  const [hospitalCode, setHospitalCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleCodeVerification = () => {
    setError(null);
    if (!hospitalCode) {
      setError("Please enter your hospital code.");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      if (hospitalCode.toUpperCase() === validHospitalCode) {
        setStep('confirmHospital');
      } else {
        setError("Invalid hospital code. Please check and try again.");
      }
      setIsVerifying(false);
    }, 1000);
  };

  const ParentDetailsForm = ({ isAffiliated }: { isAffiliated: boolean }) => {
    const formSchema = isAffiliated ? affiliatedParentSchema : independentParentSchema;
    type FormValues = z.infer<typeof formSchema>;
    
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<FormValues>({
      resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
      setError(null);
      try {
        const payload: any = {
            ...data,
            role: "Parent",
        };
        if (isAffiliated) {
            payload.hospitalCode = hospitalCode;
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "An error occurred");
        }
        
        toast({
          title: "Account Created!",
          description: "Welcome to BabyAura. Let's get started.",
        });

        login({ token: result.token, user: result.user });

      } catch (err: any) {
        setError(err.message || 'Failed to register. Please try again.');
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Registration Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" type="text" placeholder="Your Name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{(errors.name as any).message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{(errors.email as any).message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && <p className="text-sm text-destructive">{(errors.password as any).message}</p>}
        </div>
        {!isAffiliated && (
            <>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Your phone number" {...register("phone")} />
                    {errors.phone && <p className="text-sm text-destructive">{(errors.phone as any).message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="Your full address" {...register("address")} />
                    {errors.address && <p className="text-sm text-destructive">{(errors.address as any).message}</p>}
                </div>
            </>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Sign Up & Start Journey"}
        </Button>
      </form>
    );
  };

  const renderContent = () => {
    switch(step) {
      case 'initial':
        return (
            <>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Join BabyAura</CardTitle>
                    <CardDescription>How would you like to sign up?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={() => setStep('enterCode')} className="w-full" variant="outline">
                        <Hospital className="mr-2 h-4 w-4" /> I have a Hospital Code
                    </Button>
                    <Button onClick={() => setStep('independentDetails')} className="w-full">
                        <User className="mr-2 h-4 w-4" /> Continue as an Independent Parent
                    </Button>
                </CardContent>
            </>
        );
      case 'enterCode':
        return (
          <>
            <CardHeader className="text-center">
              <Button variant="ghost" size="sm" className="absolute left-4 top-4" onClick={() => setStep('initial')}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <CardTitle className="text-2xl font-headline pt-8">Join Your Hospital's Network</CardTitle>
              <CardDescription>Enter the unique code provided by your hospital to begin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Verification Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="hospital-code">Unique Hospital Code</Label>
                <Input
                  id="hospital-code"
                  placeholder="e.g., GAH789"
                  value={hospitalCode}
                  onChange={(e) => setHospitalCode(e.target.value)}
                />
              </div>
              <Button onClick={handleCodeVerification} className="w-full" disabled={isVerifying}>
                {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Code
              </Button>
            </CardContent>
          </>
        );

      case 'confirmHospital':
        return (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                <Hospital className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-headline">Confirm Your Hospital</CardTitle>
              <CardDescription>Does this look right? You are about to sign up under:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="p-4 bg-muted rounded-md">
                <p className="font-bold text-lg">{hospitalName}</p>
              </div>
              <Button onClick={() => setStep('affiliatedDetails')} className="w-full">
                Yes, Continue Signup
              </Button>
              <Button variant="outline" onClick={() => { setStep('enterCode'); setError(null); }} className="w-full">
                Wrong Hospital? Enter Code Again
              </Button>
            </CardContent>
          </>
        );

      case 'affiliatedDetails':
        return (
          <>
            <CardHeader className="text-center relative">
              <Button variant="ghost" size="sm" className="absolute left-4 top-4" onClick={() => setStep('confirmHospital')}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <CardTitle className="text-2xl font-headline pt-8">Create Your Account</CardTitle>
              <CardDescription>Final step! Fill in your details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <ParentDetailsForm isAffiliated={true} />
            </CardContent>
          </>
        );

      case 'independentDetails':
        return (
            <>
                <CardHeader className="text-center relative">
                    <Button variant="ghost" size="sm" className="absolute left-4 top-4" onClick={() => setStep('initial')}>
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                    <CardTitle className="text-2xl font-headline pt-8">Create Your Account</CardTitle>
                    <CardDescription>Welcome! Let's get your details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ParentDetailsForm isAffiliated={false} />
                </CardContent>
            </>
        );
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      {renderContent()}
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
