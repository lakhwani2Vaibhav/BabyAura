
"use client";

import { notFound, useParams } from "next/navigation";
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
import { ArrowLeft, Building, Stethoscope, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Doctor = {
  _id: string;
  name: string;
  specialty: string;
  status: 'Active' | 'On Leave';
  avatarUrl?: string;
};

type Parent = {
    _id: string;
    name: string;
    assignedDoctor: string;
}

type VerificationDocument = {
    docId: string;
    name: string;
    status: 'Pending' | 'Uploaded' | 'Verified' | 'Rejected';
};

type HospitalDetails = {
    _id: string;
    hospitalName: string;
    plan: string;
    status: string;
    doctors: Doctor[];
    parents: Parent[];
    documents: VerificationDocument[];
}


export default function HospitalDetailsPage() {
  const params = useParams();
  const hospitalId = params.hospitalId as string;
  const [hospital, setHospital] = useState<HospitalDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

   useEffect(() => {
    const fetchHospitalDetails = async () => {
      if (!hospitalId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("babyaura_token");
        const response = await fetch(`/api/superadmin/hospitals/${hospitalId}`, { 
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 404) {
             notFound();
             return;
        }

        if (!response.ok) {
            throw new Error('Failed to fetch hospital details');
        }
        
        const data = await response.json();
        setHospital(data);

      } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch hospital details.' });
      } finally {
        setLoading(false);
      }
    };
    fetchHospitalDetails();
  }, [hospitalId, toast]);

  const getInitials = (name: string) => {
    if(!name) return "";
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
             <div className="grid grid-cols-1 gap-6">
                <Skeleton className="h-48 w-full" />
            </div>
          </div>
      )
  }

  if (!hospital) {
    return notFound();
  }

    const getStatusBadge = (status: VerificationDocument['status']) => {
      switch (status) {
          case 'Verified':
              return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">Verified</Badge>;
          case 'Uploaded':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">Uploaded</Badge>;
          case 'Rejected':
                return <Badge variant="destructive">Rejected</Badge>;
          default:
               return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">Pending</Badge>;
      }
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
                    <Badge variant="outline" className="text-lg">{hospital.plan || 'N/A'}</Badge>
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

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> KYC Documents Status</CardTitle>
                <CardDescription>Verification status of documents submitted by {hospital.hospitalName}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Document Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {hospital.documents?.map(doc => (
                            <TableRow key={doc.docId}>
                                <TableCell className="font-medium">{doc.name}</TableCell>
                                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" disabled={doc.status !== 'Uploaded'}>
                                        Verify
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      
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
                                <TableRow key={doctor._id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/admin/doctors/${doctor._id}`} className="flex items-center gap-3 hover:underline">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={doctor.avatarUrl} />
                                                <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
                                            </Avatar>
                                            {doctor.name}
                                        </Link>
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
                                <TableRow key={parent._id}>
                                    <TableCell className="font-medium">{parent.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{parent.assignedDoctor}</Badge>
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
