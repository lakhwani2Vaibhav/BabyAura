"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialty: z.string().min(1, "Specialty is required"),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

type UserProfile = {
  name: string;
  email: string;
  specialty: string;
  hospitalName?: string;
  avatarUrl?: string;
}

export default function DoctorSettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", specialty: "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    const fetchUserData = async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('babyaura_token');
            const response = await fetch('/api/doctor/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch profile");
            const profileData = await response.json();
            
            setProfile(profileData);
            profileForm.reset({
                name: profileData.name,
                specialty: profileData.specialty,
            });
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Error",
                description: "Could not fetch your profile data.",
            });
        } finally {
             setLoading(false);
        }
    }
    fetchUserData();
  }, [profileForm, toast, user]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user?.email) return;
    try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/doctor/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error((await response.json()).message);
        const result = await response.json();
        setProfile(result.updatedData);
        toast({ title: "Profile Updated!", description: "Your changes have been saved." });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Update Failed", description: error.message });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
      if (!user?.email) return;
      try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/doctor/change-password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error((await response.json()).message);
        toast({ title: "Password Changed!", description: "Your password has been updated." });
        passwordForm.reset();
    } catch (error: any) {
        toast({ variant: "destructive", title: "Update Failed", description: error.message });
    }
  }
  
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.substring(0, 2).toUpperCase();
  };

  if (loading) {
      return (
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1"><Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card></div>
            <div className="md:col-span-2"><Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card></div>
        </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1">
            <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={profile?.avatarUrl} data-ai-hint="doctor portrait" />
                                    <AvatarFallback>{getInitials(profile?.name || "")}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-2xl">{profile?.name}</CardTitle>
                                    <CardDescription>{profile?.email}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField control={profileForm.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={profileForm.control} name="specialty" render={({ field }) => (
                                <FormItem><FormLabel>Specialty</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormItem>
                                <FormLabel>Hospital</FormLabel>
                                <FormControl><Input readOnly disabled value={profile?.hospitalName || "N/A"} /></FormControl>
                            </FormItem>
                             <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                                {profileForm.formState.isSubmitting ? "Saving..." : "Save Profile"}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
        <div className="lg:col-span-2">
             <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your password here. Use a strong, unique password for security.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                                <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                                    <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                                    <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                        </CardContent>
                        <CardContent>
                            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    </div>
  );
}
