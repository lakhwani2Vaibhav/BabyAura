
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
import { Shield, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginValues = z.infer<typeof loginSchema>;

type ProfessionalRole = "Admin" | "Doctor";

const professionalRoles: { value: ProfessionalRole; label: string; icon: React.ReactNode }[] =
  [
    { value: "Admin", label: "Hospital Admin", icon: <Shield className="w-4 h-4" /> },
    { value: "Doctor", label: "Doctor", icon: <Stethoscope className="w-4 h-4" /> },
  ];

export function UnifiedAdminLoginForm() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] =
    useState<ProfessionalRole>("Admin");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@babyaura.in", password: "password" },
  });

  const handleRoleChange = (role: ProfessionalRole) => {
    setSelectedRole(role);
    setValue("email", `${role.toLowerCase()}@babyaura.in`);
    setError(null);
  }

  const onSubmit = async (data: LoginValues) => {
    setError(null);
    try {
      // Superadmin check for non-public login
      const roleToSubmit = data.email === 'superadmin@babyaura.in' ? 'Superadmin' : selectedRole;
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: roleToSubmit }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "An error occurred");
      }

      toast({
        title: "Login Successful",
        description: `Welcome back, ${result.name}!`,
      });
      login(roleToSubmit as NonNullable<UserRole>);

    } catch (err: any) {
       setError(err.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Professional Portal</CardTitle>
        <CardDescription>Select your role and sign in to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedRole}
          onValueChange={(value) =>
            handleRoleChange(value as ProfessionalRole)
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            {professionalRoles.map((role) => (
              <TabsTrigger
                key={role.value}
                value={role.value}
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
              placeholder={`${selectedRole.toLowerCase()}@babyaura.in`}
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
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">
            Not a professional user? Go to{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
                Parent login
            </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
