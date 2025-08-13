
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
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
  role: string;
  hospitalName?: string;
}

export default function AdminProfilePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "" },
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
            const response = await fetch('/api/admin/profile', {
                headers: { 
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("Failed to fetch profile");
            const profileData = await response.json();
            
            setProfile(profileData);
            profileForm.reset({
                name: profileData.name,
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
    };
    fetchUserData();
  }, [profileForm, toast, user]);


  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user?.email) return;
    try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/admin/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name: data.name }),
        });

        if (!response.ok) throw new Error((await response.json()).message);

        const result = await response.json();
        setProfile(prev => prev ? { ...prev, name: result.updatedData.name } : null);
        toast({ title: "Profile Updated!", description: "Your changes have been saved." });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Update Failed", description: error.message });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
      if (!user?.email) return;
      try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/admin/change-password', {
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
    return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.substring(0, 2);
  };

  if (loading) {
      return (
          <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
            <Card className="p-6"><Skeleton className="h-48 w-full" /></Card>
            <Card className="p-6"><Skeleton className="h-48 w-full" /></Card>
          </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://placehold.co/80x80.png" data-ai-hint="admin portrait" />
                  <AvatarFallback>{getInitials(profile?.name || "")}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profile?.name}</CardTitle>
                  <CardDescription>{profile?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input readOnly disabled value={profile?.email || ""} /></FormControl>
                </FormItem>
                 <FormItem>
                    <FormLabel>Hospital</FormLabel>
                    <FormControl><Input readOnly disabled value={profile?.hospitalName || ""} /></FormControl>
                </FormItem>
              <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                  {profileForm.formState.isSubmitting ? "Saving..." : "Save Profile Changes"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>

       <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password here. Use a strong, unique password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                        <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                        <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                        <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
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
  );
}

    