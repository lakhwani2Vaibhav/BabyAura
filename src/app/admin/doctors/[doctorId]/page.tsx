
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AtSign, BadgeCheck, Stethoscope, Users, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type Doctor = {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  status: 'Active' | 'On Leave';
  avatarUrl?: string;
  patients: number;
};

export default function AdminDoctorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { doctorId } = params;
  const { toast } = useToast();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch(`/api/admin/doctors/${doctorId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch doctor details');
        }
        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch doctor profile.',
        });
        router.push('/admin/doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId, router, toast]);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  if (loading) {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-10 w-48" />
            <Card>
                <CardHeader>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                </CardHeader>
                <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center">
        <p>Doctor not found.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/doctors">Back to Doctors List</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div>
             <Button asChild variant="outline" size="sm">
                <Link href="/admin/doctors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Doctors
                </Link>
            </Button>
        </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={doctor.avatarUrl} />
              <AvatarFallback className="text-3xl">
                {getInitials(doctor.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold font-headline">{doctor.name}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {doctor.specialty}
              </CardDescription>
               <div className="flex items-center gap-2 mt-2">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{doctor.email}</span>
                </div>
            </div>
            <Badge
                variant={doctor.status === 'Active' ? 'default' : 'destructive'}
                className="text-base px-4 py-1"
            >
                {doctor.status === 'Active' ? <BadgeCheck className="mr-2 h-5 w-5"/> : <XCircle className="mr-2 h-5 w-5"/> }
                {doctor.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Patient Load</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{doctor.patients || 0}</div>
                    <p className="text-xs text-muted-foreground">
                    Active patients under this doctor
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Specialty</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{doctor.specialty}</div>
                     <p className="text-xs text-muted-foreground">
                        Primary medical field
                    </p>
                </CardContent>
            </Card>
        </CardContent>
      </Card>
    </div>
  );
}
