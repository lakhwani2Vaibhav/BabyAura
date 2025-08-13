
"use client";

import { notFound, useParams } from "next/navigation";
import { superAdminData, adminData, doctorData } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Building, Stethoscope, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type HospitalDetails = {
    _id: string;
    hospitalName: string;
    plan: string;
    status: string;
    doctors: any[];
    parents: any[];
}


export default function HospitalDetailsPage({ params }: { params: { hospitalId: string } }) {
  const { hospitalId } = params;
  const [hospital, setHospital] = useState<HospitalDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

   useEffect(() => {
    const fetchHospitalDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("babyaura_token");
        // This would be a real API call in a production app
        // For now, we simulate fetching and combining data
        const allHospitals = (await (await fetch('/api/superadmin/hospitals', { headers: { 'Authorization': `Bearer ${token}` }})).json());
        const targetHospital = allHospitals.find((h: any) => h._id === hospitalId);
        
        if(!targetHospital) {
            notFound();
            return;
        }

        // Mock fetching doctors and parents for this hospital
        const doctors = adminData.doctors; // Replace with API call
        const parents = doctorData.patients; // Replace with API call

        setHospital({
            _id: targetHospital._id,
            hospitalName: targetHospital.hospitalName,
            plan: targetHospital.plan || 'N/A',
            status: targetHospital.status,
            doctors,
            parents
        });

      } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch hospital details.' });
      } finally {
        setLoading(false);
      }
    };
    fetchHospitalDetails();
  }, [hospitalId, toast]);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };
  
  if (loading) {
      return (
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
          </div>
      )
  }

  if (!hospital) {
    return notFound();
  }


  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
             <Button asChild variant="outline" size="icon">
                <Link href="/superadmin/hospitals">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                    <Building className="h-6 w-6" /> {hospital.hospitalName}
                </h1>
                <p className="text-muted-foreground">ID: {hospital._id}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Doctors</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{hospital.doctors.length}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Parents</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{hospital.parents.length}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Partnership Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <Badge variant="outline" className="text-lg">{hospital.plan}</Badge>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                </CardHeader>
                <CardContent>
                     <Badge variant={hospital.status === "verified" ? "default" : "destructive"} className="text-lg">{hospital.status}</Badge>
                </CardContent>
            </Card>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Stethoscope className="h-5 w-5" /> Doctors</CardTitle>
                    <CardDescription>Doctors associated with {hospital.hospitalName}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Specialty</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hospital.doctors.map(doctor => (
                                <TableRow key={doctor.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={doctor.avatarUrl} />
                                                <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
                                            </Avatar>
                                            {doctor.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{doctor.specialty}</TableCell>
                                    <TableCell>
                                        <Badge variant={doctor.status === 'Active' ? 'default' : 'destructive'}>{doctor.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Parents & Relationship</CardTitle>
                     <CardDescription>Parents registered under this hospital and their assigned doctor.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Parent (Baby's Name)</TableHead>
                                <TableHead>Assigned Doctor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hospital.parents.map(parent => (
                                <TableRow key={parent.id}>
                                    <TableCell className="font-medium">{parent.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">Dr. Emily Carter</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
