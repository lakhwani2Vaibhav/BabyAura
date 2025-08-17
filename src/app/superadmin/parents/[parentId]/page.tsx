
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
import { ArrowLeft, AtSign, BadgeCheck, Stethoscope, Baby, Hospital, Calendar, User, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';

type ParentDetails = {
  _id: string;
  name: string;
  email: string;
  babyName: string;
  babyDob: string;
  status: 'Active' | 'Inactive';
  avatarUrl?: string;
  hospitalName?: string;
  doctorName?: string;
  createdAt: string;
};

export default function SuperadminParentProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { parentId } = params;
  const { toast } = useToast();

  const [parent, setParent] = useState<ParentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParent = async () => {
      if (!parentId) return;
      try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch(`/api/superadmin/parents/${parentId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch parent details');
        }
        const data = await response.json();
        setParent(data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch parent profile.',
        });
        router.push('/superadmin/hospitals');
      } finally {
        setLoading(false);
      }
    };
    fetchParent();
  }, [parentId, router, toast]);

  const getInitials = (name: string) => {
    if (!name) return '';
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
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!parent) {
    return (
      <div className="text-center">
        <p>Parent not found.</p>
        <Button asChild className="mt-4">
          <Link href="/superadmin/hospitals">Back to Hospitals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div>
             <Button asChild variant="outline" size="sm">
                <Link href="/superadmin/hospitals">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Hospitals
                </Link>
            </Button>
        </div>
        <Card>
            <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={parent.avatarUrl} />
                <AvatarFallback className="text-3xl">
                    {getInitials(parent.name)}
                </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                <CardTitle className="text-3xl font-bold font-headline">{parent.name}</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                    Parent of {parent.babyName}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                        <AtSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{parent.email}</span>
                    </div>
                </div>
                <Badge
                    variant={parent.status === 'Active' ? 'default' : 'destructive'}
                    className="text-base px-4 py-1"
                >
                    {parent.status === 'Active' ? <BadgeCheck className="mr-2 h-5 w-5"/> : <XCircle className="mr-2 h-5 w-5"/> }
                    {parent.status}
                </Badge>
            </div>
            </CardHeader>
            <CardContent className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2"><Baby className="h-4 w-4"/> Baby's Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Name:</strong> {parent.babyName}</p>
                        <p><strong>DOB:</strong> {parent.babyDob ? format(new Date(parent.babyDob), 'MMMM d, yyyy') : 'N/A'}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2"><Hospital className="h-4 w-4"/> Affiliation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Hospital:</strong> {parent.hospitalName || 'Independent'}</p>
                        <p><strong>Doctor:</strong> {parent.doctorName || 'Unassigned'}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2"><Calendar className="h-4 w-4"/> Account Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Joined:</strong> {format(new Date(parent.createdAt), 'MMMM d, yyyy')}</p>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    </div>
  );
}
