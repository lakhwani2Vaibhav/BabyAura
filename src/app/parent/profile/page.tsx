
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  babyName: z.string().min(1, "Baby's name is required"),
  babyDob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
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
  babyName: string;
  babyDob: string;
  hospitalName?: string;
  avatarUrl?: string;
}

export default function ParentProfilePage() {
  const { toast } = useToast();
  const { user } = useAuth(); // Get user from auth context
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", babyName: "", babyDob: "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
        if (!user?.email) return; // Wait until user info is available

        setLoading(true);
        try {
            const token = localStorage.getItem('babyaura_token');
            const response = await fetch('/api/parent/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch profile");
            const profileData = await response.json();
            
            setProfile(profileData);
            profileForm.reset({
                name: profileData.name,
                babyName: profileData.babyName,
                babyDob: profileData.babyDob ? format(parseISO(profileData.babyDob), 'yyyy-MM-dd') : '',
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
    if (!user?.email) {
        toast({ variant: "destructive", title: "Error", description: "You are not logged in." });
        return;
    }
    
    try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/parent/profile', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update profile.");
        }

        const result = await response.json();
        
        setProfile(result.updatedData);

        toast({
            title: "Profile Updated!",
            description: "Your changes have been saved successfully.",
        });

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: error.message,
        });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
      if (!user?.email) {
        toast({ variant: "destructive", title: "Error", description: "You are not logged in." });
        return;
    }
     try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/parent/change-password', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to change password.");
        }
        
        toast({
            title: "Password Changed!",
            description: "Your password has been updated successfully.",
        });
        passwordForm.reset();

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: error.message,
        });
    }
  }
  
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2).toUpperCase();
  };

  if (loading) {
      return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-6 w-40" />
                           <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-24" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
        </div>
      )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatarUrl} data-ai-hint="woman smiling" />
                <AvatarFallback>{getInitials(profile?.name || '')}</AvatarFallback>
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
               <FormField control={profileForm.control} name="babyName" render={({ field }) => (
                  <FormItem><FormLabel>Baby's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
               <FormField control={profileForm.control} name="babyDob" render={({ field }) => (
                  <FormItem><FormLabel>Baby's Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            <div className="space-y-2">
              <Label>Connected Hospital</Label>
              <Input value={profile?.hospitalName || "Independent"} readOnly disabled />
            </div>
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
