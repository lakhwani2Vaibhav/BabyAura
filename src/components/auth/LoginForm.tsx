
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth, UserRole } from "@/hooks/use-auth";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Baby, Stethoscope, Shield, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginValues = z.infer<typeof loginSchema>;

const roles: { value: NonNullable<UserRole>; label: string; icon: React.ReactNode }[] =
  [
    { value: "Parent", label: "Parent", icon: <Baby className="w-4 h-4" /> },
    { value: "Doctor", label: "Doctor", icon: <Stethoscope className="w-4 h-4" /> },
    { value: "Admin", label: "Admin", icon: <Shield className="w-4 h-4" /> },
    { value: "Superadmin", label: "Superadmin", icon: <UserCog className="w-4 h-4" /> },
  ];

export function LoginForm() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] =
    useState<NonNullable<UserRole>>("Parent");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: `${"parent"}@babyaura.com`, password: "password" },
  });

  const handleRoleChange = (role: NonNullable<UserRole>) => {
    setSelectedRole(role);
    setValue("email", `${role.toLowerCase()}@babyaura.com`);
    setError(null);
  }

  const onSubmit = async (data: LoginValues) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: selectedRole }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "An error occurred");
      }

      toast({
        title: "Login Successful",
        description: `Welcome back, ${result.name}!`,
      });
      login(selectedRole);

    } catch (err: any) {
       setError(err.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
        <CardDescription>Select your role and sign in to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedRole}
          onValueChange={(value) =>
            handleRoleChange(value as NonNullable<UserRole>)
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            {roles.map((role) => (
              <TabsTrigger
                key={role.value}
                value={role.value as string}
                className="flex items-center justify-center gap-1 text-xs md:text-sm py-2"
              >
                {role.icon} {role.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
           {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={`${selectedRole.toLowerCase()}@babyaura.com`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} defaultValue="password" />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : `Sign In as ${selectedRole}`}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <p className="text-xs text-muted-foreground text-center w-full">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
                Sign Up as a Parent
            </Link>
        </p>
         <p className="text-xs text-muted-foreground text-center w-full">
            Doctors and Admins must be invited by their organization.
        </p>
      </CardFooter>
    </Card>
  );
}
