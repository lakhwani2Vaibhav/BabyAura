
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Building, User, Pencil, ArrowRight, MapPin, Users, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

const specialtiesList = [
  { id: 'pediatrics', label: 'General Pediatrics' },
  { id: 'nutrition', label: 'Pediatric Nutrition' },
  { id: 'emergency', label: 'Emergency Care' },
  { id: 'cardiology', label: 'Pediatric Cardiology' },
] as const;


const profileSchema = z.object({
    hospitalName: z.string().min(3, "Hospital name is required."),
    mobile: z.string().min(10, "A valid phone number is required."),
    email: z.string().email("Invalid email address."),
    address: z.object({
        street: z.string().min(3, "Street address is required."),
        city: z.string().min(2, "City is required."),
        state: z.string().min(2, "State is required."),
        zip: z.string().min(5, "Postal code is required."),
    }),
    specialties: z.array(z.string()),
    emergencyContact: z.string().min(3, "Emergency contact is required."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type Doctor = {
  _id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
};

type HospitalProfile = {
  hospitalName: string;
  hospitalCode: string;
  email: string;
  mobile: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  doctors: Doctor[];
  specialties: string[];
  emergencyContact: string;
};

export default function HospitalOnboardingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<{ doctors: Doctor[], hospitalCode: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        hospitalName: "",
        mobile: "",
        email: "",
        address: { street: "", city: "", state: "", zip: ""},
        specialties: [],
        emergencyContact: ""
    }
  });
  
  const { formState: { isSubmitting }} = form;

  useEffect(() => {
    const fetchHospitalProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('babyaura_token');
        const [dashboardRes, profileRes] = await Promise.all([
             fetch('/api/admin/dashboard', { headers: { 'Authorization': `Bearer ${token}` } }),
             fetch('/api/admin/profile', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!dashboardRes.ok || !profileRes.ok) throw new Error("Failed to fetch profile");
        
        const dashboardData = await dashboardRes.json();
        const profileData = await profileRes.json();

        setProfileData({
            doctors: dashboardData.doctors,
            hospitalCode: profileData.hospitalCode
        });

        form.reset({
            hospitalName: profileData.hospitalName || "",
            mobile: profileData.mobile || "",
            email: profileData.email || "",
            address: profileData.address || { street: "", city: "", state: "", zip: "" },
            specialties: profileData.specialties || [],
            emergencyContact: profileData.emergencyContact || "",
        });

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch hospital profile data.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchHospitalProfile();
  }, [user, toast, form]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/admin/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        if(!response.ok) throw new Error("Failed to save changes.");

        toast({
          title: "Changes Saved",
          description: "Hospital information has been successfully updated.",
        });
    } catch(error) {
         toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not save your changes. Please try again.'
        });
    }
  };

  const handleCopyCode = () => {
    if (!profileData) return;
    navigator.clipboard.writeText(profileData.hospitalCode);
    toast({
        title: "Code Copied!",
        description: "The hospital code has been copied to your clipboard."
    })
  }
  
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  if (loading) {
      return <div className="space-y-6">
          <div className="flex items-center justify-between">
              <div>
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-96 mt-2" />
              </div>
              <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                  <Skeleton className="h-48" />
                  <Skeleton className="h-48" />
                  <Skeleton className="h-48" />
              </div>
              <div className="space-y-6">
                  <Skeleton className="h-64" />
                  <Skeleton className="h-80" />
              </div>
          </div>
      </div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Hospital Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your hospital's public profile, contact details, and specialties.
                    </p>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Pencil className="mr-2 h-4 w-4" />}
                    Save All Changes
                </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" /> Basic Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <FormField control={form.control} name="hospitalName" render={({ field }) => (
                                <FormItem><FormLabel>Hospital Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <FormField control={form.control} name="mobile" render={({ field }) => (
                                    <FormItem><FormLabel>Main Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Public Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Address</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <FormField control={form.control} name="address.street" render={({ field }) => (
                                <FormItem><FormLabel>Street Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="address.city" render={({ field }) => (
                                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="address.state" render={({ field }) => (
                                    <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="address.zip" render={({ field }) => (
                                    <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Specialties</CardTitle><CardDescription>Select the pediatric specialties your hospital offers.</CardDescription></CardHeader>
                        <CardContent>
                             <FormField control={form.control} name="specialties" render={() => (
                                <FormItem>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                    {specialtiesList.map((item) => (
                                        <FormField key={item.id} control={form.control} name="specialties" render={({ field }) => {
                                            return (
                                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(item.id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                ? field.onChange([...(field.value || []), item.id])
                                                                : field.onChange(field.value?.filter((value) => value !== item.id))
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                                </FormItem>
                                            )
                                        }} />
                                    ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                             )} />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Parent Onboarding</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <FormLabel>Unique Hospital Code</FormLabel>
                                <div className="flex items-center gap-2 mt-2">
                                    <Input value={profileData?.hospitalCode || "N/A"} readOnly />
                                    <Button type="button" variant="outline" size="icon" onClick={handleCopyCode}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Parents will use this code to connect with your hospital.</p>
                            </div>
                            <Separator />
                            <FormField control={form.control} name="emergencyContact" render={({ field }) => (
                                <FormItem><FormLabel>Emergency Contact Number</FormLabel><FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                <FormDescription className="text-xs">The number displayed in the app for immediate help.</FormDescription>
                                </FormItem>
                            )}/>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Our Doctors</CardTitle><CardDescription>Key medical staff on the platform.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            {profileData?.doctors.map((doctor) => (
                                <div key={doctor._id} className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10"><AvatarImage src={doctor.avatarUrl} /><AvatarFallback>{getInitials(doctor.name)}</AvatarFallback></Avatar>
                                    <div className="flex-grow"><p className="font-semibold text-sm">{doctor.name}</p><p className="text-xs text-muted-foreground">{doctor.specialty}</p></div>
                                </div>
                            ))}
                        </CardContent>
                        <CardContent><Button type="button" variant="outline" asChild className="w-full"><Link href="/admin/doctors">Manage Team <ArrowRight className="h-4 w-4 ml-2" /></Link></Button></CardContent>
                    </Card>
                </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
