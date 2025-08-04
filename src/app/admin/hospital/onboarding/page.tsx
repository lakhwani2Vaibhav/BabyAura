
"use client";

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
import { Copy, Building, User, Mail, Phone, MapPin, ShieldAlert, Users, Pencil, ArrowRight } from "lucide-react";
import { adminData } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";


export default function HospitalOnboardingPage() {
  const { toast } = useToast();
  const hospitalCode = "GAH789";

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Hospital information has been successfully updated.",
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(hospitalCode);
    toast({
        title: "Code Copied!",
        description: "The hospital code has been copied to your clipboard."
    })
  }
  
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };


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
                            <Input id="hospital-name" defaultValue="General Hospital" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hospital-phone">Main Phone Number</Label>
                                <Input id="hospital-phone" type="tel" defaultValue="(123) 456-7890" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hospital-email">Public Email Address</Label>
                                <Input id="hospital-email" type="email" defaultValue="contact@generalhospital.com" />
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
                            <Input id="hospital-street" defaultValue="123 Health St" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hospital-city">City</Label>
                                <Input id="hospital-city" defaultValue="Wellnessville" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="hospital-state">State</Label>
                                <Input id="hospital-state" defaultValue="CA" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="hospital-zip">Postal Code</Label>
                                <Input id="hospital-zip" defaultValue="90210" />
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
                                <Input id="hospital-code" value={hospitalCode} readOnly />
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
                        {adminData.doctors.map((doctor) => (
                            <div key={doctor.id} className="flex items-center gap-3">
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
