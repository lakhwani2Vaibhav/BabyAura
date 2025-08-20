
'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, KeyRound, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { BabyAuraLogo } from '@/components/icons/BabyAuraLogo';
import { useSearchParams } from 'next/navigation';

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormComponent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Invalid Link</AlertTitle>
            <AlertDescription>
                The password reset link is missing a token. Please request a new one.
            </AlertDescription>
        </Alert>
    );
  }

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An unexpected error occurred.');
      }

      setIsSuccess(true);
      toast({
          title: "Password Reset Successfully!",
          description: "You can now log in with your new password.",
      })

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
     <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline mt-2">Reset Your Password</CardTitle>
            <CardDescription>
              {isSuccess ? "Your password has been changed." : "Enter your new password below."}
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isSuccess ? (
                <div className="text-center space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <p>Your password has been successfully updated.</p>
                     <Button asChild className="w-full">
                        <Link href="/auth/login">Proceed to Login</Link>
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" type="password" {...register('password')} />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
                    {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
                </form>
            )}
        </CardContent>
     </Card>
  );
}


export default function ResetPasswordPage() {
    return (
         <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-6">
                <Link href="/">
                    <BabyAuraLogo />
                </Link>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordFormComponent />
                </Suspense>
            </div>
        </div>
    )
}
