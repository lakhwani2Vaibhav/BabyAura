
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type UserProfile = {
  name: string;
  email: string;
  role: string;
  hospitalName?: string;
}

export default function AdminProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  
  // This would fetch the current user's data. For now, we simulate it.
  useEffect(() => {
    const fetchUserData = async () => {
        setLoading(true);
        // In a real app, you would get the user ID from the session
        const profileData = {
          name: "Admin User",
          email: "admin@babyaura.in",
          role: "Hospital Administrator",
          hospitalName: "General Hospital",
        };
        setUser(profileData);
        form.reset({
            name: profileData.name,
            email: profileData.email,
        });
        setLoading(false);
    }
    fetchUserData();
  }, [form]);


  const onSubmit = async (data: ProfileFormValues) => {
    toast({
        title: "Updating Profile...",
        description: "Please wait while we save your changes.",
    });

    try {
        // In a real app, this API endpoint would be protected and use the user's session
        const response = await fetch('/api/admin/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: data.name, password: data.password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update profile.");
        }

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
  
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  if (loading) {
      return <Card className="max-w-2xl mx-auto p-6"><Skeleton className="h-48 w-full" /></Card>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://placehold.co/80x80.png" data-ai-hint="admin portrait" />
                  <AvatarFallback>{getInitials(user?.name || "")}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user?.name}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input readOnly disabled {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>New Password (optional)</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="Leave blank to keep current password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="Confirm your new password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              <div className="space-y-2">
                <Label>Role</Label>
                <Input defaultValue={user?.role} readOnly disabled />
              </div>
              <div className="space-y-2">
                <Label>Hospital</Label>
                <Input defaultValue={user?.hospitalName} readOnly disabled />
              </div>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
