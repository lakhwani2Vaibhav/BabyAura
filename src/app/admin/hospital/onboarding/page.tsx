
"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Building, User, Pencil, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

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
};

export default function HospitalOnboardingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState<HospitalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitalProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/admin/dashboard', { // Reusing dashboard API as it has most info
           headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        
        const data = await response.json();
        const hospitalData = await fetch('/api/admin/profile', { // Get hospital specific info
             headers: { 'Authorization': `Bearer ${token}` }
        })
        const hospitalProfile = await hospitalData.json();

        setProfile({
          hospitalName: hospitalProfile.hospitalName,
          hospitalCode: hospitalProfile.hospitalCode,
          email: hospitalProfile.email,
          mobile: hospitalProfile.mobile,
          address: hospitalProfile.address || { street: '', city: '', state: '', zip: '' },
          doctors: data.doctors,
          specialties: hospitalProfile.specialties || []
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
  }, [user, toast]);
  

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Hospital information has been successfully updated.",
    });
  };

  const handleCopyCode = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.hospitalCode);
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

  if (!profile) {
      return <div>Could not load hospital profile.</div>
  }


  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold font-headline">Hospital Profile</h1>
                <p className="text-muted-foreground">
                    Manage your hospital's public profile, contact details, and specialties.
                </p>
            </div>
            <Button onClick={handleSaveChanges}>
                <Pencil className="mr-2 h-4 w-4" />
                Save All Changes
            </Button>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" /> Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="hospital-name">Hospital Name</Label>
                            <Input id="hospital-name" defaultValue={profile.hospitalName} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hospital-phone">Main Phone Number</Label>
                                <Input id="hospital-phone" type="tel" defaultValue={profile.mobile} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hospital-email">Public Email Address</Label>
                                <Input id="hospital-email" type="email" defaultValue={profile.email} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="hospital-street">Street Address</Label>
                            <Input id="hospital-street" defaultValue={profile.address.street} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hospital-city">City</Label>
                                <Input id="hospital-city" defaultValue={profile.address.city} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="hospital-state">State</Label>
                                <Input id="hospital-state" defaultValue={profile.address.state} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="hospital-zip">Postal Code</Label>
                                <Input id="hospital-zip" defaultValue={profile.address.zip} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Specialties</CardTitle>
                        <CardDescription>Select the pediatric specialties your hospital offers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="pediatrics" defaultChecked />
                                <Label
                                htmlFor="pediatrics"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                General Pediatrics
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="nutrition" defaultChecked />
                                <Label
                                htmlFor="nutrition"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                Pediatric Nutrition
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="emergency" defaultChecked />
                                <Label
                                htmlFor="emergency"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                Emergency Care
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="cardiology" />
                                <Label
                                htmlFor="cardiology"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                Pediatric Cardiology
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Parent Onboarding</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="hospital-code">Unique Hospital Code</Label>
                            <div className="flex items-center gap-2 mt-2">
                                <Input id="hospital-code" value={profile.hospitalCode} readOnly />
                                <Button variant="outline" size="icon" onClick={handleCopyCode}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Parents will use this code to connect with your hospital.
                            </p>
                        </div>
                         <Separator />
                        <div>
                            <Label>Emergency Contact</Label>
                            <Input className="mt-2" defaultValue="911" placeholder="e.g., Hospital Emergency Line" />
                            <p className="text-xs text-muted-foreground mt-2">
                                The number displayed in the app for immediate help.
                            </p>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Our Doctors</CardTitle>
                        <CardDescription>Key medical staff on the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {profile.doctors.map((doctor) => (
                            <div key={doctor._id} className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={doctor.avatarUrl} />
                                    <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <p className="font-semibold text-sm">{doctor.name}</p>
                                    <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardContent>
                        <Button variant="outline" asChild className="w-full">
                           <Link href="/admin/doctors">
                                Manage Team <ArrowRight className="h-4 w-4 ml-2" />
                           </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
       </div>
    </div>
  );
}
